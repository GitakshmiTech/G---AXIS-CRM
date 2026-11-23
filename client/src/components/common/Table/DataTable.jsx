//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, Lucide chevron sort indicators.
// ==================================================================================================================
import { useState, useMemo, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

// Estimate the space needed for a one-line label, including its optional sort icon and cell padding.
const getColumnWidth = (column) => {
  const widthHint = column.width || `${column.headerClassName || ''} ${column.className || ''}`;
  const pixelMatch = String(widthHint).match(/w-\[(\d+(?:\.\d+)?)px\]/);
  const scaleMatch = String(widthHint).match(/\bw-(\d+)\b/);
  const hintedWidth = pixelMatch ? Number(pixelMatch[1]) : scaleMatch ? Number(scaleMatch[1]) * 4 : 120;
  const labelWidth = String(column.label || '').length * 7 + (column.sortable ? 44 : 24);
  return Math.max(hintedWidth, labelWidth);
};

//==================================================================================================================
//    REUSABLE DATA TABLE COMPONENT
//    Universal responsive table container supporting sortable headers, custom column renderers, and empty state.
// ==================================================================================================================
export const DataTable = ({
  columns = [],
  data = [],
  rowKey = 'id',
  emptyMessage = 'No records found.',
  className = '',
  maxHeight,
  freezeFirstColumn = true,
  minWidth = 0,
  fixedLayout = true,
  fitContent = false,
  loading = false,
}) => {
  //==================================================================================================================
  //    PERSISTENT SORTING STATE
  //==================================================================================================================
  const [sortConfig, setSortConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(`dataTable-sort-${window.location.pathname}`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Save to localStorage on change
  useEffect(() => {
    if (sortConfig) {
      localStorage.setItem(`dataTable-sort-${window.location.pathname}`, JSON.stringify(sortConfig));
    } else {
      localStorage.removeItem(`dataTable-sort-${window.location.pathname}`);
    }
  }, [sortConfig]);

  // Listen for reset trigger from Toolbar
  useEffect(() => {
    const handleReset = () => setSortConfig(null);
    window.addEventListener('reset-table-sort', handleReset);
    return () => window.removeEventListener('reset-table-sort', handleReset);
  }, []);

  //==================================================================================================================
  //    SORTING TOGGLE HANDLER (2-CLICK LOGIC)
  //==================================================================================================================
  const handleSortToggle = (column) => {
    if (!column.sortable) return;

    if (sortConfig?.key === column.key) {
      // 2-click toggle logic: asc -> desc -> asc
      setSortConfig({
        key: column.key,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc',
        type: column.sortType || 'text'
      });
    } else {
      // New column selected -> set to asc
      setSortConfig({ key: column.key, direction: 'asc', type: column.sortType || 'text' });
    }
  };

  //==================================================================================================================
  //    SORTING LOGIC (SMART)
  //==================================================================================================================
  const sortedData = useMemo(() => {
    if (!sortConfig || !sortConfig.key) return data;

    return [...data].sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      // Handle undefined/null
      if (valA === undefined || valA === null) valA = '';
      if (valB === undefined || valB === null) valB = '';

      if (sortConfig.type === 'number') {
        // Extract numbers from strings like "#001" or "12"
        const numA = Number(String(valA).replace(/[^0-9.-]+/g, ""));
        const numB = Number(String(valB).replace(/[^0-9.-]+/g, ""));
        return sortConfig.direction === 'asc' ? numA - numB : numB - numA;
      }
      else if (sortConfig.type === 'status') {
        // Active/Approved usually comes first, then Inactive/Rejected
        const statusPriority = {
          'active': 1, 'approved': 1,
          'inactive': 2, 'rejected': 2, 'pending': 3
        };
        const pA = statusPriority[String(valA).toLowerCase()] || 99;
        const pB = statusPriority[String(valB).toLowerCase()] || 99;

        if (pA === pB) return String(valA).localeCompare(String(valB));
        return sortConfig.direction === 'asc' ? pA - pB : pB - pA;
      }
      else {
        // Default text sorting
        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        if (strA < strB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (strA > strB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      }
    });
  }, [data, sortConfig]);

  // Convert existing pixel width hints into responsive proportions and remove fixed widths from cells.
  const columnWidths = useMemo(() => {
    if (fitContent || !columns.length) return [];
    const weights = columns.map(getColumnWidth);
    const total = weights.reduce((sum, width) => sum + width, 0);
    return weights.map((width) => `${(width / total) * 100}%`);
  }, [columns, fitContent]);

  // Preserve readable baseline widths and allow horizontal scrolling only when the viewport is narrower.
  const responsiveMinWidth = useMemo(() => {
    if (fitContent) return minWidth;
    return columns.reduce((total, column) => total + getColumnWidth(column), 0);
  }, [columns, fitContent, minWidth]);

  // Keep width constraints at the table column level so legacy page classes cannot force overflow.
  const responsiveCellClass = (classNames = '') => fitContent
    ? classNames
    : classNames.split(/\s+/).filter((token) => !/^(?:min-|max-)?w-(?:\[[^\]]+\]|\d+|full|auto|screen|min|max|fit)$/.test(token)).join(' ');

  return (
    //==================================================================================================================
    //    RESPONSIVE TABLE WRAPPER
    // ==================================================================================================================
    <div
      className={`data-table-viewport w-full overflow-x-auto min-h-[350px] ${maxHeight ? 'overflow-y-auto no-scrollbar' : ''} ${className}`}
      style={maxHeight ? { maxHeight } : undefined}
    >
      <table aria-busy={loading} className={`${fitContent ? 'w-max' : 'w-full'} text-left border-separate border-spacing-0 ${fixedLayout ? 'table-fixed' : ''}`} style={{ minWidth: fitContent ? minWidth : responsiveMinWidth, width: fitContent ? 'max-content' : '100%' }}>
        {/* Table Column Headers */}
        <thead className="sticky top-0 z-10 bg-gray">
          <tr className="bg-gray text-[11px] font-semibold text-black capitalize tracking-wider">
            {columns.map((column, index) => {
              const isFirst = (freezeFirstColumn && index === 0) || column.pinned === 'left';
              return (
                <th
                  key={column.key}
                  onClick={() => column.sortable && handleSortToggle(column)}
                  style={!fitContent ? { width: columnWidths[index] } : undefined}
                  className={`sticky top-0 overflow-hidden bg-gray py-2 px-2 first:pl-4 last:pr-4 first:rounded-l-lg last:rounded-r-lg relative ${
                    isFirst ? 'left-0 z-20' : 'z-10'
                  } ${column.sortable ? 'cursor-pointer  group' : ''} ${responsiveCellClass(column.headerClassName || '')}`}
                >
                  <div
                    className={`flex items-center gap-1.5 ${column.align === 'center'
                      ? 'justify-center'
                      : column.align === 'right'
                        ? 'justify-end'
                        : 'justify-start'
                      }`}
                  >
                    <span className="min-w-0 whitespace-nowrap leading-tight">{column.label}</span>
                    {column.sortable && (
                      <div
                        className={`p-0.5 transition-all ${sortConfig?.key === column.key
                          ? 'text-primary'
                          : 'text-primary group-hover:text-primary'
                          }`}
                      >
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${sortConfig?.key === column.key && sortConfig.direction === 'asc'
                            ? 'rotate-180'
                            : ''
                            }`}
                        />
                      </div>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        {/* Table Body Rows */}
        <tbody className="divide-y divide-stroke text-xs text-black-90">
          {loading ? (
            Array.from({ length: 5 }, (_, rowIndex) => (
              <tr key={`skeleton-row-${rowIndex}`} aria-hidden="true" className="border-b border-stroke/50">
                {columns.map((column, columnIndex) => {
                  const isFirst = (freezeFirstColumn && columnIndex === 0) || column.pinned === 'left';
                  const width = [68, 82, 72, 88, 62, 76][(columnIndex + rowIndex) % 6];
                  return (
                    <td key={`skeleton-cell-${column.key}`} className={`crm-data-table-cell align-middle py-4 px-2 first:pl-4 last:pr-4 ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'} ${isFirst ? 'sticky left-0 z-[5] bg-white-100' : ''}`}>
                      <span className="inline-block h-3 max-w-full animate-pulse rounded-[4px] bg-gray" style={{ width: `${width}%` }} />
                    </td>
                  );
                })}
              </tr>
            ))
          ) : sortedData.length > 0 ? (
            sortedData.map((row, rowIndex) => {
              const key =
                typeof rowKey === 'function' ? rowKey(row, rowIndex) : row[rowKey] || rowIndex;

              return (
                <tr
                  key={key}
                  className="group hover:bg-gray/30 transition-colors"
                >
                  {columns.map((column, index) => {
                    const isFirst = (freezeFirstColumn && index === 0) || column.pinned === 'left';
                    return (
                      <td
                        key={column.key}
                        className={`crm-data-table-cell align-middle whitespace-normal break-words [overflow-wrap:anywhere] py-3 px-2 first:pl-4 last:pr-4 ${
                          isFirst
                            ? 'sticky left-0 z-[5] bg-white-100 group-hover:bg-[#FBFCFE]'
                            : ''
                        } ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'} ${responsiveCellClass(column.className || '')}`}
                      >
                        {column.render ? column.render(row, rowIndex) : row[column.key]}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="py-12 text-center text-sm text-black-90/60"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
