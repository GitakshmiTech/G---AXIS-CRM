//==================================================================================================================
//    QUOTATIONS PAGE COMPONENT (SALES WORKSPACE)
//    Commercial proposals workspace module featuring status lifecycle, revenue valuation & create quotation drawer
//==================================================================================================================

import React, { useState, useMemo, useCallback } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { TableContainer } from '../../../components/common/TableContainer';
import { DataTableToolbar } from '../../../components/common/DataTableToolbar';
import { DataTable } from '../../../components/common/DataTable';
import { Pagination } from '../../../components/common/Pagination';
import { ViewBtn } from '../../../components/common/buttons/ViewBtn';
import { EditBtn } from '../../../components/common/buttons/EditBtn';
import { AvatarStack } from '../../../components/common/AvatarStack';
import { CreateQuotationDrawer } from './CreateQuotationDrawer';
import {
  INITIAL_QUOTATIONS_DATA,
  QUOTATION_PRODUCT_OPTIONS,
  QUOTATION_STATUS_OPTIONS,
} from '../../../constants/quotationsConstants';

//==================================================================================================================
//    STATUS BADGE STYLING HELPER
//==================================================================================================================
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Pending Approval':
      return 'bg-[#FFF4E5] text-warning';
    case 'Draft':
      return 'bg-gray text-black-90';
    case 'Sent':
      return 'bg-[#E6F7F5] text-[#0D9488]';
    case 'Accepted':
      return 'bg-[#E8F7EE] text-success';
    case 'Rejected':
      return 'bg-[#FDE8E8] text-alert';
    case 'Expired':
      return 'bg-[#FEECEC] text-[#EF4444]';
    default:
      return 'bg-gray text-black-90';
  }
};

//==================================================================================================================
//    QUOTATIONS COMPONENT
//==================================================================================================================
export const Quotations = () => {
  const [quotations, setQuotations] = useState(INITIAL_QUOTATIONS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [productFilter, setProductFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);

  //==================================================================================================================
  //    DRAWER TRIGGER HANDLERS
  //==================================================================================================================
  const handleOpenCreate = useCallback(() => {
    setSelectedQuotation(null);
    setIsDrawerOpen(true);
  }, []);

  const handleOpenEdit = useCallback((quote) => {
    setSelectedQuotation(quote);
    setIsDrawerOpen(true);
  }, []);

  const handleOpenView = useCallback((quote) => {
    setSelectedQuotation(quote);
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setSelectedQuotation(null);
  }, []);

  const handleSaveQuotation = useCallback((savedData) => {
    if (selectedQuotation) {
      setQuotations((prev) =>
        prev.map((q) => (q.id === selectedQuotation.id ? { ...q, ...savedData } : q))
      );
    } else {
      const newQuote = {
        id: `quote-${Date.now()}`,
        code: `#${String(quotations.length + 1).padStart(3, '0')}`,
        dealName: 'Johnson Doe',
        dealRole: 'VP of Sales',
        dealAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop&crop=face',
        productInterest: quotations[0]?.productInterest || [],
        extraProductCount: 5,
        expectedValue: `₹${savedData.dealAmount || '483,500'}`,
        status: savedData.status || 'Pending Approval',
        createdDate: '14 May 2025',
        createdTime: '08:45 AM',
      };
      setQuotations((prev) => [newQuote, ...prev]);
    }
    handleCloseDrawer();
  }, [selectedQuotation, quotations, handleCloseDrawer]);

  //==================================================================================================================
  //    FILTERING & PAGINATION (OPTIMIZED WITH USEMEMO)
  //==================================================================================================================
  const filteredQuotations = useMemo(() => {
    return quotations.filter((quote) => {
      const matchesSearch =
        !searchQuery.trim() ||
        quote.dealName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.status.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesProduct =
        productFilter === 'All' || quote.productInterestName === productFilter;
      const matchesStatus =
        statusFilter === 'All' || quote.status === statusFilter;

      return matchesSearch && matchesProduct && matchesStatus;
    });
  }, [quotations, searchQuery, productFilter, statusFilter]);

  const paginatedQuotations = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredQuotations.slice(start, start + pageSize);
  }, [filteredQuotations, currentPage, pageSize]);

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
        <span className="text-xs font-medium text-black-90 whitespace-nowrap leading-none">
          {row.expectedValue}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      sortType: 'status',
      align: 'center',
      render: (row) => (
        <span
          className={`w-[132px] h-[24px] rounded-[8px] text-xs font-semibold whitespace-nowrap inline-flex items-center justify-center select-none ${getStatusBadgeClass(
            row.status
          )}`}
        >
          {row.status}
        </span>
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
          <ViewBtn onClick={() => handleOpenView(row)} title="View Quotation" />
          <EditBtn onClick={() => handleOpenEdit(row)} title="Edit Quotation" />
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
                options: QUOTATION_PRODUCT_OPTIONS,
              },
              {
                id: 'status-filter',
                value: statusFilter,
                onChange: setStatusFilter,
                options: QUOTATION_STATUS_OPTIONS,
              },
            ]}
            onResetFilters={() => {
              setSearchQuery('');
              setProductFilter('All');
              setStatusFilter('All');
              setCurrentPage(1);
            }}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onExport={() => alert('Exporting Quotations Data...')}
            actionButton={{
              label: (
                <div className="flex items-center gap-1">
                  <span>Create Quotation</span>
                  <ChevronDown size={14} className="text-white-100" />
                </div>
              ),
              icon: <Plus size={15} />,
              onClick: handleOpenCreate,
            }}
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
          data={paginatedQuotations}
          rowKey="id"
          emptyMessage="No quotations found matching the current search criteria."
        />
      </TableContainer>

      {/* Slide-over Create/Edit Quotation Drawer (Images 4 & 5) */}
      <CreateQuotationDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onSave={handleSaveQuotation}
        initialData={selectedQuotation}
      />
    </div>
  );
};

//==================================================================================================================
//    DEFAULT EXPORT
//==================================================================================================================
export default Quotations;
