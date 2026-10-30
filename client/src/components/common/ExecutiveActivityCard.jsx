//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, hooks, and memoization for reusable activity box component
//==================================================================================================================
import React, { useState, useEffect, memo } from 'react';

//==================================================================================================================
//    EXECUTIVE ACTIVITY CARD COMPONENT (IMAGE 2)
//    Individual sales executive card with multi-layer progress meters for Leads, Deals, and Won outcomes
//==================================================================================================================
export const ExecutiveActivityCard = memo(({
  name,
  region,
  leads,
  deals,
  won,
  leadsPercent = 75,
  dealsPercent = 25,
  wonPercent = 8,
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
      className={`bg-white-100 rounded-xl p-4 sm:p-4.5 border border-stroke flex flex-col justify-between shadow-2xs select-none ${className}`}
    >
      {/* ==============================================================================================================
          EXECUTIVE HEADER & METRIC SUMMARY
      ============================================================================================================== */}
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-bold text-sm sm:text-[15px] text-black-90 truncate">
          {name}
        </h4>

        <div className="flex items-center gap-2 sm:gap-2.5 text-xs sm:text-[13px] shrink-0">
          <span>
            <strong className="font-bold text-black-90">{leads}</strong>{' '}
            <span className="font-medium text-black-90/70">Leads</span>
          </span>
          <span>
            <strong className="font-bold text-black-90">{deals}</strong>{' '}
            <span className="font-medium text-black-90/70">Deals</span>
          </span>
          <span className="font-bold text-success">
            {won} Won
          </span>
        </div>
      </div>

      {/* Region / Segment Subtitle */}
      <p className="text-xs font-medium text-black-90/60 mt-0.5">
        {region}
      </p>

      {/* ==============================================================================================================
          THREE STACKED PERFORMANCE METERS (Leads Handled, Deals Handled, Won Deals)
      ============================================================================================================== */}
      <div className="flex flex-col gap-1.5 sm:gap-2 mt-3.5">
        {/* Meter 1: Leads Handled (Dark Blue) */}
        <div className="w-full bg-[#E5E7EB] dark:bg-stroke/40 rounded-full h-1.5 sm:h-2 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary"
            style={{
              width: isAnimated ? `${leadsPercent}%` : '0%',
              transition: 'width 900ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>

        {/* Meter 2: Deals Handled (Light Blue) */}
        <div className="w-full bg-[#E5E7EB] dark:bg-stroke/40 rounded-full h-1.5 sm:h-2 overflow-hidden">
          <div
            className="h-full rounded-full bg-secondary"
            style={{
              width: isAnimated ? `${dealsPercent}%` : '0%',
              transition: 'width 900ms cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: '80ms',
            }}
          />
        </div>

        {/* Meter 3: Won Deals (Green) */}
        <div className="w-full bg-[#E5E7EB] dark:bg-stroke/40 rounded-full h-1.5 sm:h-2 overflow-hidden">
          <div
            className="h-full rounded-full bg-success"
            style={{
              width: isAnimated ? `${wonPercent}%` : '0%',
              transition: 'width 900ms cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: '160ms',
            }}
          />
        </div>
      </div>
    </div>
  );
});

ExecutiveActivityCard.displayName = 'ExecutiveActivityCard';

//==================================================================================================================
//    DEFAULT EXPORT
//==================================================================================================================
export default ExecutiveActivityCard;
