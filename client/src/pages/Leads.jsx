//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, Lucide icons, common data table shell, toolbar, pagination, and multi-mode drawers
//==================================================================================================================
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Mail,
  MessageSquare,
  Clock,
} from 'lucide-react';
import whatsappIcon from '../assets/icons/Group.png';
import { TableContainer } from '../components/common/Table/TableContainer';
import { DataTableToolbar } from '../components/common/Table/DataTableToolbar';
import { DataTable } from '../components/common/Table/DataTable';
import { Pagination } from '../components/common/Table/Pagination';
import { ViewBtn } from '../components/common/buttons/ViewBtn';
import { EditBtn } from '../components/common/buttons/EditBtn';
import { DropdownInput } from '../components/common/inputs/DropdownInput';
import { LeadActivityDrawer } from '../components/modules/leads/LeadActivityDrawer';
import { LeadCommentsDrawer } from '../components/modules/leads/LeadCommentsDrawer';
import {
  LEAD_STAGES,
  LEAD_PRIORITIES,
  LEAD_SOURCES,
} from '../constants/leadsConstants';
import { addLeadComment, fetchLead, fetchLeads, updateLeadStatus } from '../services/leadsService';
import { useToast } from '../hooks/useToast';

const LEAD_STAGE_OPTIONS = LEAD_STAGES.filter((stage) => stage.value !== 'All');

