//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, Lucide icons, common StatCard component, and Super Admin telemetry constants
//==================================================================================================================
import React, { useState, useMemo, memo } from 'react';
import { ChevronDown } from 'lucide-react';
import { ExportButton } from '../../../components/common/buttons/ExportButton';
import { StatCard } from '../../../components/common/StatCard';
import { BarChart } from '../../../components/common/BarChart';
import { LeadStatusBreakdown } from '../../../components/common/LeadStatusBreakdown';
import { LeadStageDistributionCard } from '../../../components/common/LeadStageDistributionCard';
import { LeadSourcePerformance } from '../../../components/common/LeadSourcePerformance';
import { ExecutiveActivityCard } from '../../../components/common/ExecutiveActivityCard';
import { SystemHealthCard } from '../../../components/common/SystemHealthCard';
import {
  ADMIN_STAT_CARDS,
  ADMIN_LEAD_VOLUME_PACING_MONTHLY,
  ADMIN_LEAD_VOLUME_PACING_YEARLY,
  ADMIN_LEAD_STATUS_BREAKDOWN_DATA,
  ADMIN_STAGE_DISTRIBUTION_DATA,
  ADMIN_LEAD_SOURCE_PERFORMANCE_DATA,
  ADMIN_EXECUTIVE_ACTIVITY_DATA,
  ADMIN_SYSTEM_HEALTH_DATA,
} from '../../../constants/adminDashboardConstants';

