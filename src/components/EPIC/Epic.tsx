'use client'
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  GlobeAltIcon,
  EyeIcon,
  ArrowsPointingOutIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowsRightLeftIcon,
  CalendarDaysIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { EPICImage } from '@/types/epic';
import CanvasEarthViewer from './CanvasEarthViewer';

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

// Thumbnail Gallery Component
const ThumbnailGallery: React.FC<{
  images: EPICImage[];
  imageUrls: string[];
  currentIndex: number;
  onImageSelect: (index: number) => void;
}> = ({ images, imageUrls, currentIndex, onImageSelect }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current image
  useEffect(() => {
    if (scrollContainerRef.current && imageUrls.length > 0) {
      const container = scrollContainerRef.current;
      const thumbnailWidth = 80; // w-20 = 80px
      const gap = 8; // gap-2 = 8px
      const scrollPosition = currentIndex * (thumbnailWidth + gap);
      
      container.scrollTo({
        left: scrollPosition - container.clientWidth / 2 + thumbnailWidth / 2,
        behavior: 'smooth'
      });
    }
  }, [currentIndex, imageUrls.length]);

  if (!images || images.length <= 1) return null;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 mb-4">
      <div className="flex items-center space-x-2 mb-3">
        <PhotoIcon className="h-4 w-4 text-blue-400" />
        <h3 className="text-sm font-semibold text-white">
          All Images ({images.length})
        </h3>
        <span className="text-slate-400 text-xs">
          {images[0]?.date.split(' ')[0]}
        </span>
      </div>
      
      {/* Scrollable thumbnail container */}
      <div 
        ref={scrollContainerRef}
        className="flex space-x-2 overflow-x-auto pb-2"
        style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: '#475569 #1e293b'
        }}
      >
        {imageUrls.map((url, index) => (
          <motion.button
            key={`${images[index]?.image}-${index}`}
            onClick={() => onImageSelect(index)}
            className={`
              relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300
              ${currentIndex === index 
                ? 'border-blue-400 ring-2 ring-blue-400/50 shadow-lg' 
                : 'border-slate-600 hover:border-slate-500'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src={url}
              alt={`Earth ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
              width={80}
            />
            
            {/* Image number overlay */}
            <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
              {index + 1}
            </div>
            
            {/* Current image indicator */}
            {currentIndex === index && (
              <div className="absolute inset-0 bg-blue-400/20 border-2 border-blue-400 rounded-lg" />
            )}
          </motion.button>
        ))}
      </div>
      
      {/* Navigation hint */}
      <div className="text-xs text-slate-400 mt-2 text-center">
        Click thumbnails to navigate • {currentIndex + 1} of {images.length} selected
      </div>
    </div>
  );
};

