//===========================================================================================
//    DEAL DIRECTORY PAGE
// ===========================================================================================
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TableContainer } from '../components/common/Table/TableContainer';
import { DataTableToolbar } from '../components/common/Table/DataTableToolbar';
import { DataTable } from '../components/common/Table/DataTable';
import { Pagination } from '../components/common/Table/Pagination';
import { ViewBtn } from '../components/common/buttons/ViewBtn';
import { EditBtn } from '../components/common/buttons/EditBtn';
import { DropdownInput } from '../components/common/inputs/DropdownInput';
import { StatCard } from '../components/common/cards/StatCard';
import { CONVERSION_DEAL_STAGE_OPTIONS } from '../constants/dealsConstants';
import { downloadBlob } from '../utils/exportUtils';
import { formatCurrency } from '../utils/formatters';
import { fetchDeals, exportDeals, updateDealStage } from '../services/dealsService';
import { useToast } from '../hooks/useToast';

/** Display the authenticated user's Deals using server-backed search and filters. */
export const Deals = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const [deals, setDeals] = useState([]);
  const [owners, setOwners] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [stageFilter, setStageFilter] = useState('');
  const [ownerFilter, setOwnerFilter] = useState(searchParams.get('ownerId') || searchParams.get('owner') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState('');
  const [updatingDealIds, setUpdatingDealIds] = useState([]);
  const pageSize = 10;

  // Sync search and owner parameters from URL if navigating from quick navigation
  useEffect(() => {
    const s = searchParams.get('search');
    const o = searchParams.get('ownerId') || searchParams.get('owner');
    if (s !== null) setSearchQuery(s);
    if (o !== null) setOwnerFilter(o);
  }, [searchParams]);

  // Reload API rows whenever the server-side search, filters, or page changes.
  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      setIsLoading(true);
      setError('');
      fetchDeals({ page: currentPage, limit: pageSize, search: searchQuery, stage: stageFilter, ownerId: ownerFilter })
        .then((result) => {
          if (!active) return;
          setDeals(result.rows);
          setOwners(result.owners);
          setStats(result.stats);
          setPagination(result.pagination);
        })
        .catch((requestError) => {
          if (!active) return;
          setDeals([]);
          setPagination({ page: currentPage, limit: pageSize, total: 0, totalPages: 1 });
          setError(requestError.message || 'Unable to load deals.');
        })
        .finally(() => { if (active) setIsLoading(false); });
    }, searchQuery.trim() ? 250 : 0);
    return () => { active = false; clearTimeout(timer); };
  }, [currentPage, ownerFilter, pageSize, searchQuery, stageFilter]);

  const handleSearch = useCallback((value) => { setSearchQuery(value); setCurrentPage(1); }, []);
  const handleStageFilter = useCallback((event) => { setStageFilter(event.target.value); setCurrentPage(1); }, []);
  const handleOwnerFilter = useCallback((event) => { setOwnerFilter(event.target.value); setCurrentPage(1); }, []);
  /** Save a row's stage through the Deal API and leave the last persisted value on failure. */
  const handleDealStageChange = useCallback(async (deal, nextStage) => {
    if (!nextStage || nextStage === deal.stageValue) return;
    setUpdatingDealIds((ids) => [...ids, deal.id]);
    try {
      const updated = await updateDealStage(deal.id, nextStage);
      const persistedStage = updated.stageValue || nextStage;
      setDeals((rows) => rows.map((row) => row.id === deal.id ? { ...row, ...updated, stageValue: persistedStage } : row));
      toast(`Deal stage changed to ${updated.stage || nextStage}.`);
    } catch (stageError) {
      toast(stageError.message || 'Unable to update the deal stage.', 'error');
    } finally {
      setUpdatingDealIds((ids) => ids.filter((id) => id !== deal.id));
    }
  }, [toast]);
  const handleExport = useCallback(async () => {
    try {
      setError('');
      setIsExporting(true);
      const blob = await exportDeals({ search: searchQuery, stage: stageFilter, ownerId: ownerFilter });
      downloadBlob(blob, 'deals.csv');
    } catch (exportError) {
      setError(exportError.message || 'Unable to export deals.');
    } finally {
      setIsExporting(false);
    }
  }, [ownerFilter, searchQuery, stageFilter]);

  const stageOptions = useMemo(() => [
    { value: '', label: 'By Stage' },
    ...CONVERSION_DEAL_STAGE_OPTIONS.map(({ value, label }) => ({ value, label })),
  ], []);
  const ownerOptions = useMemo(() => [
    { value: '', label: 'By Owner' },
    ...owners,
  ], [owners]);
  const columns = useMemo(() => [
    {
      key: 'code', label: 'Code', sortable: true, sortType: 'text', className: 'w-[155px] pl-4', headerClassName: 'w-[155px]',
      render: (row) => <span title={row.code} className="whitespace-nowrap font-semibold text-black-90">{row.code || '—'}</span>,
    },
    {
      key: 'title', label: 'Deal Name', sortable: true, sortType: 'text', className: 'w-[145px] max-w-[145px]', headerClassName: 'w-[145px]',
      render: (row) => <span title={row.title} className="block whitespace-normal break-words font-semibold text-black-90">{row.title || '—'}</span>,
    },
    {
      key: 'companyName', label: 'Account', sortable: true, sortType: 'text', className: 'w-[125px] max-w-[125px]', headerClassName: 'w-[125px]',
      render: (row) => <span title={row.companyName} className="block whitespace-normal break-words text-xs font-medium text-black-90">{row.companyName || '—'}</span>,
    },
    {
      key: 'assignedBde', label: 'Owner (BDE)', sortable: true, sortType: 'text', className: 'w-[145px]', headerClassName: 'w-[145px]',
      render: (row) => <span title={row.assignedBde} className="block whitespace-normal break-words text-xs font-semibold text-black-90">{row.assignedBde}</span>,
    },
    {
      key: 'value', label: 'Expected Value', sortable: true, sortType: 'number', className: 'w-[135px]', headerClassName: 'w-[135px]',
      render: (row) => <span title={row.expectedValue} className="block break-all text-xs font-semibold text-black-90">{row.expectedValue}</span>,
    },
    {
      key: 'stage', label: 'Stage', sortable: true, sortType: 'text', align: 'center',
      className: 'w-[140px]', headerClassName: 'w-[140px]',
      render: (row) => <div className="flex w-full justify-center"><DropdownInput name={`deal-stage-${row.id}`} value={row.stageValue || ''} options={CONVERSION_DEAL_STAGE_OPTIONS} onChange={(event) => handleDealStageChange(row, event.target.value)} disabled={updatingDealIds.includes(row.id)} aria-label={`Change stage for ${row.title}`} title="Change deal stage" containerClassName="w-fit min-w-0" containerDataUiStyle="table-stage-select" fitContent dropdownMenuClassName="right-auto w-max min-w-[10rem]" dropdownOptionLabelClassName="overflow-visible" chevronButtonClassName="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer p-0.5 focus:outline-none" selectClassName="h-7 px-2 pr-6 bg-transparent border-0 rounded-none text-xs text-black-90 font-semibold shadow-none focus:outline-none focus:shadow-none cursor-pointer transition-colors hover:text-primary disabled:cursor-wait" /></div>,
    },
    {
      key: 'closeDate', label: 'Expected Close Date', sortable: true, sortType: 'text', align: 'center', className: 'w-[165px]', headerClassName: 'w-[165px]',
      render: (row) => <span className="text-xs font-semibold text-primary">{row.expectedCloseDate}</span>,
    },
    {
      key: 'probability', label: 'Probability', sortable: true, sortType: 'number', className: 'w-[100px]', headerClassName: 'w-[100px]',
      render: (row) => <span className="text-xs font-medium text-black-90">{row.probability === '' ? '—' : `${row.probability}%`}</span>,
    },
    {
      key: 'actions', label: 'Action', align: 'center', className: 'w-[95px] pr-4', headerClassName: 'w-[95px]',
      render: (row) => <div className="flex items-center justify-center gap-1.5"><ViewBtn onClick={() => navigate(`/deals/${encodeURIComponent(row.id)}/view`)} title="View Deal Details" /><EditBtn onClick={() => navigate(`/deals/${encodeURIComponent(row.id)}/edit`)} title="Edit Deal" /></div>,
    },
  ], [handleDealStageChange, navigate, updatingDealIds]);

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-3 select-text max-md:min-h-fit">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
        <StatCard title="Total Pipeline Value" value={formatCurrency(stats?.pipelineValue || 0, '₹')} colorKey="secondary" loading={isLoading} />
        <StatCard title="Weighted Forecast" value={formatCurrency(stats?.weightedForecast || 0, '₹')} colorKey="purple" loading={isLoading} />
        <StatCard title="Closed Won" value={formatCurrency(stats?.closedWonValue || 0, '₹')} colorKey="success" loading={isLoading} />
        <StatCard title="Win Rate" value={`${stats?.winRate || 0}%`} colorKey="secondary" loading={isLoading} />
        <StatCard title="Awaiting Approvals" value="—" subText="Approval status is not available in the current API" colorKey="alert" loading={isLoading} />
      </div>
      <TableContainer toolbar={<DataTableToolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        searchPlaceholder="Search deals, codes, or clients..."
        filters={[
          { id: 'stage-filter', value: stageFilter, onChange: handleStageFilter, options: stageOptions },
          { id: 'owner-filter', value: ownerFilter, onChange: handleOwnerFilter, options: ownerOptions },
        ]}
        onResetFilters={() => { handleSearch(''); setStageFilter(''); setOwnerFilter(''); }}
        showViewToggle={false}
        onExport={handleExport}
      />} pagination={<Pagination
        currentPage={currentPage}
        totalEntries={pagination.total || 0}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        className="pt-0 border-t-0"
      />}>
        {error && <div role="alert" className="mx-4 mt-3 rounded-[7px] border-b-2 border-stroke/80 bg-alert/10 px-4 py-3 text-sm text-alert">{error}</div>}
        {isExporting && <div role="status" className="px-4 py-2 text-xs text-black-90/60">Preparing deal export…</div>}
        <DataTable columns={columns} data={deals} rowKey="id" fixedLayout loading={isLoading} emptyMessage="No deals found matching the current search criteria." />
      </TableContainer>
    </div>
  );
};

export { Deals as DealManagement };
export default Deals;
