//==================================================================================================================
//    LEAD STATUSES TABLE VIEWPORT (CRM CONFIGURATION)
//    Data table for managing Lead Statuses taxonomies, funnel positions, and active states (Images 1, 2 & 3)
//==================================================================================================================

import React, { useState, useMemo, useCallback } from 'react';
import { TableContainer } from '../../../../components/common/TableContainer';
import { DataTableToolbar } from '../../../../components/common/DataTableToolbar';
import { DataTable } from '../../../../components/common/DataTable';
import { Pagination } from '../../../../components/common/Pagination';
import { EditBtn } from '../../../../components/common/buttons/EditBtn';
import { LeadStatusStarIcon } from '../../../../components/common/icons/LeadStatusStarIcon';
import { AddLeadStatusDrawer } from './AddLeadStatusDrawer';
import { INITIAL_LEAD_STATUSES } from '../../../../constants/crmConfigurationConstants';

export const LeadStatusesTable = () => {
  const [statuses, setStatuses] = useState(INITIAL_LEAD_STATUSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const pageSize = 10;

  // Drawer handlers
  const handleOpenAdd = useCallback(() => {
    setSelectedStatus(null);
    setIsDrawerOpen(true);
  }, []);

  const handleOpenEdit = useCallback((statusItem) => {
    setSelectedStatus(statusItem);
    setIsDrawerOpen(true);
  }, []);

  const handleSaveStatus = useCallback((formData) => {
    if (selectedStatus) {
      setStatuses((prev) =>
        prev.map((item) =>
          item.id === selectedStatus.id ? { ...item, ...formData } : item
        )
      );
    } else {
      const newStatus = {
        id: `st-${Date.now()}`,
        code: `#${String(statuses.length + 1).padStart(3, '0')}`,
        name: formData.name || 'New',
        icon: 'Star',
        funnelPosition: formData.funnelPosition || 'Unassigned Incoming',
        status: formData.status || 'Active',
      };
      setStatuses((prev) => [newStatus, ...prev]);
    }
    setIsDrawerOpen(false);
  }, [selectedStatus, statuses.length]);

  const handleDeleteStatus = useCallback((statusItem) => {
    setStatuses((prev) => prev.filter((item) => item.id !== statusItem.id));
    setIsDrawerOpen(false);
  }, []);

  const handleExport = useCallback(() => {
    // Export handler
  }, []);

  // Filtering & Pagination
  const filteredStatuses = useMemo(() => {
    return statuses.filter((item) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        (item.funnelPosition && item.funnelPosition.toLowerCase().includes(q))
      );
    });
  }, [statuses, searchQuery]);

  const paginatedStatuses = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredStatuses.slice(startIndex, startIndex + pageSize);
  }, [filteredStatuses, currentPage, pageSize]);

  // Table columns definition matching Figma Images 1 & 2
  const columns = useMemo(() => [
    {
      key: 'code',
      label: 'ID',
      sortable: true,
      className: 'w-24',
      render: (row) => (
        <span className="font-semibold text-black-90 text-xs sm:text-sm">
          {row.code}
        </span>
      ),
    },
    {
      key: 'name',
      label: 'Lead Source',
      sortable: true,
      className: 'w-full min-w-[200px]',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#EBF1FD] text-primary flex items-center justify-center shrink-0">
            <LeadStatusStarIcon size={14} className="stroke-primary" />
          </div>
          <span className="font-semibold text-black-90 text-xs sm:text-sm whitespace-nowrap">
            {row.name}
          </span>
        </div>
      ),
    },
    {
      key: 'funnelPosition',
      label: 'Funnel Position',
      sortable: true,
      className: 'min-w-[260px]',
      render: (row) => (
        <span className="text-black-90 text-xs sm:text-sm font-normal whitespace-nowrap">
          {row.funnelPosition}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      align: 'center',
      className: 'w-[140px] text-center',
      render: (row) => (
        <div className="flex items-center justify-center">
          <span
            className={`w-[112px] h-[23px] rounded-[4px] text-xs font-semibold whitespace-nowrap inline-flex items-center justify-center select-none ${
              row.status === 'Active'
                ? 'bg-[#019F68]/10 text-success'
                : 'bg-gray text-black-90'
            }`}
          >
            {row.status}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Action',
      align: 'center',
      className: 'pr-4 w-20',
      render: (row) => (
        <div className="flex items-center justify-center">
          <EditBtn onClick={() => handleOpenEdit(row)} title="Edit Lead Status" />
        </div>
      ),
    },
  ], [handleOpenEdit]);

  return (
    <div className="flex-1 w-full min-w-0 h-full flex flex-col min-h-0">
      <TableContainer
        toolbar={
          <DataTableToolbar
            searchPlaceholder="Search here..."
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onExport={handleExport}
            actionButton={{
              label: 'Add Lead Status',
              onClick: handleOpenAdd,
            }}
          />
        }
        pagination={
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredStatuses.length / pageSize) || 1}
            totalEntries={filteredStatuses.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            className="pt-0 border-t-0"
          />
        }
      >
        <DataTable
          columns={columns}
          data={paginatedStatuses}
          rowKey="id"
          emptyMessage="No lead statuses configured."
        />
      </TableContainer>

      <AddLeadStatusDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveStatus}
        onDelete={handleDeleteStatus}
        initialData={selectedStatus}
      />
    </div>
  );
};

export default LeadStatusesTable;
