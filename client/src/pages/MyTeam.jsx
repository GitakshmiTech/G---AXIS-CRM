//===========================================================================================
//    SALES TEAM MANAGEMENT PAGE (FRD 11.23)
//    Enterprise team allocation, active workload tracking, and employee details view
//    Strict Flat Design: no drop shadows, 7px radius, 2px bottom border in stroke/80
// ===========================================================================================
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, UserX, Download, AlertTriangle, RefreshCw } from 'lucide-react';
import { TableContainer } from '../components/common/Table/TableContainer';
import { DataTableToolbar } from '../components/common/Table/DataTableToolbar';
import { DataTable } from '../components/common/Table/DataTable';
import { Pagination } from '../components/common/Table/Pagination';
import { ViewBtn } from '../components/common/buttons/ViewBtn';
import { EditBtn } from '../components/common/buttons/EditBtn';
import { AddTeamMemberModal } from '../components/modules/team/AddTeamMemberModal';
import { fetchTeamMembers } from '../services/teamService';
import { useToast } from '../hooks/useToast';

const PAGE_SIZE = 10;

const STATUS_FILTER_OPTIONS = [
  { value: 'All', label: 'All Status' },
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
];

const ROLE_FILTER_OPTIONS = [
  { value: 'All', label: 'All Roles' },
  { value: 'BDE', label: 'BDE' },
  { value: 'Sales Executive', label: 'Sales Executive' },
  { value: 'Senior Sales Executive', label: 'Senior Sales Executive' },
  { value: 'Sales Manager', label: 'Sales Manager' },
];

