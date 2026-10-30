//==================================================================================================================
//    DEAL STAGES TABLE VIEWPORT (CRM CONFIGURATION)
//    Data table for managing Deal Stages taxonomies, pipeline milestones, and active states (Image 1)
//==================================================================================================================

import React, { useState, useMemo, useCallback } from 'react';
import { CircleDollarSign, CheckCircle2, XCircle } from 'lucide-react';
import { TableContainer } from '../../../../components/common/TableContainer';
import { DataTableToolbar } from '../../../../components/common/DataTableToolbar';
import { DataTable } from '../../../../components/common/DataTable';
import { Pagination } from '../../../../components/common/Pagination';
import { EditBtn } from '../../../../components/common/buttons/EditBtn';
import { AddDealStageDrawer } from './AddDealStageDrawer';
import { INITIAL_DEAL_STAGES } from '../../../../constants/crmConfigurationConstants';

export const DealStagesTable = () => {
  const [stages, setStages] = useState(INITIAL_DEAL_STAGES);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);
  const pageSize = 10;

  // Drawer handlers
  const handleOpenAdd = useCallback(() => {
    setSelectedStage(null);
    setIsDrawerOpen(true);
  }, []);

  const handleOpenEdit = useCallback((stage) => {
    setSelectedStage(stage);
    setIsDrawerOpen(true);
  }, []);

  const handleSaveStage = useCallback((formData) => {
    if (selectedStage) {
      setStages((prev) =>
        prev.map((item) =>
          item.id === selectedStage.id ? { ...item, ...formData } : item
        )
      );
    } else {
      const isWon = formData.name === 'Closed Won';
      const isLost = formData.name === 'Closed Lost';
      const newStage = {
        id: `ds-${Date.now()}`,
        code: `#${String(stages.length + 1).padStart(3, '0')}`,
        name: formData.name || 'Qualification',
        icon: isWon ? 'CheckCircle2' : isLost ? 'XCircle' : 'CircleDollarSign',
        milestone: formData.milestone || '',
        status: formData.status || 'Active',
        isWon,
        isLost,
      };
      setStages((prev) => [newStage, ...prev]);
    }
    setIsDrawerOpen(false);
  }, [selectedStage, stages.length]);

  const handleDeleteStage = useCallback((stage) => {
    setStages((prev) => prev.filter((item) => item.id !== stage.id));
    setIsDrawerOpen(false);
  }, []);

  const handleExport = useCallback(() => {
    // Export handler
  }, []);

  // Filtering & Pagination
  const filteredStages = useMemo(() => {
    return stages.filter((item) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        (item.milestone && item.milestone.toLowerCase().includes(q))
      );
    });
  }, [stages, searchQuery]);

  const paginatedStages = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredStages.slice(startIndex, startIndex + pageSize);
  }, [filteredStages, currentPage, pageSize]);

  // Table columns definition matching Image 1
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
      label: 'Stage Name',
      sortable: true,
      className: 'w-[380px] min-w-[280px]',
      render: (row) => {
        if (row.isWon || row.name === 'Closed Won') {
          return (
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#D1FADF]/60 text-success flex items-center justify-center shrink-0">
                <CheckCircle2 size={14} />
              </div>
              <span className="font-semibold text-success text-xs sm:text-sm whitespace-nowrap">
                {row.name}
              </span>
            </div>
          );
        }

        if (row.isLost || row.name === 'Closed Lost') {
          return (
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#FEE4E2]/70 text-alert flex items-center justify-center shrink-0">
                <XCircle size={14} />
              </div>
              <span className="font-semibold text-alert text-xs sm:text-sm whitespace-nowrap">
                {row.name}
              </span>
            </div>
          );
        }

        return (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#EBF1FD] text-primary flex items-center justify-center shrink-0">
              <CircleDollarSign size={14} />
            </div>
            <span className="font-semibold text-black-90 text-xs sm:text-sm whitespace-nowrap">
              {row.name}
            </span>
          </div>
        );
      },
    },
    {
      key: 'milestone',
      label: 'Pipeline Milestone',
      sortable: true,
      className: 'min-w-[260px]',
      render: (row) => (
        <span className="text-black-90 text-xs sm:text-sm font-normal whitespace-nowrap">
          {row.milestone}
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
            className={`w-[112px] h-[23px] rounded-[4px] text-xs font-semibold whitespace-nowrap inline-flex items-center justify-center select-none ${row.status === 'Active'
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
          <EditBtn onClick={() => handleOpenEdit(row)} title="Edit Deal Stage" />
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
              label: 'Add Deal Stage',
              onClick: handleOpenAdd,
            }}
          />
        }
        pagination={
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredStages.length / pageSize) || 1}
            totalEntries={filteredStages.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            className="pt-0 border-t-0"
          />
        }
      >
        <DataTable
          columns={columns}
          data={paginatedStages}
          rowKey="id"
          emptyMessage="No deal stages configured."
        />
      </TableContainer>

      <AddDealStageDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveStage}
        onDelete={handleDeleteStage}
        initialData={selectedStage}
      />
    </div>
  );
};

export default DealStagesTable;
