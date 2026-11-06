import React from 'react';
import { RotateCcw } from 'lucide-react';

export const ResetFilterButton = ({ onReset, className }) => {
  if (!onReset) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        onReset(e);
        window.dispatchEvent(new Event('reset-table-sort'));
      }}
      className={`h-8 inline-flex items-center justify-center gap-1.5 px-3 rounded-[7px] bg-gray border-b-2 border-stroke/80 text-xs font-semibold text-primary hover:bg-gray/80 transition-colors cursor-pointer shrink-0 ${className || ''}`}
      title="Reset filters"
    >
      <span>Reset</span>
      <RotateCcw size={13} className="text-primary shrink-0" />
    </button>
  );
};
