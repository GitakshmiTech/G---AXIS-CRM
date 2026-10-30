//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives and memoization for reusable system health telemetry card
//==================================================================================================================
import React, { memo } from 'react';

//==================================================================================================================
//    SYSTEM HEALTH TELEMETRY CARD COMPONENT (IMAGE 3)
//    Health status monitor card displaying server uptime, engine latency, and diagnostic signals
//==================================================================================================================
export const SystemHealthCard = memo(({
  title,
  status = 'Operational',
  statusVariant = 'success',
  metrics = [],
  className = '',
}) => {
  return (
    <div
      className={`bg-white-100 rounded-xl p-4 sm:p-5 border border-stroke flex flex-col justify-between shadow-2xs select-none ${className}`}
    >
      {/* ==============================================================================================================
          CARD HEADER & HEALTH STATUS BADGE
      ============================================================================================================== */}
      <div className="flex items-start justify-between gap-2 pb-2">
        <h4 className="font-bold text-sm sm:text-[15px] text-black-90 leading-tight">
          {title}
        </h4>

        {status && (
          <span
            className={`inline-flex items-center justify-center h-[23px] px-3 py-1 rounded-[4px] text-xs font-semibold shrink-0 select-none ${
              statusVariant === 'success'
                ? 'bg-success/10 text-success'
                : 'bg-primary/10 text-primary'
            }`}
          >
            {status}
          </span>
        )}
      </div>

      {/* ==============================================================================================================
          KEY-VALUE TELEMETRY METRIC ROWS
      ============================================================================================================== */}
      <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-stroke/40">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between text-xs sm:text-[13px]"
          >
            <span className="font-medium text-black-90/70">
              {metric.label}
            </span>
            <span
              className={`font-bold ${
                metric.isSuccess ? 'text-success' : 'text-black-90'
              }`}
            >
              {metric.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

SystemHealthCard.displayName = 'SystemHealthCard';

//==================================================================================================================
//    DEFAULT EXPORT
//==================================================================================================================
export default SystemHealthCard;
