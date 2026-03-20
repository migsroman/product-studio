import React, { useState } from 'react';
import { Icons } from '../utils/icons';

/**
 * DataTable.jsx - Reusable Sortable Table Component
 *
 * Features:
 *   - Sortable columns (click header to toggle asc/desc)
 *   - Striped rows (#FAFAFA alternate)
 *   - Sticky header
 *   - Hover highlight
 *   - Custom render functions per column
 *   - Optional row click handler
 *
 * Props:
 *   - columns: array of {key, label, width?, sortable?, render?}
 *   - data: array of row objects
 *   - onRowClick?: function(row, index)
 *   - emptyMessage?: string (default: "No data")
 *   - rowClassName?: function(row, index) -> string
 */
export default function DataTable({
  columns = [],
  data = [],
  onRowClick,
  emptyMessage = 'No data',
  rowClassName,
}) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  // Handle column header click for sorting
  const handleSort = (columnKey, sortable) => {
    if (!sortable) return;
    if (sortKey === columnKey) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(columnKey);
      setSortDir('asc');
    }
  };

  // Sort data
  let sortedData = [...data];
  if (sortKey && data.length > 0) {
    sortedData.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* Table Header (Sticky) */}
          <thead className="sticky top-0 bg-white border-b border-gray-200">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`
                    px-4 py-3 text-left font-semibold text-gray-700 text-xs uppercase tracking-wide
                    ${col.sortable ? 'cursor-pointer hover:bg-gray-50' : ''}
                  `}
                  style={{ width: col.width }}
                  onClick={() => handleSort(col.key, col.sortable)}
                >
                  <div className="flex items-center gap-2">
                    <span>{col.label}</span>
                    {col.sortable && sortKey === col.key && (
                      <span className="text-gray-500">
                        {sortDir === 'asc' ? (
                          <Icons.ChevronDown size={14} />
                        ) : (
                          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="18 15 12 9 6 15" />
                          </svg>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={`
                    border-b border-gray-200 transition-colors
                    ${rowIdx % 2 === 1 ? 'bg-gray-50' : 'bg-white'}
                    ${onRowClick ? 'hover:bg-blue-50 cursor-pointer' : 'hover:bg-gray-50'}
                    ${rowClassName ? rowClassName(row, rowIdx) : ''}
                  `}
                  onClick={() => onRowClick?.(row, rowIdx)}
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-4 py-3 text-gray-900" style={{ width: col.width }}>
                      {col.render ? col.render(row[col.key], row, rowIdx) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
