//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, Lucide icons, and common SVG action icons.
// ==================================================================================================================
import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, RotateCcw, Plus, Filter, X } from 'lucide-react';
import { ImportIcon } from '../icons/ImportIcon';
import { ExportIcon } from '../icons/ExportIcon';
import { ExportButton } from '../buttons/ExportButton';
import { ViewModeToggle } from '../common/ViewModeToggle';
import { ResetFilterButton } from '../buttons/ResetFilterButton';
import { TableFilterSelect } from './TableFilterSelect';
import { exportToCSV } from '../../utils/exportUtils';

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
  const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);
  const toolbarRef = useRef(null);
  const actionDropdownRef = useRef(null);

  // Close mobile panels and action dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target)) {
        setIsMobileSearchOpen(false);
        setIsMobileFilterOpen(false);
      }
      if (actionDropdownRef.current && !actionDropdownRef.current.contains(event.target)) {
        setIsActionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Helper to close all floating panels
  const closeMobilePanels = () => {
    setIsMobileSearchOpen(false);
    setIsMobileFilterOpen(false);
    setIsActionDropdownOpen(false);
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
              className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-[7px] border-b-2 text-xs font-semibold transition-colors cursor-pointer ${isMobileSearchOpen
                ? 'bg-primary text-white-100 border-stroke/80'
                : 'bg-gray border-stroke/80 text-black-90 hover:bg-gray/80'
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
                className={`h-8 px-2 shrink-0 flex items-center gap-1 rounded-[7px] border-b-2 text-xs font-semibold transition-colors cursor-pointer ${isMobileFilterOpen
                  ? 'bg-primary text-white-100 border-stroke/80'
                  : 'bg-gray border-stroke/80 text-black-90 hover:bg-gray/80'
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
                className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg bg-secondary text-white-100 hover:bg-secondary/90 transition-colors  cursor-pointer"
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
                className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg bg-primary text-white-100 hover:bg-primary/90 transition-colors  cursor-pointer"
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
              className="w-full pl-9 pr-8 py-2 bg-gray border-b-2 border-stroke/80 rounded-[7px] text-xs font-medium text-black-90 placeholder:text-black-90/40 focus:outline-none transition-all"
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
          <div className="w-full p-2.5 bg-white-100 border-b-2 border-stroke/80 rounded-[7px] flex items-center gap-2 flex-wrap animate-in fade-in slide-in-from-top-1 duration-200">
            {filters.map((filter) => (
              <div key={filter.id} className="relative flex-1 min-w-[120px] [&>div]:w-full [&_select]:w-full">
                {filter.component ? (
                  filter.component
                ) : (
                  <TableFilterSelect
                    id={`mobile-filter-${filter.id}`}
                    name={filter.id}
                    value={filter.value}
                    placeholder={filter.placeholder}
                    options={filter.options}
                    onChange={(e) => {
                      const val = e && e.target ? e.target.value : e;
                      filter.onChange && filter.onChange(val);
                    }}
                    className="w-full"
                    selectClassName="w-full"
                  />
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
              className="w-full pl-9 pr-3 py-2 bg-gray border-b-2 border-stroke/80 rounded-[7px] text-xs font-medium text-black-90 placeholder:text-black-90/40 focus:outline-none transition-all"
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
                <TableFilterSelect
                  id={`filter-${filter.id}`}
                  name={filter.id}
                  value={filter.value}
                  placeholder={filter.placeholder}
                  options={filter.options}
                  onChange={(e) => {
                    const val = e && e.target ? e.target.value : e;
                    filter.onChange && filter.onChange(val);
                  }}
                />
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
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-white-100 text-xs font-semibold hover:bg-secondary/90 transition-colors  cursor-pointer"
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
              className="cursor-pointer h-[34px] w-[34px]"
              size={15}
            />
          )}

          {/* Primary Action Button (Split Dropdown Button matching Image 1 & 2) */}
          {actionButton && (
            <div ref={actionDropdownRef} className="relative inline-block shrink-0">
              <div
                data-ui-style="split-action"
                className="h-8 inline-flex items-stretch rounded-[7px] bg-primary text-white-100 border-b-2 border-stroke/80 overflow-hidden shrink-0"
              >
                <button
                  type="button"
                  data-ui-style="split-action-part"
                  onClick={actionButton.onClick}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  {actionButton.icon || <Plus size={14} />}
                  <span>{actionButton.label}</span>
                </button>
                {actionButton.hasDropdown !== false && (
                  <button
                    type="button"
                    data-ui-style="split-action-part"
                    onClick={() => setIsActionDropdownOpen((prev) => !prev)}
                    className="px-2 border-l border-white-100/25 hover:bg-primary/90 transition-colors cursor-pointer flex items-center justify-center text-white-100"
                    title="More actions"
                    aria-expanded={isActionDropdownOpen}
                  >
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${
                        isActionDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                )}
              </div>

              {/* More Actions Dropdown Menu (Import / Export) matching User Screenshots */}
              {isActionDropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-1.5 min-w-[150px] bg-white-100 rounded-xl border border-stroke py-1 z-50 animate-in fade-in zoom-in-95 duration-100 shadow-none"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setIsActionDropdownOpen(false);
                      if (actionButton.onImport) {
                        actionButton.onImport();
                      } else if (onImport) {
                        onImport();
                      } else {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = '.csv, .xlsx, .xls';
                        input.onchange = (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            alert(`File selected: ${file.name}`);
                          }
                        };
                        input.click();
                      }
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-black-90 hover:bg-gray text-left transition-colors cursor-pointer"
                    title="Import Data"
                  >
                    <ImportIcon size={16} color="currentColor" />
                    <span>Import Data</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsActionDropdownOpen(false);
                      if (actionButton.onExport) {
                        actionButton.onExport();
                      } else if (onExport) {
                        onExport();
                      } else {
                        exportToCSV(
                          [{ 'Record ID': 1, Name: 'Sample Record', Status: 'Active', Date: '06/11/2026' }],
                          `${(actionButton.label || 'crm_data').toLowerCase().replace(/\s+/g, '_')}_export.csv`
                        );
                      }
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-black-90 hover:bg-gray text-left transition-colors cursor-pointer"
                    title="Export Data"
                  >
                    <ExportIcon size={16} color="currentColor" />
                    <span>Export Data</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTableToolbar;
