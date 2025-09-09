// pages/epic.tsx or components/EPICPage.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import EPICImageInfo from '@/components/EPIC/Epic';
import { getEpicData } from '@/api_service/get_epic';
import { EPICImage } from '@/types/epic';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      {/* Back button */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          href="/"
          className="flex items-center space-x-2 px-3 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-white rounded-lg hover:bg-slate-700/50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Go back to home page"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span className="text-sm">Back</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            EPIC - Earth Images
          </h1>
          <p className="text-slate-300">
            View Earth from the DSCOVR satellite at L1 Lagrange point
          </p>
        </header>

        <main className="h-[calc(100vh-200px)]" role="main">
          <EPICImageInfo {...epicImageProps} />
        </main>
      </div>
    </div>
  );
};

export default EPICPage;