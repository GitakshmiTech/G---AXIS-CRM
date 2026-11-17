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
      data-ui-style="joined-control"
      className={`h-8 inline-flex items-center bg-gray p-0.5 rounded-[7px] border-b-2 border-stroke/80 shrink-0 ${className}`.trim()}
    >
      <button
        type="button"
        data-ui-style="filter-tab"
        onClick={() => onViewModeChange && onViewModeChange('list')}
        className={`h-full px-2 rounded-[5px] transition-all cursor-pointer flex items-center justify-center ${
          viewMode === 'list'
            ? 'bg-primary text-white-100'
            : 'text-black-90/60 hover:text-black-90'
        }`}
        title="List view"
        aria-label="List view"
      >
        <List size={iconSize} />
      </button>

      <button
        type="button"
        data-ui-style="filter-tab"
        onClick={() => onViewModeChange && onViewModeChange('grid')}
        className={`h-full px-2 rounded-[5px] transition-all cursor-pointer flex items-center justify-center ${
          viewMode === 'grid'
            ? 'bg-primary text-white-100'
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
