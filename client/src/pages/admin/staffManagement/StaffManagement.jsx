//==================================================================================================================
//    STAFF MANAGEMENT PAGE COMPONENT (SUPER ADMIN WORKSPACE)
//    Enterprise team allocation, reporting hierarchy, workload governance & staff directory (Image 4)
//==================================================================================================================

import React, { useState, useMemo, useCallback } from 'react';
import { TableContainer } from '../../../components/common/TableContainer';
import { DataTableToolbar } from '../../../components/common/DataTableToolbar';
import { DataTable } from '../../../components/common/DataTable';
import { Pagination } from '../../../components/common/Pagination';
import {
  INITIAL_ADMIN_STAFF_DATA,
  STAFF_ROLE_OPTIONS,
  STAFF_BRANCH_OPTIONS,
} from '../../../constants/staffConstants';

//==================================================================================================================
//    ADMIN STAFF MANAGEMENT COMPONENT
//==================================================================================================================
export const StaffManagement = () => {
  const [staffList, setStaffList] = useState(INITIAL_ADMIN_STAFF_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('All');
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  //==================================================================================================================
  //    FILTER RESET HANDLER
  //==================================================================================================================
  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setRoleFilter('All');
    setBranchFilter('All');
    setCurrentPage(1);
  }, []);

  //==================================================================================================================
  //    FILTERING & PAGINATION (OPTIMIZED WITH USEMEMO)
  //==================================================================================================================
  const filteredStaff = useMemo(() => {
    return staffList.filter((member) => {
      const matchesSearch =
        !searchQuery.trim() ||
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.reportingManager.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole =
        roleFilter === 'All' || member.role === roleFilter;

      const matchesBranch =
        branchFilter === 'All' || member.branch === branchFilter;

      return matchesSearch && matchesRole && matchesBranch;
    });
  }, [staffList, searchQuery, roleFilter, branchFilter]);

  const paginatedStaff = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStaff.slice(start, start + pageSize);
  }, [filteredStaff, currentPage, pageSize]);

  //==================================================================================================================
  //    TABLE COLUMNS DEFINITION (Exact match to Image 4)
  //==================================================================================================================
  const columns = useMemo(() => [
    {
      key: 'code',
      label: 'Code',
      sortable: true,
      sortType: 'text',
      className: 'w-20 pl-4',
      render: (row) => (
        <span className="font-semibold text-black-90 text-xs sm:text-sm">{row.code}</span>
      ),
    },
    {
      key: 'name',
      label: 'Employee Name',
      sortable: true,
      sortType: 'text',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <img
            src={row.avatar}
            alt={row.name}
            className="w-7 h-7 rounded-full object-cover shrink-0"
          />
          <span className="font-semibold text-black-90 text-xs sm:text-sm whitespace-nowrap">
            {row.name}
          </span>
        </div>
      ),
    },
    {
      key: 'reportingManager',
      label: 'Reporting Manager',
      sortable: true,
      sortType: 'text',
      render: (row) => (
        <div className="flex flex-col text-xs leading-tight">
          <span className="font-semibold text-black-90">{row.reportingManager}</span>
          <span className="text-black-90/50 text-[11px] mt-0.5">{row.managerRole}</span>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      sortType: 'text',
      render: (row) => (
        <span className="text-xs text-black-90/80 whitespace-nowrap font-normal">
          {row.email}
        </span>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      sortType: 'text',
      render: (row) => (
        <span className="text-xs text-black-90/80 whitespace-nowrap font-normal">
          {row.role}
        </span>
      ),
    },
    {
      key: 'branch',
      label: 'Branch',
      sortable: true,
      sortType: 'text',
      render: (row) => (
        <span className="text-xs text-black-90/80 whitespace-nowrap font-normal">
          {row.branch}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      sortType: 'status',
      align: 'center',
      className: 'pr-4',
      render: (row) => (
        <span
          className={`w-[92px] h-[24px] rounded-[7px] text-xs font-semibold whitespace-nowrap inline-flex items-center justify-center select-none ${row.status === 'Active'
              ? 'bg-[#019F68]/10 text-success'
              : 'bg-gray text-black-90'
            }`}
        >
          {row.status}
        </span>
      ),
    },
  ], []);

  //==================================================================================================================
  //    RENDER MAIN COMPONENT
  //==================================================================================================================
  return (
    <div className="w-full flex-1 flex flex-col min-h-0 select-text">
      <TableContainer
        toolbar={
          <DataTableToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search here..."
            filters={[
              {
                id: 'role-filter',
                value: roleFilter,
                onChange: setRoleFilter,
                options: STAFF_ROLE_OPTIONS,
              },
              {
                id: 'branch-filter',
                value: branchFilter,
                onChange: setBranchFilter,
                options: STAFF_BRANCH_OPTIONS,
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
            totalEntries={180}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            className="pt-0 border-t-0"
          />
        }
      >
        <DataTable
          columns={columns}
          data={paginatedStaff}
          rowKey="id"
          emptyMessage="No staff members found matching the current search criteria."
        />
      </TableContainer>
    </div>
  );
};

//==================================================================================================================
//    DEFAULT EXPORT
//==================================================================================================================
export default StaffManagement;
