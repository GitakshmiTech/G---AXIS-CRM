//==================================================================================================================
//    STAFF MANAGEMENT PAGE COMPONENT (SUPER ADMIN WORKSPACE - FRD SECTION 10)
//    Enterprise team allocation, reporting hierarchy, workload governance & dynamic staff directory
//    Strict Flat Design: 100% border-only, no drop shadows, 7px radius, 2px bottom border in stroke/80
//==================================================================================================================
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, UserPlus, Users, UserCheck, Shield } from 'lucide-react';
import { TableContainer } from '../components/common/Table/TableContainer';
import { DataTableToolbar } from '../components/common/Table/DataTableToolbar';
import { DataTable } from '../components/common/Table/DataTable';
import { Pagination } from '../components/common/Table/Pagination';
import { ViewBtn } from '../components/common/buttons/ViewBtn';
import { AddTeamMemberModal } from '../components/modules/team/AddTeamMemberModal';
import { fetchStaffMembers } from '../services/staffService';
import {
  STAFF_ROLE_OPTIONS,
  STAFF_BRANCH_OPTIONS,
} from '../constants/staffConstants';
import { useToast } from '../hooks/useToast';

const PAGE_SIZE = 10;

export const StaffManagement = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('All');
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setCurrentPage(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load dynamic staff members from backend API
  const loadStaffData = useCallback(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');

    fetchStaffMembers({
      page: currentPage,
      limit: PAGE_SIZE,
      search: debouncedSearch,
      role: roleFilter,
      branch: branchFilter,
      signal: controller.signal,
    })
      .then((res) => {
        setStaffList(res.rows || []);
        setPagination(res.pagination || { page: currentPage, limit: PAGE_SIZE, total: (res.rows || []).length, totalPages: 1 });
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Unable to load staff directory.');
        toast(err.message || 'Failed to load staff records.', 'error');
      })
      .finally(() => {
        setLoading(false);
      });

    return () => controller.abort();
  }, [currentPage, debouncedSearch, roleFilter, branchFilter, toast]);

  useEffect(() => {
    loadStaffData();
  }, [loadStaffData]);

  // Filter Reset Handler
  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setDebouncedSearch('');
    setRoleFilter('All');
    setBranchFilter('All');
    setCurrentPage(1);
  }, []);

  // View staff member handler
  const handleViewMember = useCallback((member) => {
    if (!member?.id) return;
    navigate(`/team/${encodeURIComponent(member.id)}`);
  }, [navigate]);

  // CSV Export Handler
  const handleExportCsv = useCallback(() => {
    try {
      const escapeCsv = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
      const headers = ['Employee Code', 'Full Name', 'Reporting Manager', 'Corporate Email', 'Role', 'Branch', 'Status'];
      const rows = staffList.map((m) => [
        escapeCsv(m.code),
        escapeCsv(m.name),
        escapeCsv(m.reportingManager),
        escapeCsv(m.email),
        escapeCsv(m.role),
        escapeCsv(m.branch),
        escapeCsv(m.status),
      ].join(','));

      const csvContent = [headers.join(','), ...rows].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `crm-staff-directory-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast('Staff directory exported successfully.', 'success');
    } catch {
      toast('Failed to export CSV.', 'error');
    }
  }, [staffList, toast]);

  // Table Columns Definition
  const columns = useMemo(() => [
    {
      key: 'code',
      label: 'Code',
      sortable: true,
      headerClassName: 'w-[90px]',
      className: 'w-[90px] pl-4 font-bold text-black-90 text-xs whitespace-nowrap',
      render: (row) => <span title={row.code}>{row.code}</span>,
    },
    {
      key: 'name',
      label: 'Employee Name',
      sortable: true,
      headerClassName: 'w-[240px]',
      className: 'min-w-[200px]',
      render: (row) => (
        <div
          onClick={() => handleViewMember(row)}
          className="flex items-center gap-2.5 min-w-[200px] cursor-pointer group"
          title={`View telemetry for ${row.name}`}
        >
          {/* Circular & Borderless Avatar (Rule #24) */}
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
      key: 'reportingManager',
      label: 'Reporting Manager',
      sortable: true,
      headerClassName: 'w-[160px]',
      className: 'w-[160px] whitespace-nowrap',
      render: (row) => (
        <div className="flex flex-col text-xs leading-tight whitespace-nowrap">
          <span className="font-semibold text-black-90">{row.reportingManager || '—'}</span>
          <span className="text-black-90/50 text-[11px] mt-0.5">{row.managerRole || 'Executive'}</span>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Corporate Email',
      sortable: true,
      headerClassName: 'w-[190px]',
      className: 'w-[190px] text-xs text-black-90/80 whitespace-nowrap font-medium',
      render: (row) => <span title={row.email} className="truncate block max-w-[170px]">{row.email}</span>,
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      headerClassName: 'w-[150px]',
      className: 'w-[150px] whitespace-nowrap',
      render: (row) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-[7px] text-[11px] font-semibold whitespace-nowrap ${
            row.role?.includes('Admin')
              ? 'bg-purple-50 text-purple-700'
              : row.role?.includes('Manager')
              ? 'bg-primary/10 text-primary'
              : 'bg-gray text-black-90/80'
          }`}
          title={row.role}
        >
          {row.role}
        </span>
      ),
    },
    {
      key: 'branch',
      label: 'Branch / Territory',
      sortable: true,
      headerClassName: 'w-[150px]',
      className: 'w-[150px] text-xs text-black-90/80 whitespace-nowrap font-medium',
      render: (row) => <span>{row.branch || 'Headquarters'}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      align: 'center',
      headerClassName: 'w-[110px]',
      className: 'w-[110px] text-center whitespace-nowrap',
      render: (row) => (
        <span
          className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-[7px] text-[11px] font-semibold whitespace-nowrap ${
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
      key: 'action',
      label: 'Action',
      align: 'center',
      headerClassName: 'w-[90px]',
      className: 'w-[90px] text-center whitespace-nowrap pr-4',
      render: (row) => (
        <div className="flex items-center justify-center">
          <ViewBtn onClick={() => handleViewMember(row)} title={`View profile and telemetry for ${row.name}`} />
        </div>
      ),
    },
  ], [handleViewMember]);

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 select-text gap-3 max-md:min-h-fit">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-base font-bold text-black-90">Staff Management Directory</h2>
          <p className="text-xs text-black-90/50">
            Real-time staff allocation, administrative hierarchy, and role governance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            title="Export staff roster to CSV"
            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] border-b-2 border-stroke/80 bg-white-100 hover:bg-gray text-xs font-semibold text-black-90 transition-colors"
          >
            <Download size={13} className="text-primary" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            title="Provision new staff member"
            className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[7px] border-b-2 border-primary/80 bg-primary hover:bg-primary/90 text-xs font-bold text-white-100 transition-colors"
          >
            <UserPlus size={13} />
            <span>Add Staff Member</span>
          </button>
        </div>
      </div>

      <TableContainer
        toolbar={
          <DataTableToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search staff by name, code, or email..."
            filters={[
              {
                id: 'role-filter',
                value: roleFilter,
                onChange: setRoleFilter,
                options: STAFF_ROLE_OPTIONS,
                placeholder: 'By Role',
              },
              {
                id: 'branch-filter',
                value: branchFilter,
                onChange: setBranchFilter,
                options: STAFF_BRANCH_OPTIONS,
                placeholder: 'By Branch',
              },
            ]}
            onResetFilters={handleResetFilters}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        }
        pagination={
          <Pagination
            currentPage={currentPage}
            totalEntries={pagination.total}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
            className="pt-0 border-t-0"
          />
        }
      >
        <DataTable
          columns={columns}
          data={staffList}
          rowKey="id"
          loading={loading}
          emptyMessage="No staff members found matching the current search criteria."
        />
      </TableContainer>

      {/* Add Staff Modal (FRD 10.3 / 11.24) */}
      <AddTeamMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadStaffData}
      />
    </div>
  );
};

export default StaffManagement;
