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
      className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-stroke bg-gray text-xs font-semibold text-primary hover:bg-gray-50 hover:border-primary/50 transition-colors cursor-pointer shrink-0 ${className || ''}`}
      title="Reset filters"
    >
      <span>Reset</span>
      <RotateCcw size={13} className="text-primary shrink-0" />
    </button>
  );
};
