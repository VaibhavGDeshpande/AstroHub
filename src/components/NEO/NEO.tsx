'use client'
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  CalendarIcon, 
  RocketLaunchIcon,
  ExclamationTriangleIcon,
  GlobeAmericasIcon,
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  HomeIcon,
  ClockIcon,
  ScaleIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { getNEO } from "../../api_service/neo";
import { NEOResponse } from "../../types/neo";
import LoaderWrapper from "../Loader";

const NEOExplorer = () => {
  const [data, setData] = useState<NEOResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [expandedNEO, setExpandedNEO] = useState<string | null>(null);

  // Get today's date and yesterday as default range
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const todayStr = today.toISOString().split('T')[0];
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  useEffect(() => {
    if (!startDate && !endDate) {
      setStartDate(yesterdayStr);
      setEndDate(todayStr);
    }
  }, [yesterdayStr, todayStr, startDate, endDate]);

  const fetchNEOData = async (start: string, end: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getNEO(start, end);
      setData(result);
    } catch (err) {
      console.error('Failed to fetch NEO data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load NEO data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchNEOData(startDate, endDate);
    }
  }, [startDate, endDate]);

  const handleDateSearch = () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date must be before or equal to end date');
      return;
    }
    
    const daysDiff = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24));
    if (daysDiff > 7) {
      setError('Date range cannot exceed 7 days');
      return;
    }
    
    fetchNEOData(startDate, endDate);
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const getHazardColor = (isHazardous: boolean): string => {
    return isHazardous ? 'text-red-400' : 'text-green-400';
  };

  const getSizeCategory = (diameterKm: number): string => {
    if (diameterKm < 0.1) return 'Very Small';
    if (diameterKm < 1) return 'Small';
    if (diameterKm < 10) return 'Medium';
    return 'Large';
  };

  if (loading) {
    return <LoaderWrapper/>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
        <div className="fixed top-4 left-4 z-50">
          <Link
            href="/"
            className="flex items-center space-x-2 px-3 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-white rounded-lg hover:bg-slate-700/50 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto text-center bg-slate-800/50 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 sm:p-8"
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationTriangleIcon className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-red-400 mb-2">Asteroid Detection Failed!</h2>
          <p className="text-sm sm:text-base text-slate-300 mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null);
              if (startDate && endDate) {
                fetchNEOData(startDate, endDate);
              }
            }}
            className="w-full px-6 py-2.5 sm:py-3 bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base rounded-lg transition-colors duration-300"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br">
      {/* Back Button */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-3 left-3 sm:top-4 sm:left-4 z-50 hidden md:block"
      >
        <Link
          href="/"
          className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-white rounded-lg hover:bg-slate-700/50 transition-all duration-300 hover:scale-105 shadow-lg group"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:-translate-x-0.5 transition-transform duration-300" />
          <HomeIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 hidden xs:block" />
          <span className="text-xs sm:text-sm font-medium">Back</span>
        </Link>
      </motion.div>

      <div className="relative z-10 container mx-auto px-3 sm:px-4 py-6 sm:py-8 pt-16 sm:pt-20 max-w-7xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 via-pink-500 to-red-500 bg-clip-text text-transparent px-2">
            NASA&apos;s Near Earth Objects
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto px-4">
            Track asteroids and comets that approach Earth with detailed orbital information
          </p>
        </motion.header>

        {/* Search Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-xl"
        >
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-lg">
                <MagnifyingGlassIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Search Date Range</h2>
                <p className="text-xs sm:text-sm text-slate-400">Select dates to explore NEOs</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-slate-700/50 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-300">NASA API Connected</span>
            </div>
          </div>

          {/* Form Section */}
          <div className="space-y-3 sm:space-y-4">
            {/* Date Inputs Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {/* Start Date */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm font-medium text-slate-300">
                  <CalendarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-400" />
                  <span>Start Date</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={todayStr}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-slate-700/70 border border-slate-600/50 rounded-lg sm:rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-slate-700 hover:border-slate-500"
                />
              </div>
              
              {/* End Date */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm font-medium text-slate-300">
                  <CalendarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-400" />
                  <span>End Date</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  max={todayStr}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-slate-700/70 border border-slate-600/50 rounded-lg sm:rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-slate-700 hover:border-slate-500"
                />
              </div>
              
              {/* Search Button */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium text-transparent select-none hidden sm:block">Search</label>
                <button
                  onClick={handleDateSearch}
                  className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-pink-600 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2 font-medium text-sm sm:text-base"
                >
                  <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Search NEOs</span>
                </button>
              </div>
            </div>

            {/* Info Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 sm:pt-4 border-t border-slate-600/30">
              <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-4 text-xs text-slate-400">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <ExclamationTriangleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-400 flex-shrink-0" />
                  <span>Max 7 days range</span>
                </div>
                <div className="flex items-center space-x-1.5 sm:space-x-2 text-slate-500">
                  <ClockIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>Daily NASA updates</span>
                </div>
              </div>
              
              {/* Quick Date Shortcuts */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-slate-500 hidden sm:inline">Quick:</span>
                <button
                  onClick={() => {
                    const today = new Date().toISOString().split('T')[0];
                    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
                    setStartDate(yesterday);
                    setEndDate(today);
                  }}
                  className="flex-1 sm:flex-none px-2.5 sm:px-3 py-1 text-xs bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-colors duration-200"
                >
                  Yesterday-Today
                </button>
                <button
                  onClick={() => {
                    const today = new Date().toISOString().split('T')[0];
                    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
                    setStartDate(weekAgo);
                    setEndDate(today);
                  }}
                  className="flex-1 sm:flex-none px-2.5 sm:px-3 py-1 text-xs bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-colors duration-200"
                >
                  Last 7 Days
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {data && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Summary Stats */}
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center"
              >
                <RocketLaunchIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-white">{data.element_count}</div>
                <div className="text-sm sm:text-base text-slate-400">Total NEOs</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center"
              >
                <ExclamationTriangleIcon className="h-6 w-6 sm:h-8 sm:w-8 text-red-400 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {Object.values(data.near_earth_objects)
                    .flat()
                    .filter(neo => neo.is_potentially_hazardous_asteroid).length}
                </div>
                <div className="text-sm sm:text-base text-slate-400">Potentially Hazardous</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center xs:col-span-2 lg:col-span-1"
              >
                <CalendarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {Object.keys(data.near_earth_objects).length}
                </div>
                <div className="text-sm sm:text-base text-slate-400">Days Tracked</div>
              </motion.div>
            </div>

            {/* NEO List by Date */}
            <div className="space-y-4 sm:space-y-6">
              {Object.entries(data.near_earth_objects).map(([date, neos], dateIndex) => (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: dateIndex * 0.1 }}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6"
                >
                  <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-0 xs:space-x-2 mb-4">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400 flex-shrink-0" />
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-white truncate">
                        {new Date(date).toLocaleDateString('en-US', {
                          weekday: window.innerWidth >= 640 ? 'long' : 'short',
                          year: 'numeric',
                          month: window.innerWidth >= 640 ? 'long' : 'short',
                          day: 'numeric'
                        })}
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 sm:px-2 sm:py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
                      {neos.length} NEOs
                    </span>
                  </div>

                  <div className="grid gap-3 sm:gap-4">
                    {neos.map((neo, neoIndex) => {
                      const approach = neo.close_approach_data[0];
                      const isExpanded = expandedNEO === neo.id;
                      const diameterKm = (neo.estimated_diameter.kilometers.estimated_diameter_min + 
                                        neo.estimated_diameter.kilometers.estimated_diameter_max) / 2;

                      return (
                        <motion.div
                          key={neo.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: neoIndex * 0.05 }}
                          className={`border ${neo.is_potentially_hazardous_asteroid 
                            ? 'border-red-500/30 bg-red-500/5' 
                            : 'border-slate-700/50 bg-slate-700/20'
                          } rounded-lg sm:rounded-xl p-3 sm:p-4 hover:bg-slate-700/30 transition-all duration-300`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-base sm:text-lg font-semibold text-white mb-2 break-words">
                                {neo.name}
                              </h4>
                              <div className="flex flex-col xs:flex-row xs:flex-wrap items-start xs:items-center gap-2 xs:gap-3 text-xs sm:text-sm">
                                <div className="flex items-center space-x-1">
                                  <ExclamationTriangleIcon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 ${getHazardColor(neo.is_potentially_hazardous_asteroid)}`} />
                                  <span className={getHazardColor(neo.is_potentially_hazardous_asteroid)}>
                                    {neo.is_potentially_hazardous_asteroid ? 'Hazardous' : 'Safe'}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <ScaleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 text-slate-400" />
                                  <span className="text-slate-300">{getSizeCategory(diameterKm)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <GlobeAmericasIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 text-slate-400" />
                                  <span className="text-slate-300">
                                    {formatNumber(diameterKm)} km
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => setExpandedNEO(isExpanded ? null : neo.id)}
                              className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors duration-300 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
                            >
                              {isExpanded ? 'Less' : 'More'}
                            </button>
                          </div>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-3 pt-3 border-t border-slate-600/30"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                  <div className="space-y-2">
                                    <h5 className="text-xs sm:text-sm font-semibold text-white">Physical Properties</h5>
                                    <div className="space-y-1 text-xs sm:text-sm text-slate-400">
                                      <div>Absolute Magnitude: <span className="text-white">{neo.absolute_magnitude}</span></div>
                                      <div>Min Diameter: <span className="text-white">{formatNumber(neo.estimated_diameter.kilometers.estimated_diameter_min)} km</span></div>
                                      <div>Max Diameter: <span className="text-white">{formatNumber(neo.estimated_diameter.kilometers.estimated_diameter_max)} km</span></div>
                                      <div>Sentry Object: <span className={neo.is_sentry_object ? 'text-red-400' : 'text-green-400'}>
                                        {neo.is_sentry_object ? 'Yes' : 'No'}
                                      </span></div>
                                    </div>
                                  </div>

                                  {approach && (
                                    <div className="space-y-2">
                                      <h5 className="text-xs sm:text-sm font-semibold text-white">Close Approach Data</h5>
                                      <div className="space-y-1 text-xs sm:text-sm text-slate-400">
                                        <div className="flex items-center space-x-1">
                                          <ClockIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 text-blue-400" />
                                          <span className="break-all">{new Date(approach.close_approach_date_full).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <BoltIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 text-yellow-400" />
                                          <span>{formatNumber(parseFloat(approach.relative_velocity.kilometers_per_hour))} km/h</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <GlobeAmericasIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 text-green-400" />
                                          <span>{formatNumber(parseFloat(approach.miss_distance.kilometers))} km</span>
                                        </div>
                                        <div>Orbiting: <span className="text-white">{approach.orbiting_body}</span></div>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="pt-2">
                                  <a
                                    href={neo.nasa_jpl_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-300 text-xs sm:text-sm"
                                  >
                                    <span>View on NASA JPL</span>
                                    <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                                  </a>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NEOExplorer;
