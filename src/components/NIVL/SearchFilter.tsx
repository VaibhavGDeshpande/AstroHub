'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  BuildingLibraryIcon,
  TagIcon,
  UserIcon,
  MapPinIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';
import { SearchFiltersProps, NASA_CENTERS } from '../../types/nivl';

const SearchFilters: React.FC<SearchFiltersProps> = ({ 
  filters, 
  onFiltersChange, 
  onSearch, 
  searching 
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (field: keyof typeof filters, value: string) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  const handleReset = () => {
    onFiltersChange({
      query: '',
      mediaType: 'all',
      center: '',
      yearStart: '',
      yearEnd: '',
      keywords: '',
      photographer: '',
      location: ''
    });
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Main Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-white font-medium mb-2">
              Search NASA Images & Videos
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={filters.query}
                onChange={(e) => handleInputChange('query', e.target.value)}
                placeholder="Enter keywords (e.g., Mars, ISS, nebula...)"
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
            <select
              value={filters.mediaType}
              onChange={(e) => handleInputChange('mediaType', e.target.value as string)}
              className="bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Media</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="audio">Audio</option>
            </select>

            <button
              type="submit"
              disabled={searching}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-300 disabled:opacity-50 flex items-center space-x-2 min-w-[120px]"
            >
              {searching ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <MagnifyingGlassIcon className="h-4 w-4" />
              )}
              <span>{searching ? 'Searching...' : 'Search'}</span>
            </button>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1 transition-colors"
          >
            <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Filters</span>
            <ChevronLeftIcon 
              className={`h-4 w-4 transform transition-transform duration-200 ${
                showAdvanced ? 'rotate-90' : ''
              }`} 
            />
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="text-slate-400 hover:text-white text-sm transition-colors"
          >
            Reset All
          </button>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-700/50">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1">
                    <BuildingLibraryIcon className="inline h-4 w-4 mr-1" />
                    NASA Center
                  </label>
                  <select
                    value={filters.center}
                    onChange={(e) => handleInputChange('center', e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Centers</option>
                    {NASA_CENTERS.map(center => (
                      <option key={center} value={center}>{center}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1">
                    <TagIcon className="inline h-4 w-4 mr-1" />
                    Keywords
                  </label>
                  <input
                    type="text"
                    value={filters.keywords}
                    onChange={(e) => handleInputChange('keywords', e.target.value)}
                    placeholder="Comma-separated keywords"
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1">
                    <MapPinIcon className="inline h-4 w-4 mr-1" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Mars, ISS"
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1">
                    <UserIcon className="inline h-4 w-4 mr-1" />
                    Photographer
                  </label>
                  <input
                    type="text"
                    value={filters.photographer}
                    onChange={(e) => handleInputChange('photographer', e.target.value)}
                    placeholder="e.g., NASA/JPL"
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-1">
                  <label className="block text-slate-300 text-sm font-medium mb-1">
                    <CalendarDaysIcon className="inline h-4 w-4 mr-1" />
                    Year Range
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={filters.yearStart}
                      onChange={(e) => handleInputChange('yearStart', e.target.value)}
                      placeholder="Start"
                      min="1958"
                      max="2025"
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      value={filters.yearEnd}
                      onChange={(e) => handleInputChange('yearEnd', e.target.value)}
                      placeholder="End"
                      min="1958"
                      max="2025"
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default SearchFilters;