//==================================================================================================================
//    ACTIVITY CARD COMPONENT
//    Standardized common timeline activity box used across lead and client audit logs
//==================================================================================================================

import React, { memo } from 'react';
import { ChevronRight } from 'lucide-react';
import { EditIcon } from './icons/EditIcon';

//==================================================================================================================
//    ACTIVITY CARD
//==================================================================================================================
export const ActivityCard = memo(({
  title = 'Edited the status of stage.',
  fromStage = 'Stage 1',
  toStage = 'Stage 2',
  description = 'Live deep-dive walk-through of Cloud Data Platform v4 container clustering and multi-tenant security architecture with lead architect.',
  timestamp = 'Edited on Oct 24, 2024 02:30 PM',
  className = '',
}) => {
  return (
    //==================================================================================================================
    //    ACTIVITY CARD CONTAINER
    //==================================================================================================================
    <div
      className={`w-full bg-[#F8F9FC] border border-[#E4E7EC] rounded-2xl p-4 flex items-start gap-3.5 transition-colors ${className}`.trim()}
    >
      {/* Action Icon Graphic */}
      <div className="w-9 h-9 rounded-full bg-white-100 border border-stroke/40 flex items-center justify-center text-primary shrink-0 shadow-2xs mt-0.5">
        <EditIcon className="w-4 h-4 text-primary" />
      </div>

      {/* Content Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs sm:text-[13px] font-bold text-black-90 leading-tight">
          {title}
        </h4>

        {/* Transition Badges (Figma Specs: h-[24px], px-2, rounded-full / 100px, #019F68 10%) */}
        {(fromStage || toStage) && (
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {fromStage && (
              <span className="h-[24px] px-2 inline-flex items-center justify-center rounded-full text-xs font-semibold bg-success/10 text-success select-none">
                {fromStage}
              </span>
            )}
            {fromStage && toStage && (
              <ChevronRight size={14} className="text-black-90/60 shrink-0" strokeWidth={2} />
            )}
            {toStage && (
              <span className="h-[24px] px-2 inline-flex items-center justify-center rounded-full text-xs font-semibold bg-success/10 text-success select-none">
                {toStage}
              </span>
            )}
          </div>
        )}

        {/* Activity Description */}
        {description && (
          <p className="text-xs text-black-90/70 font-normal mt-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Activity Timestamp */}
        {timestamp && (
          <p className="text-[11px] text-black-90/50 mt-2 font-medium">
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
});

export default ActivityCard;
