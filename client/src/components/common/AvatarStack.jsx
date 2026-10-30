//==================================================================================================================
//    AVATAR STACK COMPONENT
//    Standardized overlapping avatar cluster with counter bubble for stakeholders & team members
//==================================================================================================================

import React, { memo } from 'react';

//==================================================================================================================
//    AVATAR STACK
//==================================================================================================================
export const AvatarStack = memo(({
  avatars = [],
  extraCount = 0,
  maxVisible = 4,
  size = 'w-7 h-7',
  className = '',
}) => {
  const visibleAvatars = avatars.slice(0, maxVisible);

  return (
    <div className={`flex items-center -space-x-2 shrink-0 ${className}`.trim()}>
      {visibleAvatars.map((url, idx) => (
        <img
          key={idx}
          src={url}
          alt="Stakeholder"
          className={`${size} rounded-full object-cover border-2 border-white-100 shrink-0 shadow-2xs`}
        />
      ))}
      {extraCount > 0 && (
        <div
          className={`${size} rounded-full bg-black-90 text-white-100 text-[11px] font-bold flex items-center justify-center border-2 border-white-100 shrink-0 shadow-2xs select-none`}
        >
          +{extraCount}
        </div>
      )}
    </div>
  );
});

export default AvatarStack;
