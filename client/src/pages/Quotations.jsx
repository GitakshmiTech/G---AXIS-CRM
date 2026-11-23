//===========================================================================================
//    QUOTATIONS DIRECTORY PAGE
// ===========================================================================================
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Check, X } from 'lucide-react';
import { TableContainer } from '../components/common/Table/TableContainer';
import { DataTableToolbar } from '../components/common/Table/DataTableToolbar';
import { DataTable } from '../components/common/Table/DataTable';
import { Pagination } from '../components/common/Table/Pagination';
import { ViewBtn } from '../components/common/buttons/ViewBtn';
import { EditBtn } from '../components/common/buttons/EditBtn';
import { QuotationApprovalModal } from '../components/modules/quotations/QuotationApprovalModal';
import { fetchQuotations, approveQuotation, rejectQuotation } from '../services/quotationsService';
import { useToast } from '../hooks/useToast';

const PAGE_SIZE = 10;
const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending_approval', label: 'Pending Approval' },
  { value: 'sent', label: 'Sent' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'expired', label: 'Expired' },
];
const getStatusBadgeClass = (status) => ({
  draft: 'bg-gray text-black-90',
  pending_approval: 'bg-warning/10 text-warning',
  sent: 'bg-secondary/10 text-secondary',
  accepted: 'bg-success/10 text-success',
  rejected: 'bg-alert/10 text-alert',
  expired: 'bg-alert/10 text-alert',
}[status] || 'bg-gray text-black-90');

