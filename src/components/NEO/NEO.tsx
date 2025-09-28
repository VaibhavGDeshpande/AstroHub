// components/NEO/NEOExplorer.tsx
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

  // Fetch NEO data function
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

  // Initial data fetch
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
    
    // Check if date range is within 7 days (NASA API limit)
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

  // Loading Component
  if (loading) {
    return (
      <LoaderWrapper/>
    );
  }

  // Error Component
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
        {/* Back Button */}
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
          className="max-w-md mx-auto text-center bg-slate-800/50 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8"
        >
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Asteroid Detection Failed!</h2>
          <p className="text-slate-300 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setError(null);
                if (startDate && endDate) {
                  fetchNEOData(startDate, endDate);
                }
              }}
              className="w-full px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br">
      {/* Back Button */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-4 left-4 z-50"
      >
        <Link
          href="/"
          className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-white rounded-lg hover:bg-slate-700/50 transition-all duration-300 hover:scale-105 shadow-lg group"
        >
          <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform duration-300" />
          <HomeIcon className="h-4 w-4 hidden sm:block" />
          <span className="text-sm font-medium">Back</span>
        </Link>
      </motion.div>


      <div className="relative z-10 container mx-auto px-4 py-8 pt-5 max-w-7xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            NASA&apos;s Near Earth Objects
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Track asteroids and comets that approach Earth with detailed orbital information
          </p>
        </motion.header>

        {/* Search Controls */}
        <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-8 shadow-xl"
>
  {/* Header Section */}
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-blue-500/10 rounded-lg">
        <MagnifyingGlassIcon className="h-6 w-6 text-blue-400" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-white">Search Date Range</h2>
        <p className="text-sm text-slate-400">Select dates to explore Near Earth Objects</p>
      </div>
    </div>
    <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-slate-700/50 rounded-full">
      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      <span className="text-xs text-slate-300">NASA API Connected</span>
    </div>
  </div>

  {/* Form Section */}
  <div className="space-y-4">
    {/* Date Inputs Row */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Start Date */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-sm font-medium text-slate-300">
          <CalendarIcon className="h-4 w-4 text-blue-400" />
          <span>Start Date</span>
        </label>
        <div className="relative">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={todayStr}
            className="w-full px-4 py-3 bg-slate-700/70 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-slate-700 hover:border-slate-500"
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          </div>
        </div>
      </div>
      
      {/* End Date */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-sm font-medium text-slate-300">
          <CalendarIcon className="h-4 w-4 text-blue-400" />
          <span>End Date</span>
        </label>
        <div className="relative">
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            max={todayStr}
            className="w-full px-4 py-3 bg-slate-700/70 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-slate-700 hover:border-slate-500"
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          </div>
        </div>
      </div>
      
      {/* Search Button */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-transparent select-none">Search</label>
        <button
          onClick={handleDateSearch}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-pink-600 text-white rounded-xl hover:from-blue-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2 font-medium"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
          <span>Search NEOs</span>
        </button>
      </div>
    </div>

    {/* Info Section */}
    <div className="flex items-center justify-between pt-4 border-t border-slate-600/30">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <ExclamationTriangleIcon className="h-4 w-4 text-yellow-400" />
          <span>Maximum 7 days range allowed</span>
        </div>
        <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-500">
          <ClockIcon className="h-4 w-4" />
          <span>Data updated daily by NASA</span>
        </div>
      </div>
      
      {/* Quick Date Shortcuts */}
      <div className="flex items-center space-x-2">
        <span className="text-xs text-slate-500 hidden sm:block">Quick:</span>
        <button
          onClick={() => {
            const today = new Date().toISOString().split('T')[0];
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            setStartDate(yesterday);
            setEndDate(today);
          }}
          className="px-3 py-1 text-xs bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-colors duration-200"
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
          className="px-3 py-1 text-xs bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-colors duration-200"
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
            className="space-y-6"
          >
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center"
              >
                <RocketLaunchIcon className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{data.element_count}</div>
                <div className="text-slate-400">Total NEOs</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center"
              >
                <ExclamationTriangleIcon className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {Object.values(data.near_earth_objects)
                    .flat()
                    .filter(neo => neo.is_potentially_hazardous_asteroid).length}
                </div>
                <div className="text-slate-400">Potentially Hazardous</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center"
              >
                <CalendarIcon className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {Object.keys(data.near_earth_objects).length}
                </div>
                <div className="text-slate-400">Days Tracked</div>
              </motion.div>
            </div>

            {/* NEO List by Date */}
            <div className="space-y-6">
              {Object.entries(data.near_earth_objects).map(([date, neos], dateIndex) => (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: dateIndex * 0.1 }}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <CalendarIcon className="h-6 w-6 text-blue-400" />
                    <h3 className="text-xl font-bold text-white">
                      {new Date(date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                      {neos.length} NEOs
                    </span>
                  </div>

                  <div className="grid gap-4">
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
                          } rounded-xl p-4 hover:bg-slate-700/30 transition-all duration-300`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-white mb-1">
                                {neo.name}
                              </h4>
                              <div className="flex flex-wrap items-center gap-4 text-sm">
                                <div className="flex items-center space-x-1">
                                  <ExclamationTriangleIcon className={`h-4 w-4 ${getHazardColor(neo.is_potentially_hazardous_asteroid)}`} />
                                  <span className={getHazardColor(neo.is_potentially_hazardous_asteroid)}>
                                    {neo.is_potentially_hazardous_asteroid ? 'Potentially Hazardous' : 'Safe'}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <ScaleIcon className="h-4 w-4 text-slate-400" />
                                  <span className="text-slate-300">{getSizeCategory(diameterKm)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <GlobeAmericasIcon className="h-4 w-4 text-slate-400" />
                                  <span className="text-slate-300">
                                    {formatNumber(diameterKm)} km diameter
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => setExpandedNEO(isExpanded ? null : neo.id)}
                              className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors duration-300 text-sm"
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <h5 className="text-sm font-semibold text-white">Physical Properties</h5>
                                    <div className="space-y-1 text-sm">
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
                                      <h5 className="text-sm font-semibold text-white">Close Approach Data</h5>
                                      <div className="space-y-1 text-sm">
                                        <div className="flex items-center space-x-1">
                                          <ClockIcon className="h-4 w-4 text-blue-400" />
                                          <span>{new Date(approach.close_approach_date_full).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <BoltIcon className="h-4 w-4 text-yellow-400" />
                                          <span>{formatNumber(parseFloat(approach.relative_velocity.kilometers_per_hour))} km/h</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <GlobeAmericasIcon className="h-4 w-4 text-green-400" />
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
                                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-300 text-sm"
                                  >
                                    <span>View on NASA JPL</span>
                                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
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
