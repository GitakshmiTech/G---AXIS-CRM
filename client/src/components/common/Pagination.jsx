//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, Lucide chevron icons for page navigation controls.
// ==================================================================================================================
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

//==================================================================================================================
//    REUSABLE PAGINATION COMPONENT
//    Renders entry counts and numeric pagination buttons with responsive controls.
// ==================================================================================================================
export const Pagination = ({
  currentPage = 1,
  totalEntries = 180,
  pageSize = 10,
  onPageChange,
  className = '',
}) => {
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const currentCount = Math.min(pageSize, totalEntries);

  // Generate page numbers array with ellipsis when applicable
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, '...', totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage, '...', totalPages];
  };

  return (
    //==================================================================================================================
    //    PAGINATION BAR CONTAINER
    // ==================================================================================================================
    <div
      className={`flex flex-col bg-white sm:flex-row items-center justify-between gap-3 py-1.5 px-1 text-xs text-black-90/60 font-medium ${className}`}
    >
      {/* Current Entries Summary */}
      <p>
        Showing <span className="font-bold text-black-90">{currentCount}</span> out of{' '}
        <span className="font-bold text-black-90">{totalEntries}</span> Entries
      </p>

      {/* Action Navigation Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous Page Button */}
        <button
          type="button"
          onClick={() => onPageChange && onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          title='previous'
          className="w-7 h-7 rounded-lg bg-gray border border-stroke flex items-center justify-center hover:bg-gray/80 transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>

        {/* Numeric Page Buttons */}
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-7 h-7 flex items-center justify-center text-black-90/50"
              >
                ...
              </span>
            );
          }

          const isActive = currentPage === page;

          return (
            <button
              key={`page-${page}`}
              type="button"
              onClick={() => onPageChange && onPageChange(page)}
              className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center transition-colors cursor-pointer ${
                isActive
                  ? 'bg-primary text-white-100 shadow-2xs'
                  : 'bg-gray border border-stroke hover:bg-gray/80 text-black-90'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}

        {/* Next Page Button */}
        <button
          type="button"
          onClick={() => onPageChange && onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          title='next'
          className="w-7 h-7 rounded-lg bg-gray border border-stroke flex items-center justify-center hover:bg-gray/80 transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
