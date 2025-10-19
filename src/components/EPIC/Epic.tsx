'use client'
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useRef, useEffect } from 'react';
import {
  GlobeAltIcon,
  ArrowsPointingOutIcon,
  SunIcon,
  MapIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { EPICImage } from '@/types/epic';
import DateSelectionModal from './date-selection-modal';
import ThumbnailSidebar from './thumbnail-sidebar';

interface EPICData {
  images: EPICImage[];
  imageUrls: string[];
}

interface EPICImageInfoProps {
  data: EPICData;
  currentImageIndex: number;
  setCurrentImageIndex: (index: number) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  imageLoaded: boolean;
  setImageLoaded: (loaded: boolean) => void;
  openImageInNewTab: (url: string) => void;
  loading?: boolean;
}

// Mobile-optimized Image Viewer
const ReducedHeightImageViewer: React.FC<{
  imageUrl: string;
  currentEPIC: EPICImage;
  imageLoaded: boolean;
  onOpenFullSize: () => void;
  setImageLoaded: (loaded: boolean) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  imageRef: React.RefObject<HTMLImageElement | null>;
  currentImageIndex: number;
  totalImages: number;
  onNavigate: (direction: 'prev' | 'next') => void;
}> = ({ 
  imageUrl, 
  currentEPIC, 
  imageLoaded, 
  onOpenFullSize,
  setImageLoaded,
  containerRef,
  imageRef,
  currentImageIndex,
  totalImages,
  onNavigate,
}) => {
  const formatCoordinate = (coord: number, type: 'lat' | 'lon'): string => {
    const direction = type === 'lat' ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'W');
    return `${Math.abs(coord).toFixed(2)}° ${direction}`;
  };

  return (
    <div className="h-full flex flex-col space-y-2 sm:space-y-3">
      {/* Compact mobile-friendly metadata header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-slate-800/70 to-slate-900/70 backdrop-blur-md border border-slate-600/40 rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-xl"
      >
        <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-2 sm:gap-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1 sm:p-1.5 bg-green-500/20 rounded-lg">
              <GlobeAltIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
            </div>
            <div>
              <motion.h2
                key={currentEPIC.image}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm sm:text-lg font-bold text-white leading-tight"
              >
                Earth from L1 Lagrange Point
              </motion.h2>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-400 mt-1">
                <div className="flex items-center space-x-1">
                  <SunIcon className="h-3 w-3 text-yellow-400" />
                  <span className="text-xs">{currentEPIC.date}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapIcon className="h-3 w-3 text-cyan-400" />
                  <span className="text-xs">
                    {formatCoordinate(currentEPIC.centroid_coordinates.lat, 'lat')}, {formatCoordinate(currentEPIC.centroid_coordinates.lon, 'lon')}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-xs sm:text-sm">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-slate-300 font-medium">Live Data</span>
          </div>
        </div>
      </motion.div>

      {/* Mobile-optimized main image viewer */}
      <motion.div
        key={currentEPIC.image}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative group flex-1 flex items-center justify-center"
        style={{ 
          maxHeight: 'calc(100vh - 280px)', // Adjusted for mobile bottom bar
          minHeight: '300px' 
        }}
      >
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-lg sm:rounded-xl bg-gradient-to-br from-slate-900/60 to-black/80 backdrop-blur-md border border-slate-600/30 w-full h-full flex items-center justify-center shadow-2xl"
        >
          <AnimatePresence mode="wait">
            <motion.img
              ref={imageRef}
              key={imageUrl + currentImageIndex}
              src={imageUrl}
              alt={`Earth from DSCOVR satellite on ${currentEPIC.date}`}
              className="w-full h-full object-contain rounded-lg select-none"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: imageLoaded ? 1 : 0.7, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              onLoad={() => setImageLoaded(true)}
              onLoadStart={() => setImageLoaded(false)}
              draggable={false}
            />
          </AnimatePresence>

          {/* Loading overlay */}
          {!imageLoaded && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-slate-900/70 backdrop-blur-md"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-green-500/30 border-t-green-400 rounded-full mb-2 sm:mb-3 mx-auto"
                />
                <p className="text-slate-300 text-xs sm:text-sm font-medium px-4">Processing Earth imagery...</p>
              </div>
            </motion.div>
          )}

          {/* Mobile-friendly floating controls */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex items-start justify-between pointer-events-none z-10"
          >
            {/* Left: Navigation arrows (mobile) */}
            <div className="flex md:hidden items-center space-x-1.5 pointer-events-auto">
              <button
                onClick={() => onNavigate('prev')}
                disabled={currentImageIndex === 0}
                className="p-2 bg-black/70 backdrop-blur-md text-white rounded-full hover:bg-black/80 transition-all duration-300 border border-slate-600/50 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
                title="Previous image"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => onNavigate('next')}
                disabled={currentImageIndex === totalImages - 1}
                className="p-2 bg-black/70 backdrop-blur-md text-white rounded-full hover:bg-black/80 transition-all duration-300 border border-slate-600/50 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
                title="Next image"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Right: Full size button */}
            <div className="flex items-center space-x-1 sm:space-x-1.5 pointer-events-auto ml-auto">
              <button
                onClick={onOpenFullSize}
                className="p-2 bg-black/70 backdrop-blur-md text-white rounded-full hover:bg-black/80 transition-all duration-300 border border-slate-600/50 shadow-lg"
                title="Open full size"
              >
                <ArrowsPointingOutIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

