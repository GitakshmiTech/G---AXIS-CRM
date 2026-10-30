//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, Lucide chevron sort indicators.
// ==================================================================================================================
import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

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
}) => {
  //==================================================================================================================
  //    PERSISTENT SORTING STATE
  //==================================================================================================================
  const [sortConfig, setSortConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(`dataTable-sort-${window.location.pathname}`);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
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

  return (
    //==================================================================================================================
    //    RESPONSIVE TABLE WRAPPER
    // ==================================================================================================================
    <div
      className={`w-full min-h-[350px] ${maxHeight ? 'overflow-auto table-scrollbar' : ''} ${className}`}
      style={maxHeight ? { maxHeight } : undefined}
    >
      <table className="w-full text-left border-separate border-spacing-0 min-w-[760px]">
        {/* Table Column Headers */}
        <thead className="sticky top-0 z-10 bg-gray">
          <tr className="bg-gray text-[11px] font-semibold text-black capitalize tracking-wider">
            {columns.map((column, index) => {
              const isFirst = (freezeFirstColumn && index === 0) || column.pinned === 'left';
              return (
                <th
                  key={column.key}
                  onClick={() => column.sortable && handleSortToggle(column)}
                  className={`sticky top-0 bg-gray py-2 px-2 first:pl-4 last:pr-4 first:rounded-l-lg last:rounded-r-lg relative ${
                    isFirst ? 'left-0 z-20' : 'z-10'
                  } ${column.sortable ? 'cursor-pointer select-none group' : ''} ${column.headerClassName || ''}`}
                >
                  <div
                    className={`flex items-center gap-1.5 ${column.align === 'center'
                      ? 'justify-center'
                      : column.align === 'right'
                        ? 'justify-end'
                        : 'justify-start'
                      }`}
                  >
                    <span className="whitespace-nowrap">{column.label}</span>
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
          {sortedData.length > 0 ? (
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
                        className={`py-3 px-2 first:pl-4 last:pr-4 ${
                          isFirst
                            ? 'sticky left-0 z-[5] bg-white-100 group-hover:bg-[#FBFCFE]'
                            : ''
                        } ${column.className || ''}`}
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
