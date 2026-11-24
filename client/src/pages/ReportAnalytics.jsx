//==================================================================================================================
//    REPORT & ANALYTICS MANAGEMENT (SALES OPERATIONS - FRD CRM-028 & SECTION 10)
//    Single-Screen Data Table Shell Aligned with CRM Theme & Leads Table Architecture
//==================================================================================================================

import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import {
  Video,
  Globe,
  Handshake,
  Share2,
  Ticket,
  Mail,
  X,
  User,
  Search,
  ChevronRight,
  Info,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { TableContainer } from '../components/common/Table/TableContainer';
import { TableFilterSelect } from '../components/common/Table/TableFilterSelect';
import { ResetFilterButton } from '../components/common/buttons/ResetFilterButton';
import { ExportButton } from '../components/common/buttons/ExportButton';
import { ViewBtn } from '../components/common/buttons/ViewBtn';
import { Pagination } from '../components/common/Table/Pagination';
import {
  fetchTeamPerformanceReport,
  fetchLeadSourceAttributionReport,
  fetchReportDrilldown,
  fetchReportFilterOptions,
  exportTeamPerformanceReport,
  exportLeadSourceReport,
} from '../services/reportsService';
import { formatDateDDMMYYYY } from '../utils/dateUtils';
import { formatCurrency } from '../utils/formatters';
import { useToast } from '../hooks/useToast';

// Lead source icons resolver
const getSourceIcon = (sourceName = '') => {
  const s = String(sourceName).toLowerCase();
  if (s.includes('demo') || s.includes('video')) return Video;
  if (s.includes('web') || s.includes('site')) return Globe;
  if (s.includes('partner') || s.includes('referral')) return Handshake;
  if (s.includes('linkedin') || s.includes('social')) return Share2;
  if (s.includes('event') || s.includes('ticket') || s.includes('conf')) return Ticket;
  return Mail;
};

// Channel code mapping helper
const getChannelCode = (sourceName = '', index = 1) => {
  const s = String(sourceName).toLowerCase();
  if (s.includes('demo')) return 'INB-01';
  if (s.includes('web')) return 'WEB-02';
  if (s.includes('partner')) return 'PRT-03';
  if (s.includes('linkedin')) return 'SOC-04';
  if (s.includes('event')) return 'EVT-05';
  if (s.includes('cold') || s.includes('outreach')) return 'CLD-06';
  return `SRC-0${index}`;
};

// Initials generator for avatars
const getInitials = (name = '') => {
  const parts = String(name).trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return (name.slice(0, 2) || 'BD').toUpperCase();
};

// Date range options
const DATE_OPTIONS = [
  { label: 'Current Fiscal Quarter', value: 'This Quarter' },
  { label: 'All Time', value: 'All' },
  { label: 'Today', value: 'Today' },
  { label: 'This Week', value: 'This Week' },
  { label: 'This Month', value: 'This Month' },
  { label: 'This Year', value: 'This Year' },
];

// Pipeline status options
const STATUS_OPTIONS = [
  { label: 'All Statuses', value: 'All' },
  { label: 'New Leads', value: 'New' },
  { label: 'Contacted', value: 'Contacted' },
  { label: 'Qualified', value: 'Qualified' },
  { label: 'Proposal Submitted', value: 'Proposal' },
  { label: 'Negotiation', value: 'Negotiation' },
  { label: 'Closed Won', value: 'Won' },
  { label: 'Closed Lost', value: 'Lost' },
];

//==================================================================================================================
//    MAIN COMPONENT
//==================================================================================================================
export const ReportAnalytics = memo(() => {
  const toast = useToast();
  // Active report tab ('team' | 'sources')
  const [activeTab, setActiveTab] = useState('team');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Dropdown filter states
  const [dateFilter, setDateFilter] = useState('This Quarter');
  const [bdeFilter, setBdeFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Dynamic filter options from server
  const [filterOptions, setFilterOptions] = useState({
    dateRangeOptions: DATE_OPTIONS,
    leadSourceOptions: [{ label: 'All Lead Sources', value: 'All' }],
    bdeOptions: [{ label: 'All BDEs (Direct Team)', value: 'All' }],
  });

  // Report data states
  const [teamRows, setTeamRows] = useState([]);
  const [leadSourceRows, setLeadSourceRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  // Pagination states
  const [teamPage, setTeamPage] = useState(1);
  const [sourcesPage, setSourcesPage] = useState(1);
  const pageSize = 10;

  // Drilldown drawer state
  const [isDrilldownOpen, setIsDrilldownOpen] = useState(false);
  const [selectedDrilldown, setSelectedDrilldown] = useState(null);
  const [drilldownLoading, setDrilldownLoading] = useState(false);

  // Load dynamic filter metadata
  useEffect(() => {
    let active = true;
    fetchReportFilterOptions().then((opts) => {
      if (active && opts) {
        setFilterOptions({
          dateRangeOptions: opts.dateRangeOptions?.length ? opts.dateRangeOptions : DATE_OPTIONS,
          leadSourceOptions: opts.leadSourceOptions?.length
            ? opts.leadSourceOptions
            : [{ label: 'All Lead Sources', value: 'All' }],
          bdeOptions: opts.bdeOptions?.length
            ? opts.bdeOptions
            : [{ label: 'All BDEs (Direct Team)', value: 'All' }],
        });
      }
    });
    return () => { active = false; };
  }, []);

  // Fetch telemetry reports
  const loadReports = useCallback(async (filters) => {
    setLoading(true);
    setApiError('');

    try {
      const [teamData, sourceData] = await Promise.all([
        fetchTeamPerformanceReport({
          timeframe: filters.date,
          bdeId: filters.bde,
          status: filters.status,
          limit: 50,
        }),
        fetchLeadSourceAttributionReport({
          timeframe: filters.date,
          source: filters.source,
        }),
      ]);

      if (teamData?.rows) {
        setTeamRows(teamData.rows);
      }
      if (sourceData?.rows) {
        setLeadSourceRows(sourceData.rows);
      }
    } catch (err) {
      console.warn('Error fetching reports:', err);
      setApiError(err?.message || 'Unable to load report telemetry data.');
      toast(err?.message || 'Unable to load report telemetry data.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-reload on any filter change (Instant live response matching Leads)
  useEffect(() => {
    loadReports({
      date: dateFilter,
      bde: bdeFilter,
      source: sourceFilter,
      status: statusFilter,
    });
  }, [dateFilter, bdeFilter, sourceFilter, statusFilter, loadReports]);

  // Handle Reset Filters
  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setDateFilter('This Quarter');
    setBdeFilter('All');
    setSourceFilter('All');
    setStatusFilter('All');
    setTeamPage(1);
    setSourcesPage(1);
  }, []);

  // Handle Export CSV
  const handleExport = useCallback(() => {
    if (activeTab === 'team') {
      exportTeamPerformanceReport({ timeframe: dateFilter, bdeId: bdeFilter });
    } else {
      exportLeadSourceReport({ timeframe: dateFilter, source: sourceFilter });
    }
  }, [activeTab, dateFilter, bdeFilter, sourceFilter]);

  // Open drill-down drawer
  const handleOpenDrilldown = useCallback(async (type, identifier, title, extra = {}) => {
    setIsDrilldownOpen(true);
    setDrilldownLoading(true);
    setSelectedDrilldown({
      type,
      identifier,
      title,
      extra,
      leads: [],
      deals: [],
    });

    try {
      const data = await fetchReportDrilldown(type, identifier, { timeframe: dateFilter });
      if (data) {
        setSelectedDrilldown({
          type,
          identifier,
          title: title || data.executive?.name || data.source,
          executive: data.executive,
          source: data.source,
          extra,
          leads: data.leads || [],
          deals: data.deals || [],
        });
      }
    } catch (err) {
      console.warn('Drilldown fetch error:', err);
    } finally {
      setDrilldownLoading(false);
    }
  }, [dateFilter]);

  // Filtered rows by search query
  const filteredTeamRows = useMemo(() => {
    if (!searchQuery.trim()) return teamRows;
    const q = searchQuery.toLowerCase().trim();
    return teamRows.filter(
      (r) =>
        r.name?.toLowerCase().includes(q) ||
        r.code?.toLowerCase().includes(q) ||
        r.role?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q)
    );
  }, [teamRows, searchQuery]);

  const filteredSourceRows = useMemo(() => {
    if (!searchQuery.trim()) return leadSourceRows;
    const q = searchQuery.toLowerCase().trim();
    return leadSourceRows.filter(
      (r) =>
        r.source?.toLowerCase().includes(q) ||
        getChannelCode(r.source).toLowerCase().includes(q)
    );
  }, [leadSourceRows, searchQuery]);

  // Aggregated Team Execution Totals
  const teamTotals = useMemo(() => {
    const totalLeads = filteredTeamRows.reduce(
      (sum, r) => sum + (Number(r.leadsHandledCount) || Number(String(r.leadsHandled || '').replace(/\D/g, '')) || 0),
      0
    );
    const totalPipeline = filteredTeamRows.reduce(
      (sum, r) => sum + (Number(r.pipelineValueRaw) || Number(String(r.pipelineValue || '').replace(/[^0-9]/g, '')) || 0),
      0
    );
    const totalWon = filteredTeamRows.reduce(
      (sum, r) => sum + (Number(r.wonRevenueRaw) || Number(String(r.wonRevenue || '').replace(/[^0-9]/g, '')) || 0),
      0
    );
    const avgConv = filteredTeamRows.length > 0
      ? (
          filteredTeamRows.reduce(
            (sum, r) => sum + (Number(r.conversionRateValue) || Number(String(r.conversionRate || '').replace(/[^0-9.]/g, '')) || 0),
            0
          ) / filteredTeamRows.length
        ).toFixed(1)
      : '0.0';

    return {
      count: filteredTeamRows.length,
      totalLeads: `${totalLeads.toLocaleString('en-IN')} Total Leads`,
      avgConversion: `${avgConv}% Avg Conversion`,
      pipelineValue: formatCurrency(totalPipeline, '₹'),
      wonRevenue: formatCurrency(totalWon, '₹'),
    };
  }, [filteredTeamRows]);

  // Aggregated Lead Source Totals
  const leadSourceTotals = useMemo(() => {
    const intake = filteredSourceRows.reduce((sum, r) => sum + (Number(r.leadsIntake) || 0), 0);
    const qualified = filteredSourceRows.reduce((sum, r) => sum + (Number(r.qualifiedLeads) || 0), 0);
    const deals = filteredSourceRows.reduce((sum, r) => sum + (Number(r.dealsCreated) || 0), 0);
    const won = filteredSourceRows.reduce((sum, r) => sum + (Number(r.wonDeals) || 0), 0);
    const revenue = filteredSourceRows.reduce(
      (sum, r) => sum + (Number(r.attributedRevenueRaw) || Number(String(r.attributedRevenue || '').replace(/[^0-9]/g, '')) || 0),
      0
    );
    const qualRate = intake > 0 ? ((qualified / intake) * 100).toFixed(1) : '0.0';

    return {
      count: filteredSourceRows.length,
      intake,
      qualifiedText: `${qualified} (${qualRate}%)`,
      deals,
      won,
      revenue: formatCurrency(revenue, '₹'),
    };
  }, [filteredSourceRows]);

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 select-text max-md:min-h-fit">
      <TableContainer
        toolbar={
          <div className="w-full flex flex-col gap-2.5">
            {/* Standard Desktop & Tablet One-Line Toolbar (Matching Leads Page) */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 flex-wrap w-full">
              {/* Left Controls: Search & Report Segmented Tab Toggle */}
              <div className="flex items-center gap-2.5 flex-wrap flex-1 min-w-0">
                {/* Search Input Bar */}
                <div className="relative min-w-[200px] sm:min-w-[240px]">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-black-90/50 pointer-events-none"
                  />
                  <input
                    type="text"
                    placeholder="Search BDE or channel..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray border-b-2 border-stroke/80 rounded-[7px] text-xs font-medium text-black-90 placeholder:text-black-90/40 placeholder:select-none focus:outline-none transition-all"
                  />
                </div>

                {/* Report Switcher Tabs (One-click toggle between Team & Sources) */}
                <div
                  className="inline-flex rounded-[7px] bg-gray p-0.5 border-b-2 border-stroke/80 shrink-0 w-full sm:w-auto"
                  data-ui-style="joined-control"
                >
                  <button
                    type="button"
                    onClick={() => setActiveTab('team')}
                    className={`flex-1 sm:flex-none text-center px-3 py-1.5 text-xs font-semibold rounded-[5px] transition-colors cursor-pointer ${
                      activeTab === 'team'
                        ? 'bg-primary text-white-100 shadow-none'
                        : 'text-black-90/70 hover:text-black-90'
                    }`}
                  >
                    Team Performance ({teamRows.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('sources')}
                    className={`flex-1 sm:flex-none text-center px-3 py-1.5 text-xs font-semibold rounded-[5px] transition-colors cursor-pointer ${
                      activeTab === 'sources'
                        ? 'bg-primary text-white-100 shadow-none'
                        : 'text-black-90/70 hover:text-black-90'
                    }`}
                  >
                    Lead Sources ({leadSourceRows.length})
                  </button>
                </div>
              </div>

              {/* Right Filter & Action Controls (All in ONE line matching Leads) */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* 1. Date Range Filter */}
                <TableFilterSelect
                  id="filter-date-range"
                  name="date-range"
                  value={dateFilter}
                  placeholder="Date Range"
                  options={filterOptions.dateRangeOptions}
                  onChange={setDateFilter}
                  showAllOption={false}
                />

                {/* 2. By BDE Filter (Active for team tab) */}
                {activeTab === 'team' && (
                  <TableFilterSelect
                    id="filter-bde"
                    name="bde"
                    value={bdeFilter}
                    placeholder="By BDE"
                    options={filterOptions.bdeOptions}
                    onChange={setBdeFilter}
                    showAllOption={false}
                  />
                )}

                {/* 3. By Lead Source Filter (Active for sources tab) */}
                {activeTab === 'sources' && (
                  <TableFilterSelect
                    id="filter-lead-source"
                    name="lead-source"
                    value={sourceFilter}
                    placeholder="By Lead Source"
                    options={filterOptions.leadSourceOptions}
                    onChange={setSourceFilter}
                    showAllOption={false}
                  />
                )}

                {/* 4. By Pipeline Status Filter */}
                <TableFilterSelect
                  id="filter-status"
                  name="status"
                  value={statusFilter}
                  placeholder="By Status"
                  options={STATUS_OPTIONS}
                  onChange={setStatusFilter}
                  showAllOption={false}
                />

                {/* Reset Filter Button with animation */}
                <ResetFilterButton onReset={handleResetFilters} />

                {/* Export CSV Button */}
                <ExportButton
                  onClick={handleExport}
                  title="Export Report CSV"
                />
              </div>
            </div>
          </div>
        }
        pagination={
          (activeTab === 'team' ? filteredTeamRows.length : filteredSourceRows.length) > 0 ? (
            <Pagination
              currentPage={activeTab === 'team' ? teamPage : sourcesPage}
              totalPages={
                Math.ceil((activeTab === 'team' ? filteredTeamRows.length : filteredSourceRows.length) / pageSize) || 1
              }
              totalEntries={activeTab === 'team' ? filteredTeamRows.length : filteredSourceRows.length}
              pageSize={pageSize}
              onPageChange={activeTab === 'team' ? setTeamPage : setSourcesPage}
              className="pt-0 border-t-0"
            />
          ) : null
        }
      >
        {/* ==============================================================================================================
            ACTIVE TAB: TEAM PERFORMANCE REPORT TABLE
        ============================================================================================================== */}
        {activeTab === 'team' && (
          <div className="overflow-x-auto w-full no-scrollbar overscroll-x-contain [-webkit-overflow-scrolling:touch]">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-gray text-[11px] font-bold uppercase tracking-wider text-black-90/70 border-b border-stroke">
                  <th className="py-2.5 px-4 rounded-l-[7px] border-none">Executive Name</th>
                  <th className="py-2.5 px-3 border-none">Code</th>
                  <th className="py-2.5 px-3 border-none">Role</th>
                  <th className="py-2.5 px-3 border-none">Leads Handled</th>
                  <th className="py-2.5 px-3 border-none">Conversion Rate</th>
                  <th className="py-2.5 px-3 border-none">Pipeline Value</th>
                  <th className="py-2.5 px-3 border-none">Won Revenue</th>
                  <th className="py-2.5 px-4 text-center rounded-r-[7px] border-none">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stroke text-xs text-black-90">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={8} className="py-3 px-4 bg-gray/20">
                        <div className="h-4 bg-gray rounded w-3/4" />
                      </td>
                    </tr>
                  ))
                ) : filteredTeamRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-14 px-4 text-center">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                        <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2.5 select-none border-none">
                          <User size={20} />
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-black-90 mb-1">
                          No Team Performance Records Found
                        </h4>
                        <p className="text-[11px] text-black-90/50 mb-3.5 leading-relaxed">
                          No active BDE team members or lead activity match your current filter selection.
                        </p>
                        {(searchQuery || dateFilter !== 'This Quarter' || bdeFilter !== 'All' || statusFilter !== 'All') && (
                          <button
                            type="button"
                            onClick={handleResetFilters}
                            className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 bg-gray hover:bg-stroke/40 text-black-90 rounded-[7px] text-xs font-semibold transition-colors border-b-2 border-stroke/80"
                          >
                            Clear all filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTeamRows.map((bde, idx) => {
                    const convVal =
                      Number(bde.conversionRateValue) ||
                      Number(String(bde.conversionRate || '').replace(/[^0-9.]/g, '')) ||
                      0;
                    const handledCount =
                      Number(bde.leadsHandledCount) ||
                      Number(String(bde.leadsHandled || '').replace(/\D/g, '')) ||
                      0;

                    return (
                      <tr key={bde.id || idx} className="hover:bg-gray/30 transition-colors">
                        {/* Executive Name & Avatar */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 border-none select-none">
                              {getInitials(bde.name)}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-semibold text-black-90 text-xs sm:text-sm truncate">
                                {bde.name}
                              </span>
                              <span className="text-[11px] text-black-90/50 truncate">
                                {bde.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Code */}
                        <td className="py-3 px-3">
                          <span className="bg-gray text-black-90/70 border border-stroke px-1.5 py-0.5 rounded-[4px] text-[10px] font-mono font-bold">
                            {bde.code}
                          </span>
                        </td>

                        {/* Role / Designation */}
                        <td className="py-3 px-3">
                          <span className="text-xs text-black-90/80 font-medium">
                            {bde.role || 'BDE'}
                          </span>
                        </td>

                        {/* Leads Handled */}
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span className="font-semibold text-black-90 text-xs">
                              {handledCount} leads
                            </span>
                            <span className="text-[10px] text-black-90/50">
                              {handledCount > 0 ? `${handledCount} processed · in-flight` : '0 processed'}
                            </span>
                          </div>
                        </td>

                        {/* Conversion Rate */}
                        <td className="py-3 px-3">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-black-90 text-xs">
                                {convVal.toFixed(1)}%
                              </span>
                              <div className="w-14 sm:w-16 h-1.5 bg-gray rounded-full overflow-hidden shrink-0">
                                <div
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${Math.min(100, Math.max(0, convVal))}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-[10px] text-success font-medium">
                              {convVal >= 20 ? 'On-target' : convVal > 0 ? 'Approaching target' : 'Pending activity'}
                            </span>
                          </div>
                        </td>

                        {/* Pipeline Value */}
                        <td className="py-3 px-3">
                          <span className="font-bold text-black-90 text-xs">
                            {bde.pipelineValue}
                          </span>
                        </td>

                        {/* Won Revenue */}
                        <td className="py-3 px-3">
                          <span className="font-bold text-success text-xs">
                            {bde.wonRevenue}
                          </span>
                        </td>

                        {/* Action View Button */}
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center">
                            <ViewBtn
                              onClick={() =>
                                handleOpenDrilldown('bde', bde.id, bde.name, { code: bde.code, role: bde.role })
                              }
                              title={`View drill-down records for ${bde.name}`}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

              {/* Table Total Summary Row */}
              {filteredTeamRows.length > 0 && (
                <tfoot>
                  <tr className="bg-gray font-bold text-xs text-black-90 border-t border-stroke">
                    <td className="py-3 px-4 uppercase tracking-wider font-mono">
                      TOTAL EXECUTION ({teamTotals.count} BDEs)
                    </td>
                    <td className="py-3 px-3">—</td>
                    <td className="py-3 px-3">—</td>
                    <td className="py-3 px-3">{teamTotals.totalLeads}</td>
                    <td className="py-3 px-3 text-primary">{teamTotals.avgConversion}</td>
                    <td className="py-3 px-3">{teamTotals.pipelineValue}</td>
                    <td className="py-3 px-3 text-success">{teamTotals.wonRevenue}</td>
                    <td className="py-3 px-4 text-center text-[11px] font-mono uppercase text-black-90/60">
                      TEAM TOTAL
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}

        {/* ==============================================================================================================
            ACTIVE TAB: LEAD SOURCE ATTRIBUTION FUNNEL TABLE
        ============================================================================================================== */}
        {activeTab === 'sources' && (
          <div className="overflow-x-auto w-full no-scrollbar overscroll-x-contain [-webkit-overflow-scrolling:touch]">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-gray text-[11px] font-bold uppercase tracking-wider text-black-90/70 border-b border-stroke">
                  <th className="py-2.5 px-4 rounded-l-[7px] border-none">Lead Channel</th>
                  <th className="py-2.5 px-3 border-none">Channel ID</th>
                  <th className="py-2.5 px-3 border-none">Leads Intake</th>
                  <th className="py-2.5 px-3 border-none">Qualified Leads</th>
                  <th className="py-2.5 px-3 border-none">Deals Created</th>
                  <th className="py-2.5 px-3 border-none">Won Deals</th>
                  <th className="py-2.5 px-3 text-right border-none">Attributed Revenue</th>
                  <th className="py-2.5 px-4 text-center rounded-r-[7px] border-none">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stroke text-xs text-black-90">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={8} className="py-3 px-4 bg-gray/20">
                        <div className="h-4 bg-gray rounded w-3/4" />
                      </td>
                    </tr>
                  ))
                ) : filteredSourceRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-14 px-4 text-center">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                        <div className="w-11 h-11 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-2.5 select-none border-none">
                          <Globe size={20} />
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-black-90 mb-1">
                          No Lead Source Attribution Records Found
                        </h4>
                        <p className="text-[11px] text-black-90/50 mb-3.5 leading-relaxed">
                          No channel attribution records or deals found for the current selection.
                        </p>
                        {(searchQuery || dateFilter !== 'This Quarter' || sourceFilter !== 'All' || statusFilter !== 'All') && (
                          <button
                            type="button"
                            onClick={handleResetFilters}
                            className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 bg-gray hover:bg-stroke/40 text-black-90 rounded-[7px] text-xs font-semibold transition-colors border-b-2 border-stroke/80"
                          >
                            Clear all filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSourceRows.map((src, idx) => {
                    const Icon = getSourceIcon(src.source);
                    const channelCode = getChannelCode(src.source, idx + 1);
                    const intake = Number(src.leadsIntake) || 0;
                    const qual = Number(src.qualifiedLeads) || 0;
                    const rate = intake > 0 ? ((qual / intake) * 100).toFixed(1) : '0.0';

                    return (
                      <tr
                        key={src.source || idx}
                        className="hover:bg-gray/30 transition-colors"
                      >
                        {/* Channel Name & Icon */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-[7px] bg-secondary/10 border-b-2 border-stroke/80 text-secondary flex items-center justify-center shrink-0">
                              <Icon size={14} />
                            </div>
                            <span className="font-semibold text-black-90 text-xs sm:text-sm">
                              {src.source}
                            </span>
                          </div>
                        </td>

                        {/* Channel Code */}
                        <td className="py-3 px-3">
                          <span className="text-[10px] font-mono text-black-90/60 bg-gray px-1.5 py-0.5 rounded-[4px] border border-stroke">
                            {channelCode}
                          </span>
                        </td>

                        {/* Leads Intake */}
                        <td className="py-3 px-3">
                          <span className="font-semibold text-black-90 text-xs">
                            {src.leadsIntake}
                          </span>
                        </td>

                        {/* Qualified Leads */}
                        <td className="py-3 px-3">
                          <span className="font-semibold text-black-90 text-xs">
                            {qual} <span className="text-black-90/50 font-normal">({rate}%)</span>
                          </span>
                        </td>

                        {/* Deals Created */}
                        <td className="py-3 px-3">
                          <span className="font-semibold text-black-90 text-xs">
                            {src.dealsCreated}
                          </span>
                        </td>

                        {/* Won Deals */}
                        <td className="py-3 px-3">
                          <span className="font-bold text-primary text-xs">
                            {src.wonDeals}
                          </span>
                        </td>

                        {/* Attributed Revenue */}
                        <td className="py-3 px-3 text-right">
                          <span className="font-bold text-success text-xs">
                            {src.attributedRevenue}
                          </span>
                        </td>

                        {/* Action View Button */}
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center">
                            <ViewBtn
                              onClick={() =>
                                handleOpenDrilldown('leadSource', src.source, `Channel: ${src.source}`, { channelCode })
                              }
                              title={`View leads & deals for ${src.source}`}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

              {/* Table Total Summary Row */}
              {filteredSourceRows.length > 0 && (
                <tfoot>
                  <tr className="bg-gray font-bold text-xs text-black-90 border-t border-stroke">
                    <td className="py-3 px-4 uppercase tracking-wider font-mono">
                      AGGREGATED TOTAL ({leadSourceTotals.count} CHANNELS)
                    </td>
                    <td className="py-3 px-3">—</td>
                    <td className="py-3 px-3">{leadSourceTotals.intake}</td>
                    <td className="py-3 px-3 text-primary">{leadSourceTotals.qualifiedText}</td>
                    <td className="py-3 px-3">{leadSourceTotals.deals}</td>
                    <td className="py-3 px-3 text-primary">{leadSourceTotals.won}</td>
                    <td className="py-3 px-3 text-right text-success">{leadSourceTotals.revenue}</td>
                    <td className="py-3 px-4 text-center text-[11px] font-mono uppercase text-black-90/60">
                      TOTAL
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </TableContainer>

      {/* ==============================================================================================================
          INTERACTIVE DRILL-DOWN DRAWER (FRD CRM-028 Reconciled Records)
      ============================================================================================================== */}
      {isDrilldownOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black-90/30 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
          <div className="w-full max-w-xl h-full bg-white-100 flex flex-col border-l border-stroke">
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-stroke flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-black-90">
                  {selectedDrilldown?.title || 'Telemetry Drill-Down'}
                </h2>
                <p className="text-xs text-black-90/60 mt-0.5">
                  Reconciled underlying leads and deals for {selectedDrilldown?.type === 'bde' ? 'sales executive' : 'attribution channel'}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDrilldownOpen(false)}
                className="w-8 h-8 rounded-[7px] bg-gray border-b-2 border-stroke/80 flex items-center justify-center hover:bg-gray/80 transition-colors cursor-pointer"
                title="Close Drawer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4 no-scrollbar">
              {drilldownLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-8 h-8 border-4 border-stroke border-t-primary rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  {/* Summary Metric Counters */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray rounded-[7px] p-3 border-b-2 border-stroke/80">
                      <span className="text-xs font-semibold text-black-90/60 block">Underlying Leads</span>
                      <span className="text-xl font-bold text-black-90 mt-1 block">
                        {selectedDrilldown?.leads?.length || 0}
                      </span>
                    </div>
                    <div className="bg-gray rounded-[7px] p-3 border-b-2 border-stroke/80">
                      <span className="text-xs font-semibold text-black-90/60 block">Associated Deals</span>
                      <span className="text-xl font-bold text-primary mt-1 block">
                        {selectedDrilldown?.deals?.length || 0}
                      </span>
                    </div>
                  </div>

                  {/* Section 1: Associated Leads */}
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center gap-2">
                      <User size={15} className="text-primary" />
                      <h3 className="text-sm font-bold text-black-90">Assigned Leads</h3>
                    </div>

                    {!selectedDrilldown?.leads?.length ? (
                      <p className="text-xs text-black-90/50 py-3 text-center bg-gray/50 rounded-[7px]">
                        No individual lead records available.
                      </p>
                    ) : (
                      <div className="divide-y divide-stroke border border-stroke rounded-[7px] overflow-hidden">
                        {selectedDrilldown.leads.map((ld) => (
                          <div key={ld.lds_id} className="p-3 bg-white-100 flex items-center justify-between text-xs hover:bg-gray/40">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-black-90">{ld.lds_company || ld.lds_lead_no}</span>
                                <span className="text-[10px] font-mono text-black-90/50">{ld.lds_lead_no}</span>
                              </div>
                              <span className="text-black-90/60 text-[11px] block mt-0.5">{ld.lds_contact || 'No Contact'}</span>
                            </div>
                            <div className="text-right">
                              <span className="inline-block px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-primary/10 text-primary uppercase">
                                {ld.lds_status}
                              </span>
                              <span className="text-[10px] text-black-90/40 block mt-0.5">
                                {formatDateDDMMYYYY(ld.lds_created_at)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Section 2: Associated Deals */}
                  <div className="flex flex-col gap-2 mt-3">
                    <div className="flex items-center gap-2">
                      <Handshake size={15} className="text-secondary" />
                      <h3 className="text-sm font-bold text-black-90">Associated Deals</h3>
                    </div>

                    {!selectedDrilldown?.deals?.length ? (
                      <p className="text-xs text-black-90/50 py-3 text-center bg-gray/50 rounded-[7px]">
                        No deal records linked.
                      </p>
                    ) : (
                      <div className="divide-y divide-stroke border border-stroke rounded-[7px] overflow-hidden">
                        {selectedDrilldown.deals.map((dl) => (
                          <div key={dl.deal_id} className="p-3 bg-white-100 flex items-center justify-between text-xs hover:bg-gray/40">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-black-90">{dl.deal_title || dl.deal_no}</span>
                                <span className="text-[10px] font-mono text-black-90/50">{dl.deal_no}</span>
                              </div>
                              <span className="text-success font-semibold text-xs block mt-0.5">
                                {formatCurrency(dl.deal_value, '₹')}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="inline-block px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-secondary/10 text-secondary uppercase">
                                {dl.deal_stage}
                              </span>
                              <span className="text-[10px] text-black-90/40 block mt-0.5">
                                {formatDateDDMMYYYY(dl.deal_close_date || dl.deal_created_at)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default ReportAnalytics;
