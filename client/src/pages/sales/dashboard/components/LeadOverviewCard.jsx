//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, memoization, and telemetry data
//==================================================================================================================
import React, { memo } from 'react';
import { SALES_LEAD_OVERVIEW_DATA } from '../../../../constants/salesDashboardConstants';

//==================================================================================================================
//    LEAD OVERVIEW CARD COMPONENT (Image 4 Right)
//    Segmented pipeline stage distribution with individual breakdown stats
//==================================================================================================================
export const LeadOverviewCard = memo(({ data = SALES_LEAD_OVERVIEW_DATA, className = '' }) => {
  return (
    <div
      className={`bg-white-100 rounded-xl p-4 sm:p-5 2xl:p-6 border border-stroke flex flex-col justify-between shadow-2xs h-full ${className}`}
    >
      {/* ==============================================================================================================
          Card Header
      ============================================================================================================== */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-col">
          <h3 className="font-bold text-lg text-black-90 leading-tight">
            Lead Overview
          </h3>
          <p className="text-xs text-black-90/60 font-medium mt-0.5">
            Team lead stage distribution
          </p>
        </div>

        <span className="px-3 py-1 rounded-lg border border-stroke text-xs font-semibold text-black-90 bg-gray/40 select-none">
          {data.totalBadge}
        </span>
      </div>

      {/* ==============================================================================================================
          Segmented Horizontal Progress Bar
      ============================================================================================================== */}
      <div className="w-full flex h-3.5 rounded-full overflow-hidden my-3 bg-gray gap-[2px]">
        {data.stages.map((stage, idx) => (
          <div
            key={stage.id}
            title={`${stage.label}: ${stage.percentage} (${stage.count})`}
            className={`h-full ${stage.colorClass} transition-all duration-500 first:rounded-l-full last:rounded-r-full`}
            style={{ width: stage.percentage }}
          />
        ))}
      </div>

      {/* ==============================================================================================================
          Stage Legend / Metrics Breakdown
      ============================================================================================================== */}
      <div className="flex flex-col w-full mt-2">
        {/* Table Subheaders */}
        <div className="flex items-center justify-between pb-2 border-b border-stroke/50 text-[11px] font-semibold text-black-90/50 uppercase tracking-wider select-none">
          <span>Pipeline Inflow</span>
          <span>Conversion / Drop</span>
        </div>

        {/* Stage Metric Rows */}
        <div className="flex flex-col divide-y divide-stroke/30">
          {data.stages.map((stage) => (
            <div
              key={stage.id}
              className="flex items-center justify-between py-2 sm:py-2.5 text-xs transition-colors hover:bg-gray/30 px-1 rounded-md"
            >
              {/* Left: Stage Indicator Dot & Label */}
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${stage.dotColorClass}`}
                  aria-hidden="true"
                />
                <span className="font-semibold text-black-90 truncate">
                  {stage.label}
                </span>
              </div>

              {/* Right: Count Badge & Percentage */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="px-3 py-0.5 min-w-[42px] text-center rounded-md border border-stroke/80 text-xs font-bold text-primary bg-white-100 shadow-3xs">
                  {stage.count}
                </span>
                <span className="text-xs font-semibold text-black-90/70 w-12 text-right">
                  {stage.percentage}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

LeadOverviewCard.displayName = 'LeadOverviewCard';

export default LeadOverviewCard;
