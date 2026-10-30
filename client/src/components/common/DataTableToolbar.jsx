//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, Lucide icons, and common SVG action icons.
// ==================================================================================================================
import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, RotateCcw, Plus, Filter, X } from 'lucide-react';
import { ImportIcon } from './icons/ImportIcon';
import { ExportIcon } from './icons/ExportIcon';
import { ExportButton } from './buttons/ExportButton';
import { ViewModeToggle } from './ViewModeToggle';
import { ResetFilterButton } from './buttons/ResetFilterButton';

//==================================================================================================================
//    REUSABLE DATA TABLE TOOLBAR COMPONENT
//    Standard search bar, dynamic status/role filters, view toggles, and bulk action controls.
// ==================================================================================================================
export const DataTableToolbar = ({
  searchQuery = '',
  onSearchChange,
  searchPlaceholder = 'Search here...',
  leftContent = null,
  filters = [],
  onResetFilters,
  viewMode = 'list',
  onViewModeChange,
  showViewToggle = true,
  onImport,
  onExport,
  actionButton,
  importLabel = 'Import',
}) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const toolbarRef = React.useRef(null);

  // Close mobile panels when clicking outside the toolbar
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target)) {
        setIsMobileSearchOpen(false);
        setIsMobileFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Helper to close both mobile search and filter panels
  const closeMobilePanels = () => {
    setIsMobileSearchOpen(false);
    setIsMobileFilterOpen(false);
  };

  return (
    //==================================================================================================================
    //    TOOLBAR CONTAINER
    // ==================================================================================================================
    <div ref={toolbarRef} className="w-full flex flex-col gap-2.5">
      {/* ================================================================================================================
          MOBILE VIEW (< sm)
          Optimized compact controls: icon-only search toggle, filter dropdown with chevron, icon-only actions
      ================================================================================================================ */}
      <div className="sm:hidden flex flex-col gap-2.5 w-full">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between gap-1 w-full">
          {/* Left: Search Icon Button & Filter Icon Button */}
          <div className="flex items-center gap-1 shrink-0">
            {leftContent}
            {/* Animated Search Toggle Button */}
            <button
              type="button"
              onClick={() => {
                setIsMobileSearchOpen((prev) => !prev);
                setIsMobileFilterOpen(false);
              }}
              className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-lg border text-xs font-semibold transition-colors cursor-pointer shadow-2xs ${isMobileSearchOpen
                ? 'bg-primary text-white-100 border-primary'
                : 'bg-white-100 border-stroke text-black-90 hover:border-primary/50'
                }`}
              title="Search"
            >
              <Search size={15} />
            </button>

            {/* Filter Toggle Button with Up/Down Chevron */}
            {filters.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setIsMobileFilterOpen((prev) => !prev);
                  setIsMobileSearchOpen(false);
                }}
                className={`h-8 px-2 shrink-0 flex items-center gap-1 rounded-lg border text-xs font-semibold transition-colors cursor-pointer shadow-2xs ${isMobileFilterOpen
                  ? 'bg-primary text-white-100 border-primary'
                  : 'bg-white-100 border-stroke text-black-90 hover:border-primary/50'
                  }`}
                title="Filters"
              >
                <Filter size={13} />
                {isMobileFilterOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
            )}
          </div>

          {/* Right: View Mode Toggle, Import (Icon Only), Export (Icon Only), Add (Plus Icon Only) */}
          <div className="flex items-center gap-2.5 shrink-0">
            {showViewToggle && (
              <ViewModeToggle
                viewMode={viewMode}
                onViewModeChange={(mode) => {
                  closeMobilePanels();
                  onViewModeChange && onViewModeChange(mode);
                }}
                iconSize={14}
                className="h-8"
              />
            )}

            {/* Import (Icon Only on Mobile) */}
            {onImport && (
              <button
                type="button"
                onClick={() => {
                  closeMobilePanels();
                  onImport();
                }}
                className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg bg-secondary text-white-100 hover:bg-secondary/90 transition-colors shadow-2xs cursor-pointer"
                title={importLabel}
              >
                <ImportIcon size={13} color="currentColor" />
              </button>
            )}

            {/* Export (Icon Only on Mobile) */}
            {onExport && (
              <ExportButton
                onClick={() => {
                  closeMobilePanels();
                  onExport();
                }}
                className="w-8 h-8 sm:w-8 sm:h-8"
                size={13}
                title="Export"
              />
            )}

            {/* Add Action (Plus Icon Only on Mobile) */}
            {actionButton && (
              <button
                type="button"
                onClick={(e) => {
                  closeMobilePanels();
                  actionButton.onClick && actionButton.onClick(e);
                }}
                className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg bg-primary text-white-100 hover:bg-primary/90 transition-colors shadow-2xs cursor-pointer"
                title={actionButton.label}
              >
                {actionButton.icon || <Plus size={15} />}
              </button>
            )}
          </div>
        </div>

        {/* Animated Expandable Search Input Bar */}
        {isMobileSearchOpen && (
          <div className="relative w-full animate-in fade-in slide-in-from-top-1 duration-200">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-black-90/50 pointer-events-none"
            />
            <input
              type="text"
              autoFocus
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-gray border border-stroke rounded-lg text-xs font-medium text-black-90 placeholder:text-black-90/40 focus:outline-none focus:border-primary shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange && onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black-90/40 hover:text-black-90 cursor-pointer"
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}

        {/* Expandable Filter Menu with By Status & Reset */}
        {isMobileFilterOpen && filters.length > 0 && (
          <div className="w-full p-2.5 bg-white-100 border border-stroke rounded-xl shadow-2xs flex items-center gap-2 flex-wrap animate-in fade-in slide-in-from-top-1 duration-200">
            {filters.map((filter) => (
              <div key={filter.id} className="relative flex-1 min-w-[120px] [&>div]:w-full [&_select]:w-full">
                {filter.component ? (
                  filter.component
                ) : (
                  <>
                    <select
                      value={filter.value}
                      onChange={(e) => filter.onChange && filter.onChange(e.target.value)}
                      className="w-full appearance-none bg-gray border border-stroke rounded-lg px-3 py-2 pr-8 text-xs font-medium text-black-90 outline-none cursor-pointer hover:border-primary/50"
                    >
                      {filter.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-primary pointer-events-none"
                    />
                  </>
                )}
              </div>
            ))}

            <ResetFilterButton onReset={onResetFilters} />
          </div>
        )}
      </div>

      {/* ================================================================================================================
          DESKTOP & TABLET VIEW (>= sm)
          Original desktop layout preserved 100% without change
      ================================================================================================================ */}
      <div className="hidden sm:flex sm:flex-col lg:flex-row lg:items-center justify-between gap-3 flex-wrap w-full">
        {/* Left Filter & Search Controls */}
        <div className="flex items-center gap-2.5 flex-wrap flex-1 min-w-0">
          {leftContent}

          {/* Search Input Bar */}
          <div className="relative min-w-[200px] sm:min-w-[240px] flex-1 sm:flex-initial">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-black-90/50 pointer-events-none"
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray border border-stroke rounded-lg text-xs font-medium text-black-90 placeholder:text-black-90/40 focus:outline-none focus:border-primary/50"
            />
          </div>

        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Dynamic Filters (e.g. By Status, By Role) */}
          {filters.map((filter) => (
            <div key={filter.id} className="relative">
              {filter.component ? (
                filter.component
              ) : (
                <React.Fragment>
                  <select
                    value={filter.value}
                    onChange={(e) => filter.onChange && filter.onChange(e.target.value)}
                    className="appearance-none bg-gray border border-stroke rounded-lg px-3 py-2 pr-8 text-xs font-medium text-black-90 outline-none cursor-pointer hover:border-primary/50"
                  >
                    {filter.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-primary pointer-events-none"
                  />
                </React.Fragment>
              )}
            </div>
          ))}

          {/* Reset Filter Button */}
          <ResetFilterButton onReset={onResetFilters} />

          {/* View Mode Toggle (List / Grid) */}
          {showViewToggle && (
            <ViewModeToggle
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
            />
          )}

          {/* Import Action Button */}
          {onImport && (
            <button
              type="button"
              onClick={onImport}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-white-100 text-xs font-semibold hover:bg-secondary/90 transition-colors shadow-2xs cursor-pointer"
            >
              <ImportIcon size={14} color="currentColor" />
              <span>{importLabel}</span>
            </button>
          )}

          {/* Export Action Button */}
          {onExport && (
            <ExportButton
              onClick={onExport}
              title="Export"
              className="h-[34px] w-[34px]"
              size={15}
            />
          )}

          {/* Primary Action Button (Split Dropdown Button matching Image 1 & 2) */}
          {actionButton && (
            <div className="h-[34px] inline-flex items-stretch rounded-lg bg-primary text-white-100 shadow-2xs overflow-hidden shrink-0">
              <button
                type="button"
                onClick={actionButton.onClick}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
              >
                {actionButton.icon || <Plus size={15} />}
                <span>{actionButton.label}</span>
              </button>
              {actionButton.hasDropdown !== false && (
                <button
                  type="button"
                  onClick={actionButton.onDropdownClick || actionButton.onClick}
                  className="px-2 py-2 border-l border-white-100/25 hover:bg-primary/90 transition-colors cursor-pointer flex items-center justify-center text-white-100"
                  title="More actions"
                >
                  <ChevronDown size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTableToolbar;
