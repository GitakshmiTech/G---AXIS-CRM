//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, hooks, and memoization for Stage Distribution card matching Image 4
//==================================================================================================================
import React, { useState, useEffect, memo } from 'react';
import { ADMIN_STAGE_DISTRIBUTION_DATA } from '../../constants/adminDashboardConstants';

//==================================================================================================================
//    LEAD STAGE DISTRIBUTION CARD COMPONENT (IMAGE 4 LEFT)
//    Single-line horizontal pipeline stages with inline progress meters matching Image 4
//==================================================================================================================
export const LeadStageDistributionCard = memo(({
  title = 'Deals Count by Stage Distribution',
  badgeText = 'Total Deals',
  badgeCount = '1,739',
  items = ADMIN_STAGE_DISTRIBUTION_DATA,
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
          CARD HEADER & TOTAL DEALS BADGE (IMAGE 4)
      ============================================================================================================== */}
      <div className="flex items-center justify-between pb-3 border-b border-stroke/60 select-none">
        <h3 className="font-bold text-lg text-black-90 leading-tight">
          {title}
        </h3>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-stroke bg-gray/40 text-xs sm:text-[13px] shadow-3xs select-none">
          <span className="font-medium text-black-90">{badgeText}</span>
          <span className="font-bold text-primary">{badgeCount}</span>
        </div>
      </div>

      {/* ==============================================================================================================
          INLINE HORIZONTAL STAGE ROWS WITH ANIMATED TRACKS (IMAGE 4)
      ============================================================================================================== */}
      <div className="flex flex-col justify-between flex-1 pt-3 gap-2 sm:gap-2.5">
        {items.map((item, idx) => (
          <div
            key={item.id ?? idx}
            className="flex items-center justify-between text-xs sm:text-[13px] select-none"
          >
            {/* Stage Label on Left */}
            <span
              className={`w-[170px] sm:w-[195px] shrink-0 truncate ${
                item.textColor || 'text-black-90 font-medium'
              }`}
            >
              {item.label}
            </span>

            {/* Middle Progress Track & Animated Color Bar */}
            <div className="flex-1 bg-[#E5E7EB] dark:bg-stroke/40 rounded-full h-2 sm:h-2.5 overflow-hidden mx-2.5 sm:mx-3">
              <div
                className={`h-full rounded-full ${item.barColor || 'bg-primary'}`}
                style={{
                  width: isAnimated ? `${item.percent}%` : '0%',
                  transition: 'width 900ms cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: `${idx * 40}ms`,
                }}
              />
            </div>

            {/* Percentage on Right */}
            <span
              className={`w-12 text-right font-semibold shrink-0 ${
                item.valueColor || 'text-black-90/70'
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

LeadStageDistributionCard.displayName = 'LeadStageDistributionCard';

//==================================================================================================================
//    DEFAULT EXPORT
//==================================================================================================================
export default LeadStageDistributionCard;
