//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, Lucide icons, common StatCard component, and BDE telemetry constants
//==================================================================================================================
import { useState, useMemo } from 'react';
import { TableFilterSelect } from '../../../components/Table/TableFilterSelect';
import { ChevronDown, ChevronRight, Upload, Mail } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import { StatCard } from '../../../components/cards/StatCard';
import { BarChart } from '../../../components/common/BarChart';
import { DealDistribution } from '../../../components/common/DealDistribution';
import { ViewIcon } from '../../../components/icons/ViewIcon';
import { EditIcon } from '../../../components/icons/EditIcon';
import {
  BDE_STAT_CARDS,
  BDE_REVENUE_CHART_MONTHLY,
  BDE_REVENUE_CHART_YEARLY,
  BDE_DEAL_DISTRIBUTION_DATA,
  BDE_LAST_5_LEADS_DATA,
} from '../../../constants/bdeDashboardConstants';

//==================================================================================================================
//    LAST 5 LEADS TABLE SUBCOMPONENT
//    Directly implemented for BDE dashboard without external common table component
//==================================================================================================================
const Last5LeadsTable = () => {
  return (
    <div className="bg-white-100 rounded-xl border-b-2 border-stroke/80 overflow-hidden flex flex-col ">
      {/* Table Header Section */}
      <div className="p-4 sm:p-5 pb-3 flex justify-between items-center ">
        <h3 className="font-bold text-lg text-black-90">Last 5 Leads</h3>
        <button
          type="button"
          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-[7px] border-b-2 border-stroke/80 bg-gray text-xs sm:text-sm font-semibold text-primary hover:bg-gray/80 transition-colors cursor-pointer "
        >
          <span>View All Leads</span>
          <ChevronRight size={14} className="text-primary flex-shrink-0" />
        </button>
      </div>

      {/* Table Data Rows */}
      <div className="overflow-x-auto w-full px-4 sm:px-5 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <table className="w-full text-left border-collapse min-w-[800px] lg:min-w-0">
          <thead>
            <tr className="bg-gray">
              <th className="py-2.5 px-4 text-xs font-medium text-black-90 whitespace-nowrap first:rounded-l-lg last:rounded-r-lg">
                Code
              </th>
              <th className="py-2.5 px-4 text-xs font-medium text-black-90 whitespace-nowrap first:rounded-l-lg last:rounded-r-lg">
                Lead Name
              </th>
              <th className="py-2.5 px-4 text-xs font-medium text-black-90 whitespace-nowrap first:rounded-l-lg last:rounded-r-lg">
                Company Name
              </th>
              <th className="py-2.5 px-4 text-xs font-medium text-black-90 whitespace-nowrap first:rounded-l-lg last:rounded-r-lg">
                Stage
              </th>
              <th className="py-2.5 px-4 text-xs font-medium text-black-90 whitespace-nowrap first:rounded-l-lg last:rounded-r-lg">
                Priority
              </th>
              <th className="py-2.5 px-4 text-xs font-medium text-black-90 whitespace-nowrap first:rounded-l-lg last:rounded-r-lg">
                Quick Contact
              </th>
              <th className="py-2.5 px-4 text-xs font-medium text-black-90 whitespace-nowrap first:rounded-l-lg last:rounded-r-lg">
                <div className="inline-flex items-center gap-1 ">
                  <span>Created Date</span>
                  <ChevronDown size={13} className="text-primary flex-shrink-0" />
                </div>
              </th>
              <th className="py-2.5 px-4 text-xs font-medium text-black-90 whitespace-nowrap first:rounded-l-lg last:rounded-r-lg">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {BDE_LAST_5_LEADS_DATA.map((lead, idx) => (
              <tr
                key={`${lead.id}-${idx}`}
                className="border-b border-stroke/60 last:border-0 hover:bg-gray/20 transition-colors"
              >
                {/* Code */}
                <td className="py-3.5 px-4 text-sm font-bold text-black-90 whitespace-nowrap">
                  {lead.code}
                </td>

                {/* Lead Name */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <img
                      src={lead.leadAvatar}
                      alt={lead.leadName}
                      className="w-8 h-8 rounded-full object-cover border-none flex-shrink-0"
                    />
                    <span className="text-sm font-bold text-black-90">
                      {lead.leadName}
                    </span>
                  </div>
                </td>

                {/* Company Name */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <img
                      src={lead.companyLogo}
                      alt={lead.companyName}
                      className="w-8 h-8 rounded-full object-cover border-none flex-shrink-0"
                    />
                    <span className="text-sm font-bold text-black-90">
                      {lead.companyName}
                    </span>
                  </div>
                </td>

                {/* Stage */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center justify-center w-[112px] h-[24px] px-3 py-0.5 rounded-[7px] text-xs font-semibold bg-gray text-black-90">
                    {lead.stage}
                  </span>
                </td>

                {/* Priority */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center justify-center w-[112px] h-[24px] px-3 py-0.5 rounded-[7px] text-xs font-semibold bg-warning/15 text-warning">
                    {lead.priority}
                  </span>
                </td>

                {/* Quick Contact */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      title="WhatsApp Contact"
                      aria-label="WhatsApp Contact"
                      className="w-8 h-8 rounded-[7px] bg-gray border-b-2 border-stroke/80 flex items-center justify-center hover:bg-gray/80 transition-colors cursor-pointer shrink-0"
                    >
                      <FaWhatsapp size={18} className="text-[#25D366]" />
                    </button>
                    <button
                      type="button"
                      title="Email Contact"
                      aria-label="Email Contact"
                      className="w-8 h-8 rounded-[7px] bg-gray border-b-2 border-stroke/80 text-primary flex items-center justify-center hover:bg-gray/80 transition-colors cursor-pointer shrink-0"
                    >
                      <Mail size={16} strokeWidth={2} />
                    </button>
                  </div>
                </td>

                {/* Created Date */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-semibold text-black-90">
                      {lead.createdDate}
                    </span>
                    <span className="text-[11px] font-medium text-black-90/60 mt-0.5">
                      {lead.createdTime}
                    </span>
                  </div>
                </td>

                {/* Action */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      title="View Lead Details"
                      aria-label="View lead details"
                      className="w-8 h-8 rounded-[7px] bg-gray border-b-2 border-stroke/80 text-secondary flex items-center justify-center hover:bg-gray/80 transition-colors cursor-pointer"
                    >
                      <ViewIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Edit Lead"
                      aria-label="Edit lead"
                      className="w-8 h-8 rounded-[7px] bg-gray border-b-2 border-stroke/80 text-secondary flex items-center justify-center hover:bg-gray/80 transition-colors cursor-pointer"
                    >
                      <EditIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

//==================================================================================================================
//    BDE DASHBOARD COMPONENT
//    Renders the Dashboard welcome header with date range selector, export action, 4 metric stat cards,
//    revenue column bar chart, and deal distribution pipeline stages.
//==================================================================================================================
export const BdeDashboard = () => {
  const [revenueTab, setRevenueTab] = useState('Monthly'); // 'Monthly' | 'Yearly'
  const [selectedYear, setSelectedYear] = useState('2025');

  // Memoize chart data to avoid redundant transformations on re-renders
  const currentChartData = useMemo(() => {
    return revenueTab === 'Monthly'
      ? BDE_REVENUE_CHART_MONTHLY
      : BDE_REVENUE_CHART_YEARLY;
  }, [revenueTab]);

  return (
    <div className="w-full flex flex-col gap-4 px-3 sm:px-0 pb-6 sm:pb-0">
      {/* ==================================================================================================================
          Dashboard Welcome Header & Action Controls
      ================================================================================================================== */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 ">
        {/* Left: Heading and Ecosystem Subtitle */}
        <div className="flex flex-col">
          <h1 className="text-xl sm:text-[24px] font-bold text-primary tracking-tight leading-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm font-medium text-black-90/70 mt-0.5">
            Welcome, <span className="font-bold text-primary">Johnson Doe</span>. Here's your ecosystem overview
          </p>
        </div>

        {/* Right: Date Filter Button & Export Action Button */}
        <div className="flex items-center gap-2.5 sm:gap-3 self-end sm:self-auto">
          {/* Static Date Filter Button */}
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-gray border-b-2 border-stroke/80 rounded-[7px] text-xs sm:text-sm font-medium text-black-90 hover:bg-gray transition-colors cursor-pointer"
          >
            <span>By Date</span>
            <ChevronDown size={15} className="text-black-90/60" />
          </button>

          {/* Export Action Button */}
          <button
            type="button"
            title="Export Overview"
            aria-label="Export Overview"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-secondary text-white-100 flex items-center justify-center hover:opacity-90 active:scale-95 transition-all  cursor-pointer"
          >
            <Upload size={17} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* ==================================================================================================================
          FOUR METRIC STAT CARDS ROW
          Grid display with uniform column spacing (gap-4) matching Figma and Reference layout.
      ================================================================================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {BDE_STAT_CARDS.map((stat) => (
          <StatCard key={stat.id} item={stat} />
        ))}
      </div>

      {/* ==================================================================================================================
          CHARTS AND PIPELINE ANALYTICS SECTION
          Grid presenting Monthly vs Yearly revenue comparisons alongside Deal Distribution pipeline stages.
      ================================================================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ==============================================================================================================
            MONTHLY VS YEARLY REVENUE BAR CHART
        ============================================================================================================== */}
        <BarChart
          title="Monthly vs Yearly Revenue"
          headerRight={
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <div
                data-ui-style="joined-control"
                className="flex items-center bg-gray rounded-[7px] p-[3px] border-b-2 border-stroke/80"
              >
                <button
                  type="button"
                  data-ui-style="filter-tab"
                  onClick={() => setRevenueTab('Monthly')}
                  className={`px-3 py-1 rounded-[5px] text-xs transition-colors cursor-pointer ${
                    revenueTab === 'Monthly'
                      ? 'font-bold bg-primary text-white-100'
                      : 'font-medium text-black-90 hover:text-black-90'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  data-ui-style="filter-tab"
                  onClick={() => setRevenueTab('Yearly')}
                  className={`px-3 py-1 rounded-[5px] text-xs transition-colors cursor-pointer ${
                    revenueTab === 'Yearly'
                      ? 'font-bold bg-primary text-white-100'
                      : 'font-medium text-black-90 hover:text-black-90'
                  }`}
                >
                  Yearly
                </button>
              </div>

              <TableFilterSelect
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                options={[
                  { value: '2025', label: '2025' },
                  { value: '2024', label: '2024' },
                ]}
                showAllOption={false}
                placeholder="2025"
                selectClassName="h-8"
              />
            </div>
          }
          data={currentChartData}
          yAxisTiers={[80, 60, 40, 20, 0]}
          maxVal={80}
          barColor="bg-secondary hover:bg-primary"
          formatTopValue={(v) => `₹${v}k`}
          renderYAxisTier={(tier) => (
            <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-gray font-semibold text-black-90 text-[10px] sm:text-[11px]">
              <span className="text-secondary font-bold">₹</span>
              <span>{tier}k</span>
            </div>
          )}
        />

        {/* ==============================================================================================================
            DEAL DISTRIBUTION PIPELINE CARD
        ============================================================================================================== */}
        <DealDistribution
          title="Deal Distribution"
          subtitle="My pipeline by stage"
          badge="19 Deals"
          items={BDE_DEAL_DISTRIBUTION_DATA}
        />
      </div>

      {/* ==================================================================================================================
          BOTTOM SECTION: LAST 5 LEADS TABLE
          Directly rendered table displaying recent prospects, organizational details, contact badges, and action triggers.
      ================================================================================================================== */}
      <Last5LeadsTable />
    </div>
  );
};

//==================================================================================================================
//    DEFAULT EXPORT
//==================================================================================================================
export default BdeDashboard;