//==================================================================================================================
//    LEAD MANAGEMENT / LEADS UNIFIED PAGE COMPONENT
//    Enterprise leads management with filters, quick contacts, and creation/inspection slide-overs
//==================================================================================================================
export const Leads = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [stageFilter, setStageFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingLeadIds, setUpdatingLeadIds] = useState([]);
  const pageSize = 10;

  // Sync search parameter from URL if navigating with deep links
  useEffect(() => {
    const s = searchParams.get('search');
    if (s !== null) {
      setSearchQuery(s);
      setCurrentPage(1);
    }
  }, [searchParams]);

  // Load API-backed rows when backend-supported search or status filters change.
  useEffect(() => {
    let active = true;
    setLoading(true);
    setApiError('');
    fetchLeads({ search: searchQuery, status: stageFilter, source: sourceFilter === 'All' ? '' : sourceFilter, limit: 100 })
      .then(({ rows }) => { if (active) setLeads(rows); })
      .catch((error) => {
        if (active) {
          setApiError(error.message || 'Unable to load leads.');
          toast(error.message || 'Unable to load leads.', 'error');
        }
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [searchQuery, stageFilter, sourceFilter]);

  // Drawer States
  const [selectedLead, setSelectedLead] = useState(null);

  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState('');

  //==================================================================================================================
  //    Handlers
  //==================================================================================================================
  const handleOpenCreate = useCallback(() => {
    navigate('/leads/new');
  }, [navigate]);

  const handleOpenEdit = useCallback((lead) => {
    navigate(`/leads/${encodeURIComponent(lead.id)}/edit`);
  }, [navigate]);

  const handleOpenView = useCallback((lead) => {
    navigate(`/leads/${encodeURIComponent(lead.id)}/view`);
  }, [navigate]);

  const handleOpenComments = useCallback(async (lead) => {
    setSelectedLead({ ...lead, activities: [] });
    setIsCommentsOpen(true);
    setCommentsError('');
    setCommentsLoading(true);
    try { setSelectedLead(await fetchLead(lead.id)); }
    catch (error) { setCommentsError(error.message || 'Unable to load lead comments.'); toast(error.message || 'Unable to load lead comments.', 'error'); }
    finally { setCommentsLoading(false); }
  }, [toast]);

  const handleOpenActivity = useCallback(async (lead) => {
    setSelectedLead(lead);
    setIsActivityOpen(true);
    try { setSelectedLead(await fetchLead(lead.id)); }
    catch (error) { setApiError(error.message || 'Unable to load lead activity.'); toast(error.message || 'Unable to load lead activity.', 'error'); }
  }, [toast]);

  const handleAddComment = useCallback(async (text) => {
    if (!selectedLead?.id) throw new Error('Select a lead before adding a comment.');
    const comment = await addLeadComment(selectedLead.id, text);
    toast('Comment added to the lead.');
    return comment;
  }, [selectedLead, toast]);

  /** Persist a stage selection and update the row only after the API confirms it. */
  const handleStageChange = useCallback(async (lead, nextStage) => {
    if (!nextStage || nextStage === lead.stage) return;
    setUpdatingLeadIds((ids) => [...ids, lead.id]);
    try {
      const updated = await updateLeadStatus(lead.id, nextStage);
      const stage = updated.stage || nextStage;
      setLeads((items) => items.map((item) => item.id === lead.id ? { ...item, stage } : item));
      toast(`Lead stage changed to ${stage}.`);
    } catch (error) {
      toast(error.message || 'Unable to update the lead stage.', 'error');
    } finally {
      setUpdatingLeadIds((ids) => ids.filter((id) => id !== lead.id));
    }
  }, [toast]);

  const leadComments = useMemo(() => (
    selectedLead?.activities?.filter((activity) => activity.type === 'note').map((activity) => ({
      id: activity.id,
      text: activity.text || activity.description,
      timestamp: activity.timestamp,
      avatar: '',
    })) || []
  ), [selectedLead]);

  const handleCloseAllDrawers = useCallback(() => {
    setIsActivityOpen(false);
    setIsCommentsOpen(false);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setStageFilter('All');
    setPriorityFilter('All');
    setSourceFilter('All');
    setCurrentPage(1);
  }, []);

  //==================================================================================================================
  //    FILTERING & PAGINATION
  //==================================================================================================================
  const filteredLeads = useMemo(() => {
    return leads.filter((item) => {
      // Search matching (Name, Code, Company, Email, Assigned Executive)
      const term = searchQuery.toLowerCase().trim();
      const matchesSearch =
        term === '' ||
        (item.name && item.name.toLowerCase().includes(term)) ||
        (item.code && item.code.toLowerCase().includes(term)) ||
        (item.companyName &&
          item.companyName.toLowerCase().includes(term)) ||
        (item.email && item.email.toLowerCase().includes(term)) ||
        (item.assignedUserName && item.assignedUserName.toLowerCase().includes(term)) ||
        (item.assignedUser?.usr_name && item.assignedUser.usr_name.toLowerCase().includes(term));

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
      className: 'w-[110px] pl-4',
      headerClassName: 'w-[110px]',
      render: (row) => (
        <span title={row.code} className="whitespace-nowrap font-semibold text-black-90">{row.code}</span>
      ),
    },
    {
      key: 'name',
      label: 'Lead Name',
      sortable: true,
      sortType: 'text',
      className: 'w-[155px] max-w-[155px] pr-2',
      headerClassName: 'w-[155px]',
      render: (row) => (
        <div className="flex min-w-0 items-center gap-2">
          <img
            src={row.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'}
            alt={row.name}
            className="w-7 h-7 rounded-full object-cover border-none shrink-0"
          />
          <span title={row.name} className="block min-w-0 truncate font-medium text-black-90">
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
      className: 'w-[165px] max-w-[165px] pr-2',
      headerClassName: 'w-[165px]',
      render: (row) => (
        <div className="flex min-w-0 items-center gap-2">
          <img
            src={row.companyLogo || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=80&h=80&fit=crop&crop=faces'}
            alt={row.companyName}
            className="w-7 h-7 rounded-full object-cover border-none shrink-0"
          />
          <span title={row.companyName} className="block min-w-0 truncate font-medium text-black-90">
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
      align: 'center',
      className: 'w-[130px]',
      headerClassName: 'w-[130px]',
      render: (row) => (
        <div className="flex w-full justify-center"><DropdownInput
          name={`lead-stage-${row.id}`}
          value={row.stage || 'New'}
          options={[...(!LEAD_STAGE_OPTIONS.some((stage) => stage.value === row.stage) && row.stage ? [{ value: row.stage, label: row.stage }] : []), ...LEAD_STAGE_OPTIONS]}
          onChange={(event) => handleStageChange(row, event.target.value)}
          disabled={updatingLeadIds.includes(row.id)}
          aria-label={`Change stage for ${row.name}`}
          title="Change lead stage"
          containerClassName="w-fit min-w-0"
          containerDataUiStyle="table-stage-select"
          fitContent
          dropdownMenuClassName="right-auto w-max min-w-[10rem]"
          dropdownOptionLabelClassName="overflow-visible"
          chevronButtonClassName="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer p-0.5 focus:outline-none"
          selectClassName="h-7 px-2 pr-6 bg-transparent border-0 rounded-none text-xs text-black-90 font-semibold shadow-none focus:outline-none focus:shadow-none cursor-pointer transition-colors hover:text-primary disabled:cursor-wait"
        /></div>
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      sortType: 'text',
      align: 'center',
      className: 'w-[110px]',
      headerClassName: 'w-[110px]',
      render: (row) => {
        const badgeColor =
          row.priority?.toLowerCase() === 'high'
            ? 'bg-alert/10 text-alert'
            : row.priority?.toLowerCase() === 'medium'
              ? 'bg-secondary/10 text-secondary'
              : 'bg-warning/10 text-warning';

        return (
          <span
            className={`w-full max-w-[90px] h-[24px] inline-flex items-center justify-center px-2 py-0.5 rounded-[7px] text-xs font-semibold ${badgeColor}`}
          >
            {row.priority || '—'}
          </span>
        );
      },
    },
    {
      key: 'quickContact',
      label: 'Quick Contact',
      align: 'center',
      className: 'w-[95px]',
      headerClassName: 'w-[95px]',
      render: (row) => (
        <div className="flex items-center justify-center gap-1.5">
          {/* WhatsApp Direct Action */}
          <a
            href={`https://wa.me/${(row.phone || '').replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="w-7 h-7 rounded-[7px] bg-gray border-b-2 border-stroke/80 flex items-center justify-center hover:bg-gray/80 transition-colors cursor-pointer shrink-0"
            title="Chat on WhatsApp"
          >
            <img
              src={whatsappIcon}
              alt="WhatsApp"
              className="w-3.5 h-3.5 object-contain"
            />
          </a>

          {/* Email Direct Action */}
          <a
            href={`mailto:${row.email}`}
            className="w-7 h-7 rounded-[7px] bg-gray border-b-2 border-stroke/80 flex items-center justify-center text-primary hover:bg-gray/80 transition-colors cursor-pointer shrink-0"
            title="Send Email"
          >
            <Mail size={14} strokeWidth={2} />
          </a>
        </div>
      ),
    },
    {
      key: 'createdDate',
      label: 'Created Date',
      sortable: true,
      className: 'w-[110px]',
      headerClassName: 'w-[110px]',
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
      className: 'w-[155px] pr-4',
      headerClassName: 'w-[155px]',
      render: (row) => (
        <div className="flex items-center justify-center gap-1">
          <ViewBtn onClick={() => handleOpenView(row)} title="View Lead Details" />
          <EditBtn onClick={() => handleOpenEdit(row)} title="Edit Lead" />
          <button
            type="button"
            onClick={() => handleOpenComments(row)}
            className="w-7.5 h-7.5 rounded-[7px] bg-gray border-b-2 border-stroke/80 flex items-center justify-center text-primary hover:bg-gray/80 transition-colors cursor-pointer shrink-0"
            title="Notes & Comments"
          >
            <MessageSquare size={14} />
          </button>
          <button
            type="button"
            onClick={() => handleOpenActivity(row)}
            className="w-7.5 h-7.5 rounded-[7px] bg-gray border-b-2 border-stroke/80 flex items-center justify-center text-primary hover:bg-gray/80 transition-colors cursor-pointer shrink-0"
            title="Activity Timeline"
          >
            <Clock size={14} />
          </button>
        </div>
      ),
    },
  ], [
    handleOpenView,
    handleOpenEdit,
    handleOpenActivity,
    handleOpenComments,
    handleStageChange,
    updatingLeadIds,
  ]);

  //==================================================================================================================
  //    RENDER MAIN VIEW
  //==================================================================================================================
  return (
    <div className="w-full flex-1 flex flex-col min-h-0 select-text max-md:min-h-fit">
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
          loading={loading}
          fixedLayout
          emptyMessage={apiError ? 'Unable to load leads. Please check connection and retry.' : 'No leads found matching current criteria.'}
        />
      </TableContainer>

      {/* ==============================================================================================================
          Lead Activity Drawer
      ============================================================================================================== */}
      <LeadActivityDrawer
        isOpen={isActivityOpen}
        onClose={handleCloseAllDrawers}
        activities={selectedLead?.activities || []}
      />

      {/* ==============================================================================================================
          Lead Comments Drawer
      ============================================================================================================== */}
      <LeadCommentsDrawer
        isOpen={isCommentsOpen}
        onClose={handleCloseAllDrawers}
        initialComments={leadComments}
        isLoading={commentsLoading}
        loadError={commentsError}
        onAddComment={handleAddComment}
      />

    </div>
  );
};

export { Leads as LeadManagement };
export default Leads;
