//==================================================================================================================
//    REPORT & ANALYTICS PAGE (SALES WORKSPACE)
//    Telemetry hub matching Image 1 (BDE Performance) and Image 2 (Lead Source Attribution & Outcome Funnel)
//==================================================================================================================

import React, { useState, useMemo, useCallback, memo } from 'react';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Video,
  Globe,
  Handshake,
  Share2,
  Ticket,
  Mail,
  ArrowLeft,
} from 'lucide-react';
import { TableContainer } from '../../../components/common/TableContainer';
import { DataTableToolbar } from '../../../components/common/DataTableToolbar';
import { DataTable } from '../../../components/common/DataTable';
import { Pagination } from '../../../components/common/Pagination';
import { ViewBtn } from '../../../components/common/buttons/ViewBtn';

//==================================================================================================================
//    MOCK TELEMETRY DATA
//==================================================================================================================
const STATS_DATA = [
  {
    id: 'intake',
    title: 'Total Leads Intake',
    value: '1290',
    subText: '100% of top-of-funnel',
    trendType: 'positive',
    iconColor: 'bg-secondary/15 text-secondary',
  },
  {
    id: 'qualified',
    title: 'Qualified Leads',
    value: '435',
    subText: '66.3% drop-off',
    trendType: 'negative',
    iconColor: 'bg-success/15 text-success',
  },
  {
    id: 'deals',
    title: 'Deals Created',
    value: '118',
    subText: 'Pipeline: $4,470,000',
    trendType: 'positive',
    iconColor: 'bg-alert/15 text-alert',
  },
  {
    id: 'closed',
    title: 'Closed Won Deals',
    value: '40',
    subText: '78 lost / stalled deals',
    trendType: 'positive',
    iconColor: 'bg-[#8B5CF6]/15 text-[#8B5CF6]',
  },
  {
    id: 'revenue',
    title: 'Attributed Revenue',
    value: '₹8,20,000',
    subText: 'Avg Deal: ₹45,500',
    trendType: 'positive',
    iconColor: 'bg-secondary/15 text-secondary',
  },
];

const INITIAL_BDE_DATA = Array.from({ length: 10 }, (_, i) => ({
  id: `bde-${i + 1}`,
  code: '#001',
  name: 'Emily Carter',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=face',
  leadsHandled: '312 leads',
  conversionRate: '28.4%',
  pipelineValue: '₹14,20,000',
  wonRevenue: '₹5,80,000',
}));

const LEAD_SOURCE_DATA = [
  {
    id: 'INB-01',
    source: 'Inbound Demo',
    icon: Video,
    leadsIntake: 500,
    qualifiedLeads: 240,
    dealsCreated: 64,
    wonDeals: 22,
    attributedRevenue: '₹9,90,000',
  },
  {
    id: 'INB-01',
    source: 'Website',
    icon: Globe,
    leadsIntake: 375,
    qualifiedLeads: 150,
    dealsCreated: 40,
    wonDeals: 14,
    attributedRevenue: '₹6,30,000',
  },
  {
    id: 'INB-01',
    source: 'Partner Referral',
    icon: Handshake,
    leadsIntake: 750,
    qualifiedLeads: 435,
    dealsCreated: 110,
    wonDeals: 38,
    attributedRevenue: '₹17,10,000',
  },
  {
    id: 'INB-01',
    source: 'LinkedIn',
    icon: Share2,
    leadsIntake: 625,
    qualifiedLeads: 200,
    dealsCreated: 46,
    wonDeals: 15,
    attributedRevenue: '₹6,75,000',
  },
  {
    id: 'INB-01',
    source: 'Event',
    icon: Ticket,
    leadsIntake: 875,
    qualifiedLeads: 245,
    dealsCreated: 55,
    wonDeals: 18,
    attributedRevenue: '₹8,10,000',
  },
  {
    id: 'INB-01',
    source: 'Cold Outreach',
    icon: Mail,
    leadsIntake: 250,
    qualifiedLeads: 45,
    dealsCreated: 12,
    wonDeals: 4,
    attributedRevenue: '₹1,80,000',
  },
];

const DATE_OPTIONS = [
  { label: 'By Date', value: 'All' },
  { label: 'This Week', value: 'This Week' },
  { label: 'This Month', value: 'This Month' },
  { label: 'This Quarter', value: 'This Quarter' },
];

const LEAD_SOURCE_OPTIONS = [
  { label: 'By Lead Source', value: 'All' },
  { label: 'Inbound Demo', value: 'Inbound Demo' },
  { label: 'Website', value: 'Website' },
  { label: 'Partner Referral', value: 'Partner Referral' },
  { label: 'LinkedIn', value: 'LinkedIn' },
  { label: 'Event', value: 'Event' },
  { label: 'Cold Outreach', value: 'Cold Outreach' },
];