// Main EPIC Component
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
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Set max date to 2025-07-15
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

  // Reset zoom and pan when image changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [currentImageIndex, selectedDate]);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.2, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.2, 0.5));
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
    }
  }, [currentImageIndex, setCurrentImageIndex]);

  const formatCoordinate = (coord: number, type: 'lat' | 'lon'): string => {
    const direction = type === 'lat' ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'W');
    return `${Math.abs(coord).toFixed(2)}° ${direction}`;
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full"
        />
        <span className="ml-3 text-slate-400">Loading Earth imagery...</span>
      </div>
    );
  }

  if (!currentEPIC || !currentImageUrl) {
    return (
      <div className="h-full flex items-center justify-center text-center">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
          <GlobeAltIcon className="h-16 w-16 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Images Available</h3>
          <p className="text-slate-400">No EPIC images found for {selectedDate}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Date Picker Section */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 mb-4">
        <div className="flex items-center space-x-4">
          <CalendarDaysIcon className="h-5 w-5 text-blue-400" />
          <label className="text-white font-medium">Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            max={MAX_DATE}
            className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="text-slate-400 text-xs">
            (Available until {MAX_DATE})
          </span>
        </div>
      </div>

      {/* Thumbnail Gallery */}
      <ThumbnailGallery
        images={data.images}
        imageUrls={data.imageUrls}
        currentIndex={currentImageIndex}
        onImageSelect={handleThumbnailSelect}
      />

      {/* Mobile Layout */}
      <div className="block lg:hidden space-y-4 flex-1 overflow-y-auto">
        {/* Title Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
          <motion.h2
            key={currentEPIC.image}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg sm:text-xl font-bold text-white mb-3 leading-tight"
          >
            Earth from Space - {currentEPIC.date.split(' ')[0]}
          </motion.h2>

          {/* Controls Row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 5}
              className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-md hover:from-green-600 hover:to-teal-700 transition-all duration-300 hover:scale-105 shadow-lg text-xs sm:text-sm disabled:opacity-50"
            >
              <MagnifyingGlassPlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Zoom In</span>
            </button>

            <button
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-md hover:from-orange-600 hover:to-red-700 transition-all duration-300 hover:scale-105 shadow-lg text-xs sm:text-sm disabled:opacity-50"
            >
              <MagnifyingGlassMinusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Zoom Out</span>
            </button>

            <button
              onClick={handleResetView}
              className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-md hover:from-purple-600 hover:to-pink-700 transition-all duration-300 hover:scale-105 shadow-lg text-xs sm:text-sm"
            >
              <ArrowsRightLeftIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Reset</span>
            </button>

            <button
              onClick={() => openImageInNewTab(currentImageUrl)}
              className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-all duration-300 hover:scale-105 shadow-lg text-xs sm:text-sm"
            >
              <ArrowsPointingOutIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Full Size</span>
            </button>
          </div>

          {/* Zoom Indicator */}
          <div className="flex items-center space-x-2 text-xs sm:text-sm">
            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${zoom > 1 ? 'bg-green-400' : 'bg-blue-400'} animate-pulse`} />
            <span className="text-slate-400">
              Zoom: <span className={zoom > 1 ? 'text-green-400' : 'text-blue-400'}>{(zoom * 100).toFixed(0)}%</span>
            </span>
          </div>
        </div>

        {/* Image */}
        <motion.div
          key={currentEPIC.image}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative group"
        >
          <div 
            ref={containerRef}
            className="relative overflow-hidden rounded-xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 h-80 sm:h-96 cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <AnimatePresence mode="wait">
              <motion.img
                ref={imageRef}
                key={currentImageUrl + currentImageIndex}
                src={currentImageUrl}
                alt={`Earth from DSCOVR satellite on ${currentEPIC.date}`}
                className="w-full h-full object-contain rounded-xl"
                style={{
                  transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                  transformOrigin: 'center center'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: imageLoaded ? 1 : 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                onLoad={() => setImageLoaded(true)}
                onLoadStart={() => setImageLoaded(false)}
                onDoubleClick={() => zoom === 1 ? handleZoomIn() : handleResetView()}
                draggable={false}
              />
            </AnimatePresence>
            
            {/* Loading overlay */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50 backdrop-blur-sm">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full"
                />
              </div>
            )}

            {/* Zoom indicator overlay */}
            {zoom > 1 && (
              <div className="absolute top-3 left-3 px-2 py-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-green-400/50">
                <div className="flex items-center space-x-1">
                  <EyeIcon className="h-3 w-3" />
                  <span>{(zoom * 100).toFixed(0)}%</span>
                </div>
              </div>
            )}

            {/* Instructions overlay */}
            <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span>Scroll to zoom • Double-click to reset</span>
            </div>
          </div>
        </motion.div>

        {/* Description and Details */}
        <div className="grid gap-4">
          {/* Caption Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <GlobeAltIcon className="h-4 w-4 text-blue-400" />
              <h3 className="text-base font-semibold text-white">Image Details</h3>
            </div>
            <motion.p
              key={currentEPIC.caption}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-slate-300 leading-relaxed text-sm"
            >
              {currentEPIC.caption || "Earth observation from the DSCOVR satellite, positioned at the L1 Lagrange point approximately 1.5 million kilometers from Earth."}
            </motion.p>
          </div>

          {/* Coordinates Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
            <h3 className="text-base font-semibold text-white mb-3">Earth Center Coordinates</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex justify-between items-center py-1 border-b border-slate-700/30">
                <span className="text-slate-400 text-sm">Latitude</span>
                <span className="text-white font-medium text-sm">
                  {formatCoordinate(currentEPIC.centroid_coordinates.lat, 'lat')}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-700/30">
                <span className="text-slate-400 text-sm">Longitude</span>
                <span className="text-white font-medium text-sm">
                  {formatCoordinate(currentEPIC.centroid_coordinates.lon, 'lon')}
                </span>
              </div>
            </div>
          </div>

          {/* Metadata Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
            <h3 className="text-base font-semibold text-white mb-3">Technical Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-1 border-b border-slate-700/30">
                <span className="text-slate-400 text-sm">Date & Time</span>
                <span className="text-white font-medium text-sm">{currentEPIC.date}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-700/30">
                <span className="text-slate-400 text-sm">Image ID</span>
                <span className="text-white font-medium text-sm">{currentEPIC.image}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400 text-sm">Version</span>
                <span className="text-white font-medium text-sm">{currentEPIC.version}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex lg:flex-row gap-6 flex-1 min-h-0">
        {/* Left Info Panel */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-1/3 flex flex-col space-y-4 overflow-hidden"
        >
          {/* Title Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 flex-shrink-0">
            <motion.h2
              key={currentEPIC.image}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-white mb-3 leading-tight"
            >
              Earth from Space
            </motion.h2>
            <p className="text-slate-400 text-sm mb-4">{currentEPIC.date}</p>

            {/* Zoom Controls */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 5}
                className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-md hover:from-green-600 hover:to-teal-700 transition-all duration-300 hover:scale-105 shadow-lg text-sm disabled:opacity-50"
              >
                <MagnifyingGlassPlusIcon className="h-4 w-4" />
                <span>Zoom In</span>
              </button>

              <button
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-md hover:from-orange-600 hover:to-red-700 transition-all duration-300 hover:scale-105 shadow-lg text-sm disabled:opacity-50"
              >
                <MagnifyingGlassMinusIcon className="h-4 w-4" />
                <span>Zoom Out</span>
              </button>

              <button
                onClick={handleResetView}
                className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-md hover:from-purple-600 hover:to-pink-700 transition-all duration-300 hover:scale-105 shadow-lg text-sm"
              >
                <ArrowsRightLeftIcon className="h-4 w-4" />
                <span>Reset</span>
              </button>

              <button
                onClick={() => openImageInNewTab(currentImageUrl)}
                className="flex items-center space-x-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-all duration-300 hover:scale-105 shadow-lg text-sm"
              >
                <ArrowsPointingOutIcon className="h-4 w-4" />
                <span>Full Size</span>
              </button>
            </div>

            {/* Zoom Indicator */}
            <div className="flex items-center space-x-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${zoom > 1 ? 'bg-green-400' : 'bg-blue-400'} animate-pulse`} />
              <span className="text-slate-400">
                Zoom: <span className={zoom > 1 ? 'text-green-400' : 'text-blue-400'}>{(zoom * 100).toFixed(0)}%</span>
              </span>
            </div>
          </div>

          {/* Caption Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 flex-1 min-h-0">
            <div className="flex items-center space-x-2 mb-3">
              <GlobeAltIcon className="h-4 w-4 text-blue-400" />
              <h3 className="text-base font-semibold text-white">Image Details</h3>
            </div>
            <motion.div
              key={currentEPIC.caption}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="overflow-y-auto h-full"
            >
              <p className="text-slate-300 leading-relaxed text-sm pr-2">
                {currentEPIC.caption || "Earth observation from the DSCOVR satellite, positioned at the L1 Lagrange point approximately 1.5 million kilometers from Earth. This natural color image shows our planet as seen from deep space, capturing the full sunlit hemisphere."}
              </p>
            </motion.div>
          </div>

          {/* Coordinates Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 flex-shrink-0">
            <h3 className="text-base font-semibold text-white mb-3">Earth Center Coordinates</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-1 border-b border-slate-700/30">
                <span className="text-slate-400 text-sm">Latitude</span>
                <span className="text-white font-medium text-sm">
                  {formatCoordinate(currentEPIC.centroid_coordinates.lat, 'lat')}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-700/30">
                <span className="text-slate-400 text-sm">Longitude</span>
                <span className="text-white font-medium text-sm">
                  {formatCoordinate(currentEPIC.centroid_coordinates.lon, 'lon')}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400 text-sm">Image ID</span>
                <span className="text-white font-medium text-sm">{currentEPIC.image}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Image Panel */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-2/3 flex items-center justify-center"
        >
          <motion.div
            key={currentEPIC.image}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative group w-full h-full max-h-[calc(100vh-200px)] flex items-center justify-center"
          >
            <div 
              ref={containerRef}
              className="relative overflow-hidden rounded-xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  ref={imageRef}
                  key={currentImageUrl + currentImageIndex}
                  src={currentImageUrl}
                  alt={`Earth from DSCOVR satellite on ${currentEPIC.date}`}
                  className="max-w-full max-h-full object-contain rounded-xl"
                  style={{
                    transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                    transformOrigin: 'center center'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: imageLoaded ? 1 : 0.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  onLoad={() => setImageLoaded(true)}
                  onLoadStart={() => setImageLoaded(false)}
                  onDoubleClick={() => zoom === 1 ? handleZoomIn() : handleResetView()}
                  draggable={false}
                />
              </AnimatePresence>
              
              {/* Loading overlay */}
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50 backdrop-blur-sm">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full"
                  />
                </div>
              )}

              {/* Zoom indicator */}
              {zoom > 1 && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-green-500/90 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-green-400/50">
                  <div className="flex items-center space-x-1">
                    <EyeIcon className="h-4 w-4" />
                    <span>{(zoom * 100).toFixed(0)}%</span>
                  </div>
                </div>
              )}

              {/* Instructions overlay */}
              <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Scroll to zoom • Drag to pan • Double-click to reset</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default EPICImageInfo;