// Main EPIC Component with mobile-responsive layout
const EPICImageInfo: React.FC<EPICImageInfoProps> = ({
  data,
  currentImageIndex,
  setCurrentImageIndex,
  selectedDate,
  onDateChange,
  imageLoaded,
  setImageLoaded,
  openImageInNewTab,
  loading = false
}) => {
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const MAX_DATE = '2025-07-15';

  const getCurrentEPIC = (): EPICImage | null => {
    if (!data.images || data.images.length === 0) return null;
    return data.images[currentImageIndex] || data.images[0];
  };

  const getCurrentImageUrl = (): string => {
    if (!data.imageUrls || data.imageUrls.length === 0) return '';
    return data.imageUrls[currentImageIndex] || data.imageUrls[0];
  };

  const currentEPIC = getCurrentEPIC();
  const currentImageUrl = getCurrentImageUrl();

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying && data.images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex(
          currentImageIndex === data.images.length - 1 ? 0 : currentImageIndex + 1
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, data.images.length, currentImageIndex, setCurrentImageIndex]);

  const handleThumbnailSelect = useCallback((index: number) => {
    if (index !== currentImageIndex) {
      setCurrentImageIndex(index);
      setIsAutoPlaying(false);
    }
  }, [currentImageIndex, setCurrentImageIndex]);

  const handleNavigate = useCallback((direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else if (direction === 'next' && currentImageIndex < data.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
    setIsAutoPlaying(false);
  }, [currentImageIndex, data.images.length, setCurrentImageIndex]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <motion.div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full mb-4 mx-auto"
          />
          <span className="text-slate-300 text-base sm:text-lg font-medium">Loading Earth imagery...</span>
        </motion.div>
      </div>
    );
  }

  if (!currentEPIC || !currentImageUrl) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="h-full flex items-center justify-center text-center p-4"
      >
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md border border-slate-600/40 rounded-2xl p-6 sm:p-10 shadow-2xl max-w-md">
          <GlobeAltIcon className="h-16 w-16 sm:h-20 sm:w-20 text-blue-400 mx-auto mb-4 sm:mb-6" />
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">No Images Available</h3>
          <p className="text-slate-400 text-base sm:text-lg">No EPIC images found for {selectedDate}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      {/* Date Selection Modal */}
      <DateSelectionModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        selectedDate={selectedDate}
        onDateChange={onDateChange}
        maxDate={MAX_DATE}
      />

      {/* Responsive Layout: Desktop (sidebar) vs Mobile (bottom bar) */}
      <div className="h-full flex flex-col md:flex-row md:space-x-4">
        {/* Desktop Left Sidebar - Hidden on mobile */}
        <div className="hidden md:block md:w-72 md:flex-shrink-0">
          <ThumbnailSidebar
            images={data.images}
            imageUrls={data.imageUrls}
            currentIndex={currentImageIndex}
            onImageSelect={handleThumbnailSelect}
            onDateModalOpen={() => setIsDateModalOpen(true)}
          />
        </div>

        {/* Main Content Area - Full width on mobile */}
        <div className="flex-1 min-w-0 flex flex-col">
          <ReducedHeightImageViewer
            imageUrl={currentImageUrl}
            currentEPIC={currentEPIC}
            imageLoaded={imageLoaded}
            onOpenFullSize={() => openImageInNewTab(currentImageUrl)}
            setImageLoaded={setImageLoaded}
            containerRef={containerRef}
            imageRef={imageRef}
            currentImageIndex={currentImageIndex}
            totalImages={data.images.length}
            onNavigate={handleNavigate}
          />
        </div>

        {/* Mobile Bottom Bar - Only visible on mobile */}
        <div className="md:hidden mt-auto">
          <ThumbnailSidebar
            images={data.images}
            imageUrls={data.imageUrls}
            currentIndex={currentImageIndex}
            onImageSelect={handleThumbnailSelect}
            onDateModalOpen={() => setIsDateModalOpen(true)}
          />
        </div>
      </div>
    </>
  );
};

export default EPICImageInfo;