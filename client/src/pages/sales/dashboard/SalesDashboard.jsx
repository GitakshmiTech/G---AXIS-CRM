//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, Lucide icons, common telemetry cards and charts
//==================================================================================================================
import React, { useState, useMemo, memo } from 'react';
import { ChevronDown, Upload } from 'lucide-react';
import { StatCard } from '../../../components/common/StatCard';
import { BarChart } from '../../../components/common/BarChart';
import { LeadOverviewCard } from './components/LeadOverviewCard';
import { BdePerformanceTable } from './components/BdePerformanceTable';
import {
  SALES_STAT_CARDS,
  SALES_REVENUE_CHART_MONTHLY,
  SALES_REVENUE_CHART_YEARLY,
} from '../../../constants/salesDashboardConstants';

//==================================================================================================================
//    SALES DASHBOARD COMPONENT
//    Executive sales telemetry hub matching Image 1 to Image 5 specifications
//==================================================================================================================
export const SalesDashboard = memo(() => {
  // Chart timeframe state: 'monthly' | 'yearly'
  const [revenuePeriod, setRevenuePeriod] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [timeFilter, setTimeFilter] = useState('This Month');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Filter options
  const FILTER_OPTIONS = ['This Month', 'Last Month', 'This Quarter', 'This Year'];

  // Current revenue dataset based on toggle
  const currentRevenueData = useMemo(() => {
    return revenuePeriod === 'monthly'
      ? SALES_REVENUE_CHART_MONTHLY
      : SALES_REVENUE_CHART_YEARLY;
  }, [revenuePeriod]);

  return (
    <div className="flex flex-col gap-4 sm:gap-5 pb-3 sm:pb-0">
      {/* ==============================================================================================================
          1. DASHBOARD PAGE HEADER (Image 2)
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
              className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-lg border border-stroke text-xs sm:text-sm font-semibold text-black-90 bg-white-100 hover:bg-gray/50 transition-colors cursor-pointer shadow-3xs"
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
                    className={`w-full text-left px-3.5 py-1.5 text-xs font-medium transition-colors ${
                      timeFilter === option
                        ? 'bg-primary/10 text-primary font-semibold'
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
          <button
            type="button"
            onClick={() => console.log('Export telemetry report')}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg bg-secondary text-white-100 hover:bg-secondary/90 transition-all duration-200 text-xs sm:text-sm font-semibold cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <Upload size={15} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* ==============================================================================================================
          2. METRIC TILES GRID (Image 3)
      ============================================================================================================== */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-4">
        {SALES_STAT_CARDS.map((card) => (
          <StatCard
            key={card.id}
            title={card.title}
            value={card.value}
            subText={card.subText}
            trendType={card.trendType}
            colorKey={card.colorKey}
            icon={card.icon}
          />
        ))}
      </div>

      {/* ==============================================================================================================
          3. CHARTS ROW: REVENUE BAR CHART & LEAD OVERVIEW (Image 4)
      ============================================================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* Left: Monthly vs Yearly Revenue Bar Chart */}
        <BarChart
          title="Monthly vs Yearly Revenue"
          data={currentRevenueData}
          yAxisTiers={[80, 60, 40, 20, 0]}
          maxVal={80}
          barColor="bg-secondary hover:bg-primary"
          renderYAxisTier={(tier) => (
            <span className="text-secondary font-medium text-[11px]">
              ₹ {tier}k
            </span>
          )}
          headerRight={
            <div className="flex items-center gap-2 select-none">
              {/* Monthly / Yearly Toggle Pill */}
              <div className="inline-flex items-center p-0.5 rounded-lg border border-stroke bg-gray">
                <button
                  type="button"
                  onClick={() => setRevenuePeriod('monthly')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    revenuePeriod === 'monthly'
                      ? 'bg-primary text-white-100 shadow-3xs'
                      : 'text-black-90/70 hover:text-black-90'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setRevenuePeriod('yearly')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    revenuePeriod === 'yearly'
                      ? 'bg-primary text-white-100 shadow-3xs'
                      : 'text-black-90/70 hover:text-black-90'
                  }`}
                >
                  Yearly
                </button>
              </div>

              {/* Year Select Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-stroke text-xs font-semibold text-black-90 bg-white-100 hover:bg-gray/40 transition-colors cursor-pointer"
                >
                  <span>{selectedYear}</span>
                  <ChevronDown size={13} className="text-black-90/60" />
                </button>
              </div>
            </div>
          }
        />

        {/* Right: Lead Overview Segmented Distribution */}
        <LeadOverviewCard />
      </div>

      {/* ==============================================================================================================
          4. BDE PERFORMANCE TABLE (Image 5)
      ============================================================================================================== */}
      <div>
        <BdePerformanceTable />
      </div>
    </div>
  );
});

SalesDashboard.displayName = 'SalesDashboard';

export default SalesDashboard;
