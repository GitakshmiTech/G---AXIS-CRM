//==================================================================================================================
//    LEAD SUMMARY CARD COMPONENT
//    Standard reusable card for displaying lead profile, company summary, tags, and priority badge
//==================================================================================================================

import React, { memo } from 'react';

//==================================================================================================================
//    LEAD SUMMARY CARD
//==================================================================================================================
export const LeadSummaryCard = memo(({
  avatar,
  avatarClassName = 'rounded-full',
  title = '',
  subtitle = '',
  subline = '',
  address = '',
  priority = '',
  products = [],
  className = '',
}) => {
  return (
    <div
      className={`w-full bg-gray/50 border border-stroke/50 rounded-xl p-3.5 flex items-start gap-3.5 transition-colors ${className}`.trim()}
    >
      {/* Profile / Company Avatar */}
      {avatar && (
        <img
          src={avatar}
          alt={title}
          className={`w-12 h-12 ${avatarClassName} object-cover shrink-0 border border-stroke/40`}
        />
      )}

      {/* Details Container */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          {/* Title and Subtitle */}
          <div className="flex items-center gap-1.5 min-w-0">
            <h4 className="text-sm font-bold text-black-90 truncate">{title}</h4>
            {subtitle && (
              <span className="text-xs text-black-90/50 font-normal shrink-0">
                {subtitle}
              </span>
            )}
          </div>

          {/* Priority Badge */}
          {priority && (
            <span className="px-3 py-0.5 rounded-[7px] text-xs font-semibold bg-warning/10 text-warning shrink-0">
              {priority}
            </span>
          )}
        </div>

        {/* Secondary Subline (Designation, Contact Info, Employees) */}
        {subline && (
          <p className="text-xs text-black-90/60 font-normal mt-0.5 truncate">
            {subline}
          </p>
        )}

        {/* Address / Location Info */}
        {address && (
          <p className="text-xs text-black-90/60 font-normal mt-0.5 truncate">
            {address}
          </p>
        )}

        {/* Product Interest Tags */}
        {products && products.length > 0 && (
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {products.map((item, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-md bg-white-100 text-primary text-[11px] font-semibold shadow-2xs"
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default LeadSummaryCard;
