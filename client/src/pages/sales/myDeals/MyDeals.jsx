//==================================================================================================================
//    MY DEALS PAGE COMPONENT (SALES WORKSPACE)
//    Enterprise deals pipeline workspace module featuring deal stages, expected valuation, close dates & edit drawer
//==================================================================================================================

import React, { useState, useMemo, useCallback } from 'react';
import { TableContainer } from '../../../components/common/TableContainer';
import { DataTableToolbar } from '../../../components/common/DataTableToolbar';
import { DataTable } from '../../../components/common/DataTable';
import { Pagination } from '../../../components/common/Pagination';
import { ViewBtn } from '../../../components/common/buttons/ViewBtn';
import { EditBtn } from '../../../components/common/buttons/EditBtn';
import { AvatarStack } from '../../../components/common/AvatarStack';
import { EditDealDrawer } from './EditDealDrawer';
import {
  INITIAL_DEALS_DATA,
  DEAL_PRODUCT_OPTIONS,
  DEAL_STAGE_OPTIONS,
} from '../../../constants/dealsConstants';

//==================================================================================================================
//    MY DEALS COMPONENT
//==================================================================================================================
export const MyDeals = () => {
  const [deals, setDeals] = useState(INITIAL_DEALS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [productFilter, setProductFilter] = useState('All');
  const [stageFilter, setStageFilter] = useState('All');
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Drawer state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);

  //==================================================================================================================
  //    DRAWER TRIGGER HANDLERS
  //==================================================================================================================
  const handleOpenEdit = useCallback((deal) => {
    setSelectedDeal(deal);
    setIsEditOpen(true);
  }, []);

  const handleOpenView = useCallback((deal) => {
    setSelectedDeal(deal);
    setIsEditOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsEditOpen(false);
    setSelectedDeal(null);
  }, []);

  const handleSaveDeal = useCallback((updatedData) => {
    if (selectedDeal) {
      setDeals((prev) =>
        prev.map((d) => (d.id === selectedDeal.id ? { ...d, ...updatedData } : d))
      );
    }
    handleCloseDrawer();
  }, [selectedDeal, handleCloseDrawer]);

  //==================================================================================================================
  //    FILTERING & PAGINATION (OPTIMIZED WITH USEMEMO)
  //==================================================================================================================
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchesSearch =
        !searchQuery.trim() ||
        deal.dealName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.stage.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesProduct =
        productFilter === 'All' || deal.productInterestName === productFilter;
      const matchesStage =
        stageFilter === 'All' || deal.stage === stageFilter;

      return matchesSearch && matchesProduct && matchesStage;
    });
  }, [deals, searchQuery, productFilter, stageFilter]);

  const paginatedDeals = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDeals.slice(start, start + pageSize);
  }, [filteredDeals, currentPage, pageSize]);

  //==================================================================================================================
  //    TABLE COLUMNS DEFINITION
  //==================================================================================================================
  const columns = useMemo(() => [
    {
      key: 'code',
      label: 'Code',
      sortable: true,
      sortType: 'text',
      className: 'w-20 pl-4',
      render: (row) => (
        <span className="font-semibold text-black-90">{row.code}</span>
      ),
    },
    {
      key: 'dealName',
      label: 'Deal Name',
      sortable: true,
      sortType: 'text',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <img
            src={row.dealAvatar}
            alt={row.dealName}
            className="w-7 h-7 rounded-full object-cover shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-black-90 whitespace-nowrap">
              {row.dealName}
            </span>
            <span className="text-[11px] text-black-90/50 font-normal truncate">
              {row.dealRole}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'productInterest',
      label: 'Product Interest',
      align: 'center',
      render: (row) => (
        <AvatarStack
          avatars={row.productInterest}
          extraCount={row.extraProductCount}
        />
      ),
    },
    {
      key: 'expectedValue',
      label: 'Expected Value',
      sortable: true,
      sortType: 'text',
      render: (row) => (
        <span className="text-xs font-semibold text-black-90 whitespace-nowrap leading-none">
          {row.expectedValue}
        </span>
      ),
    },
    {
      key: 'stage',
      label: 'Stage',
      sortable: true,
      sortType: 'status',
      align: 'center',
      render: (row) => (
        <div className="px-5 py-1.5 bg-gray rounded-[8px] inline-flex items-center justify-center text-xs font-bold text-black-90 select-none">
          {row.stage}
        </div>
      ),
    },
    {
      key: 'expectedCloseDate',
      label: 'Expected Close Date',
      sortable: true,
      align: 'center',
      render: (row) => (
        <div className="flex flex-col items-center justify-center select-none">
          <div className="px-4 py-1.5 bg-gray rounded-[8px] inline-flex items-center justify-center">
            <span className="text-xs font-bold text-primary whitespace-nowrap">
              {row.expectedCloseDate}
            </span>
          </div>
          <span className="text-[11px] text-black-90/50 font-medium mt-1 whitespace-nowrap">
            {row.dueDaysText}
          </span>
        </div>
      ),
    },
    {
      key: 'assignedBde',
      label: 'Assigned BDE',
      sortable: true,
      sortType: 'text',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <img
            src={row.assignedBdeAvatar}
            alt={row.assignedBde}
            className="w-7 h-7 rounded-full object-cover shrink-0"
          />
          <span className="font-semibold text-black-90 whitespace-nowrap text-xs">
            {row.assignedBde}
          </span>
        </div>
      ),
    },
    {
      key: 'createdDate',
      label: 'Created Date',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col text-xs leading-tight">
          <span className="font-medium text-black-90">{row.createdDate}</span>
          <span className="text-black-90/50 text-[11px] mt-0.5">{row.createdTime}</span>
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
          <ViewBtn onClick={() => handleOpenView(row)} title="View Deal Details" />
          <EditBtn onClick={() => handleOpenEdit(row)} title="Edit Deal" />
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
                id: 'product-filter',
                value: productFilter,
                onChange: setProductFilter,
                options: DEAL_PRODUCT_OPTIONS,
              },
              {
                id: 'stage-filter',
                value: stageFilter,
                onChange: setStageFilter,
                options: DEAL_STAGE_OPTIONS,
              },
            ]}
            onResetFilters={() => {
              setSearchQuery('');
              setProductFilter('All');
              setStageFilter('All');
              setCurrentPage(1);
            }}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onExport={() => alert('Exporting Deals Data...')}
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
          data={paginatedDeals}
          rowKey="id"
          emptyMessage="No deals found matching the current search criteria."
        />
      </TableContainer>

      {/* Slide-over Edit Deal Details Drawer (Image 2) */}
      <EditDealDrawer
        isOpen={isEditOpen}
        onClose={handleCloseDrawer}
        onSave={handleSaveDeal}
        initialData={selectedDeal}
      />
    </div>
  );
};

//==================================================================================================================
//    DEFAULT EXPORT
//==================================================================================================================
export default MyDeals;
