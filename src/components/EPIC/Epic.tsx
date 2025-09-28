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
  XMarkIcon
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

// Date Selection Modal Component
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-600/50 rounded-3xl p-6 shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-xl">
                  <CalendarDaysIcon className="h-6 w-6 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Select Date</h2>
              </div>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-slate-700/50 rounded-full transition-colors duration-200"
              >
                <XMarkIcon className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Choose EPIC Image Date
                </label>
                <input
                  type="date"
                  value={tempDate}
                  onChange={(e) => setTempDate(e.target.value)}
                  max={maxDate}
                  className="w-full bg-slate-700/80 border border-slate-600/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-lg"
                />
                <p className="text-xs text-slate-400 mt-2">
                  Available from June 2015 to {maxDate}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={handleTodayClick}
                  className="px-4 py-2 bg-slate-700/60 hover:bg-slate-600/60 text-white rounded-lg transition-colors duration-200 text-sm"
                >
                  Today
                </button>
                <div className="text-xs text-slate-400">
                  Current: {selectedDate}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-8">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-3 bg-slate-700/60 hover:bg-slate-600/60 text-white rounded-xl transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl transition-all duration-200 font-medium shadow-lg"
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

// Enhanced Thumbnail Sidebar with Better Scrolling
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

  // Auto-scroll to current image with improved logic
  useEffect(() => {
    if (scrollContainerRef.current && imageUrls.length > 0) {
      const container = scrollContainerRef.current;
      const thumbnailHeight = 85; // Slightly smaller thumbnails for better fit
      const gap = 8; // Reduced gap
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
  }, [currentIndex, imageUrls.length]);

  if (!images || images.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full h-full bg-gradient-to-b from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-600/40 rounded-2xl p-3 shadow-2xl flex flex-col"
    >
      {/* Compact Header */}
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
        
        {/* Compact Control buttons */}
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

        {/* Compact progress indicator */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{currentIndex + 1}/{images.length}</span>
          <span>{images[0]?.date.split(' ')[0]}</span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-0.5 bg-slate-700 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Enhanced scrollable thumbnail grid */}
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

              {/* Enhanced overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Compact image number */}
              <div className="absolute bottom-1 left-1 bg-black/80 backdrop-blur-sm text-white text-xs px-1.5 py-0.5 rounded font-bold">
                {index + 1}
              </div>

              {/* Time indicator for current image */}
              {currentIndex === index && (
                <div className="absolute top-1 right-1 bg-blue-500/90 backdrop-blur-sm text-white text-xs px-1 py-0.5 rounded font-medium">
                  {images[index]?.date.split(' ')[1]?.slice(0, 5)}
                </div>
              )}

              {/* Play indicator for auto-playing */}
              {isAutoPlaying && currentIndex === index && (
                <div className="absolute top-1 left-1 bg-green-500/90 backdrop-blur-sm text-white rounded-full p-0.5">
                  <PlayIcon className="h-2.5 w-2.5" />
                </div>
              )}

              {/* Selection indicator */}
              {currentIndex === index && (
                <motion.div 
                  className="absolute inset-0 bg-blue-400/20 border border-blue-400/60 rounded-lg" 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}

              {/* Hover overlay with metadata */}
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-center text-white">
                  <p className="text-xs font-medium mb-0.5">
                    {images[index]?.date.split(' ')[1]?.slice(0, 8)}
                  </p>
                  <p className="text-xs text-slate-300">
                    View
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Reduced Height Image Viewer
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
  onResetView, 
  onOpenFullSize,
  onMouseHandlers,
  setImageLoaded,
  containerRef,
  imageRef,
  currentImageIndex,
}) => {
  const formatCoordinate = (coord: number, type: 'lat' | 'lon'): string => {
    const direction = type === 'lat' ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'W');
    return `${Math.abs(coord).toFixed(2)}° ${direction}`;
  };

  return (
    <div className="h-full flex flex-col space-y-3">
      {/* Compact metadata header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-slate-800/70 to-slate-900/70 backdrop-blur-md border border-slate-600/40 rounded-xl p-3 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-green-500/20 rounded-lg">
              <GlobeAltIcon className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <motion.h2
                key={currentEPIC.image}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg font-bold text-white"
              >
                Earth from L1 Lagrange Point
              </motion.h2>
              <div className="flex items-center space-x-4 text-sm text-slate-400">
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
          
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-slate-300 font-medium text-xs">Live Data</span>
          </div>
        </div>
      </motion.div>

      {/* Reduced height main image viewer */}
      <motion.div
        key={currentEPIC.image}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative group flex-1 flex items-center justify-center"
        style={{ maxHeight: '65vh', minHeight: '400px' }} // Reduced height constraint
      >
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900/60 to-black/80 backdrop-blur-md border border-slate-600/30 w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-2xl"
          onMouseDown={onMouseHandlers.onMouseDown}
          onMouseMove={onMouseHandlers.onMouseMove}
          onMouseUp={onMouseHandlers.onMouseUp}
          onMouseLeave={onMouseHandlers.onMouseUp}
          onWheel={onMouseHandlers.onWheel}
        >
          <AnimatePresence mode="wait">
            <motion.img
              ref={imageRef}
              key={imageUrl + currentImageIndex}
              src={imageUrl}
              alt={`Earth from DSCOVR satellite on ${currentEPIC.date}`}
              className="w-full h-full object-contain rounded-lg"
              style={{
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                transformOrigin: 'center center',
                maxWidth: 'none',
                maxHeight: 'none'
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

          {/* Enhanced loading overlay */}
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
                  className="w-10 h-10 border-2 border-green-500/30 border-t-green-400 rounded-full mb-3 mx-auto"
                />
                <p className="text-slate-300 text-sm font-medium">Processing Earth imagery...</p>
              </div>
            </motion.div>
          )}

          {/* Floating Controls - Adjusted for smaller space */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute top-3 left-3 right-3 flex items-start justify-between pointer-events-none z-10"
          >

            {/* Right: Compact zoom and action controls */}
            <div className="flex items-center space-x-1.5 pointer-events-auto">
              {/* Compact action buttons */}
              <button
                onClick={onOpenFullSize}
                className="p-2 bg-black/70 backdrop-blur-md text-white rounded-full hover:bg-black/80 transition-all duration-300 border border-slate-600/50 shadow-lg"
                title="Open full size"
              >
                <ArrowsPointingOutIcon className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

// Main EPIC Component with optimized layout
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

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full mb-4 mx-auto"
          />
          <span className="text-slate-300 text-lg font-medium">Loading Earth imagery...</span>
        </motion.div>
      </div>
    );
  }

  if (!currentEPIC || !currentImageUrl) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="h-full flex items-center justify-center text-center"
      >
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md border border-slate-600/40 rounded-2xl p-10 shadow-2xl">
          <GlobeAltIcon className="h-20 w-20 text-blue-400 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-white mb-3">No Images Available</h3>
          <p className="text-slate-400 text-lg">No EPIC images found for {selectedDate}</p>
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

      {/* Main Layout - Left sidebar + Right content with optimized heights */}
      <div className="h-full flex space-x-4">
        {/* Left Sidebar - Enhanced scrollable thumbnails */}
        <div className="w-72 flex-shrink-0">
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

        {/* Right Content - Reduced height image viewer */}
        <div className="flex-1 min-w-0">
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
            setImageLoaded={setImageLoaded}
            containerRef={containerRef}
            imageRef={imageRef}
            currentImageIndex={currentImageIndex}
            totalImages={data.images.length}
            onNavigate={handleNavigate}
          />
        </div>
      </div>
    </>
  );
};

export default EPICImageInfo;