export const MyTeam = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [teamMembers, setTeamMembers] = useState([]);
  const [kpis, setKpis] = useState({ totalMembers: 0, activeMembers: 0, inactiveMembers: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [viewMode, setViewMode] = useState('list');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setCurrentPage(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load team members from backend API
  const loadData = useCallback(() => {
    const controller = new AbortController();
    setLoading(true);
    fetchTeamMembers({
      page: currentPage,
      limit: PAGE_SIZE,
      search: debouncedSearch,
      status: statusFilter,
      role: roleFilter,
      signal: controller.signal,
    })
      .then((res) => {
        setTeamMembers(res.rows || []);
        setKpis(res.kpis || { totalMembers: 0, activeMembers: 0, inactiveMembers: 0 });
        setPagination(res.pagination || { page: currentPage, limit: PAGE_SIZE, total: 0, totalPages: 1 });
        setError('');
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Unable to load team members.');
        toast(err.message || 'Unable to load team members.', 'error');
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [currentPage, debouncedSearch, statusFilter, roleFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset Filters
  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setDebouncedSearch('');
    setStatusFilter('All');
    setRoleFilter('All');
    setCurrentPage(1);
  }, []);

  // View handler - navigate to full page (FRD 11.25)
  const handleView = useCallback((member) => {
    if (!member?.id) return;
    navigate(`/team/${encodeURIComponent(member.id)}`);
  }, [navigate]);

  // CSV Export handler
  const handleExport = useCallback(() => {
    try {
      const escapeCsv = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
      const headers = ['Code', 'Name', 'Email', 'Contact', 'Role', 'Leads', 'Deals', 'Status'];
      const rows = teamMembers.map((m) => [
        escapeCsv(m.code),
        escapeCsv(m.name),
        escapeCsv(m.email),
        escapeCsv(m.phone || m.contact),
        escapeCsv(m.role),
        escapeCsv(m.assignedLeads ?? m.leads ?? 0),
        escapeCsv(m.activeDeals ?? m.deals ?? 0),
        escapeCsv(m.status),
      ].join(','));

      const csvContent = [headers.join(','), ...rows].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sales-team-roster-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast('Team roster exported successfully.', 'success');
    } catch {
      toast('Failed to export CSV.', 'error');
    }
  }, [teamMembers, toast]);

  // Table Columns
  const columns = useMemo(() => [
    {
      key: 'code',
      label: 'Code',
      headerClassName: 'w-[90px]',
      className: 'font-bold text-black-90 text-xs whitespace-nowrap',
      render: (row) => {
        const displayCode = row.code && /^\d+$/.test(String(row.code).trim())
          ? `EMP-${String(row.code).trim().padStart(3, '0')}`
          : (row.code || '—');
        return <span title={displayCode} className="font-semibold text-black-90">{displayCode}</span>;
      },
    },
    {
      key: 'name',
      label: 'Executive Name',
      headerClassName: 'w-[240px]',
      className: 'min-w-[200px]',
      render: (row) => (
        <div
          onClick={() => handleView(row)}
          className="flex items-center gap-2.5 min-w-[200px] cursor-pointer group"
          title={`View profile for ${row.name}`}
        >
          <div
            data-preserve-radius="true"
            className="w-8 h-8 rounded-full overflow-hidden border-none shrink-0 bg-primary/10 flex items-center justify-center text-primary font-bold text-xs"
          >
            {row.avatar ? (
              <img src={row.avatar} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              row.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
            )}
          </div>
          <div className="min-w-0 max-w-[170px]">
            <span
              className="font-bold text-black-90 text-xs truncate block group-hover:text-primary transition-colors"
              title={row.name}
            >
              {row.name}
            </span>
            <span className="text-[11px] text-black-90/50 truncate block" title={row.email}>
              {row.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Contact No',
      headerClassName: 'w-[150px]',
      className: 'text-xs font-medium text-black-90/80 whitespace-nowrap',
      render: (row) => <span className="whitespace-nowrap">{row.phone || row.contact || '—'}</span>,
    },
    {
      key: 'role',
      label: 'Role',
      headerClassName: 'w-[150px]',
      className: 'text-xs font-medium text-black-90/80 whitespace-nowrap',
      render: (row) => <span title={row.role}>{row.role}</span>,
    },
    {
      key: 'leads',
      label: 'Assigned Leads',
      headerClassName: 'w-[120px]',
      className: 'text-xs font-bold text-black-90 whitespace-nowrap',
      render: (row) => <span>{row.assignedLeads ?? row.leads ?? 0}</span>,
    },
    {
      key: 'deals',
      label: 'Active Deals',
      headerClassName: 'w-[110px]',
      className: 'text-xs font-bold text-secondary whitespace-nowrap',
      render: (row) => <span>{row.activeDeals ?? row.deals ?? 0}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      headerClassName: 'w-[110px]',
      className: 'text-center whitespace-nowrap',
      render: (row) => (
        <span
          className={`inline-flex items-center justify-center px-3 py-0.5 rounded-[7px] text-[11px] font-semibold whitespace-nowrap ${
            row.status === 'Active'
              ? 'bg-success/10 text-success'
              : 'bg-gray text-black-90/60'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Action',
      align: 'center',
      headerClassName: 'w-[90px]',
      className: 'text-center whitespace-nowrap',
      render: (row) => (
        <div className="flex items-center justify-center gap-1.5">
          <ViewBtn onClick={() => handleView(row)} title={`View details for ${row.name}`} />
        </div>
      ),
    },
  ], [handleView]);

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 select-text gap-3 max-md:min-h-fit">
      {/* Top 3 KPI Summary Cards (FRD 11.23) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="p-2 sm:p-3.5 rounded-[7px] border-b-2 border-stroke/80 bg-white-100 flex items-center justify-between">
          <div className="min-w-0 pr-1">
            <span className="text-[10px] sm:text-[11px] text-black-90/50 font-medium block truncate">Total Members</span>
            <strong className="text-base sm:text-xl font-bold text-black-90">{kpis.totalMembers}</strong>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-[7px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Users size={16} className="sm:w-5 sm:h-5" />
          </div>
        </div>

        <div className="p-2 sm:p-3.5 rounded-[7px] border-b-2 border-stroke/80 bg-white-100 flex items-center justify-between">
          <div className="min-w-0 pr-1">
            <span className="text-[10px] sm:text-[11px] text-black-90/50 font-medium block truncate">Active Members</span>
            <strong className="text-base sm:text-xl font-bold text-success">{kpis.activeMembers}</strong>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-[7px] bg-success/10 text-success flex items-center justify-center shrink-0">
            <UserCheck size={16} className="sm:w-5 sm:h-5" />
          </div>
        </div>

        <div className="p-2 sm:p-3.5 rounded-[7px] border-b-2 border-stroke/80 bg-white-100 flex items-center justify-between">
          <div className="min-w-0 pr-1">
            <span className="text-[10px] sm:text-[11px] text-black-90/50 font-medium block truncate">Inactive Members</span>
            <strong className="text-base sm:text-xl font-bold text-black-90/60">{kpis.inactiveMembers}</strong>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-[7px] bg-gray text-black-90/60 flex items-center justify-center shrink-0">
            <UserX size={16} className="sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <TableContainer
        className="min-h-0 flex-1"
        toolbar={
          <DataTableToolbar
            searchPlaceholder="Search team member by name, code, or email..."
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filters={[
              {
                id: 'status',
                placeholder: 'By Status',
                value: statusFilter,
                options: STATUS_FILTER_OPTIONS,
                onChange: (v) => { setStatusFilter(v); setCurrentPage(1); },
              },
              {
                id: 'role',
                placeholder: 'By Role',
                value: roleFilter,
                options: ROLE_FILTER_OPTIONS,
                onChange: (v) => { setRoleFilter(v); setCurrentPage(1); },
              },
            ]}
            onResetFilters={handleResetFilters}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            actionButton={{
              label: 'Add Team Member',
              onClick: () => setIsAddModalOpen(true),
            }}
            actions={
              <button
                type="button"
                onClick={handleExport}
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-[7px] border-b-2 border-stroke/80 bg-white-100 px-3 py-1.5 text-xs font-semibold text-black-90 hover:bg-gray transition-colors"
                title="Export team roster to CSV"
              >
                <Download size={14} /> Export CSV
              </button>
            }
          />
        }
        pagination={
          teamMembers.length > 0 ? (
            <Pagination
              currentPage={currentPage}
              totalEntries={pagination.total}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
              className="pt-0 border-t-0"
            />
          ) : null
        }
      >
        <DataTable
          columns={columns}
          data={teamMembers}
          rowKey="id"
          loading={loading}
          emptyMessage={error ? 'Unable to load team members. Please check connection and retry.' : 'No team members found matching the current filters.'}
        />
      </TableContainer>

      {/* Add Team Member Modal (FRD 11.24) */}
      <AddTeamMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
};

export default MyTeam;
