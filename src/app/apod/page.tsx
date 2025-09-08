// app/apod/page.tsx
'use client'
import { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getAPOD } from '../../api_service/APOD';
import DateSearchSection from '../../components/APOD/DateSearchSection';
import APODImageInfo from '../../components/APOD/APOD';
import { 
  CalendarIcon, 
  PhotoIcon, 
  VideoCameraIcon,
  ArrowLeftIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';

interface APODData {
  copyright?: string;
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
}

export default function APODPage() {
  const [data, setData] = useState<APODData | APODData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [useHD, setUseHD] = useState<boolean>(true);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  
  // Date functionality states
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isDateRange, setIsDateRange] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // Get today's date and format it
  const today = new Date().toISOString().split('T')[0];
  const maxDate = today;
  const minDate = '1995-06-16'; // APOD started on this date

  const fetchData = async (date?: string, start?: string, end?: string) => {
    try {
      setLoading(true);
      setError(null);
      setImageLoaded(false);
      const result = await getAPOD(date, start, end);
      setData(result);
      setCurrentImageIndex(0);
      console.log('APOD data:', result);
    } catch (err) {
      console.error('Failed to fetch APOD:', err);
      setError(err instanceof Error ? err.message : 'Failed to load APOD data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch today's APOD on initial load
  }, []);

  const handleDateSearch = () => {
    if (isDateRange) {
      if (startDate && endDate) {
        if (new Date(startDate) > new Date(endDate)) {
          setError('Start date must be before end date');
          return;
        }
        fetchData(undefined, startDate, endDate);
      } else {
        setError('Please select both start and end dates');
      }
    } else {
      if (selectedDate) {
        fetchData(selectedDate);
      } else {
        setError('Please select a date');
      }
    }
  };

  const handleTodayClick = () => {
    setSelectedDate('');
    setStartDate('');
    setEndDate('');
    setIsDateRange(false);
    fetchData();
  };

  const openImageInNewTab = (imageUrl: string) => {
    window.open(imageUrl, '_blank', 'noopener,noreferrer');
  };

  const getCurrentData = (): APODData => {
    if (Array.isArray(data)) {
      return data[currentImageIndex] || data[0];
    }
    return data as APODData;
  };

  const navigateImages = (direction: 'prev' | 'next') => {
    if (Array.isArray(data)) {
      setImageLoaded(false);
      if (direction === 'prev' && currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
      } else if (direction === 'next' && currentImageIndex < data.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      }
    }
  };

  // Loading Component
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        {/* Back Button - Loading State */}
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
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-4 sm:p-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-4 sm:mb-6"
          />
          <motion.h2
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-xl sm:text-2xl font-bold text-white mb-2"
          >
            Loading cosmic wonder...
          </motion.h2>
          <p className="text-slate-400 text-sm sm:text-base">Fetching data from NASA</p>
        </motion.div>
      </div>
    );
  }

  // Error Component
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-900 flex items-center justify-center p-4">
        {/* Back Button - Error State */}
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
          className="max-w-sm sm:max-w-md mx-auto text-center bg-slate-800/50 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 sm:p-8"
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-red-400 mb-2">Houston, we have a problem!</h2>
          <p className="text-slate-300 mb-4 sm:mb-6 text-sm sm:text-base">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setError(null);
                handleTodayClick();
              }}
              className="w-full px-4 sm:px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-300 text-sm sm:text-base"
            >
              Try Again
            </button>
            <button
              onClick={handleTodayClick}
              className="w-full px-4 sm:px-6 py-2 border border-slate-600 text-white hover:border-blue-400 hover:text-blue-400 rounded-lg transition-colors duration-300 text-sm sm:text-base"
            >
              Back to Today
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        {/* Back Button - No Data State */}
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-white"
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-2">No cosmic data available</h2>
          <p className="text-slate-400 text-sm sm:text-base">The universe seems quiet today...</p>
        </motion.div>
      </div>
    );
  }

  const currentAPOD = getCurrentData();
  const isMultipleImages = Array.isArray(data) && data.length > 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Back Button - Main State */}
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
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
      </motion.div>

      {/* Background Stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:h-screen lg:overflow-hidden">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-4 sm:py-6 px-4 sm:px-6 flex-shrink-0 pt-16 sm:pt-20" // Added top padding to account for back button
        >
          <div className="text-center">
            <motion.h1
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight"
              animate={{
                backgroundImage: [
                  'linear-gradient(45deg, #60a5fa, #a855f7, #ec4899)',
                  'linear-gradient(45deg, #a855f7, #ec4899, #60a5fa)',
                  'linear-gradient(45deg, #ec4899, #60a5fa, #a855f7)'
                ]
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              NASA Astronomy Picture of the Day
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-6 text-slate-400"
            >
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4" />
                <span className="text-xs sm:text-sm">{new Date(currentAPOD.date).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center space-x-2">
                {currentAPOD.media_type === 'image' ? (
                  <PhotoIcon className="h-4 w-4" />
                ) : (
                  <VideoCameraIcon className="h-4 w-4" />
                )}
                <span className="capitalize text-xs sm:text-sm">{currentAPOD.media_type}</span>
              </div>
              {isMultipleImages && (
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400 font-medium text-xs sm:text-sm">
                    {currentImageIndex + 1} of {data.length}
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        </motion.header>

        {/* Search Section - Mobile First */}
        <div className="px-4 sm:px-6 mb-4 sm:mb-6 lg:hidden flex-shrink-0">
          <DateSearchSection
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            isDateRange={isDateRange}
            setIsDateRange={setIsDateRange}
            onSearch={handleDateSearch}
            onTodayClick={handleTodayClick}
            minDate={minDate}
            maxDate={maxDate}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 px-4 sm:px-6 pb-4 sm:pb-6 overflow-hidden">
          <APODImageInfo
            data={data}
            currentImageIndex={currentImageIndex}
            useHD={useHD}
            setUseHD={setUseHD}
            imageLoaded={imageLoaded}
            setImageLoaded={setImageLoaded}
            openImageInNewTab={openImageInNewTab}
            navigateImages={navigateImages}
            searchSection={
              <div className="hidden lg:block mb-4">
                <DateSearchSection
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                  isDateRange={isDateRange}
                  setIsDateRange={setIsDateRange}
                  onSearch={handleDateSearch}
                  onTodayClick={handleTodayClick}
                  minDate={minDate}
                  maxDate={maxDate}
                />
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
