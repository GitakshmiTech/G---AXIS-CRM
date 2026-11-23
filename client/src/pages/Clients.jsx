//===========================================================================================
//    CLIENT ACCOUNT DIRECTORY
// ===========================================================================================
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TableContainer } from '../components/common/Table/TableContainer';
import { DataTableToolbar } from '../components/common/Table/DataTableToolbar';
import { DataTable } from '../components/common/Table/DataTable';
import { Pagination } from '../components/common/Table/Pagination';
import { ViewBtn } from '../components/common/buttons/ViewBtn';
import { EditBtn } from '../components/common/buttons/EditBtn';
import { StatCard } from '../components/common/cards/StatCard';
import { clearClientDetailsCache, fetchClients, exportClients } from '../services/clientsService';
import { downloadBlob } from '../utils/exportUtils';
import { formatCurrency } from '../utils/formatters';
import { useToast } from '../hooks/useToast';

/** Load and manage authorized Accounts created through the CRM conversion flow. */
export const Clients = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const [clients, setClients] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [stats, setStats] = useState({ totalAccounts: 0, linkedContacts: 0, activeDealsValue: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [industryFilter, setIndustryFilter] = useState('');
  const [contactRange, setContactRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const pageSize = 10;

  // Sync search parameter from URL if navigating from quick navigation
  useEffect(() => {
    const s = searchParams.get('search');
    if (s !== null) setSearchQuery(s);
  }, [searchParams]);

  // Fetch the API page whenever search, filters, or pagination changes.
  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      setIsLoading(true);
      setError('');
      fetchClients({ page: currentPage, limit: pageSize, search: searchQuery, industryId: industryFilter, contactRange })
        .then((result) => {
          if (!active) return;
          setClients(result.rows);
          setIndustries(result.industries);
          setStats(result.stats);
          setPagination(result.pagination);
        })
        .catch((requestError) => {
          if (!active) return;
          setClients([]);
          setError(requestError.message || 'Unable to load client accounts.');
        })
        .finally(() => { if (active) setIsLoading(false); });
    }, searchQuery.trim() ? 250 : 0);
    return () => { active = false; clearTimeout(timer); };
  }, [contactRange, currentPage, industryFilter, searchQuery]);

  const handleExport = useCallback(async () => {
    try {
      setIsExporting(true);
      const blob = await exportClients({ search: searchQuery, industryId: industryFilter, contactRange });
      downloadBlob(blob, 'accounts.csv');
    } catch (exportError) { toast(exportError.message || 'Unable to export accounts.', 'error'); }
    finally { setIsExporting(false); }
  }, [contactRange, industryFilter, searchQuery, toast]);

  const industryOptions = useMemo(() => [
    { value: '', label: 'By Industry Type' },
    ...industries,
  ], [industries]);
  const contactOptions = useMemo(() => [
    { value: '', label: 'By Contacts' },
    { value: '0', label: 'No linked contacts' },
    { value: '1-3', label: '1–3 contacts' },
    { value: '4+', label: '4+ contacts' },
  ], []);
  const columns = useMemo(() => [
    { key: 'code', label: 'Code', sortable: true, className: 'w-[155px] pl-4', headerClassName: 'w-[155px]', render: (row) => <span title={row.code} className="whitespace-nowrap font-semibold text-black-90">{row.code || '—'}</span> },
    { key: 'name', label: 'Account Name', sortable: true, className: 'w-[195px] max-w-[195px]', headerClassName: 'w-[195px]', render: (row) => <div className="min-w-0 whitespace-normal break-words"><span title={row.name} className="block font-semibold text-black-90">{row.name}</span><span className="block break-all text-[11px] text-black-90/55">{row.email || 'No email on account'}</span></div> },
    { key: 'industryType', label: 'Industry', sortable: true, className: 'w-[145px] max-w-[145px]', headerClassName: 'w-[145px]', render: (row) => <span title={row.industryType} className="block whitespace-normal break-words font-medium text-black-90">{row.industryType}</span> },
    { key: 'assignedBde', label: 'Assigned BDE', sortable: true, className: 'w-[140px] max-w-[140px]', headerClassName: 'w-[140px]', render: (row) => <span title={row.assignedBde} className="block whitespace-normal break-words font-semibold text-black-90">{row.assignedBde}</span> },
    { key: 'stakeholderCount', label: 'Stakeholders', sortable: true, sortType: 'number', align: 'center', className: 'w-[105px]', headerClassName: 'w-[105px]', render: (row) => <span className="font-semibold text-black-90">{row.stakeholderCount}</span> },
    { key: 'activeDealsCount', label: 'Pipeline Deals', sortable: true, sortType: 'number', className: 'w-[195px]', headerClassName: 'w-[195px]', render: (row) => <div><span title={`${row.activeDealsCount} active · ${formatCurrency(row.activeDealValue, '₹')}`} className="block whitespace-normal break-words font-semibold text-black-90">{row.activeDealsCount} active · {formatCurrency(row.activeDealValue, '₹')}</span><span className="block whitespace-normal break-words text-[11px] text-black-90/55">{row.activeDealStages.length ? row.activeDealStages.join(', ') : 'No active deal stages'}</span></div> },
    { key: 'createdDate', label: 'Created Date', sortable: true, className: 'w-[115px]', headerClassName: 'w-[115px]', render: (row) => <div><span className="block font-medium text-black-90">{row.createdDate}</span>{row.createdTime && <span className="text-[11px] text-black-90/55">{row.createdTime}</span>}</div> },
    { key: 'actions', label: 'Action', align: 'center', className: 'w-[100px] pr-4', headerClassName: 'w-[100px]', render: (row) => <div className="flex items-center justify-center gap-1.5"><ViewBtn onClick={() => navigate(`/clients/${encodeURIComponent(row.id)}/view`, { state: { industries } })} title="View Account Details" /><EditBtn onClick={() => navigate(`/clients/${encodeURIComponent(row.id)}/edit`, { state: { industries } })} title="Edit Account" /></div> },
  ], [industries, navigate]);

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-3 select-text max-md:min-h-fit">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <StatCard title="Total Accounts Managed" value={stats.totalAccounts} colorKey="secondary" loading={isLoading} />
        <StatCard title="Linked Contacts" value={stats.linkedContacts} colorKey="purple" loading={isLoading} />
        <StatCard title="Active Deals Value" value={formatCurrency(stats.activeDealsValue, '₹')} colorKey="success" loading={isLoading} />
      </div>
      <TableContainer toolbar={<DataTableToolbar
        searchQuery={searchQuery}
        onSearchChange={(value) => { setSearchQuery(value); setCurrentPage(1); }}
        searchPlaceholder="Search account ID, name, domain, or industry..."
        filters={[
          { id: 'industry-filter', value: industryFilter, onChange: (event) => { setIndustryFilter(event.target.value); setCurrentPage(1); }, options: industryOptions },
          { id: 'contact-filter', value: contactRange, onChange: (event) => { setContactRange(event.target.value); setCurrentPage(1); }, options: contactOptions },
        ]}
        onResetFilters={() => { clearClientDetailsCache(); setSearchQuery(''); setIndustryFilter(''); setContactRange(''); setCurrentPage(1); }}
        showViewToggle={false}
        onExport={handleExport}
      />} pagination={<Pagination currentPage={currentPage} totalEntries={pagination.total} pageSize={pageSize} onPageChange={setCurrentPage} className="pt-0 border-t-0" />}>
        {error && <div role="alert" className="mx-4 mt-3 rounded-[7px] border-b-2 border-stroke/80 bg-alert/10 px-4 py-3 text-sm text-alert">{error}</div>}
        {isExporting && <div role="status" className="px-4 py-2 text-xs text-black-90/60">Preparing account export…</div>}
        <DataTable columns={columns} data={clients} rowKey="id" fixedLayout loading={isLoading} emptyMessage="No accounts found matching the current search criteria." />
      </TableContainer>
    </div>
  );
};

export { Clients as ClientManagement };
export default Clients;
