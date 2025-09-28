// pages/epic.tsx or components/EPICPage.tsx
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

  // Error handling
  if (error && !loading) {
    return (
      <ErrorMessage
        error={error}
        onRetry={() => {
          setError(null);
          setSelectedDate(MAX_DATE);
        }}
      />
    );
  }

  return (
    <LoaderWrapper 
      isVisible={loading} 
      minDuration={1000}
    >
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background gradients - Earth-themed */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-20 w-80 h-80 bg-blue-500/20 blur-[120px]" />
          <div className="absolute top-40 right-20 w-72 h-72 bg-green-500/20 blur-[100px]" />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-40 bg-cyan-500/20 blur-[100px]" />
        </div>

        {/* Header with Navigation */}
        <div className="fixed top-4 left-4 z-50">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/40 backdrop-blur-sm transition duration-300"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <HomeIcon className="h-4 w-4 hidden sm:block" />
              <span className="text-sm">Back</span>
            </Link>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-10 pt-5 flex flex-col gap-10">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-12"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-500 to-green-500 bg-clip-text text-transparent animate-pulse">
              DSCOVR EPIC - Earth Images
            </h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-slate-300 mt-3 text-base sm:text-lg max-w-3xl mx-auto"
            >
              View Earth from the DSCOVR satellite at the L1 Lagrange point, 1 million miles away
            </motion.p>
          </motion.div>

          {/* Main Content */}
          {epicData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center"
            >
              <EPICImageInfo {...epicImageProps} />
            </motion.div>
          )}

          {/* Additional Info Section */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="max-w-4xl mx-auto w-full"
          >
          </motion.div>
        </div>
      </div>
    </LoaderWrapper>
  );
};

export default EPICPage;
