//==================================================================================================================
//    MY LEADS PAGE
//    Enterprise leads workspace with interactive DataTable, toolbar filters, pagination, and multi-mode drawers
//==================================================================================================================

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  ChevronDown,
  Eye,
  Edit2,
  MessageSquare,
  Clock,
  Mail,
  MessageCircle,
  Loader2,
} from 'lucide-react';

import { TableContainer } from '../../../components/Table/TableContainer';
import { DataTableToolbar } from '../../../components/Table/DataTableToolbar';
import { DataTable } from '../../../components/Table/DataTable';
import { Pagination } from '../../../components/inputs/Pagination';
import { ViewBtn } from '../../../components/buttons/ViewBtn';
import { EditBtn } from '../../../components/buttons/EditBtn';
import whatsappIcon from '../../../assets/icons/Group.png';
import { AddLeadDrawer } from './AddLeadDrawer';
import { LeadActivityDrawer } from './LeadActivityDrawer';
import { LeadCommentsDrawer } from './LeadCommentsDrawer';
import { ConvertLeadDrawer } from './ConvertLeadDrawer';
import {
  fetchLeads,
  createLead,
  updateLead,
  convertLead,
  fetchLeadOptions,
} from '../../../services/leadsService';
import {
  INITIAL_LEADS_DATA,
  LEAD_STAGES,
  LEAD_PRIORITIES,
  LEAD_SOURCES,
} from '../../../constants/leadsConstants';

