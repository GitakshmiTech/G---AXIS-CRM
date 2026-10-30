//==================================================================================================================
//    MY CLIENTS PAGE COMPONENT (SALES WORKSPACE)
//    Enterprise accounts workspace module featuring client directory, stakeholders stack, and drawer actions
//==================================================================================================================

import React, { useState, useMemo, useCallback } from 'react';
import { TableContainer } from '../../../components/common/TableContainer';
import { DataTableToolbar } from '../../../components/common/DataTableToolbar';
import { DataTable } from '../../../components/common/DataTable';
import { Pagination } from '../../../components/common/Pagination';
import { ViewBtn } from '../../../components/common/buttons/ViewBtn';
import { EditBtn } from '../../../components/common/buttons/EditBtn';
import { AvatarStack } from '../../../components/common/AvatarStack';
import { EditClientDrawer } from './EditClientDrawer';
import {
  INITIAL_CLIENTS_DATA,
  CLIENT_INDUSTRY_OPTIONS,
  CLIENT_STAGE_OPTIONS,
} from '../../../constants/clientsConstants';

//==================================================================================================================
//    MY CLIENTS COMPONENT
//==================================================================================================================
export const MyClients = () => {
  const [clients, setClients] = useState(INITIAL_CLIENTS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [stageFilter, setStageFilter] = useState('All');
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Drawer state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [drawerMode, setDrawerMode] = useState('edit');

  //==================================================================================================================
  //    DRAWER TRIGGER HANDLERS
  //==================================================================================================================
  const handleOpenEdit = useCallback((client) => {
    setSelectedClient(client);
    setDrawerMode('edit');
    setIsEditOpen(true);
  }, []);

  const handleOpenView = useCallback((client) => {
    setSelectedClient(client);
    setDrawerMode('view');
    setIsEditOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsEditOpen(false);
    setSelectedClient(null);
  }, []);

  const handleSaveClient = useCallback((updatedData) => {
    if (selectedClient) {
      setClients((prev) =>
        prev.map((c) => (c.id === selectedClient.id ? { ...c, ...updatedData } : c))
      );
    }
    handleCloseDrawer();
  }, [selectedClient, handleCloseDrawer]);

  //==================================================================================================================
  //    FILTERING & SORTING (OPTIMIZED WITH USEMEMO)
  //==================================================================================================================
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        !searchQuery.trim() ||
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.industryType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesIndustry =
        industryFilter === 'All' || client.industryType === industryFilter;
      const matchesStage =
        stageFilter === 'All' || client.stage === stageFilter;

      return matchesSearch && matchesIndustry && matchesStage;
    });
  }, [clients, searchQuery, industryFilter, stageFilter]);

  const paginatedClients = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredClients.slice(start, start + pageSize);
  }, [filteredClients, currentPage, pageSize]);

  //==================================================================================================================
  //    TABLE COLUMNS DEFINITION
  //==================================================================================================================
  const columns = useMemo(() => [
    {
      key: 'code',
      label: 'Code',
      sortable: true,
      className: 'w-20 pl-4',
      render: (row) => (
        <span className="font-semibold text-black-90">{row.code}</span>
      ),
    },
    {
      key: 'name',
      label: 'Client Name',
      sortable: true,
      className: 'max-sm:min-w-[180px] max-sm:pr-4',
      headerClassName: 'max-sm:min-w-[180px] max-sm:pr-4',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <img
            src={row.companyLogo}
            alt={row.name}
            className="w-7 h-7 rounded-lg object-cover border border-stroke shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-black-90 whitespace-nowrap">
              {row.name}
            </span>
            <span className="text-[11px] text-black-90/50 font-normal truncate">
              {row.website}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'industryType',
      label: 'Industry Type',
      sortable: true,
      className: 'max-sm:min-w-[150px] max-sm:pr-4',
      headerClassName: 'max-sm:min-w-[150px] max-sm:pr-4',
      render: (row) => (
        <span className="font-semibold text-black-90 whitespace-nowrap">
          {row.industryType}
        </span>
      ),
    },
    {
      key: 'stakeholders',
      label: 'Stakeholders',
      sortable: true,
      align: 'center',
      className: 'max-sm:min-w-[130px]',
      headerClassName: 'max-sm:min-w-[130px]',
      render: (row) => (
        <AvatarStack
          avatars={row.stakeholders}
          extraCount={row.extraStakeholdersCount}
        />
      ),
    },
    {
      key: 'assignedBde',
      label: 'Assigned BDE',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <img
            src={row.assignedBdeAvatar}
            alt={row.assignedBde}
            className="w-6 h-6 rounded-full object-cover border border-stroke shrink-0"
          />
          <span className="font-semibold text-black-90 whitespace-nowrap text-xs">
            {row.assignedBde}
          </span>
        </div>
      ),
    },
    {
      key: 'stage',
      label: 'Stage',
      sortable: true,
      render: (row) => (
        <div className="w-[112px] h-[24px] inline-flex items-center justify-center px-3 py-0.5 bg-gray rounded-[7px] text-xs font-semibold text-black-90 select-none">
          {row.stage}
        </div>
      ),
    },
    {
      key: 'createdDate',
      label: 'Created Date',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col text-[11px] leading-tight">
          <span className="font-medium text-black-90">{row.createdDate}</span>
          <span className="text-black-90/50 mt-0.5">{row.createdTime}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Action',
      align: 'center',
      className: 'pr-4',
      render: (row) => (
        <div className="flex items-center justify-center gap-1.5">
          <ViewBtn onClick={() => handleOpenView(row)} title="View Client Details" />
          <EditBtn onClick={() => handleOpenEdit(row)} title="Edit Client" />
        </div>
      ),
    },
  ], [handleOpenView, handleOpenEdit]);

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
                id: 'industry-filter',
                value: industryFilter,
                onChange: setIndustryFilter,
                options: CLIENT_INDUSTRY_OPTIONS,
              },
              {
                id: 'stage-filter',
                value: stageFilter,
                onChange: setStageFilter,
                options: CLIENT_STAGE_OPTIONS,
              },
            ]}
            onResetFilters={() => {
              setSearchQuery('');
              setIndustryFilter('All');
              setStageFilter('All');
              setCurrentPage(1);
            }}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onExport={() => alert('Exporting Clients Data...')}
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
          data={paginatedClients}
          rowKey="id"
          emptyMessage="No clients found matching the current search criteria."
        />
      </TableContainer>

      {/* Slide-over Edit Client Details Drawer (Images 2 & 3) */}
      <EditClientDrawer
        isOpen={isEditOpen}
        onClose={handleCloseDrawer}
        onSave={handleSaveClient}
        initialData={selectedClient}
        mode={drawerMode}
      />
    </div>
  );
};

export default MyClients;
