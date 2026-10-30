//==================================================================================================================
//    VIEW MODE TOGGLE COMPONENT
//    Toggle between list and grid view representations for data tables and card layouts
//==================================================================================================================

import React, { memo } from 'react';
import { List, LayoutGrid } from 'lucide-react';

export const ViewModeToggle = memo(({
  viewMode = 'list',
  onViewModeChange,
  iconSize = 15,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center bg-gray p-0.5 rounded-lg border border-stroke shrink-0 ${className}`.trim()}
    >
      <button
        type="button"
        onClick={() => onViewModeChange && onViewModeChange('list')}
        className={`p-1.5 rounded-md transition-all cursor-pointer ${
          viewMode === 'list'
            ? 'bg-primary text-white-100 shadow-2xs'
            : 'text-black-90/60 hover:text-black-90'
        }`}
        title="List view"
        aria-label="List view"
      >
        <List size={iconSize} />
      </button>

      <button
        type="button"
        onClick={() => onViewModeChange && onViewModeChange('grid')}
        className={`p-1.5 rounded-md transition-all cursor-pointer ${
          viewMode === 'grid'
            ? 'bg-primary text-white-100 shadow-2xs'
            : 'text-black-90/60 hover:text-black-90'
        }`}
        title="Grid view"
        aria-label="Grid view"
      >
        <LayoutGrid size={iconSize} />
      </button>
    </div>
  );
});

export default ViewModeToggle;