export const MyLeads = () => {
  //==================================================================================================================
  //    STATE MANAGEMENT
  //==================================================================================================================
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Dynamic filter options loaded from GET /api/masters/lead-options
  const [filterOptions, setFilterOptions] = useState({
    stages: LEAD_STAGES,
    priorities: LEAD_PRIORITIES,
    sources: LEAD_SOURCES,
  });

  // Drawer States
  const [isAddOrEditOpen, setIsAddOrEditOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('create'); // 'create' | 'edit' | 'view'
  const [selectedLead, setSelectedLead] = useState(null);

  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isConvertOpen, setIsConvertOpen] = useState(false);

  //==================================================================================================================
  //    DATA FETCHING (RULE 12)
  //==================================================================================================================
  const loadLeadsData = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const data = await fetchLeads({
        limit: 100,
      });
      if (data?.leads) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error('Failed to fetch leads from API:', err);
      setApiError(err.message || 'Failed to connect to backend server');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    loadLeadsData();

    // Fetch dynamic options from GET /api/masters/lead-options
    const loadFilterOptions = async () => {
      try {
        const data = await fetchLeadOptions();
        if (data && isMounted) {
          setFilterOptions({
            stages: [{ value: 'All', label: 'All' }, ...(data.statuses || []).map((s) => ({ value: s.name, label: s.name }))],
            sources: [{ value: 'All', label: 'All' }, ...(data.sources || []).map((src) => ({ value: src.name, label: src.name }))],
            priorities: [{ value: 'All', label: 'All' }, ...(data.priorities || []).map((p) => ({ value: p, label: p }))],
          });
        }
      } catch (err) {
        console.warn('Using default constants for lead filters:', err);
      }
    };
    loadFilterOptions();

    return () => {
      isMounted = false;
    };
  }, [loadLeadsData]);

  //==================================================================================================================
  //    DRAWER TRIGGER HANDLERS
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

  const handleCloseAllDrawers = useCallback(() => {
    setIsAddOrEditOpen(false);
    setIsActivityOpen(false);
    setIsCommentsOpen(false);
    setIsConvertOpen(false);
    setSelectedLead(null);
  }, []);

  const handleSaveLead = useCallback(async (formData) => {
    try {
      if (drawerMode === 'edit' && selectedLead) {
        const updated = await updateLead(selectedLead.id, formData);
        setLeads((prev) =>
          prev.map((item) => (item.id === selectedLead.id ? { ...item, ...updated } : item))
        );
      } else {
        const created = await createLead(formData);
        setLeads((prev) => [created, ...prev]);
      }
      handleCloseAllDrawers();
    } catch (error) {
      console.error('Failed to save lead:', error);
      alert(error.message || 'Failed to save lead. Please verify required fields or potential duplicate.');
    }
  }, [drawerMode, selectedLead, handleCloseAllDrawers]);

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

  const handleOpenConvertLead = useCallback(() => {
    setIsAddOrEditOpen(false);
    setIsConvertOpen(true);
  }, []);

  const handleConfirmConvert = useCallback(async (dealData) => {
    if (selectedLead) {
      try {
        const result = await convertLead(selectedLead.id, dealData);
        setLeads((prev) =>
          prev.map((item) =>
            item.id === selectedLead.id
              ? { ...item, stage: 'Won', dealAmount: dealData?.amount || item.dealAmount }
              : item
          )
        );
        handleCloseAllDrawers();
      } catch (error) {
        console.error('Failed to convert lead:', error);
        alert(error.message || 'Failed to convert lead');
      }
    }
  }, [selectedLead, handleCloseAllDrawers]);

  //==================================================================================================================
  //    RESET FILTERS HANDLER
  //==================================================================================================================
  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setStageFilter('All');
    setPriorityFilter('All');
    setSourceFilter('All');
    setCurrentPage(1);
    window.dispatchEvent(new CustomEvent('reset-table-sort'));
  }, []);

  //==================================================================================================================
  //    FILTERING LOGIC (OPTIMIZED WITH USEMEMO)
  //==================================================================================================================
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Search matching across multiple keys
      const matchesSearch =
        !searchQuery.trim() ||
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery);

      // Dropdown filters
      const matchesStage = stageFilter === 'All' || lead.stage === stageFilter;
      const matchesPriority = priorityFilter === 'All' || lead.priority === priorityFilter;
      const matchesSource = sourceFilter === 'All' || lead.leadSource === sourceFilter;

      return matchesSearch && matchesStage && matchesPriority && matchesSource;
    });
  }, [leads, searchQuery, stageFilter, priorityFilter, sourceFilter]);

  // Paginated View Slice
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage, pageSize]);

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
            src={row.avatar}
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
            src={row.companyLogo}
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
          <a
            href={`https://wa.me/${row.phone.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="w-8 h-8 rounded-[7px] bg-gray border-b-2 border-stroke/80 flex items-center justify-center hover:bg-gray/80 transition-colors cursor-pointer shrink-0"
            title="Chat on WhatsApp"
          >
            <img src={whatsappIcon} alt="WhatsApp" className="w-4 h-4 object-contain" />
          </a>
          <a
            href={`mailto:${row.email}`}
            className="w-8 h-8 rounded-[7px] bg-gray border-b-2 border-stroke/80 flex items-center justify-center text-primary hover:bg-gray/80 transition-colors cursor-pointer shrink-0"
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
          <ViewBtn
            onClick={() => handleOpenView(row)}
            title="View Lead Details"
          />
          <EditBtn
            onClick={() => handleOpenEdit(row)}
            title="Edit Lead"
          />
          <button
            type="button"
            onClick={() => handleOpenComments(row)}
            className="w-8 h-8 rounded-[7px] bg-gray border-b-2 border-stroke/80 flex items-center justify-center text-primary hover:bg-gray/80 transition-colors cursor-pointer shrink-0"
            title="Notes & Comments"
          >
            <MessageSquare size={16} />
          </button>
          <button
            type="button"
            onClick={() => handleOpenActivity(row)}
            className="w-8 h-8 rounded-[7px] bg-gray border-b-2 border-stroke/80 flex items-center justify-center text-primary hover:bg-gray/80 transition-colors cursor-pointer shrink-0"
            title="Activity Timeline"
          >
            <Clock size={16} />
          </button>
        </div>
      ),
    },
  ], [handleOpenView, handleOpenEdit, handleOpenComments, handleOpenActivity]);

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
                id: 'stage-filter',
                value: stageFilter,
                onChange: setStageFilter,
                options: filterOptions.stages,
              },
              {
                id: 'priority-filter',
                value: priorityFilter,
                onChange: setPriorityFilter,
                options: filterOptions.priorities,
              },
              {
                id: 'source-filter',
                value: sourceFilter,
                onChange: setSourceFilter,
                options: filterOptions.sources,
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
          emptyMessage={
            isLoading
              ? 'Loading leads from database...'
              : apiError
              ? `Unable to connect to backend: ${apiError}`
              : 'No leads found matching the current search criteria.'
          }
        />
      </TableContainer>

      {/* Slide-over Add/Edit/View Lead Details Drawer */}
      <AddLeadDrawer
        isOpen={isAddOrEditOpen}
        onClose={handleCloseAllDrawers}
        onSave={handleSaveLead}
        onDeactivate={handleDeactivateLead}
        onConvert={handleOpenConvertLead}
        initialData={selectedLead}
        mode={drawerMode}
      />

      {/* Slide-over Convert Lead Drawer (Images 1 & 2) */}
      <ConvertLeadDrawer
        isOpen={isConvertOpen}
        onClose={handleCloseAllDrawers}
        onConfirm={handleConfirmConvert}
        lead={selectedLead}
      />

      {/* Slide-over Activity Drawer (Images 1 & 2) */}
      <LeadActivityDrawer
        isOpen={isActivityOpen}
        onClose={handleCloseAllDrawers}
      />

      {/* Slide-over Comments Drawer (Image 3) */}
      <LeadCommentsDrawer
        isOpen={isCommentsOpen}
        onClose={handleCloseAllDrawers}
      />
    </div>
  );
};

export default MyLeads;