//==================================================================================================================
//    REPORT & ANALYTICS COMPONENT
//==================================================================================================================
export const ReportAnalytics = memo(() => {
  // Active view: 'bde' (Image 1) | 'leadSource' (Image 2)
  const [activeView, setActiveView] = useState('bde');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Toggle handlers
  const handleToggleView = useCallback(() => {
    setActiveView((prev) => (prev === 'bde' ? 'leadSource' : 'bde'));
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  //==================================================================================================================
  //    BDE PERFORMANCE COLUMNS (Image 1)
  //==================================================================================================================
  const bdeColumns = useMemo(
    () => [
      {
        key: 'code',
        label: 'BDE Code',
        sortable: true,
        className: 'w-24 pl-4',
        render: (row) => (
          <span className="font-semibold text-black-90 text-xs sm:text-sm">{row.code}</span>
        ),
      },
      {
        key: 'name',
        label: 'Name',
        sortable: true,
        className: 'max-sm:min-w-[160px] max-sm:pr-4',
        headerClassName: 'max-sm:min-w-[160px] max-sm:pr-4',
        render: (row) => (
          <div className="flex items-center gap-2.5">
            <img
              src={row.avatar}
              alt={row.name}
              className="w-7 h-7 rounded-full object-cover shrink-0 border border-stroke"
            />
            <span className="font-semibold text-black-90 text-xs sm:text-sm whitespace-nowrap">
              {row.name}
            </span>
          </div>
        ),
      },
      {
        key: 'leadsHandled',
        label: 'Leads Handled',
        sortable: true,
        className: 'max-sm:min-w-[120px]',
        headerClassName: 'max-sm:min-w-[120px]',
        render: (row) => (
          <span className="text-black-90 text-xs sm:text-sm whitespace-nowrap font-medium">
            {row.leadsHandled}
          </span>
        ),
      },
      {
        key: 'conversionRate',
        label: 'Conversion Rate',
        sortable: true,
        className: 'max-sm:min-w-[120px]',
        headerClassName: 'max-sm:min-w-[120px]',
        render: (row) => (
          <span className="text-black-90 text-xs sm:text-sm whitespace-nowrap font-medium">
            {row.conversionRate}
          </span>
        ),
      },
      {
        key: 'pipelineValue',
        label: 'Pipeline Value',
        sortable: true,
        className: 'max-sm:min-w-[130px]',
        headerClassName: 'max-sm:min-w-[130px]',
        render: (row) => (
          <span className="font-bold text-primary text-xs sm:text-sm whitespace-nowrap">
            {row.pipelineValue}
          </span>
        ),
      },
      {
        key: 'wonRevenue',
        label: 'Won Revenue',
        sortable: true,
        className: 'max-sm:min-w-[130px]',
        headerClassName: 'max-sm:min-w-[130px]',
        render: (row) => (
          <span className="font-bold text-primary text-xs sm:text-sm whitespace-nowrap">
            {row.wonRevenue}
          </span>
        ),
      },
      {
        key: 'actions',
        label: 'Actions',
        align: 'center',
        className: 'pr-4',
        render: () => (
          <div className="flex items-center justify-center">
            <ViewBtn onClick={() => { }} title="View Analytics Details" />
          </div>
        ),
      },
    ],
    []
  );

  //==================================================================================================================
  //    LEAD SOURCE ATTRIBUTION COLUMNS (Image 2)
  //==================================================================================================================
  const leadSourceColumns = useMemo(
    () => [
      {
        key: 'id',
        label: 'ID',
        sortable: true,
        className: 'w-24 pl-4',
        render: (row) => (
          <span className="font-semibold text-black-90 text-xs sm:text-sm">{row.id}</span>
        ),
      },
      {
        key: 'source',
        label: 'Lead Source',
        sortable: true,
        render: (row) => {
          const Icon = row.icon;
          return (
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gray text-secondary flex items-center justify-center shrink-0">
                <Icon size={14} />
              </div>
              <span className="font-semibold text-black-90 text-xs sm:text-sm whitespace-nowrap">
                {row.source}
              </span>
            </div>
          );
        },
      },
      {
        key: 'leadsIntake',
        label: 'Leads Intake',
        sortable: true,
        render: (row) => (
          <span className="text-black-90 text-xs sm:text-sm font-semibold">{row.leadsIntake}</span>
        ),
      },
      {
        key: 'qualifiedLeads',
        label: 'Qualified Leads',
        sortable: true,
        render: (row) => (
          <span className="text-black-90 text-xs sm:text-sm font-semibold">{row.qualifiedLeads}</span>
        ),
      },
      {
        key: 'dealsCreated',
        label: 'Deals Created',
        sortable: true,
        render: (row) => (
          <span className="text-black-90 text-xs sm:text-sm font-semibold">{row.dealsCreated}</span>
        ),
      },
      {
        key: 'wonDeals',
        label: 'Won Deals',
        sortable: true,
        render: (row) => (
          <span className="font-bold text-primary text-xs sm:text-sm">{row.wonDeals}</span>
        ),
      },
      {
        key: 'attributedRevenue',
        label: 'Attributed Revenue',
        sortable: true,
        className: 'pr-4',
        render: (row) => (
          <span className="font-bold text-primary text-xs sm:text-sm whitespace-nowrap">
            {row.attributedRevenue}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="w-full flex-1 flex flex-col gap-4 min-h-0 select-text max-sm:overflow-y-auto max-sm:overflow-x-hidden no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* ==============================================================================================================
          1. TOP TELEMETRY STAT CARDS (Image 1) - Only shown in BDE view
      ============================================================================================================== */}
      {activeView === 'bde' && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-4 shrink-0">
          {STATS_DATA.map((item) => (
            <div
              key={item.id}
              className="bg-white-100 rounded-xl border border-stroke p-4 flex flex-col justify-between shadow-2xs"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-black-90/60 truncate">
                  {item.title}
                </span>
                <div
                  className={`w-7 h-7 rounded-lg ${item.iconColor} flex items-center justify-center shrink-0`}
                >
                  <Sparkles size={14} />
                </div>
              </div>
              <div className="mt-2.5">
                <span className="text-xl sm:text-2xl font-bold text-black-90 tracking-tight">
                  {item.value}
                </span>
              </div>
              <div className="mt-2.5">
                <div
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold ${item.trendType === 'positive'
                      ? 'bg-success/10 text-success'
                      : 'bg-alert/10 text-alert'
                    }`}
                >
                  {item.trendType === 'positive' ? (
                    <TrendingUp size={12} className="shrink-0" />
                  ) : (
                    <TrendingDown size={12} className="shrink-0" />
                  )}
                  <span className="truncate">{item.subText}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==============================================================================================================
          2. DATA TABLE CONTAINER WITH TOOLBAR
      ============================================================================================================== */}
      <div className="flex-1 flex flex-col min-h-0 max-sm:shrink-0 max-sm:min-h-[520px] pb-4 sm:pb-0">
        <TableContainer
          toolbar={
            <DataTableToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search here..."
              filters={[
                {
                  id: 'date-filter',
                  value: dateFilter,
                  onChange: setDateFilter,
                  options: DATE_OPTIONS,
                },
                {
                  id: 'source-filter',
                  value: sourceFilter,
                  onChange: setSourceFilter,
                  options: LEAD_SOURCE_OPTIONS,
                },
              ]}
              onResetFilters={() => {
                setSearchQuery('');
                setDateFilter('All');
                setSourceFilter('All');
                setCurrentPage(1);
              }}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onExport={() => alert('Exporting Analytics Data...')}
              actionButton={
                activeView === 'bde'
                  ? {
                    label: 'Lead Source Analysis',
                    onClick: handleToggleView,
                    className: 'bg-primary hover:bg-primary/90 text-white-100',
                  }
                  : {
                    label: 'Back to Overview',
                    icon: <ArrowLeft size={14} />,
                    onClick: handleToggleView,
                    className: 'bg-primary hover:bg-primary/90 text-white-100',
                  }
              }
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
          {activeView === 'bde' ? (
            <DataTable
              columns={bdeColumns}
              data={INITIAL_BDE_DATA}
              rowKey="id"
              emptyMessage="No BDE telemetry data found."
            />
          ) : (
            <div className="flex flex-col w-full">
              <DataTable
                columns={leadSourceColumns}
                data={LEAD_SOURCE_DATA}
                rowKey="source"
                emptyMessage="No lead source data found."
              />
              {/* Aggregated Total Row matching Image 2 */}
              <div className="bg-[#F8F9FC] border-t border-stroke px-4 py-3.5 flex items-center justify-between text-xs sm:text-sm font-bold text-black-90">
                <span className="w-1/4">Aggregated Total (6 Channels)</span>
                <span className="text-center w-24">3375</span>
                <span className="text-center w-24">1315</span>
                <span className="text-center w-24">327</span>
                <span className="text-center w-24 text-primary">111</span>
                <span className="text-right pr-4 text-primary">₹49,95,000</span>
              </div>
            </div>
          )}
        </TableContainer>
      </div>
    </div>
  );
});

//==================================================================================================================
//    DEFAULT EXPORT
//==================================================================================================================
export default ReportAnalytics;
