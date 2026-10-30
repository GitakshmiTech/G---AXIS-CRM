//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, memoization, and telemetry mock data
//==================================================================================================================
import React, { useState, useEffect, memo } from 'react';
import { ADMIN_LEAD_SOURCE_PERFORMANCE_DATA } from '../../constants/adminDashboardConstants';

//==================================================================================================================
//    LEAD SOURCE PERFORMANCE & CONVERSION COMPONENT (Image 5 Right)
//    Channel yield and downstream conversion efficiency with animated progress meters
//==================================================================================================================
export const LeadSourcePerformance = memo(({
  title = 'Lead Source Performance & Conversion',
  subtitle = 'Channel yield and downstream conversion efficiency',
  badge = 'Conv % & Vol',
  items = ADMIN_LEAD_SOURCE_PERFORMANCE_DATA,
  className = '',
}) => {
  const [isAnimated, setIsAnimated] = useState(false);

  // Trigger smooth expansion animation on mount
  //==================================================================================================================
  //    Lifecycle Effect
  //==================================================================================================================
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 60);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`bg-white-100 rounded-xl p-4 sm:p-5 2xl:p-6 border border-stroke flex flex-col justify-between shadow-2xs h-full ${className}`}
    >
      {/* ==============================================================================================================
          CARD HEADER & METRIC TOGGLE BADGE
      ============================================================================================================== */}
      <div className="flex items-start justify-between pb-3 border-b border-stroke/60 select-none">
        <div>
          <h3 className="font-bold text-lg text-black-90">{title}</h3>
          {subtitle && (
            <p className="text-xs sm:text-sm font-medium text-black-90/60 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {badge && (
          <button
            type="button"
            className="inline-flex items-center px-3.5 py-1.5 rounded-lg border border-stroke bg-gray/40 hover:bg-gray transition-colors text-xs sm:text-[13px] font-medium text-black-90 shadow-3xs select-none cursor-pointer"
          >
            {badge}
          </button>
        )}
      </div>

      {/* ==============================================================================================================
          LEAD SOURCE CHANNELS LIST WITH PROGRESS METERS
      ============================================================================================================== */}
      <div className="flex flex-col justify-between flex-1 pt-3 gap-3 sm:gap-3.5">
        {items.map((item, idx) => (
          <div key={item.id ?? idx} className="flex flex-col gap-1.5">
            {/* Channel Source, Total Leads & Conversion Rate Tag */}
            <div className="flex items-center justify-between text-xs sm:text-sm select-none">
              <span className="font-medium text-black-90">
                {item.source}
              </span>

              <div className="flex items-center gap-2">
                <span className="font-bold text-black-90">
                  {item.leads}
                </span>
                {item.conversionRate && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold text-success bg-success/10 border border-success/20">
                    {item.conversionRate}
                  </span>
                )}
              </div>
            </div>

            {/* Progress Track & Animated Blue Bar */}
            <div className="w-full bg-[#E5E7EB] dark:bg-stroke/40 rounded-full h-2 sm:h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${item.colorClass || 'bg-primary'}`}
                style={{
                  width: isAnimated ? `${item.percent}%` : '0%',
                  transition: 'width 900ms cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: `${idx * 50}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

LeadSourcePerformance.displayName = 'LeadSourcePerformance';

//==================================================================================================================
//    DEFAULT EXPORT
//==================================================================================================================
export default LeadSourcePerformance;
