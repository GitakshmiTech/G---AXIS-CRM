//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, memoization, and standardized Admin telemetry data
//==================================================================================================================
import React, { useState, useEffect, useMemo, memo } from 'react';
import { ADMIN_LEAD_STATUS_BREAKDOWN_DATA } from '../../constants/adminDashboardConstants';

//==================================================================================================================
//    LEAD STATUS BREAKDOWN DONUT CHART COMPONENT
//    Round donut chart with exact dimensions from Image 1 & Image 3 (Frame 429), featuring interactive animations
//==================================================================================================================
export const LeadStatusBreakdown = memo(({
  title = 'Lead Status Breakdown',
  subtitle = 'Active funnel categorization across pipeline',
  badge = 'Distribution',
  data = ADMIN_LEAD_STATUS_BREAKDOWN_DATA,
  className = '',
}) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState(null);

  // Trigger smooth entrance animation on mount
  //==================================================================================================================
  //    Lifecycle Effect
  //==================================================================================================================
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 60);
    return () => clearTimeout(timer);
  }, []);

  // Geometry tailored for 220x220 viewBox: slightly thinner border for a spacious inner hole
  // Inner hole diameter is 128px, ensuring text never overlaps or merges into segment colors
  const radius = 80;
  const strokeWidth = 32;
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);

  // Compute donut segment arcs based on relative weights for clockwise display (Image 3)
  const segments = useMemo(() => {
    const items = data.items || [];
    const totalVal = items.reduce((acc, curr) => acc + (curr.value || 0), 0) || 100;
    let accumulatedAngle = -90; // Start at 12 o'clock

    return items.map((item) => {
      const sliceAngle = ((item.value || 0) / totalVal) * 360;
      const strokeLength = ((item.value || 0) / totalVal) * circumference;
      const strokeDashoffset = circumference - strokeLength;
      const rotation = accumulatedAngle;
      accumulatedAngle += sliceAngle;

      return {
        ...item,
        strokeLength,
        strokeDashoffset,
        rotation,
      };
    });
  }, [data.items, circumference]);

  // Legend display order matching Image 1: New -> Contacted -> Qualified -> Converted -> Lost
  const legendItems = useMemo(() => {
    const items = [...(data.items || [])];
    const order = ['new', 'contacted', 'qualified', 'converted', 'lost'];
    return items.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  }, [data.items]);

  // Active state details for dynamic center display on hover
  const activeDetail = useMemo(() => {
    if (!hoveredSegment) return null;
    return (data.items || []).find((i) => i.id === hoveredSegment);
  }, [hoveredSegment, data.items]);

  return (
    <div
      className={`bg-white-100 rounded-xl p-4 sm:p-5 2xl:p-6 border border-stroke flex flex-col justify-between shadow-2xs h-full ${className}`}
    >
      {/* ==============================================================================================================
          CARD HEADER & DISTRIBUTION BADGE (Image 1 / 4)
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
            className="inline-flex items-center px-3.5 py-1.5 border border-stroke rounded-lg text-xs sm:text-[13px] font-medium text-black-90 bg-gray/40 hover:bg-gray transition-colors shadow-3xs cursor-pointer select-none"
          >
            {badge}
          </button>
        )}
      </div>

      {/* ==============================================================================================================
          DONUT CHART & STAGE METRICS LEGEND (Figma Frame 429: 254px x 208px container)
      ============================================================================================================== */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 py-2 sm:py-3 flex-1">
        {/* Left: Interactive Circular Donut Ring (Image 1 Frame 429 & Image 3) */}
        <div className="relative w-[220px] h-[208px] sm:w-[254px] sm:h-[208px] flex items-center justify-center shrink-0">
          <svg
            className={`w-full h-full -rotate-90 transform transition-all duration-700 ease-out ${
              isAnimated ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
            }`}
            viewBox="0 0 220 220"
            aria-hidden="true"
          >
            {/* Background Base Ring Track */}
            <circle
              cx="110"
              cy="110"
              r={radius}
              fill="transparent"
              stroke="var(--color-stroke)"
              strokeOpacity="0.25"
              strokeWidth={strokeWidth}
            />

            {/* Individual Segments with Smooth Steady Hover Interaction */}
            {segments.map((seg, idx) => {
              const isHovered = hoveredSegment === seg.id;

              return (
                <circle
                  key={seg.id || idx}
                  cx="110"
                  cy="110"
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={isHovered ? strokeWidth + 2 : strokeWidth}
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={isAnimated ? seg.strokeDashoffset : circumference}
                  onMouseEnter={() => setHoveredSegment(seg.id)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  className="cursor-pointer"
                  style={{
                    transformOrigin: '110px 110px',
                    transform: `rotate(${seg.rotation + 90}deg)`,
                    transition:
                      'stroke-dashoffset 950ms cubic-bezier(0.16, 1, 0.3, 1), stroke-width 200ms ease, opacity 200ms ease',
                    transitionDelay: isAnimated ? '0ms' : `${idx * 80}ms`,
                    opacity: hoveredSegment ? (isHovered ? 1 : 0.82) : 1,
                  }}
                />
              );
            })}
          </svg>

          {/* Center Lead Count and Description (Stable, smooth cross-fading typography) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none select-none px-4">
            <span className="text-2xl sm:text-[28px] font-black text-black-90 tracking-tight leading-none transition-all duration-200">
              {activeDetail ? activeDetail.count : data.totalCount || '14,820'}
            </span>
            <span
              className={`text-xs mt-1 leading-none transition-colors duration-200 ${
                activeDetail ? 'font-bold text-primary' : 'font-medium text-black-90/60'
              }`}
            >
              {activeDetail
                ? `${activeDetail.label} (${activeDetail.percentage})`
                : data.totalLabel || 'Total Leads'}
            </span>
          </div>
        </div>

        {/* Right: Legend & Metric Percentage Breakdown (Matching Image 1 Order) */}
        <div className="w-full sm:w-auto flex-1 flex flex-col justify-center gap-1.5 sm:gap-2 sm:pl-3">
          {legendItems.map((item) => {
            const isHovered = hoveredSegment === item.id;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredSegment(item.id)}
                onMouseLeave={() => setHoveredSegment(null)}
                className={`flex items-center justify-between text-xs sm:text-sm py-1 px-1.5 rounded-lg transition-colors duration-150 cursor-pointer select-none ${
                  isHovered ? 'bg-gray/80 shadow-3xs' : 'hover:bg-gray/40'
                }`}
              >
                {/* Category Dot & Label */}
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-150 ${item.colorClass} ${
                      isHovered ? 'scale-110 ring-2 ring-stroke' : ''
                    }`}
                    aria-hidden="true"
                  />
                  <span
                    className={`truncate transition-colors ${
                      isHovered ? 'font-bold text-black-90' : 'font-semibold text-black-90/90'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>

                {/* Lead Count & Percentage Tag */}
                <div className="flex items-center gap-1.5 shrink-0 text-right">
                  <span className={`transition-colors ${isHovered ? 'font-black text-primary' : 'font-bold text-black-90'}`}>
                    {item.count}
                  </span>
                  <span className="font-normal text-black-90/60 text-xs">
                    ({item.percentage})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

LeadStatusBreakdown.displayName = 'LeadStatusBreakdown';

//==================================================================================================================
//    DEFAULT EXPORT
//==================================================================================================================
export default LeadStatusBreakdown;

