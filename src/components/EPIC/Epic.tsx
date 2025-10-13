'use client'
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useRef, useEffect } from 'react';
import {
  GlobeAltIcon,
  ArrowsPointingOutIcon,
  CalendarDaysIcon,
  PhotoIcon,
  SunIcon,
  MapIcon,
  PlayIcon,
  PauseIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { EPICImage } from '@/types/epic';

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

// Mobile-optimized Date Selection Modal
const DateSelectionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  maxDate: string;
}> = ({ isOpen, onClose, selectedDate, onDateChange, maxDate }) => {
  const [tempDate, setTempDate] = useState(selectedDate);

  const handleSave = () => {
    onDateChange(tempDate);
    onClose();
  };

  const handleCancel = () => {
    setTempDate(selectedDate);
    onClose();
  };

  const handleTodayClick = () => {
    const today = new Date().toISOString().split('T')[0];
    if (today <= maxDate) {
      setTempDate(today);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
          onClick={handleCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-600/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg sm:rounded-xl">
                  <CalendarDaysIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Select Date</h2>
              </div>
              <button
                onClick={handleCancel}
                className="p-1.5 sm:p-2 hover:bg-slate-700/50 rounded-full transition-colors duration-200"
              >
                <XMarkIcon className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  Choose EPIC Image Date
                </label>
                <input
                  type="date"
                  value={tempDate}
                  onChange={(e) => setTempDate(e.target.value)}
                  max={maxDate}
                  className="w-full bg-slate-700/80 border border-slate-600/50 text-white rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-base sm:text-lg"
                />
                <p className="text-xs text-slate-400 mt-2">
                  Available from June 2015 to {maxDate}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={handleTodayClick}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-700/60 hover:bg-slate-600/60 text-white rounded-lg transition-colors duration-200 text-xs sm:text-sm"
                >
                  Today
                </button>
                <div className="text-xs text-slate-400">
                  Current: {selectedDate}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 mt-6 sm:mt-8">
              <button
                onClick={handleCancel}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700/60 hover:bg-slate-600/60 text-white rounded-lg sm:rounded-xl transition-colors duration-200 font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg sm:rounded-xl transition-all duration-200 font-medium shadow-lg text-sm sm:text-base"
              >
                Apply Date
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Mobile-optimized Thumbnail Sidebar/Bottom Bar
const ThumbnailSidebar: React.FC<{
  images: EPICImage[];
  imageUrls: string[];
  currentIndex: number;
  onImageSelect: (index: number) => void;
  onAutoPlay: () => void;
  isAutoPlaying: boolean;
  onDateModalOpen: () => void;
}> = ({ images, imageUrls, currentIndex, onImageSelect, onAutoPlay, isAutoPlaying, onDateModalOpen }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current image
  useEffect(() => {
    if (scrollContainerRef.current && imageUrls.length > 0) {
      const container = scrollContainerRef.current;
      const isMobile = window.innerWidth < 768;
      
      if (isMobile) {
        // Horizontal scroll for mobile
        const thumbnailWidth = 72; // w-16 + gap
        const gap = 8;
        const scrollPosition = currentIndex * (thumbnailWidth + gap) - container.clientWidth / 2 + thumbnailWidth / 2;
        container.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: 'smooth'
        });
      } else {
        // Vertical scroll for desktop
        const thumbnailHeight = 85;
        const gap = 8;
        const rowHeight = thumbnailHeight + gap;
        const columns = 2;
        const currentRow = Math.floor(currentIndex / columns);
        const containerHeight = container.clientHeight;
        const scrollPosition = currentRow * rowHeight - containerHeight / 2 + thumbnailHeight / 2;
        container.scrollTo({
          top: Math.max(0, scrollPosition),
          behavior: 'smooth'
        });
      }
    }
  }, [currentIndex, imageUrls.length]);

  if (!images || images.length === 0) return null;

  return (
    <>
      {/* Mobile Bottom Bar Layout */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="md:hidden w-full bg-gradient-to-t from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-t border-slate-600/40 rounded-t-2xl p-3 shadow-2xl"
      >
        {/* Compact mobile controls */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-blue-500/20 rounded-lg">
              <PhotoIcon className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Gallery</h3>
              <p className="text-xs text-slate-400">{currentIndex + 1}/{images.length}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onDateModalOpen}
              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors duration-200 border border-blue-500/30"
            >
              <CalendarDaysIcon className="h-4 w-4" />
            </button>
            
            <button
              onClick={onAutoPlay}
              className={`
                p-2 rounded-lg font-medium transition-all duration-300
                ${isAutoPlaying 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' 
                  : 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                }
              `}
            >
              {isAutoPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden mb-3">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Horizontal scrollable thumbnail strip */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto overflow-y-hidden scrollbar-hide -mx-3 px-3"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <div className="flex space-x-2 pb-1">
            {imageUrls.map((url, index) => (
              <motion.button
                key={`${images[index]?.image}-${index}`}
                onClick={() => onImageSelect(index)}
                className={`
                  relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-300
                  ${currentIndex === index
                    ? 'ring-2 ring-blue-400 ring-offset-1 ring-offset-slate-900 scale-110' 
                    : 'ring-1 ring-slate-600/50 opacity-60'
                  }
                `}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={url}
                  alt={`Earth ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                
                {currentIndex === index && (
                  <motion.div 
                    className="absolute inset-0 bg-blue-400/20 border border-blue-400/60 rounded-lg" 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Desktop Sidebar Layout (unchanged but hidden on mobile) */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="hidden md:flex w-full h-full bg-gradient-to-b from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-600/40 rounded-2xl p-3 shadow-2xl flex-col"
      >
        {/* Desktop header and controls */}
        <div className="flex flex-col space-y-2 mb-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-blue-500/20 rounded-lg">
                <PhotoIcon className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Earth Gallery</h3>
                <p className="text-xs text-slate-400">{images.length} images</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onDateModalOpen}
              className="flex items-center justify-center space-x-1 px-2 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors duration-200 border border-blue-500/30 text-xs"
            >
              <CalendarDaysIcon className="h-3 w-3" />
              <span>Date</span>
            </button>
            
            <button
              onClick={onAutoPlay}
              className={`
                flex items-center justify-center space-x-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-300
                ${isAutoPlaying 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' 
                  : 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                }
              `}
            >
              {isAutoPlaying ? <PauseIcon className="h-3 w-3" /> : <PlayIcon className="h-3 w-3" />}
              <span>{isAutoPlaying ? 'Stop' : 'Play'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{currentIndex + 1}/{images.length}</span>
            <span>{images[0]?.date.split(' ')[0]}</span>
          </div>
          
          <div className="w-full h-0.5 bg-slate-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Desktop vertical grid */}
        <div
          ref={scrollContainerRef}
          className="flex-1 min-h-0 overflow-y-auto pr-1 scrollbar-hide"
          style={{
            maxHeight: '400px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <div className="grid grid-cols-2 gap-2">
            {imageUrls.map((url, index) => (
              <motion.button
                key={`${images[index]?.image}-${index}`}
                onClick={() => onImageSelect(index)}
                className={`
                  relative w-full aspect-square rounded-lg overflow-hidden transition-all duration-300 group
                  ${currentIndex === index
                    ? 'ring-2 ring-blue-400 ring-offset-1 ring-offset-slate-900 shadow-xl scale-105' 
                    : 'ring-1 ring-slate-600/50 hover:ring-slate-500/70 hover:scale-102'
                  }
                `}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                layout
              >
                <img
                  src={url}
                  alt={`Earth ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute bottom-1 left-1 bg-black/80 backdrop-blur-sm text-white text-xs px-1.5 py-0.5 rounded font-bold">
                  {index + 1}
                </div>

                {currentIndex === index && (
                  <div className="absolute top-1 right-1 bg-blue-500/90 backdrop-blur-sm text-white text-xs px-1 py-0.5 rounded font-medium">
                    {images[index]?.date.split(' ')[1]?.slice(0, 5)}
                  </div>
                )}

                {isAutoPlaying && currentIndex === index && (
                  <div className="absolute top-1 left-1 bg-green-500/90 backdrop-blur-sm text-white rounded-full p-0.5">
                    <PlayIcon className="h-2.5 w-2.5" />
                  </div>
                )}

                {currentIndex === index && (
                  <motion.div 
                    className="absolute inset-0 bg-blue-400/20 border border-blue-400/60 rounded-lg" 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center text-white">
                    <p className="text-xs font-medium mb-0.5">
                      {images[index]?.date.split(' ')[1]?.slice(0, 8)}
                    </p>
                    <p className="text-xs text-slate-300">View</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

// Mobile-optimized Image Viewer
const ReducedHeightImageViewer: React.FC<{
  imageUrl: string;
  currentEPIC: EPICImage;
  zoom: number;
  pan: { x: number; y: number };
  imageLoaded: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onOpenFullSize: () => void;
  onMouseHandlers: {
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: () => void;
    onWheel: (e: React.WheelEvent) => void;
  };
  onTouchHandlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
  };
  setImageLoaded: (loaded: boolean) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  imageRef: React.RefObject<HTMLImageElement | null>;
  currentImageIndex: number;
  totalImages: number;
  onNavigate: (direction: 'prev' | 'next') => void;
}> = ({ 
  imageUrl, 
  currentEPIC, 
  zoom, 
  pan, 
  imageLoaded, 
  onZoomIn,
  onZoomOut,
  onResetView, 
  onOpenFullSize,
  onMouseHandlers,
  onTouchHandlers,
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
          className="relative overflow-hidden rounded-lg sm:rounded-xl bg-gradient-to-br from-slate-900/60 to-black/80 backdrop-blur-md border border-slate-600/30 w-full h-full flex items-center justify-center touch-pan-y shadow-2xl"
          onMouseDown={onMouseHandlers.onMouseDown}
          onMouseMove={onMouseHandlers.onMouseMove}
          onMouseUp={onMouseHandlers.onMouseUp}
          onMouseLeave={onMouseHandlers.onMouseUp}
          onWheel={onMouseHandlers.onWheel}
          onTouchStart={onTouchHandlers.onTouchStart}
          onTouchMove={onTouchHandlers.onTouchMove}
          onTouchEnd={onTouchHandlers.onTouchEnd}
          style={{ cursor: zoom > 1 ? 'grab' : 'default' }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              ref={imageRef}
              key={imageUrl + currentImageIndex}
              src={imageUrl}
              alt={`Earth from DSCOVR satellite on ${currentEPIC.date}`}
              className="w-full h-full object-contain rounded-lg select-none"
              style={{
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                transformOrigin: 'center center',
                maxWidth: 'none',
                maxHeight: 'none',
                willChange: 'transform'
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: imageLoaded ? 1 : 0.7, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              onLoad={() => setImageLoaded(true)}
              onLoadStart={() => setImageLoaded(false)}
              onDoubleClick={() => zoom === 1 ? onZoomIn() : onResetView()}
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

            {/* Right: Zoom and action controls */}
            <div className="flex items-center space-x-1 sm:space-x-1.5 pointer-events-auto ml-auto">
              {/* Zoom controls */}
              <div className="hidden sm:flex items-center space-x-1 bg-black/70 backdrop-blur-md rounded-full p-1 border border-slate-600/50">
                <button
                  onClick={onZoomOut}
                  disabled={zoom <= 0.5}
                  className="p-1.5 text-white rounded-full hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Zoom out"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-white text-xs font-medium px-1 min-w-[3rem] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={onZoomIn}
                  disabled={zoom >= 5}
                  className="p-1.5 text-white rounded-full hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Zoom in"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              {/* Action buttons */}
              <button
                onClick={onResetView}
                className="hidden sm:block p-2 bg-black/70 backdrop-blur-md text-white rounded-full hover:bg-black/80 transition-all duration-300 border border-slate-600/50 shadow-lg"
                title="Reset view"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>

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
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  
  // Touch handling state
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);
  
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

  // Reset zoom and pan when image changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsAutoPlaying(false);
  }, [currentImageIndex, selectedDate]);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.3, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.3, 0.5));
  }, []);

  const handleResetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [zoom, pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      handleZoomOut();
    } else {
      handleZoomIn();
    }
  }, [handleZoomIn, handleZoomOut]);

  // Touch handlers for mobile pinch-to-zoom and pan
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      // Single touch for panning
      if (zoom > 1) {
        setTouchStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
      }
    } else if (e.touches.length === 2) {
      // Two fingers for pinch zoom
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setLastTouchDistance(distance);
    }
  }, [zoom, pan]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && touchStart && zoom > 1) {
      // Panning
      setPan({
        x: e.touches[0].clientX - touchStart.x,
        y: e.touches[0].clientY - touchStart.y
      });
    } else if (e.touches.length === 2 && lastTouchDistance) {
      // Pinch zoom
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = distance - lastTouchDistance;
      const zoomDelta = delta * 0.01;
      setZoom(prev => Math.max(0.5, Math.min(5, prev + zoomDelta)));
      setLastTouchDistance(distance);
    }
  }, [touchStart, lastTouchDistance, zoom]);

  const handleTouchEnd = useCallback(() => {
    setTouchStart(null);
    setLastTouchDistance(null);
  }, []);

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

  const handleAutoPlay = useCallback(() => {
    setIsAutoPlaying(!isAutoPlaying);
  }, [isAutoPlaying]);

  const mouseHandlers = {
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
    onWheel: handleWheel
  };

  const touchHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  };

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
            onAutoPlay={handleAutoPlay}
            isAutoPlaying={isAutoPlaying}
            onDateModalOpen={() => setIsDateModalOpen(true)}
          />
        </div>

        {/* Main Content Area - Full width on mobile */}
        <div className="flex-1 min-w-0 flex flex-col">
          <ReducedHeightImageViewer
            imageUrl={currentImageUrl}
            currentEPIC={currentEPIC}
            zoom={zoom}
            pan={pan}
            imageLoaded={imageLoaded}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetView={handleResetView}
            onOpenFullSize={() => openImageInNewTab(currentImageUrl)}
            onMouseHandlers={mouseHandlers}
            onTouchHandlers={touchHandlers}
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
            onAutoPlay={handleAutoPlay}
            isAutoPlaying={isAutoPlaying}
            onDateModalOpen={() => setIsDateModalOpen(true)}
          />
        </div>
      </div>
    </>
  );
};

export default EPICImageInfo;