/** Load quotations from the API and expose authorized create/edit/view/approval actions. */
export const Quotations = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const authRole = useSelector((state) => state.auth?.role);
  const authUser = useSelector((state) => state.auth?.user);
  const isApprover = useMemo(() => {
    const role = (authRole || authUser?.role || '').toLowerCase();
    const designation = (authUser?.roleLabel || authUser?.designation || '').toLowerCase();
    return role === 'admin' || role === 'sales' || /admin|manager|vp/i.test(designation);
  }, [authRole, authUser]);

  const [quotations, setQuotations] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [loadedRequestKey, setLoadedRequestKey] = useState('');
  const [error, setError] = useState('');
  const requestKey = `${currentPage}|${debouncedSearch}|${statusFilter}|${productFilter}`;
  const loading = loadedRequestKey !== requestKey;

  // Approval modal state (FRD 11.35)
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'approve', targetQuotation: null });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchQuery.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    fetchQuotations({ page: currentPage, limit: PAGE_SIZE, search: debouncedSearch, status: statusFilter, product: productFilter, signal: controller.signal })
      .then((result) => {
        if (!active) return;
        setError('');
        setQuotations(result.rows);
        setPagination(result.pagination);
        setProductOptions(result.productOptions);
      })
      .catch((requestError) => {
        if (!active || requestError.name === 'AbortError') return;
        setQuotations([]);
        setPagination({ total: 0, totalPages: 1 });
        setError(requestError.message || 'Unable to load quotations.');
      })
      .finally(() => { if (active) setLoadedRequestKey(requestKey); });
    return () => { active = false; controller.abort(); };
  }, [currentPage, debouncedSearch, productFilter, statusFilter, requestKey]);

  // Handle modal confirm (Approve or Reject)
  const handleModalConfirm = useCallback(async (payload) => {
    if (!modalConfig.targetQuotation) return;
    setActionLoading(true);
    try {
      if (modalConfig.type === 'approve') {
        await approveQuotation(modalConfig.targetQuotation.id, payload);
        toast(`Quotation ${modalConfig.targetQuotation.code} approved successfully.`, 'success');
      } else {
        await rejectQuotation(modalConfig.targetQuotation.id, payload);
        toast(`Quotation ${modalConfig.targetQuotation.code} rejected and sent back to BDE.`, 'info');
      }
      setModalConfig({ isOpen: false, type: 'approve', targetQuotation: null });
      // Trigger table refresh
      setLoadedRequestKey('');
    } catch (err) {
      toast(err.message || 'Operation failed. Please try again.', 'error');
    } finally {
      setActionLoading(false);
    }
  }, [modalConfig, toast]);

  const columns = useMemo(() => [
    { key: 'code', label: 'Code', sortable: true, sortType: 'text', headerClassName: 'w-[155px]', render: (row) => <span title={row.code} className="whitespace-nowrap font-semibold">{row.code || '—'}</span> },
    { key: 'dealName', label: 'Deal Name', sortable: true, sortType: 'text', render: (row) => <div className="min-w-0 whitespace-normal break-words"><span className="block font-semibold" title={row.dealName}>{row.dealName || '—'}</span><span className="block whitespace-normal break-words text-black-90/50 text-[11px]" title={row.accountName}>{row.accountName || row.dealCode || '—'}</span></div> },
    { key: 'productInterestName', label: 'Product Interest', render: (row) => <span className="block whitespace-normal break-words" title={row.productInterestName}>{row.productInterestName}</span> },
    { key: 'value', label: 'Expected Value', sortable: true, sortType: 'number', headerClassName: 'w-[145px]', render: (row) => <span title={row.expectedValue} className="block break-all font-medium">{row.expectedValue}</span> },
    { key: 'statusValue', label: 'Status', sortable: true, sortType: 'status', headerClassName: 'w-[165px]', render: (row) => <span className={`inline-flex min-w-[125px] justify-center rounded-[7px] px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${getStatusBadgeClass(row.statusValue)}`}>{row.status}</span> },
    { key: 'createdDate', label: 'Created Date', sortable: true, headerClassName: 'w-[125px]', render: (row) => <div className="whitespace-nowrap"><span className="block">{row.createdDate}</span><span className="block text-black-90/50 text-[11px]">{row.createdTime}</span></div> },
    {
      key: 'actions',
      label: 'Action',
      align: 'center',
      headerClassName: 'w-[130px]',
      render: (row) => (
        <div className="flex items-center justify-center gap-1.5">
          <ViewBtn onClick={() => navigate(`/quotations/${encodeURIComponent(row.id)}/view`)} title="View quotation" />
          {row.canEdit && <EditBtn onClick={() => navigate(`/quotations/${encodeURIComponent(row.id)}/edit`)} title="Edit quotation" />}
          {row.statusValue === 'pending_approval' && isApprover && (
            <>
              <button
                type="button"
                onClick={() => setModalConfig({ isOpen: true, type: 'approve', targetQuotation: row })}
                className="cursor-pointer rounded-[7px] border-b-2 border-stroke/80 bg-success/10 text-success p-1.5 hover:bg-success/20 transition-colors"
                title="Approve quotation"
              >
                <Check size={14} />
              </button>
              <button
                type="button"
                onClick={() => setModalConfig({ isOpen: true, type: 'reject', targetQuotation: row })}
                className="cursor-pointer rounded-[7px] border-b-2 border-stroke/80 bg-alert/10 text-alert p-1.5 hover:bg-alert/20 transition-colors"
                title="Reject quotation"
              >
                <X size={14} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ], [navigate, isApprover]);

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 select-text max-md:min-h-fit">
      {error && <div role="alert" className="mb-2 rounded-[7px] border-b-2 border-stroke/80 bg-alert/10 px-4 py-2 text-sm text-alert">{error}</div>}
      <TableContainer
        className="min-h-0"
        toolbar={<DataTableToolbar searchQuery={searchQuery} onSearchChange={(value) => { setSearchQuery(value); setCurrentPage(1); }} searchPlaceholder="Search quotation, deal, or account..." filters={[
          { id: 'product-filter', value: productFilter, placeholder: 'By Product', onChange: (value) => { setProductFilter(value); setCurrentPage(1); }, options: productOptions.map((value) => ({ value, label: value })) },
          { id: 'status-filter', value: statusFilter, placeholder: 'By Status', onChange: (value) => { setStatusFilter(value); setCurrentPage(1); }, options: STATUS_OPTIONS },
        ]} onResetFilters={() => { setSearchQuery(''); setDebouncedSearch(''); setProductFilter(''); setStatusFilter(''); setCurrentPage(1); }} viewMode={viewMode} onViewModeChange={setViewMode} actionButton={{ label: 'Create Quotation', onClick: () => navigate('/quotations/new') }} />}
        pagination={<Pagination currentPage={currentPage} totalEntries={pagination.total || 0} pageSize={PAGE_SIZE} onPageChange={setCurrentPage} className="pt-0 border-t-0" />}
      >
        {loading ? viewMode === 'list' ? <DataTable columns={columns} data={[]} rowKey="id" fixedLayout loading emptyMessage="No quotations found matching the current filters." /> : <div aria-busy="true" className="grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={`quotation-skeleton-${index}`} aria-hidden="true" className="animate-pulse space-y-3 rounded-[7px] border-b-2 border-stroke/80 bg-white-100 p-3"><div className="h-4 w-2/3 rounded-[4px] bg-gray" /><div className="h-3 w-1/3 rounded-[4px] bg-gray" /><div className="h-7 w-full rounded-[4px] bg-gray" /><div className="h-3 w-1/2 rounded-[4px] bg-gray" /></div>)}</div> : viewMode === 'list' ? <DataTable columns={columns} data={quotations} rowKey="id" fixedLayout emptyMessage="No quotations found matching the current filters." /> : <div className="grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 xl:grid-cols-3">{quotations.length ? quotations.map((row) => <article key={row.id} className="rounded-[7px] border-b-2 border-stroke/80 bg-white-100 p-3"><div className="flex items-start justify-between gap-2"><div className="min-w-0 whitespace-normal break-words"><p className="text-sm font-semibold" title={row.dealName}>{row.dealName || '—'}</p><p className="whitespace-normal break-words text-xs text-black-90/60" title={row.accountName}>{row.accountName || row.dealCode || '—'}</p></div><span className={`shrink-0 rounded-[7px] px-2 py-1 text-[11px] font-semibold ${getStatusBadgeClass(row.statusValue)}`}>{row.status}</span></div><div className="mt-3 grid grid-cols-2 gap-2 text-xs"><div><p className="text-black-90/50">Quotation</p><p className="break-all font-semibold">{row.code || '—'}</p></div><div><p className="text-black-90/50">Expected Value</p><p className="break-all font-semibold">{row.expectedValue}</p></div><div className="col-span-2"><p className="text-black-90/50">Product Interest</p><p className="whitespace-normal break-words" title={row.productInterestName}>{row.productInterestName}</p></div></div><div className="mt-3 flex items-center justify-between"><span className="text-xs text-black-90/60">{row.createdDate}</span><div className="flex items-center gap-1.5"><ViewBtn onClick={() => navigate(`/quotations/${encodeURIComponent(row.id)}/view`)} title="View quotation" />{row.canEdit && <EditBtn onClick={() => navigate(`/quotations/${encodeURIComponent(row.id)}/edit`)} title="Edit quotation" />}{row.statusValue === 'pending_approval' && isApprover && (<><button type="button" onClick={() => setModalConfig({ isOpen: true, type: 'approve', targetQuotation: row })} className="cursor-pointer rounded-[7px] border-b-2 border-stroke/80 bg-success/10 text-success p-1.5 hover:bg-success/20 transition-colors" title="Approve quotation"><Check size={14} /></button><button type="button" onClick={() => setModalConfig({ isOpen: true, type: 'reject', targetQuotation: row })} className="cursor-pointer rounded-[7px] border-b-2 border-stroke/80 bg-alert/10 text-alert p-1.5 hover:bg-alert/20 transition-colors" title="Reject quotation"><X size={14} /></button></>)}</div></div></article>) : <p className="col-span-full py-12 text-center text-sm text-black-90/60">No quotations found matching the current filters.</p>}</div>}
      </TableContainer>

      {/* Modal for Quick Approve / Quick Reject from table (FRD 11.35) */}
      <QuotationApprovalModal
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        quotation={modalConfig.targetQuotation}
        onClose={() => setModalConfig({ isOpen: false, type: 'approve', targetQuotation: null })}
        onConfirm={handleModalConfirm}
        loading={actionLoading}
      />
    </div>
  );
};

export default Quotations;
