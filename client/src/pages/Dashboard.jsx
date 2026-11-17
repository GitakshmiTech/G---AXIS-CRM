//===========================================================================================
//    UNIFIED DASHBOARD PAGE COMPONENT
//    Single optimized entry point for /dashboard with modular role-based sections
//===========================================================================================

import React, { useState, useMemo, memo } from 'react';
import { useSelector } from 'react-redux';
import { ChevronDown } from 'lucide-react';

import { USER_ROLES } from '../constants/authConstants';
import { StatCard } from '../components/common/cards/StatCard';
import { BarChart } from '../components/common/charts/BarChart';
import { TableFilterSelect } from '../components/common/Table/TableFilterSelect';
import { ExportButton } from '../components/common/buttons/ExportButton';

// Modular dashboard components
import { LeadStatusBreakdown } from '../components/modules/dashboard/LeadStatusBreakdown';
import { LeadStageDistributionCard } from '../components/modules/dashboard/LeadStageDistributionCard';
import { LeadSourcePerformance } from '../components/modules/dashboard/LeadSourcePerformance';
import { ExecutiveActivityCard } from '../components/modules/dashboard/ExecutiveActivityCard';
import { SystemHealthCard } from '../components/modules/dashboard/SystemHealthCard';
import { LeadOverviewCard } from '../components/modules/dashboard/LeadOverviewCard';
import { BdePerformanceTable } from '../components/modules/dashboard/BdePerformanceTable';
import { DealDistribution } from '../components/modules/dashboard/DealDistribution';
import { Last5LeadsTable } from '../components/modules/dashboard/Last5LeadsTable';

// Role-specific telemetry constants
import {
  ADMIN_STAT_CARDS,
  ADMIN_LEAD_VOLUME_PACING_MONTHLY,
  ADMIN_LEAD_VOLUME_PACING_YEARLY,
  ADMIN_LEAD_STATUS_BREAKDOWN_DATA,
  ADMIN_STAGE_DISTRIBUTION_DATA,
  ADMIN_LEAD_SOURCE_PERFORMANCE_DATA,
  ADMIN_EXECUTIVE_ACTIVITY_DATA,
  ADMIN_SYSTEM_HEALTH_DATA,
} from '../constants/adminDashboardConstants';

import {
  SALES_STAT_CARDS,
  SALES_REVENUE_CHART_MONTHLY,
  SALES_REVENUE_CHART_YEARLY,
} from '../constants/salesDashboardConstants';

import {
  BDE_STAT_CARDS,
  BDE_REVENUE_CHART_MONTHLY,
  BDE_REVENUE_CHART_YEARLY,
  BDE_DEAL_DISTRIBUTION_DATA,
} from '../constants/bdeDashboardConstants';

// Timeframe filter options
const FILTER_OPTIONS = ['This Month', 'Last Month', 'This Quarter', 'This Year'];

