//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, common data table shell, toolbar, pagination, and view drawer
//==================================================================================================================
import React, { useState, useMemo, useCallback } from 'react';
import { TableContainer } from '../../../components/common/TableContainer';
import { DataTableToolbar } from '../../../components/common/DataTableToolbar';
import { DataTable } from '../../../components/common/DataTable';
import { Pagination } from '../../../components/common/Pagination';
import { ViewBtn } from '../../../components/common/buttons/ViewBtn';
import { ViewMemberDrawer } from './ViewMemberDrawer';
import {
  INITIAL_SALES_TEAM_DATA,
  TEAM_STATUS_OPTIONS,
  TEAM_ROLE_OPTIONS,
} from '../../../constants/salesTeamConstants';

//==================================================================================================================
//    MY TEAM PAGE COMPONENT (Image 1)
//    Enterprise team allocation, active workload tracking, and employee details view
//==================================================================================================================
export const MyTeam = () => {
  const [teamMembers, setTeamMembers] = useState(INITIAL_SALES_TEAM_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Drawer state
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  //==================================================================================================================
  //    Handlers
  //==================================================================================================================
  const handleView = useCallback((member) => {
    setSelectedMember(member);
    setIsViewDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsViewDrawerOpen(false);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('All');
    setRoleFilter('All');
    setCurrentPage(1);
  }, []);

  //==================================================================================================================
  //    Filtered Team Members
  //==================================================================================================================
  const filteredMembers = useMemo(() => {
    return teamMembers.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' || item.status === statusFilter;

      const matchesRole =
        roleFilter === 'All' || item.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [teamMembers, searchQuery, statusFilter, roleFilter]);

  // Pagination slice
  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredMembers.slice(startIndex, startIndex + pageSize);
  }, [filteredMembers, currentPage, pageSize]);

  //==================================================================================================================
  //    Table Column Definitions (Image 1)
  //==================================================================================================================
  const columns = useMemo(() => [
    {
      key: 'code',
      label: 'Code',
      className: 'font-bold text-black-90 text-sm whitespace-nowrap',
    },
    {
      key: 'name',
      label: 'Executive Name',
      render: (row) => (
        <div className="flex items-center gap-3 min-w-[150px]">
          <img
            src={row.avatar}
            alt={row.name}
            className="w-8 h-8 rounded-full object-cover border border-stroke shrink-0"
          />
          <span className="font-bold text-black-90 text-sm truncate">
            {row.name}
          </span>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      className: 'text-sm font-medium text-black-90/80 whitespace-nowrap',
    },
    {
      key: 'contact',
      label: 'Contact no',
      className: 'text-sm font-medium text-black-90/80 whitespace-nowrap',
    },
    {
      key: 'role',
      label: 'Role',
      className: 'text-sm font-medium text-black-90/80 whitespace-nowrap',
    },
    {
      key: 'leads',
      label: 'Leads',
      className: 'text-sm font-bold text-black-90 whitespace-nowrap',
    },
    {
      key: 'deals',
      label: 'Deals',
      className: 'text-sm font-bold text-secondary whitespace-nowrap',
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span
          className={`w-[154px] h-[24px] inline-flex items-center justify-center px-4 py-[2px] rounded-[7px] text-xs font-semibold select-none ${
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
      label: 'Actions',
      align: 'center',
      className: 'text-center whitespace-nowrap',
      render: (row) => (
        <div className="flex items-center justify-center">
          <ViewBtn
            onClick={() => handleView(row)}
            title={`View ${row.name}`}
          />
        </div>
      ),
    },
  ], [handleView]);

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 select-text">
      {/* ==============================================================================================================
          Main Table Container (Occupies 100% available viewport height matching Sidebar)
      ============================================================================================================== */}
      <TableContainer
        toolbar={
          <DataTableToolbar
            searchPlaceholder="Search here..."
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filters={[
              {
                id: 'status',
                value: statusFilter,
                options: TEAM_STATUS_OPTIONS,
                onChange: setStatusFilter,
              },
              {
                id: 'role',
                value: roleFilter,
                options: TEAM_ROLE_OPTIONS,
                onChange: setRoleFilter,
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
          data={paginatedMembers}
          rowKey="id"
          emptyMessage="No team members found."
        />
      </TableContainer>

      {/* ==============================================================================================================
          View Member Drawer (Image 2)
      ============================================================================================================== */}
      <ViewMemberDrawer
        isOpen={isViewDrawerOpen}
        onClose={handleCloseDrawer}
        member={selectedMember}
      />
    </div>
  );
};

export default MyTeam;
