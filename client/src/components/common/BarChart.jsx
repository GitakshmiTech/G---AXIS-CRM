//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React hooks, icons, and layout utilities for reusable column bar chart.
// ==================================================================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { User } from 'lucide-react';

//==================================================================================================================
//    REUSABLE BAR CHART COMPONENT
//    Universal column bar chart with custom y-axis tiers, dashed gridlines, and animated vertical bars.
// ==================================================================================================================
export const BarChart = React.memo(({
  title,
  headerRight,
  data = [],
  yAxisTiers = [500, 100, 50, 10, 0],
  maxVal = 500,
  barColor = 'bg-secondary hover:bg-primary',
  renderBottomLabel,
  renderYAxisTier,
  formatTopValue,
  barWidthClass = 'max-w-[20px] sm:max-w-[24px]',
  className = '',
}) => {
  const [isAnimated, setIsAnimated] = useState(false);

  // Trigger smooth entrance animation on mount.
  //==================================================================================================================
  //    Lifecycle Effect
  //==================================================================================================================
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 60);
    return () => clearTimeout(timer);
  }, []);

  // Compute maximum scaling value safely
  const effectiveMax = useMemo(() => {
    if (maxVal && maxVal > 0) return maxVal;
    const maxInData = Math.max(...data.map((d) => d.value ?? d.users ?? d.v ?? 0), 100);
    return maxInData;
  }, [maxVal, data]);

  return (
    <div
      className={`bg-white-100 rounded-xl p-4 sm:p-5 2xl:p-6 border border-stroke flex flex-col justify-between shadow-2xs h-full ${className}`}
    >
      {/* Chart Header & Action/Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 2xl:mb-6 gap-3">
        {typeof title === 'string' ? (
          <h3 className="font-bold text-lg text-black-90">{title}</h3>
        ) : (
          title
        )}

        {headerRight && (
          <div className="flex items-center gap-2 flex-wrap">
            {headerRight}
          </div>
        )}
      </div>

      {/* Chart Canvas & Scrollable Bar Area */}
      <div className="overflow-x-auto sm:overflow-x-hidden w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="h-[210px] 2xl:h-[250px] min-w-[420px] sm:min-w-0 relative flex flex-col justify-between pt-1 pb-11 2xl:pb-14">
          {/* Background Dashed Gridlines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-11 2xl:pb-14">
            {yAxisTiers.map((tier) => (
              <div
                key={tier}
                className="w-full flex items-center border-b border-dashed border-stroke/50"
                style={{ height: '0px' }}
              />
            ))}
          </div>

          {/* Chart Content Area */}
          <div className="flex h-full w-full relative z-10">
            {/* Y-Axis Indicator Column */}
            <div className="w-14 sm:w-16 h-full flex flex-col justify-between text-[10px] sm:text-[11px] font-medium pr-1 select-none flex-shrink-0 sticky left-0 bg-white-100 z-20">
              {yAxisTiers.map((tier) => (
                <div key={tier} className="flex items-center">
                  {renderYAxisTier ? (
                    renderYAxisTier(tier)
                  ) : (
                    <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-gray text-black-90">
                      <User size={11} className="text-primary flex-shrink-0" />
                      <span>{tier}</span>
                    </div>
                  )}
                </div>
              ))}

              {/* Bottom Mask under sticky Y-axis to prevent scrolled X-axis labels from leaking into fixed area */}
              <div
                className="absolute -bottom-11 2xl:-bottom-14 left-0 w-full h-11 2xl:h-14 bg-white-100 pointer-events-none z-20"
                aria-hidden="true"
              />
            </div>

            {/* Bars Container */}
            <div className="flex-1 flex items-end justify-between pl-2 sm:pl-4 gap-1.5 sm:gap-2 h-full w-full min-w-0">
              {data.map((item, index) => {
                const itemValue = item.value ?? item.users ?? item.v ?? 0;
                const barHeightPct = Math.max(
                  8,
                  Math.min(100, Math.round((itemValue / effectiveMax) * 100))
                );

                return (
                  <div
                    key={`${item.label || item.product || item.m || index}-${index}`}
                    className="flex-1 flex flex-col items-center justify-end h-full relative group min-w-0"
                  >
                    {/* Metric Value Label on Top of Bar */}
                    <span
                      className={`text-[10px] sm:text-xs font-semibold text-black-90 mb-1.5 transition-all duration-500 whitespace-nowrap ${
                        isAnimated
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-2'
                      }`}
                      style={{ transitionDelay: `${index * 60 + 200}ms` }}
                    >
                      {formatTopValue ? formatTopValue(itemValue, item) : item.displayValue ?? itemValue}
                    </span>

                    {/* Vertical Column Bar */}
                    <div
                      className={`w-full ${barWidthClass} rounded-full cursor-pointer shadow-xs ${barColor}`}
                      style={{
                        height: isAnimated ? `${barHeightPct}%` : '0%',
                        transition:
                          'height 900ms cubic-bezier(0.16, 1, 0.3, 1), background-color 200ms',
                        transitionDelay: `${index * 60}ms`,
                      }}
                    />

                    {/* Bottom Label Container */}
                    <div className="absolute -bottom-9 2xl:-bottom-10 flex items-center justify-center whitespace-nowrap select-none">
                      {renderBottomLabel ? (
                        renderBottomLabel(item, index)
                      ) : item.icon ? (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray text-black-90 text-[10px] sm:text-[11px] font-medium whitespace-nowrap">
                          {React.createElement(item.icon, {
                            size: 12,
                            className: 'text-primary flex-shrink-0',
                          })}
                          <span>{item.label || item.product || item.m}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] sm:text-xs font-medium text-black-90/80">
                          {item.label || item.product || item.m}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

//==================================================================================================================
//    DEFAULT EXPORT
// ==================================================================================================================
export default BarChart;
