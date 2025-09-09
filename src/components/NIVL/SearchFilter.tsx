'use client';

import { SearchFilters as SearchFiltersType, NASA_CENTERS } from '@/types/nivl';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFilterChange: (key: keyof SearchFiltersType, value: string) => void;
  onSearch: () => void;
  onReset: () => void;
  loading: boolean;
}

const Filter: React.FC<SearchFiltersProps> = ({
  filters,
  onFilterChange,
  onSearch,
  onReset,
  loading
}) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 mb-4">
      <div className="flex items-center space-x-2 mb-4">
        <MagnifyingGlassIcon className="h-5 w-5 text-blue-400" />
        <h2 className="text-lg font-semibold text-white">Search Filters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Search Query
          </label>
          <input
            type="text"
            value={filters.query}
            onChange={(e) => onFilterChange('query', e.target.value)}
            placeholder="Enter search terms..."
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Media Type
          </label>
          <select
            value={filters.mediaType}
            onChange={(e) => onFilterChange('mediaType', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Media</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            NASA Center
          </label>
          <select
            value={filters.center}
            onChange={(e) => onFilterChange('center', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Centers</option>
            {NASA_CENTERS.map(center => (
              <option key={center} value={center}>{center}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Year Start
          </label>
          <input
            type="number"
            value={filters.yearStart}
            onChange={(e) => onFilterChange('yearStart', e.target.value)}
            placeholder="1990"
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Year End
          </label>
          <input
            type="number"
            value={filters.yearEnd}
            onChange={(e) => onFilterChange('yearEnd', e.target.value)}
            placeholder="2023"
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Keywords
          </label>
          <input
            type="text"
            value={filters.keywords}
            onChange={(e) => onFilterChange('keywords', e.target.value)}
            placeholder="mars, rover, etc."
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Photographer
          </label>
          <input
            type="text"
            value={filters.photographer}
            onChange={(e) => onFilterChange('photographer', e.target.value)}
            placeholder="Photographer name"
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Location
          </label>
          <input
            type="text"
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
            placeholder="Location name"
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onSearch}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
        >
          <MagnifyingGlassIcon className="h-4 w-4" />
          <span>{loading ? 'Searching...' : 'Search NASA Media'}</span>
        </button>
        
        <button
          onClick={onReset}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all duration-300 hover:scale-105"
        >
          <XMarkIcon className="h-4 w-4" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  );
};

export default Filter;