//===========================================================================================
//    CONTACT DIRECTORY PAGE
// ===========================================================================================
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail } from 'lucide-react';
import whatsappIcon from '../assets/icons/Group.png';
import { TableContainer } from '../components/common/Table/TableContainer';
import { DataTableToolbar } from '../components/common/Table/DataTableToolbar';
import { DataTable } from '../components/common/Table/DataTable';
import { Pagination } from '../components/common/Table/Pagination';
import { ViewBtn } from '../components/common/buttons/ViewBtn';
import { EditBtn } from '../components/common/buttons/EditBtn';
import { ContactAvatarPlaceholder } from '../components/common/avatar/ContactAvatarPlaceholder';
import { downloadBlob } from '../utils/exportUtils';
import { getContactWhatsAppUrl } from '../utils/contactUtils';
import { exportContacts, fetchContacts } from '../services/contactsService';
import { formatCurrency } from '../utils/formatters';
import { useToast } from '../hooks/useToast';

/** Display contacts with server-backed search, pagination, export, and page navigation. */
const Contacts = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState('');
  const pageSize = 10;

  // Sync search parameter from URL if navigating from quick navigation
  useEffect(() => {
    const s = searchParams.get('search');
    if (s !== null) setSearchQuery(s);
  }, [searchParams]);

  // Refresh the requested server page when the search term or page changes.
  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError('');
    const timer = setTimeout(() => {
      fetchContacts({ page: currentPage, limit: pageSize, search: searchQuery })
        .then((result) => {
          if (!active) return;
          setContacts(result.rows);
          setPagination(result.pagination);
        })
        .catch((requestError) => {
          if (!active) return;
          setContacts([]);
          setPagination({ page: currentPage, limit: pageSize, total: 0, totalPages: 1 });
          setError(requestError.message || 'Unable to load contacts.');
          toast(requestError.message || 'Unable to load contacts.', 'error');
        })
        .finally(() => { if (active) setIsLoading(false); });
    }, searchQuery.trim() ? 250 : 0);
    return () => { active = false; clearTimeout(timer); };
  }, [currentPage, pageSize, searchQuery]);

  const handleSearch = useCallback((value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleExport = useCallback(async () => {
    try {
      setError('');
      setIsExporting(true);
      const blob = await exportContacts(searchQuery);
      downloadBlob(blob, 'contacts.csv');
    } catch (exportError) {
      setError(exportError.message || 'Unable to export contacts.');
    } finally {
      setIsExporting(false);
    }
  }, [searchQuery]);

  const columns = useMemo(() => [
    {
      key: 'code', label: 'Code', sortable: true, className: 'w-36 pl-4',
      render: (row) => <span title={row.code} className="whitespace-nowrap font-semibold text-black-90">{row.code}</span>,
    },
    {
      key: 'name', label: 'Contact Name', sortable: true,
      className: 'max-sm:min-w-[170px] max-sm:pr-4', headerClassName: 'max-sm:min-w-[170px] max-sm:pr-4',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <ContactAvatarPlaceholder size="w-8 h-8" />
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-black-90 whitespace-nowrap">{row.name}</span>
            <span className="text-[11px] text-black-90/50 font-normal whitespace-normal break-words">{row.designation || '—'}</span>
            <span className={`text-[10px] font-semibold ${row.isPrimary ? 'text-primary' : 'text-black-90/50'}`}>{row.isPrimary ? 'Primary contact' : 'Contact'}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'companyName', label: 'Client Name', sortable: true,
      className: 'max-sm:min-w-[170px] max-sm:pr-4', headerClassName: 'max-sm:min-w-[170px] max-sm:pr-4',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div aria-hidden="true" className="w-7 h-7 rounded-full overflow-hidden bg-gray text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
            {row.companyName ? row.companyName.slice(0, 1).toUpperCase() : '—'}
          </div>
          <span className="font-semibold text-black-90 whitespace-nowrap">{row.companyName || '—'}</span>
        </div>
      ),
    },
    {
      key: 'activeDeals', label: 'Active Deals', sortable: false,
      render: (row) => <div className="flex flex-col text-[11px] leading-tight"><span className="font-semibold text-black-90">{row.activeDeals} {row.activeDeals === 1 ? 'deal' : 'deals'}</span><span className="text-black-90/50">{formatCurrency(row.activeDealValue) || '₹0'}</span></div>,
    },
    {
      key: 'quickContact', label: 'Quick Contact', align: 'center',
      render: (row) => {
        const whatsappUrl = getContactWhatsAppUrl(row.phone);
        return (
          <div className="flex items-center justify-center gap-2">
            {whatsappUrl ? <a href={whatsappUrl} target="_blank" rel="noreferrer" title="Chat on WhatsApp" className="w-8 h-8 rounded-[7px] bg-gray border-b-2 border-stroke/80 flex items-center justify-center hover:bg-gray/80 transition-colors cursor-pointer shrink-0">
              <img src={whatsappIcon} alt="WhatsApp" className="w-4 h-4 object-contain" />
            </a> : <span className="w-8 h-8 rounded-[7px] bg-gray flex items-center justify-center text-black-90/30" title="Phone number unavailable">—</span>}
            {row.email ? <a href={`mailto:${row.email}`} title="Send Email" className="w-8 h-8 rounded-[7px] bg-gray border-b-2 border-stroke/80 flex items-center justify-center text-primary hover:bg-gray/80 transition-colors cursor-pointer shrink-0">
              <Mail size={16} strokeWidth={2} />
            </a> : <span className="w-8 h-8 rounded-[7px] bg-gray flex items-center justify-center text-black-90/30" title="Email unavailable">—</span>}
          </div>
        );
      },
    },
    {
      key: 'createdDate', label: 'Created Date', sortable: true,
      render: (row) => <div className="flex flex-col text-[11px] leading-tight">
        <span className="font-medium text-black-90">{row.createdDate || '—'}</span>
        <span className="text-black-90/50 mt-0.5">{row.createdTime}</span>
      </div>,
    },
    {
      key: 'actions', label: 'Action', align: 'center', className: 'pr-4',
      render: (row) => <div className="flex items-center justify-center gap-1.5">
        <ViewBtn onClick={() => navigate(`/contacts/${encodeURIComponent(row.id)}/view`)} title="View Contact Details" />
        <EditBtn onClick={() => navigate(`/contacts/${encodeURIComponent(row.id)}/edit`)} title="Edit Contact" />
      </div>,
    },
  ], [navigate]);

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 select-text max-md:min-h-fit">
      <TableContainer toolbar={<DataTableToolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        searchPlaceholder="Search contacts..."
        onResetFilters={() => handleSearch('')}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onExport={handleExport}
      />} pagination={<Pagination
        currentPage={currentPage}
        totalPages={pagination.totalPages || 1}
        totalEntries={pagination.total || 0}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        className="pt-0 border-t-0"
      />}>
        {isExporting && <div role="status" className="px-4 py-2 text-xs text-black-90/60">Preparing contact export…</div>}
        <DataTable columns={columns} data={contacts} rowKey="id" loading={isLoading} emptyMessage={error ? 'Unable to load contacts. Please check connection and retry.' : 'No contacts found matching the current search criteria.'} />
      </TableContainer>
    </div>
  );
};

export { Contacts as ContactManagement };
export default Contacts;
