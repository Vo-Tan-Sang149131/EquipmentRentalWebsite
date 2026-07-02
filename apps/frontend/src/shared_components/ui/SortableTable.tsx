import type { ReactNode } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface TableColumn<T> {
  key: keyof T;
  header: string;
  render?: (value: any, row: T) => ReactNode;
  sortable?: boolean;
  width?: string;
}

interface SortableTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  onSort?: (key: string, order: 'ASC' | 'DESC') => void;
  currentSort?: { key: string; order: 'ASC' | 'DESC' } | null;
  rowKey: keyof T;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  isLoading?: boolean;
}

export default function SortableTable<T>({
                                           columns,
                                           data,
                                           onSort,
                                           currentSort,
                                           rowKey,
                                           onRowClick,
                                           emptyMessage = 'No data found',
                                           isLoading,
                                         }: SortableTableProps<T>) {
  const handleSort = (key: string) => {
    if (!onSort) return;
    const newOrder = currentSort?.key === key && currentSort.order === 'ASC' ? 'DESC' : 'ASC';
    onSort(key, newOrder);
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (data.length === 0) {
    return <div className="p-8 text-center text-gray-500">{emptyMessage}</div>;
  }

  return (
    <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
      <div className="min-w-200 lg:min-w-full inline-block align-middle">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50/80 border-b border-slate-200 sticky top-0 z-10 backdrop-blur-md">
          <tr>
            {columns.map(col => (
              <th
                key={String(col.key)}
                className={`px-4 py-3 text-left text-sm font-semibold text-gray-700 ${col.width ? `w-${col.width}` : ''} ${
                  col.sortable ? 'cursor-pointer hover:bg-gray-200 select-none' : ''
                }`}
                onClick={() => col.sortable && handleSort(String(col.key))}
              >
                <div className="flex items-center gap-2">
                  <span>{col.header}</span>
                  {col.sortable && (
                    <div className="flex flex-col">
                      {currentSort?.key === String(col.key) ? (
                        currentSort.order === 'ASC' ? (
                          <ChevronUp className="w-4 h-4 text-teal-700" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-teal-700" />
                        )
                      ) : (
                        <div className="w-4 h-4 text-gray-300" />
                      )}
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
          </thead>
          <tbody>
          {data.map((row, idx) => (
            <tr
              key={String(row[rowKey]) || idx}
              className={`border-b hover:bg-gray-50 transition ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map(col => (
                <td key={String(col.key)} className="px-4 py-3 text-sm">
                  {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


