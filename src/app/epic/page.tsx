'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import EPICImageInfo from '@/components/EPIC/Epic';
import { getEpicData } from '@/api_service/get_epic';
import { EPICImage } from '@/types/epic';
import Link from 'next/link';
import { ArrowLeftIcon, HomeIcon } from '@heroicons/react/24/outline';
import ErrorMessage from '@/components/Error';
import LoaderWrapper from '@/components/Loader';

interface EPICData {
  images: EPICImage[];
  imageUrls: string[];
}

const EPICPage = () => {
  const MAX_DATE = '2025-07-15';
  
  // State management
  const [epicData, setEpicData] = useState<EPICData>({ images: [], imageUrls: [] });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>(MAX_DATE);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized handlers
  const openImageInNewTab = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const handleDateChange = useCallback((date: string) => {
    if (date !== selectedDate) {
      setSelectedDate(date);
      setCurrentImageIndex(0);
      setImageLoaded(false);
      setError(null);
    }
  }, [selectedDate]);

  const handleImageIndexChange = useCallback((index: number) => {
    setCurrentImageIndex(index);
    setImageLoaded(false);
  }, []);

  // Fetch EPIC data with proper error handling and cleanup
  useEffect(() => {
    let isCancelled = false;
    
    const fetchEpicData = async () => {
      if (!selectedDate) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await getEpicData(selectedDate);
        
        if (!isCancelled) {
          setEpicData(data);
          if (data.images.length === 0) {
            setError('No images available for this date');
          }
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Failed to fetch EPIC data:', err);
          setError('Failed to load images. Please try again.');
          setEpicData({ images: [], imageUrls: [] });
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchEpicData();

    return () => {
      isCancelled = true;
    };
  }, [selectedDate]);

  // Prevent body scroll on mount
  useEffect(() => {
    // Prevent page scroll
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100vh';
    
    return () => {
      // Restore scroll on unmount
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
    };
  }, []);

  // Memoize props to prevent unnecessary re-renders
  const epicImageProps = useMemo(() => ({
    data: epicData,
    currentImageIndex,
    setCurrentImageIndex: handleImageIndexChange,
    selectedDate,
    onDateChange: handleDateChange,
    imageLoaded,
    setImageLoaded,
    openImageInNewTab,
    loading,
    error
  }), [
    epicData,
    currentImageIndex,
    handleImageIndexChange,
    selectedDate,
    handleDateChange,
    imageLoaded,
    openImageInNewTab,
    loading,
    error
  ]);

  // Error handling with no-scroll design
  if (error && !loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center p-4 overflow-hidden">
        <ErrorMessage
          error={error}
          onRetry={() => {
            setError(null);
            setSelectedDate(MAX_DATE);
          }}
        />
      </div>
    );
  }

  return (
    <LoaderWrapper 
      isVisible={loading} 
      minDuration={1000}
    >
      <div className="h-screen w-screen bg-black text-white relative overflow-hidden">
        {/* Fixed background gradients - no scroll interference */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-5 sm:top-10 left-10 sm:left-20 w-40 h-40 sm:w-80 sm:h-80 bg-blue-500/20 blur-[80px] sm:blur-[120px]" />
          <div className="absolute top-20 sm:top-40 right-10 sm:right-20 w-32 h-32 sm:w-72 sm:h-72 bg-green-500/20 blur-[60px] sm:blur-[100px]" />
          <div className="absolute bottom-5 sm:bottom-10 left-1/2 -translate-x-1/2 w-48 h-24 sm:w-96 sm:h-40 bg-cyan-500/20 blur-[60px] sm:blur-[100px]" />
        </div>

        {/* Fixed navigation header */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-50">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              href="/"
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 active:bg-slate-700/70 border border-slate-600/40 backdrop-blur-sm transition-all duration-300 shadow-lg"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <HomeIcon className="h-4 w-4 hidden sm:block" />
              <span className="text-xs sm:text-sm font-medium">Back</span>
            </Link>
          </motion.div>
        </div>

        {/* Main container - fixed height, no scroll */}
        <div className="h-full w-full flex flex-col overflow-hidden">
          {/* Compact header - fixed size */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-shrink-0 text-center pt-14 sm:pt-16 pb-3 sm:pb-4 px-3 sm:px-4"
          >
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-500 to-green-500 bg-clip-text text-transparent leading-tight">
              DSCOVR EPIC
            </h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-slate-300 text-xs sm:text-sm md:text-base max-w-xl lg:max-w-2xl mx-auto mt-1 sm:mt-2 leading-snug"
            >
              Earth from L1 Lagrange Point • 1 Million Miles Away
            </motion.p>
          </motion.div>

          {/* Main content - fills remaining space */}
          {epicData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex-1 min-h-0 w-full px-2 sm:px-3 md:px-4 lg:px-6 pb-3 sm:pb-4"
            >
              <div className="h-full w-full max-w-[2000px] mx-auto">
                <EPICImageInfo {...epicImageProps} />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </LoaderWrapper>
  );
};

export default EPICPage;
