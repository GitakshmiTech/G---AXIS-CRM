//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives and memoization for mobile header
//==================================================================================================================
import React, { memo } from 'react';

//==================================================================================================================
//    MOBILE PAGE HEADER COMPONENT
//    Standardized mobile header displaying page title and subtitle below TopHeader with 12px (px-3) side padding.
//    Hidden on desktop/tablet (sm:hidden) where titles are rendered inside TopHeader.
//==================================================================================================================
export const MobilePageHeader = memo(({ title, subtitle, className = '' }) => {
  if (!title && !subtitle) return null;

  return (
    <div className={`sm:hidden px-3 pt-0 pb-2 flex flex-col shrink-0 select-none ${className}`}>
      {title && (
        <h1 className="text-lg font-bold text-primary leading-tight">
          {title}
        </h1>
      )}
      {subtitle && (
        <p className="text-xs text-black-90/50 font-medium leading-tight mt-0.5">
          {subtitle}
        </p>
      )}
    </div>
  );
});

//==================================================================================================================
//    DEFAULT EXPORT
//==================================================================================================================
export default MobilePageHeader;
