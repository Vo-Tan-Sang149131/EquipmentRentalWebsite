import { useState } from 'react';

interface FilterState {
  search: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface FilterProps {
  onFilterChange: (filters: FilterState) => void;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'select' | 'checkbox';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: Array<{ value: any; label: string }>;
  }>;
}

export default function FilterBar({ onFilterChange, fields }: FilterProps) {
  const [filters, setFilters] = useState<FilterState>({ search: '' });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (name: string, value: any) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = fields.reduce((acc, field) => {
      acc[field.name] = '';
      return acc;
    }, { search: '' } as FilterState);
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white rounded shadow p-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
        {/* Search field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            value={filters.search}
            onChange={e => handleChange('search', e.target.value)}
            placeholder="Search..."
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        {/* Dynamic filter fields */}
        {fields.map(field => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            {field.type === 'text' && (
              <input
                type="text"
                value={filters[field.name] || ''}
                onChange={e => handleChange(field.name, e.target.value)}
                placeholder={field.label}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            )}
            {field.type === 'select' && (
              <select
                value={filters[field.name] || ''}
                onChange={e => handleChange(field.name, e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="">All</option>
                {field.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}

        {/* Reset button */}
        <div>
          <button
            onClick={handleReset}
            className="w-full bg-gray-400 hover:bg-gray-500 text-white px-3 py-2 rounded text-sm font-medium"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

