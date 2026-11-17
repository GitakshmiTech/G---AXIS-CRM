//==================================================================================================================
//    RESET FILTER BUTTON COMPONENT
//    Shared action button used across all CRM tables to reset filters and trigger smooth rotation animation
//==================================================================================================================
import React, { useState, memo, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';

export const ResetFilterButton = memo(({ onReset, className }) => {
  const [rotation, setRotation] = useState(0);

  if (!onReset) return null;

  const handleClick = useCallback((e) => {
    setRotation((prev) => prev - 360);
    onReset(e);
    window.dispatchEvent(new Event('reset-table-sort'));
  }, [onReset]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`h-8 inline-flex items-center justify-center gap-1.5 px-3 rounded-[7px] bg-gray border-b-2 border-stroke/80 text-xs font-semibold text-primary hover:bg-gray/80 transition-colors cursor-pointer shrink-0 ${className || ''}`}
      title="Reset filters"
      aria-label="Reset filters"
    >
      <span>Reset</span>
      <RotateCcw
        size={13}
        className="text-primary shrink-0 transition-transform duration-1000 ease-in-out"
        style={{ transform: `rotate(${rotation}deg)` }}
      />
    </button>
  );
});

ResetFilterButton.displayName = 'ResetFilterButton';
export default ResetFilterButton;
