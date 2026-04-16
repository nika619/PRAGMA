'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';

export default function DataTable({ 
  data, 
  columns, 
  defaultSortKey = '',
  defaultSortDirection = 'asc',
  onRowClick
}) {
  const [sortKey, setSortKey] = useState(defaultSortKey);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    
    // Check if there's a custom sort function in the column config
    const column = columns.find(col => col.key === sortKey);
    if (column && column.sortFn) {
      return sortDirection === 'asc' 
        ? column.sortFn(a, b) 
        : column.sortFn(b, a);
    }

    const valA = a[sortKey];
    const valB = b[sortKey];

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="table-container text-sm">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th 
                key={col.key}
                onClick={() => col.sortable !== false && handleSort(col.key)}
                className={`${col.sortable !== false ? 'sortable' : ''} ${col.align || 'left'}`}
                style={{ width: col.width }}
              >
                <div className={`th-content align-${col.align || 'left'}`}>
                  {col.label}
                  {col.sortable !== false && (
                    <span className="sort-icon">
                      {sortKey === col.key ? (
                        sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      ) : (
                        <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-100" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length > 0 ? (
            sortedData.map((row, i) => (
              <tr 
                key={row.id || i}
                onClick={() => onRowClick && onRowClick(row)}
                className={onRowClick ? 'clickable' : ''}
              >
                {columns.map((col) => (
                  <td key={`${row.id || i}-${col.key}`} className={`align-${col.align || 'left'}`}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="empty-state">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <style jsx>{`
        .table-container {
          width: 100%;
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        th {
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
          color: var(--text-secondary);
          font-weight: 600;
          user-select: none;
          background: rgba(10, 22, 40, 0.4);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        th.sortable {
          cursor: pointer;
        }

        th.sortable:hover {
          color: var(--text-primary);
          background: rgba(10, 22, 40, 0.8);
        }

        .th-content {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .th-content.align-left { justify-content: flex-start; }
        .th-content.align-center { justify-content: center; }
        .th-content.align-right { justify-content: flex-end; }

        .sort-icon {
          display: flex;
          align-items: center;
          color: var(--accent-cyan);
        }

        .sortable:not(:hover) .sort-icon:not(:has(svg.lucide-chevron-up)):not(:has(svg.lucide-chevron-down)) {
          opacity: 0;
        }

        td {
          padding: 12px 16px;
          border-bottom: 1px solid rgba(0, 229, 255, 0.05);
          color: var(--text-primary);
          transition: background 0.2s ease;
        }

        .align-left { text-align: left; }
        .align-center { text-align: center; }
        .align-right { text-align: right; }

        tr {
          transition: background 0.2s ease;
        }

        tr:last-child td {
          border-bottom: none;
        }

        tr:hover td {
          background: rgba(0, 229, 255, 0.05);
        }

        tr.clickable {
          cursor: pointer;
        }

        .empty-state {
          text-align: center;
          padding: 32px;
          color: var(--text-muted);
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