//===========================================================================================
//    DASHBOARD COMPONENT
//===========================================================================================
export const Dashboard = memo(() => {
  const role = useSelector((state) => state.auth?.role) || USER_ROLES.ADMIN;

  // Header Timeframe filter state
  const [timeFilter, setTimeFilter] = useState('This Month');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Bar chart period & year filter states
  const [revenueTab, setRevenueTab] = useState('Monthly');
  const [selectedYear, setSelectedYear] = useState('2025');

  //===========================================================================================
  //    ROLE-BASED STAT CARDS RESOLVER
  //===========================================================================================
  const currentStatCards = useMemo(() => {
    switch (role) {
      case USER_ROLES.SALES:
        return SALES_STAT_CARDS;
      case USER_ROLES.BDE:
        return BDE_STAT_CARDS;
      case USER_ROLES.ADMIN:
      default:
        return ADMIN_STAT_CARDS;
    }
  }, [role]);

  //===========================================================================================
  //    ROLE-BASED BAR CHART CONFIGURATION
  //===========================================================================================
  const chartConfig = useMemo(() => {
    if (role === USER_ROLES.SALES) {
      return {
        title: 'Monthly vs Yearly Revenue',
        data: revenueTab === 'Monthly' ? SALES_REVENUE_CHART_MONTHLY : SALES_REVENUE_CHART_YEARLY,
      };
    }
    if (role === USER_ROLES.BDE) {
      return {
        title: 'Monthly vs Yearly Revenue',
        data: revenueTab === 'Monthly' ? BDE_REVENUE_CHART_MONTHLY : BDE_REVENUE_CHART_YEARLY,
      };
    }
    return {
      title: 'Lead Volume Pacing',
      data: revenueTab === 'Monthly' ? ADMIN_LEAD_VOLUME_PACING_MONTHLY : ADMIN_LEAD_VOLUME_PACING_YEARLY,
    };
  }, [role, revenueTab]);

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-3 pb-2 sm:pb-0">
      {/* ===========================================================================================
          1. COMMON DASHBOARD HEADER BANNER
      =========================================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex flex-col">
          <h1 className="text-xl sm:text-2xl font-bold text-primary tracking-tight leading-tight">
            Dashboard
          </h1>
          {role === USER_ROLES.BDE ? (
            <p className="text-xs sm:text-sm font-medium text-black-90/70 mt-0.5">
              Welcome, <span className="font-bold text-primary">Johnson Doe</span>. Here's your ecosystem overview
            </p>
          ) : (
            <p className="text-xs sm:text-sm text-black-90/60 font-medium mt-0.5">
              Monitor team performance, leads, pipeline, and sales activity.
            </p>
          )}
        </div>

        {/* Action Controls: Time Filter + Export Button */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Time Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterDropdownOpen((prev) => !prev)}
              className="h-8 inline-flex items-center gap-2 px-3 sm:px-3.5 rounded-[7px] bg-white-100 border-b-2 border-stroke/80 text-xs font-semibold text-black-90 hover:bg-white-100/90 transition-colors cursor-pointer"
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
              <div
                data-ui-style="dropdown-menu"
                data-ui-width="trigger"
                className="absolute top-full left-0 right-0 w-full min-w-full mt-1 bg-white-100 border border-stroke rounded-[7px] p-0 z-30 shadow-none animate-in fade-in zoom-in-95 duration-100"
              >
                {FILTER_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setTimeFilter(option);
                      setIsFilterDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer rounded-none ${
                      timeFilter === option
                        ? 'text-primary bg-primary/10 font-bold'
                        : 'text-black-90 hover:bg-gray/50'
                    }`}
                  >
                    <span className="truncate whitespace-nowrap">{option}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export Action Button */}
          <ExportButton
            variant="white"
            title="Export Overview"
            aria-label="Export Overview"
            className="h-8 w-8"
            size={16}
          />
        </div>
      </div>

      {/* ===========================================================================================
          2. COMMON 4 METRIC KPI STAT CARDS ROW
      =========================================================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {currentStatCards.map((stat) => (
          <StatCard key={stat.id} item={stat} />
        ))}
      </div>

      {/* ===========================================================================================
          3. ROW 2: BAR CHART & RIGHT WIDGET (ROLE CONDITIONAL)
      =========================================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* Universal Bar Chart with Monthly / Yearly switcher and Year selector */}
        <BarChart
          title={chartConfig.title}
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
          data={chartConfig.data}
          yAxisTiers={[80, 60, 40, 20, 0]}
          maxVal={80}
          barColor="bg-secondary hover:bg-primary"
          formatTopValue={(v) => `₹${v}k`}
          renderYAxisTier={(tier) => (
            <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-gray font-semibold text-black-90 text-[10px] sm:text-[11px]">
              <span className="text-primary font-bold">₹</span>
              <span>{tier}k</span>
            </div>
          )}
        />

        {/* Right Widget: Role-specific */}
        {role === USER_ROLES.ADMIN && (
          <LeadStatusBreakdown
            title="Lead Status Breakdown"
            subtitle="Active funnel categorization across pipeline"
            badge="Distribution"
            data={ADMIN_LEAD_STATUS_BREAKDOWN_DATA}
          />
        )}

        {role === USER_ROLES.SALES && <LeadOverviewCard />}

        {role === USER_ROLES.BDE && (
          <DealDistribution
            title="Deal Distribution"
            subtitle="My pipeline by stage"
            badge="19 Deals"
            items={BDE_DEAL_DISTRIBUTION_DATA}
          />
        )}
      </div>

      {/* ===========================================================================================
          4. ROLE-SPECIFIC LOWER ROWS (ADMIN / SALES / BDE)
      =========================================================================================== */}

      {/* --- SUPER ADMIN LOWER ROWS --- */}
      {role === USER_ROLES.ADMIN && (
        <>
          {/* Row 3: Stage Distribution & Lead Source Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
            <LeadStageDistributionCard
              title="Deals Count by Stage Distribution"
              badgeText="Total Deals"
              badgeCount="1,739"
              items={ADMIN_STAGE_DISTRIBUTION_DATA}
            />
            <LeadSourcePerformance
              title="Lead Source Performance & Conversion"
              subtitle="Channel yield and downstream conversion efficiency"
              badge="Conv % & Vol"
              items={ADMIN_LEAD_SOURCE_PERFORMANCE_DATA}
            />
          </div>

          {/* Row 4: Sales Executive & BDE Activity Breakdown */}
          <div className="flex flex-col gap-3 pt-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <h2 className="text-lg sm:text-xl font-bold text-black-90">
                Sales Executive & BDE Activity Breakdown
              </h2>
              <div className="inline-flex items-center gap-2.5 sm:gap-3 px-3.5 py-1.5 rounded-[7px] border-b-2 border-stroke/80 bg-white text-xs font-semibold text-black-90/80 self-start sm:self-auto">
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

          {/* Row 5: Platform & System Health Telemetry */}
          <div className="flex flex-col gap-3 pt-1">
            <h2 className="text-lg sm:text-xl font-bold text-black-90">
              Platform & System Health Telemetry
            </h2>
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
        </>
      )}

      {/* --- SALES MANAGER LOWER ROWS --- */}
      {role === USER_ROLES.SALES && (
        <div>
          <BdePerformanceTable />
        </div>
      )}

      {/* --- BDE LOWER ROWS --- */}
      {role === USER_ROLES.BDE && <Last5LeadsTable />}
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
