// components/APOD/DateSearchSection.tsx
'use client'
import { motion } from 'framer-motion';
import { 
  CalendarIcon, 
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

interface DateSearchProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  isDateRange: boolean;
  setIsDateRange: (range: boolean) => void;
  onSearch: () => void;
  onTodayClick: () => void;
  minDate: string;
  maxDate: string;
}

const DateSearchSection: React.FC<DateSearchProps> = ({
  selectedDate,
  setSelectedDate,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  isDateRange,
  setIsDateRange,
  onSearch,
  onTodayClick,
  minDate,
  maxDate
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 sm:p-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 space-y-2 sm:space-y-0">
        <h2 className="text-base sm:text-lg font-bold text-white flex items-center">
          <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-400" />
          <span className="hidden sm:inline">Explore Dates</span>
          <span className="sm:hidden">Search</span>
        </h2>
        
        <div className="flex gap-2">
          <button
            onClick={() => setIsDateRange(false)}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-md transition-colors duration-300 ${
              !isDateRange 
                ? 'bg-blue-500 text-white' 
                : 'border border-slate-600 text-slate-400 hover:border-blue-400 hover:text-blue-400'
            }`}
          >
            Single Date
          </button>
          <button
            onClick={() => setIsDateRange(true)}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-md transition-colors duration-300 ${
              isDateRange 
                ? 'bg-blue-500 text-white' 
                : 'border border-slate-600 text-slate-400 hover:border-blue-400 hover:text-blue-400'
            }`}
          >
            Date Range
          </button>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="block sm:hidden space-y-3">
        {!isDateRange ? (
          <div className="space-y-1">
            <label className="text-xs text-slate-400">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={minDate}
              max={maxDate}
              className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={minDate}
                max={maxDate}
                className="w-full px-2 py-2 text-xs bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={minDate}
                max={maxDate}
                className="w-full px-2 py-2 text-xs bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onSearch}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center space-x-1 text-sm"
          >
            <MagnifyingGlassIcon className="h-4 w-4" />
            <span>Search</span>
          </button>
          
          <button
            onClick={onTodayClick}
            className="px-4 py-2 border border-slate-600 text-white hover:border-blue-400 hover:text-blue-400 rounded-md transition-colors duration-300 flex items-center justify-center space-x-1 text-sm"
          >
            <CalendarIcon className="h-4 w-4" />
            <span>Today</span>
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          {!isDateRange ? (
            <div className="space-y-1 md:col-span-2 lg:col-span-2">
              <label className="text-xs text-slate-400">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={minDate}
                max={maxDate}
                className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={minDate}
                  max={maxDate}
                  className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={minDate}
                  max={maxDate}
                  className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}
          
          <button
            onClick={onSearch}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center space-x-1 text-sm"
          >
            <MagnifyingGlassIcon className="h-4 w-4" />
            <span>Search</span>
          </button>
          
          <button
            onClick={onTodayClick}
            className="px-4 py-2 border border-slate-600 text-white hover:border-blue-400 hover:text-blue-400 rounded-md transition-colors duration-300 flex items-center justify-center space-x-1 text-sm"
          >
            <CalendarIcon className="h-4 w-4" />
            <span>Today</span>
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-2">
        * APOD data available from June 16, 1995 to present
      </p>
    </motion.div>
  );
};

export default DateSearchSection;
