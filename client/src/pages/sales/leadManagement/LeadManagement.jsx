//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, Lucide icons, common data table shell, toolbar, pagination, and multi-mode drawers
//==================================================================================================================
import React, { useState, useMemo, useCallback } from 'react';
import {
  Mail,
  MessageSquare,
  Clock,
} from 'lucide-react';
import whatsappIcon from '../../../assets/icons/Group.png';
import { TableContainer } from '../../../components/common/TableContainer';
import { DataTableToolbar } from '../../../components/common/DataTableToolbar';
import { DataTable } from '../../../components/common/DataTable';
import { Pagination } from '../../../components/common/Pagination';
import { ViewBtn } from '../../../components/common/buttons/ViewBtn';
import { EditBtn } from '../../../components/common/buttons/EditBtn';
import { AddLeadDrawer } from './AddLeadDrawer';
import { LeadActivityDrawer } from './LeadActivityDrawer';
import { LeadCommentsDrawer } from './LeadCommentsDrawer';
import { ConvertLeadDrawer } from './ConvertLeadDrawer';
import {
  INITIAL_LEADS_DATA,
  LEAD_STAGES,
  LEAD_PRIORITIES,
  LEAD_SOURCES,
} from '../../../constants/leadsConstants';

//==================================================================================================================
//    LEAD MANAGEMENT PAGE COMPONENT (Image 3)
//    Enterprise leads management with filters, quick contacts, and creation/inspection slide-overs
//==================================================================================================================
export const LeadManagement = () => {
  const [leads, setLeads] = useState(INITIAL_LEADS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Drawer States
  const [isAddOrEditOpen, setIsAddOrEditOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('create'); // 'create' | 'edit' | 'view'
  const [selectedLead, setSelectedLead] = useState(null);

  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isConvertOpen, setIsConvertOpen] = useState(false);

  //==================================================================================================================
  //    Handlers
  //==================================================================================================================
  const handleOpenCreate = useCallback(() => {
    setSelectedLead(null);
    setDrawerMode('create');
    setIsAddOrEditOpen(true);
  }, []);

  const handleOpenEdit = useCallback((lead) => {
    setSelectedLead(lead);
    setDrawerMode('edit');
    setIsAddOrEditOpen(true);
  }, []);

  const handleOpenView = useCallback((lead) => {
    setSelectedLead(lead);
    setDrawerMode('view');
    setIsAddOrEditOpen(true);
  }, []);

  const handleOpenComments = useCallback((lead) => {
    setSelectedLead(lead);
    setIsCommentsOpen(true);
  }, []);

  const handleOpenActivity = useCallback((lead) => {
    setSelectedLead(lead);
    setIsActivityOpen(true);
  }, []);

  const handleOpenConvert = useCallback(() => {
    setIsAddOrEditOpen(false);
    setIsConvertOpen(true);
  }, []);

  const handleCloseAllDrawers = useCallback(() => {
    setIsAddOrEditOpen(false);
    setIsActivityOpen(false);
    setIsCommentsOpen(false);
    setIsConvertOpen(false);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setStageFilter('All');
    setPriorityFilter('All');
    setSourceFilter('All');
    setCurrentPage(1);
  }, []);

  const handleSaveLead = useCallback((formData) => {
    if (drawerMode === 'edit' && selectedLead) {
      setLeads((prev) =>
        prev.map((item) =>
          item.id === selectedLead.id ? { ...item, ...formData } : item
        )
      );
    } else {
      const newEntry = {
        id: `lead-${Date.now()}`,
        code: `#00${leads.length + 1}`,
        leadName: formData.name || 'Enterprise Prospect',
        leadAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
        companyName: formData.companyName || 'ABC Company Pvt Ltd',
        companyLogo: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=100&h=100&fit=crop',
        stage: formData.stage || 'Proposal',
        priority: formData.priority || 'Low',
        createdDate: '14 May 2025',
        createdTime: '08:45 AM',
        ...formData,
      };
      setLeads((prev) => [newEntry, ...prev]);
    }
    handleCloseAllDrawers();
  }, [drawerMode, selectedLead, leads.length, handleCloseAllDrawers]);

  const handleDeactivateLead = useCallback(() => {
    if (selectedLead) {
      setLeads((prev) =>
        prev.map((item) =>
          item.id === selectedLead.id ? { ...item, stage: 'Lost' } : item
        )
      );
    }
    handleCloseAllDrawers();
  }, [selectedLead, handleCloseAllDrawers]);

  const handleConfirmConvert = useCallback((dealData) => {
    if (selectedLead) {
      setLeads((prev) =>
        prev.map((item) =>
          item.id === selectedLead.id
            ? { ...item, stage: 'Won', dealAmount: dealData?.amount || item.dealAmount }
            : item
        )
      );
    }
    handleCloseAllDrawers();
  }, [selectedLead, handleCloseAllDrawers]);

  //==================================================================================================================
  //    Filtered Leads
  //==================================================================================================================
  const filteredLeads = useMemo(() => {
    return leads.filter((item) => {
      const name = item.leadName || item.name || '';
      const code = item.code || '';
      const company = item.companyName || '';

      const matchesSearch =
        searchQuery === '' ||
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStage =
        stageFilter === 'All' || item.stage === stageFilter;

      const matchesPriority =
        priorityFilter === 'All' || item.priority === priorityFilter;

      const matchesSource =
        sourceFilter === 'All' || item.leadSource === sourceFilter;

      return matchesSearch && matchesStage && matchesPriority && matchesSource;
    });
  }, [leads, searchQuery, stageFilter, priorityFilter, sourceFilter]);

  // Paginated Leads
  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredLeads.slice(startIndex, startIndex + pageSize);
  }, [filteredLeads, currentPage, pageSize]);

  //==================================================================================================================
  //    Table Column Definitions (Image 3)
  //==================================================================================================================
  const columns = useMemo(() => [
    {
      key: 'code',
      label: 'Code',
      sortable: true,
      className: 'font-bold text-black-90 text-sm whitespace-nowrap',
    },
    {
      key: 'leadName',
      label: 'Lead Name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3 min-w-[140px]">
          <img
            src={row.leadAvatar || row.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'}
            alt={row.leadName || row.name}
            className="w-8 h-8 rounded-full object-cover border border-stroke shrink-0"
          />
          <span className="font-bold text-black-90 text-sm truncate">
            {row.leadName || row.name}
          </span>
        </div>
      ),
    },
    {
      key: 'companyName',
      label: 'Company Name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5 min-w-[160px]">
          <img
            src={row.companyLogo || 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=100&h=100&fit=crop'}
            alt={row.companyName}
            className="w-7 h-7 rounded-full object-cover border border-stroke shrink-0"
          />
          <span className="text-sm font-semibold text-black-90 truncate">
            {row.companyName}
          </span>
        </div>
      ),
    },
    {
      key: 'stage',
      label: 'Stage',
      sortable: true,
      render: (row) => (
        <span className="w-[112px] h-[24px] inline-flex items-center justify-center px-3 py-[2px] rounded-[7px] text-xs font-semibold bg-gray text-black-90 select-none">
          {row.stage || 'Proposal'}
        </span>
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (row) => {
        const badgeColor =
          row.priority?.toLowerCase() === 'high'
            ? 'bg-alert/15 text-alert'
            : row.priority?.toLowerCase() === 'medium'
              ? 'bg-secondary/15 text-secondary'
              : 'bg-warning/15 text-warning';

        return (
          <span
            className={`w-[112px] h-[24px] inline-flex items-center justify-center px-3 py-[2px] rounded-[7px] text-xs font-semibold select-none ${badgeColor}`}
          >
            {row.priority || 'Low'}
          </span>
        );
      },
    },
    {
      key: 'quickContact',
      label: 'Quick Contact',
      sortable: true,
      align: 'center',
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <a
            href={`https://wa.me/${(row?.phone || '').replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="w-8 h-8 rounded-full bg-gray flex items-center justify-center hover:bg-gray/80 transition-colors cursor-pointer shrink-0"
            title="Chat on WhatsApp"
          >
            <img src={whatsappIcon} alt="WhatsApp" className="w-4 h-4 object-contain" />
          </a>
          <a
            href={`mailto:${row?.email || 'lead@enterprise.com'}`}
            className="w-8 h-8 rounded-full bg-[#F3F5FA] flex items-center justify-center text-primary hover:bg-gray transition-colors cursor-pointer shrink-0"
            title="Send Email"
          >
            <Mail size={16} strokeWidth={2} />
          </a>
        </div>
      ),
    },
    {
      key: 'createdDate',
      label: 'Created Date',
      sortable: true,
      className: 'text-xs font-medium text-black-90/70 whitespace-nowrap',
      render: (row) => (
        <div className="flex flex-col">
          <span>{row.createdDate || '14 May 2025'}</span>
          <span className="text-[10px] text-black-90/50">{row.createdTime || '08:45 AM'}</span>
        </div>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      align: 'center',
      className: 'text-center whitespace-nowrap',
      render: (row) => (
        <div className="flex items-center justify-center gap-1.5">
          <ViewBtn onClick={() => handleOpenView(row)} title="View lead details" />
          <EditBtn onClick={() => handleOpenEdit(row)} title="Edit lead details" />
          <button
            type="button"
            onClick={() => handleOpenComments(row)}
            title="Comments"
            className="w-8 h-8 rounded-full bg-gray flex items-center justify-center text-primary hover:bg-gray/90 transition-colors cursor-pointer"
          >
            <MessageSquare size={14} />
          </button>
          <button
            type="button"
            onClick={() => handleOpenActivity(row)}
            title="Activity log"
            className="w-8 h-8 rounded-full bg-gray flex items-center justify-center text-primary hover:bg-gray/90 transition-colors cursor-pointer"
          >
            <Clock size={14} />
          </button>
        </div>
      ),
    },
  ], [handleOpenView, handleOpenEdit, handleOpenComments, handleOpenActivity]);

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
                id: 'stage',
                value: stageFilter,
                options: LEAD_STAGES,
                onChange: setStageFilter,
              },
              {
                id: 'priority',
                value: priorityFilter,
                options: LEAD_PRIORITIES,
                onChange: setPriorityFilter,
              },
              {
                id: 'source',
                value: sourceFilter,
                options: LEAD_SOURCES,
                onChange: setSourceFilter,
              },
            ]}
            onResetFilters={handleResetFilters}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            actionButton={{
              label: 'Add New Lead',
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
          data={paginatedLeads}
          rowKey="id"
          emptyMessage="No leads found matching current criteria."
        />
      </TableContainer>

      {/* ==============================================================================================================
          1. Add / Edit / View Lead Drawer (Image 4)
      ============================================================================================================== */}
      <AddLeadDrawer
        isOpen={isAddOrEditOpen}
        onClose={handleCloseAllDrawers}
        onSave={handleSaveLead}
        onDeactivate={handleDeactivateLead}
        onConvert={handleOpenConvert}
        initialData={selectedLead}
        mode={drawerMode}
      />

      {/* ==============================================================================================================
          2. Lead Activity Drawer (Image 1 & 2)
      ============================================================================================================== */}
      <LeadActivityDrawer
        isOpen={isActivityOpen}
        onClose={handleCloseAllDrawers}
      />

      {/* ==============================================================================================================
          3. Lead Comments Drawer (Image 3)
      ============================================================================================================== */}
      <LeadCommentsDrawer
        isOpen={isCommentsOpen}
        onClose={handleCloseAllDrawers}
      />

      {/* ==============================================================================================================
          4. Convert Lead / Make a Deal Drawer (Image 5)
      ============================================================================================================== */}
      <ConvertLeadDrawer
        isOpen={isConvertOpen}
        onClose={handleCloseAllDrawers}
        onConfirm={handleConfirmConvert}
        lead={selectedLead}
      />
    </div>
  );
};

export default LeadManagement;
