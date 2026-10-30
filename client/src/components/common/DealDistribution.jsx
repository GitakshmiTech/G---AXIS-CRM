//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React hooks and memo optimization for reusable pipeline deal distribution card.
//==================================================================================================================

import React, { useState, useEffect } from 'react';

//==================================================================================================================
//    REUSABLE DEAL DISTRIBUTION COMPONENT
//    Displays deal pipeline stages with animated progress meters, stage rankings, and valuation tags.
//==================================================================================================================
export const DealDistribution = React.memo(({
  title = 'Deal Distribution',
  subtitle = 'My pipeline by stage',
  badge = '19 Deals',
  headerRight,
  items = [],
  className = '',
}) => {
  const [isAnimated, setIsAnimated] = useState(false);

  // Trigger smooth horizontal expansion animation on mount
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
      {/* ==================================================================================================================
          CARD HEADER & STAGE SUMMARY BADGE
      ================================================================================================================== */}
      <div className="flex items-start justify-between pb-3 border-b border-stroke/60 select-none">
        <div>
          <h3 className="font-bold text-lg text-black-90">{title}</h3>
          {subtitle && (
            <p className="text-xs sm:text-sm font-medium text-black-90/60 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {headerRight ? (
          headerRight
        ) : badge ? (
          <div className="px-3 py-1 border border-stroke rounded-lg text-xs font-semibold text-black-90/70 bg-white-100 shadow-2xs">
            {badge}
          </div>
        ) : null}
      </div>

      {/* ==================================================================================================================
          PIPELINE STAGE ROWS WITH ANIMATED PROGRESS BARS
      ================================================================================================================== */}
      <div className="flex flex-col justify-between flex-1 pt-3 gap-2.5 sm:gap-3">
        {items.map((item, idx) => {
          const itemIndex = item.index ?? idx + 1;
          const displayTitle =
            item.title ||
            (item.stage
              ? `${item.stage} (${item.deals ?? item.count ?? 0} Deals)`
              : '');
          const colorClass =
            item.colorClass ||
            (item.variant === 'alert' || item.color === 'alert'
              ? 'bg-alert'
              : 'bg-success');
          const percent = item.percent ?? 0;

          return (
            <div key={item.id ?? idx} className="flex flex-col gap-1.5">
              {/* Stage Ranking, Stage Name & Metric Value Badge */}
              <div className="flex items-center justify-between text-xs sm:text-sm select-none">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary">{itemIndex}</span>
                  <span className="font-bold text-black-90">{displayTitle}</span>
                </div>
                {item.value && (
                  <div className="px-2 py-0.5 border border-stroke/80 rounded text-xs font-bold text-primary bg-white-100 shadow-2xs">
                    {item.value}
                  </div>
                )}
              </div>

              {/* Progress Track & Animated Color Bar */}
              <div className="w-full bg-stroke/40 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${colorClass}`}
                  style={{
                    width: isAnimated ? `${percent}%` : '0%',
                    transition: 'width 900ms cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: `${idx * 50}ms`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

//==================================================================================================================
//    DEFAULT EXPORT
//==================================================================================================================
export default DealDistribution;