//==================================================================================================================
//    SUPER ADMIN DASHBOARD COMPONENT
//    Executive telemetry dashboard matching Image 1 to Image 5 specifications
//==================================================================================================================
export const AdminDashboard = memo(() => {
  const [timeFilter, setTimeFilter] = useState('This Month');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Timeframe filter options
  const FILTER_OPTIONS = ['This Month', 'Last Month', 'This Quarter', 'This Year'];

  // Lead volume pacing chart state: Monthly vs Yearly
  const [revenueTab, setRevenueTab] = useState('Monthly');
  const [selectedYear, setSelectedYear] = useState('2025');

  const currentChartData = useMemo(() => {
    return revenueTab === 'Monthly'
      ? ADMIN_LEAD_VOLUME_PACING_MONTHLY
      : ADMIN_LEAD_VOLUME_PACING_YEARLY;
  }, [revenueTab]);

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-5 pb-2 sm:pb-0">
      {/* ==============================================================================================================
          1. DASHBOARD PAGE HEADER (Image 1 & Image 3)
      ============================================================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 select-none">
        <div className="flex flex-col">
          <h1 className="text-xl sm:text-2xl font-bold text-primary tracking-tight leading-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-black-90/60 font-medium mt-0.5">
            Monitor team performance, leads, pipeline, and sales activity.
          </p>
        </div>

        {/* Action Controls: Time Filter + Export Button */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Time Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterDropdownOpen((prev) => !prev)}
              className="h-[38px] inline-flex items-center gap-2 px-3 sm:px-3.5 rounded-[7px] border border-stroke text-xs sm:text-sm font-semibold text-black-90 bg-white-100 hover:bg-gray/50 transition-colors cursor-pointer shadow-3xs"
            >
              <span>{timeFilter}</span>
              <ChevronDown
                size={14}
                className={`text-black-90/70 transition-transform duration-200 ${
                  isFilterDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isFilterDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-36 bg-white-100 border border-stroke rounded-xl shadow-lg py-1 z-30">
                {FILTER_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setTimeFilter(option);
                      setIsFilterDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                      timeFilter === option
                        ? 'text-primary bg-primary/10 font-bold'
                        : 'text-black-90 hover:bg-gray'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export Action Button */}
          <ExportButton
            title="Export Overview"
            aria-label="Export Overview"
            className="h-[38px] w-[38px]"
          />
        </div>
      </div>

      {/* ==============================================================================================================
          2. FOUR COMMON METRIC STAT CARDS ROW (Image 1 & Image 3)
      ============================================================================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {ADMIN_STAT_CARDS.map((stat) => (
          <StatCard key={stat.id} item={stat} />
        ))}
      </div>

      {/* ==============================================================================================================
          3. ROW 2: LEAD VOLUME PACING & ROUND DONUT CHART (Matching BDE Panel Height)
          Lead Volume Pacing bar chart paired with Lead Status Breakdown donut chart
      ============================================================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* Lead Volume Pacing Bar Chart */}
        <BarChart
          title="Lead Volume Pacing"
          headerRight={
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap select-none">
              <div className="flex bg-gray rounded-lg p-[3px] border border-stroke">
                <button
                  type="button"
                  onClick={() => setRevenueTab('Monthly')}
                  className={`px-3 py-1 rounded-md text-xs sm:text-sm transition-colors cursor-pointer ${
                    revenueTab === 'Monthly'
                      ? 'font-bold bg-primary text-white-100 shadow-2xs'
                      : 'font-medium text-black-90/60 hover:text-black-90'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setRevenueTab('Yearly')}
                  className={`px-3 py-1 rounded-md text-xs sm:text-sm transition-colors cursor-pointer ${
                    revenueTab === 'Yearly'
                      ? 'font-bold bg-primary text-white-100 shadow-2xs'
                      : 'font-medium text-black-90/60 hover:text-black-90'
                  }`}
                >
                  Yearly
                </button>
              </div>

              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="appearance-none border border-stroke rounded-lg pl-3 pr-8 py-1.5 text-xs sm:text-sm font-medium bg-white-100 text-black-90 outline-none focus:border-primary cursor-pointer shadow-2xs"
                >
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black-90/60 pointer-events-none"
                />
              </div>
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

        {/* Lead Status Breakdown Round Donut Chart (Image 2 & Image 3) */}
        <LeadStatusBreakdown
          title="Lead Status Breakdown"
          subtitle="Active funnel categorization across pipeline"
          badge="Distribution"
          data={ADMIN_LEAD_STATUS_BREAKDOWN_DATA}
        />
      </div>

      {/* ==============================================================================================================
          4. ROW 3: DEALS COUNT BY STAGE & LEAD SOURCE PERFORMANCE (EXACT IMAGE 4 SPECIFICATIONS)
          Inline horizontal stage progress bars on left alongside lead source conversion on right
      ============================================================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* Stage Distribution with Single-Line Horizontal Layout (Image 4 Left) */}
        <LeadStageDistributionCard
          title="Deals Count by Stage Distribution"
          badgeText="Total Deals"
          badgeCount="1,739"
          items={ADMIN_STAGE_DISTRIBUTION_DATA}
        />

        {/* Lead Source Performance & Conversion Card (Image 4 Right) */}
        <LeadSourcePerformance
          title="Lead Source Performance & Conversion"
          subtitle="Channel yield and downstream conversion efficiency"
          badge="Conv % & Vol"
          items={ADMIN_LEAD_SOURCE_PERFORMANCE_DATA}
        />
      </div>

      {/* ==============================================================================================================
          5. ROW 4: SALES EXECUTIVE & BDE ACTIVITY BREAKDOWN (IMAGE 1 & IMAGE 2)
          Multi-layer activity metric boxes with stacked performance meters
      ============================================================================================================== */}
      <div className="flex flex-col gap-3 select-none pt-1">
        {/* Section Header with Legend Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <h2 className="text-lg sm:text-xl font-bold text-black-90">
            Sales Executive & BDE Activity Breakdown
          </h2>

          <div className="inline-flex items-center gap-2.5 sm:gap-3 px-3.5 py-1.5 rounded-full border border-stroke bg-white-100 text-xs font-semibold shadow-3xs text-black-90/80 self-start sm:self-auto">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
              <span>Leads Handled</span>
            </div>
            <span className="text-stroke">|</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary shrink-0" />
              <span>Deals Handled</span>
            </div>
            <span className="text-stroke">|</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-success shrink-0" />
              <span>Won Deals</span>
            </div>
          </div>
        </div>

        {/* 6 Executive Activity Card Boxes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {ADMIN_EXECUTIVE_ACTIVITY_DATA.map((exec) => (
            <ExecutiveActivityCard
              key={exec.id}
              name={exec.name}
              region={exec.region}
              leads={exec.leads}
              deals={exec.deals}
              won={exec.won}
              leadsPercent={exec.leadsPercent}
              dealsPercent={exec.dealsPercent}
              wonPercent={exec.wonPercent}
            />
          ))}
        </div>
      </div>

      {/* ==============================================================================================================
          6. ROW 5: PLATFORM & SYSTEM HEALTH TELEMETRY (IMAGE 1 & IMAGE 3)
          Telemetry monitoring status cards displaying uptime, latency, and core engine diagnostics
      ============================================================================================================== */}
      <div className="flex flex-col gap-3 select-none pt-1">
        <h2 className="text-lg sm:text-xl font-bold text-black-90">
          Platform & System Health Telemetry
        </h2>

        {/* 4 Health Status Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {ADMIN_SYSTEM_HEALTH_DATA.map((health) => (
            <SystemHealthCard
              key={health.id}
              title={health.title}
              status={health.status}
              metrics={health.metrics}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

AdminDashboard.displayName = 'AdminDashboard';

//==================================================================================================================
//    DEFAULT EXPORT
//==================================================================================================================
export default AdminDashboard;