//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, Lucide icons, common data table shell, toolbar, pagination, and multi-mode drawers
//==================================================================================================================
import React, { useState, useMemo, useCallback } from 'react';
import {
  ChevronDown,
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
//    LEAD MANAGEMENT PAGE COMPONENT (ADMIN PANEL)
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
      const newLead = {
        id: `lead-${Date.now()}`,
        code: `#${String(leads.length + 1).padStart(3, '0')}`,
        name: formData.name,
        avatar:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
        designation: formData.designation,
        companyName: formData.companyName,
        companyLogo:
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=80&h=80&fit=crop&crop=faces',
        stage: formData.stage,
        priority: formData.priority,
        email: formData.email,
        phone: formData.phone,
        productInterest: formData.productInterest,
        leadSource: formData.leadSource,
        industry: formData.industry,
        employeeScale: formData.employeeScale,
        website: formData.website,
        address: formData.address,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        postalCode: formData.postalCode,
        createdDate: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        createdTime: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setLeads((prev) => [newLead, ...prev]);
    }
    handleCloseAllDrawers();
  }, [drawerMode, selectedLead, leads.length, handleCloseAllDrawers]);

  const handleDeactivateLead = useCallback(() => {
    if (selectedLead) {
      setLeads((prev) => prev.filter((item) => item.id !== selectedLead.id));
      handleCloseAllDrawers();
    }
  }, [selectedLead, handleCloseAllDrawers]);

  const handleConfirmConvert = useCallback((dealData) => {
    if (selectedLead) {
      setLeads((prev) =>
        prev.map((item) =>
          item.id === selectedLead.id ? { ...item, stage: 'Won' } : item
        )
      );
    }
    handleCloseAllDrawers();
  }, [selectedLead, handleCloseAllDrawers]);

  //==================================================================================================================
  //    FILTERING & PAGINATION
  //==================================================================================================================
  const filteredLeads = useMemo(() => {
    return leads.filter((item) => {
      // Search matching (Name, Code, Company, Email)
      const matchesSearch =
        searchQuery === '' ||
        (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.code && item.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.companyName &&
          item.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.email && item.email.toLowerCase().includes(searchQuery.toLowerCase()));

      // Stage Filter
      const matchesStage =
        stageFilter === 'All' || item.stage === stageFilter;

      // Priority Filter
      const matchesPriority =
        priorityFilter === 'All' || item.priority === priorityFilter;

      // Source Filter
      const matchesSource =
        sourceFilter === 'All' || item.leadSource === sourceFilter;

      return matchesSearch && matchesStage && matchesPriority && matchesSource;
    });
  }, [leads, searchQuery, stageFilter, priorityFilter, sourceFilter]);

  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredLeads.slice(startIndex, startIndex + pageSize);
  }, [filteredLeads, currentPage, pageSize]);

  //==================================================================================================================
  //    STAGE & PRIORITY BADGE HELPERS
  //==================================================================================================================
  const getStageBadgeClass = useCallback((stage) => {
    switch (stage) {
      case 'New':
        return 'bg-primary/10 text-primary border border-primary/20';
      case 'Contacted':
        return 'bg-[#F3E8FF] text-[#7E22CE] border border-[#E9D5FF]';
      case 'Qualified':
        return 'bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]';
      case 'Proposal':
        return 'bg-[#EBF5FF] text-[#1E40AF] border border-[#BFDBFE]';
      case 'Negotiation':
        return 'bg-warning/10 text-warning border border-warning/20';
      case 'Won':
        return 'bg-success/10 text-success border border-success/20';
      case 'Lost':
        return 'bg-alert/10 text-alert border border-alert/20';
      default:
        return 'bg-gray text-black-90/70 border border-stroke';
    }
  }, []);

  const getPriorityBadgeClass = useCallback((priority) => {
    switch (priority) {
      case 'High':
        return 'bg-alert/10 text-alert border border-alert/20';
      case 'Medium':
        return 'bg-warning/10 text-warning border border-warning/20';
      case 'Low':
        return 'bg-[#EFF8FF] text-[#175CD3] border border-[#B2DDFF]';
      default:
        return 'bg-gray text-black-90/70 border border-stroke';
    }
  }, []);

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
      key: 'name',
      label: 'Lead Name',
      sortable: true,
      sortType: 'text',
      className: 'max-sm:min-w-[150px] max-sm:pr-3',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <img
            src={row.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'}
            alt={row.name}
            className="w-8 h-8 rounded-full object-cover border border-stroke"
          />
          <span className="font-medium text-black-90 whitespace-nowrap">
            {row.name}
          </span>
        </div>
      ),
    },
    {
      key: 'companyName',
      label: 'Company Name',
      sortable: true,
      sortType: 'text',
      className: 'max-sm:min-w-[180px] max-sm:pr-5',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <img
            src={row.companyLogo || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=80&h=80&fit=crop&crop=faces'}
            alt={row.companyName}
            className="w-7 h-7 rounded-full object-cover border border-stroke shrink-0"
          />
          <span className="font-medium text-black-90 whitespace-nowrap">
            {row.companyName}
          </span>
        </div>
      ),
    },
    {
      key: 'stage',
      label: 'Stage',
      sortable: true,
      sortType: 'status',
      className: 'max-sm:pl-3',
      render: (row) => (
        <div className="w-[112px] h-[24px] inline-flex items-center justify-between px-3 py-0.5 bg-gray rounded-[7px] text-xs font-semibold text-black-90 cursor-pointer hover:bg-gray/80 transition-colors">
          <span>{row.stage}</span>
          <ChevronDown size={14} className="text-primary shrink-0" strokeWidth={2.5} />
        </div>
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      sortType: 'text',
      render: (row) => {
        const badgeColor =
          row.priority?.toLowerCase() === 'high'
            ? 'bg-alert/10 text-alert'
            : row.priority?.toLowerCase() === 'medium'
              ? 'bg-secondary/10 text-secondary'
              : 'bg-warning/10 text-warning';

        return (
          <span
            className={`w-[112px] h-[24px] inline-flex items-center justify-center px-3 py-0.5 rounded-[7px] text-xs font-semibold ${badgeColor}`}
          >
            {row.priority}
          </span>
        );
      },
    },
    {
      key: 'quickContact',
      label: 'Quick Contact',
      align: 'center',
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          {/* WhatsApp Direct Action */}
          <a
            href={`https://wa.me/${(row.phone || '').replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="w-8 h-8 rounded-full bg-gray flex items-center justify-center hover:bg-gray/80 transition-colors cursor-pointer shrink-0"
            title="Chat on WhatsApp"
          >
            <img
              src={whatsappIcon}
              alt="WhatsApp"
              className="w-4 h-4 object-contain"
            />
          </a>

          {/* Email Direct Action */}
          <a
            href={`mailto:${row.email}`}
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
          <ViewBtn onClick={() => handleOpenView(row)} title="View Lead Details" />
          <EditBtn onClick={() => handleOpenEdit(row)} title="Edit Lead" />
          <button
            type="button"
            onClick={() => handleOpenComments(row)}
            className="w-8 h-8 rounded-full bg-gray flex items-center justify-center text-primary hover:bg-gray/90 transition-colors cursor-pointer shrink-0"
            title="Notes & Comments"
          >
            <MessageSquare size={16} />
          </button>
          <button
            type="button"
            onClick={() => handleOpenActivity(row)}
            className="w-8 h-8 rounded-full bg-gray flex items-center justify-center text-primary hover:bg-gray/90 transition-colors cursor-pointer shrink-0"
            title="Activity Timeline"
          >
            <Clock size={16} />
          </button>
        </div>
      ),
    },
  ], [
    handleOpenView,
    handleOpenEdit,
    handleOpenActivity,
    handleOpenComments,
  ]);

  //==================================================================================================================
  //    RENDER MAIN VIEW
  //==================================================================================================================
  return (
    <div className="w-full flex-1 flex flex-col min-h-0 select-text">
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
            totalPages={Math.ceil(filteredLeads.length / pageSize) || 1}
            totalEntries={filteredLeads.length}
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
          1. Add / Edit / View Lead Drawer
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
          2. Lead Activity Drawer
      ============================================================================================================== */}
      <LeadActivityDrawer
        isOpen={isActivityOpen}
        onClose={handleCloseAllDrawers}
      />

      {/* ==============================================================================================================
          3. Lead Comments Drawer
      ============================================================================================================== */}
      <LeadCommentsDrawer
        isOpen={isCommentsOpen}
        onClose={handleCloseAllDrawers}
      />

      {/* ==============================================================================================================
          4. Convert Lead / Make a Deal Drawer
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
