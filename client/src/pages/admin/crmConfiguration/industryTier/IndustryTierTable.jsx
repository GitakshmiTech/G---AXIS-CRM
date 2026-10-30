//==================================================================================================================
//    INDUSTRY & TIER TABLE VIEWPORT (CRM CONFIGURATION)
//    Data table and pill switcher for managing Industry Sectors and Customer Types (Images 1, 3 & 5)
//==================================================================================================================

import React, { useState, useMemo, useCallback } from 'react';
import { Building2, Disc2 } from 'lucide-react';
import { TableContainer } from '../../../../components/common/TableContainer';
import { DataTableToolbar } from '../../../../components/common/DataTableToolbar';
import { DataTable } from '../../../../components/common/DataTable';
import { Pagination } from '../../../../components/common/Pagination';
import { EditBtn } from '../../../../components/common/buttons/EditBtn';
import { PillSwitcher } from '../../../../components/common/PillSwitcher';
import { AddIndustryDrawer } from './AddIndustryDrawer';
import { AddCustomerTypeDrawer } from './AddCustomerTypeDrawer';
import {
  INITIAL_INDUSTRIES,
  INITIAL_CUSTOMER_TYPES,
} from '../../../../constants/crmConfigurationConstants';

export const IndustryTierTable = () => {
  // Tab state: 'industry' | 'customer-type'
  const [activeTab, setActiveTab] = useState('industry');

  // Datasets for both tabs
  const [industries, setIndustries] = useState(INITIAL_INDUSTRIES);
  const [customerTypes, setCustomerTypes] = useState(INITIAL_CUSTOMER_TYPES);

  // Common UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Drawer states
  const [isIndustryDrawerOpen, setIsIndustryDrawerOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState(null);

  const [isCustomerTypeDrawerOpen, setIsCustomerTypeDrawerOpen] = useState(false);
  const [selectedCustomerType, setSelectedCustomerType] = useState(null);

  // Switch tabs reset page and search with guard to prevent redundant re-renders
  const handleTabChange = useCallback((tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setSearchQuery('');
    setCurrentPage(1);
  }, [activeTab]);

  // Industry Handlers
  const handleOpenAddIndustry = useCallback(() => {
    setSelectedIndustry(null);
    setIsIndustryDrawerOpen(true);
  }, []);

  const handleOpenEditIndustry = useCallback((item) => {
    setSelectedIndustry(item);
    setIsIndustryDrawerOpen(true);
  }, []);

  const handleSaveIndustry = useCallback((formData) => {
    if (selectedIndustry) {
      setIndustries((prev) =>
        prev.map((item) =>
          item.id === selectedIndustry.id ? { ...item, ...formData } : item
        )
      );
    } else {
      const newIndustry = {
        id: `ind-${Date.now()}`,
        code: `#${String(industries.length + 1).padStart(3, '0')}`,
        name: formData.name || 'New Sector',
        status: formData.status || 'Active',
      };
      setIndustries((prev) => [newIndustry, ...prev]);
    }
    setIsIndustryDrawerOpen(false);
  }, [selectedIndustry, industries.length]);

  const handleDeleteIndustry = useCallback((item) => {
    setIndustries((prev) => prev.filter((i) => i.id !== item.id));
    setIsIndustryDrawerOpen(false);
  }, []);

  // Customer Type Handlers
  const handleOpenAddCustomerType = useCallback(() => {
    setSelectedCustomerType(null);
    setIsCustomerTypeDrawerOpen(true);
  }, []);

  const handleOpenEditCustomerType = useCallback((item) => {
    setSelectedCustomerType(item);
    setIsCustomerTypeDrawerOpen(true);
  }, []);

  const handleSaveCustomerType = useCallback((formData) => {
    if (selectedCustomerType) {
      setCustomerTypes((prev) =>
        prev.map((item) =>
          item.id === selectedCustomerType.id ? { ...item, ...formData } : item
        )
      );
    } else {
      const newCustomerType = {
        id: `ct-${Date.now()}`,
        code: `#${String(customerTypes.length + 1).padStart(3, '0')}`,
        name: formData.name || 'New Customer Type',
        status: formData.status || 'Active',
      };
      setCustomerTypes((prev) => [newCustomerType, ...prev]);
    }
    setIsCustomerTypeDrawerOpen(false);
  }, [selectedCustomerType, customerTypes.length]);

  const handleDeleteCustomerType = useCallback((item) => {
    setCustomerTypes((prev) => prev.filter((i) => i.id !== item.id));
    setIsCustomerTypeDrawerOpen(false);
  }, []);

  const handleExport = useCallback(() => {
    // Export handler
  }, []);

  // Filtered and paginated datasets based on active tab
  const currentList = activeTab === 'industry' ? industries : customerTypes;

  const filteredData = useMemo(() => {
    return currentList.filter((item) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q)
      );
    });
  }, [currentList, searchQuery]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Industry columns (Image 1)
  const industryColumns = useMemo(() => [
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
      label: 'Industry Sector',
      sortable: true,
      className: 'w-full min-w-[240px]',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#EBF1FD] text-primary flex items-center justify-center shrink-0">
            <Building2 size={14} />
          </div>
          <span className="font-semibold text-black-90 text-xs sm:text-sm whitespace-nowrap">
            {row.name}
          </span>
        </div>
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
          <EditBtn onClick={() => handleOpenEditIndustry(row)} title="Edit Industry" />
        </div>
      ),
    },
  ], [handleOpenEditIndustry]);

  // Customer Type columns (Image 3)
  const customerTypeColumns = useMemo(() => [
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
      label: 'Customer Type',
      sortable: true,
      className: 'w-full min-w-[240px]',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#EBF1FD] text-primary flex items-center justify-center shrink-0">
            <Disc2 size={14} />
          </div>
          <span className="font-semibold text-black-90 text-xs sm:text-sm whitespace-nowrap">
            {row.name}
          </span>
        </div>
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
          <EditBtn onClick={() => handleOpenEditCustomerType(row)} title="Edit Customer Type" />
        </div>
      ),
    },
  ], [handleOpenEditCustomerType]);

  //==================================================================================================================
  //    PILL SWITCHER CONFIGURATION & MEMOIZED CONTROLS
  //    Segmented tabs, memoized toolbar, and pagination to eliminate unnecessary re-renders & flickers
  //==================================================================================================================
  const tabs = useMemo(
    () => [
      { id: 'industry', label: 'Industry' },
      { id: 'customer-type', label: 'Customer Type' },
    ],
    []
  );

  const leftContent = useMemo(
    () => (
      <PillSwitcher
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    ),
    [tabs, activeTab, handleTabChange]
  );

  const actionButton = useMemo(
    () => ({
      label: activeTab === 'industry' ? 'Add Industry' : 'Add Customer Type',
      onClick: activeTab === 'industry' ? handleOpenAddIndustry : handleOpenAddCustomerType,
    }),
    [activeTab, handleOpenAddIndustry, handleOpenAddCustomerType]
  );

  const toolbar = useMemo(
    () => (
      <DataTableToolbar
        leftContent={leftContent}
        searchPlaceholder="Search here..."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onExport={handleExport}
        actionButton={actionButton}
      />
    ),
    [leftContent, searchQuery, viewMode, handleExport, actionButton]
  );

  const totalPages = useMemo(
    () => Math.ceil(filteredData.length / pageSize) || 1,
    [filteredData.length, pageSize]
  );

  const pagination = useMemo(
    () => (
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalEntries={filteredData.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        className="pt-0 border-t-0"
      />
    ),
    [currentPage, totalPages, filteredData.length, pageSize]
  );

  return (
    <div className="flex-1 w-full min-w-0 h-full flex flex-col min-h-0">
      <TableContainer
        toolbar={toolbar}
        pagination={pagination}
      >
        <div key={activeTab} className="w-full animate-in fade-in duration-200">
          <DataTable
            columns={activeTab === 'industry' ? industryColumns : customerTypeColumns}
            data={paginatedData}
            rowKey="id"
            emptyMessage={
              activeTab === 'industry'
                ? 'No industry sectors configured.'
                : 'No customer types configured.'
            }
          />
        </div>
      </TableContainer>

      {/* Add / Edit Industry Drawer (Image 2) */}
      <AddIndustryDrawer
        isOpen={isIndustryDrawerOpen}
        onClose={() => setIsIndustryDrawerOpen(false)}
        onSave={handleSaveIndustry}
        onDelete={handleDeleteIndustry}
        initialData={selectedIndustry}
      />

      {/* Add / Edit Customer Type Drawer (Image 4) */}
      <AddCustomerTypeDrawer
        isOpen={isCustomerTypeDrawerOpen}
        onClose={() => setIsCustomerTypeDrawerOpen(false)}
        onSave={handleSaveCustomerType}
        onDelete={handleDeleteCustomerType}
        initialData={selectedCustomerType}
      />
    </div>
  );
};

export default IndustryTierTable;
