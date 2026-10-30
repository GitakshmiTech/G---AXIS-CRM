import React from 'react';

//==================================================================================================================
//    TABLE CONTAINER COMPONENT
//    Standardized container wrapper with sticky toolbar, independent scrollable table viewport, and pinned pagination.
// ==================================================================================================================
export const TableContainer = React.memo(({
  toolbar,
  children,
  pagination,
  className = '',
  tableScroll = true,
}) => {
  return (
    <div
      className={`bg-white-100 rounded-xl border border-stroke shadow-2xs flex flex-col relative h-full flex-1 min-h-0 justify-between overflow-hidden ${className}`}
    >
      {/* ================================================================================================================== */}
      {/*    Sticky Toolbar Header (Fixed at top with rounded top corners) */}
      {/* ================================================================================================================== */}
      {toolbar && (
        <div className="sticky top-0 z-20 w-full shrink-0">
          <div className="absolute top-0 left-0 w-4 h-4 bg-gray -z-10" />
          <div className="absolute top-0 right-0 w-4 h-4 bg-gray -z-10" />
          <div className="bg-white-100 p-3 rounded-t-xl w-full">
            {toolbar}
          </div>
        </div>
      )}

      {/* ================================================================================================================== */}
      {/*    Scrollable Table Content or Custom Viewport */}
      {/* ================================================================================================================== */}
      {tableScroll ? (
        <div className="flex-1 px-3 w-full overflow-hidden min-h-0 flex flex-col">
          <div className="w-full overflow-auto flex-1 min-h-0 table-scrollbar">
            {children}
          </div>
        </div>
      ) : (
        children
      )}

      {/* ================================================================================================================== */}
      {/*    Pinned Pagination Footer (Fixed at bottom with rounded bottom corners) */}
      {/* ================================================================================================================== */}
      {pagination && (
        <div className="p-3 sm:px-5 bg-white-100 rounded-b-xl shrink-0">
          {pagination}
        </div>
      )}
    </div>
  );
});

export default TableContainer;
