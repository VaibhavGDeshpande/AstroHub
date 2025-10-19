'use client'
import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import {
  PhotoIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import { EPICImage } from '@/types/epic';

interface ThumbnailSidebarProps {
  images: EPICImage[];
  imageUrls: string[];
  currentIndex: number;
  onImageSelect: (index: number) => void;
  onDateModalOpen: () => void;
}

// Mobile-optimized Thumbnail Sidebar/Bottom Bar
const ThumbnailSidebar: React.FC<ThumbnailSidebarProps> = ({ 
  images, 
  imageUrls, 
  currentIndex, 
  onImageSelect, 
  onDateModalOpen 
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current image with responsive behavior
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
        transition={{ delay: 0.3, duration: 0.5 }} 
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
              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors duration-300 border border-blue-500/30" 
            >
              <CalendarDaysIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden mb-3">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
            transition={{ duration: 0.6 }} 
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
                  relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden duration-400
                  ${currentIndex === index
                    ? 'ring-2 ring-blue-400 ring-offset-1 ring-offset-slate-900 scale-110' 
                    : 'ring-1 ring-slate-600/50 opacity-60'
                  }
                `}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }} 
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
                    transition={{ duration: 0.4 }} 
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Desktop Sidebar Layout */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }} 
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
          
          <div className="flex">
            <button
              onClick={onDateModalOpen}
              className="flex items-center justify-center space-x-1 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors duration-300 border border-blue-500/30 text-xs w-full" 
            >
              <CalendarDaysIcon className="h-3 w-3" />
              <span>Select Date</span>
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
              transition={{ duration: 0.6 }} 
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
                  relative w-full aspect-square rounded-lg overflow-hidden transition-all duration-400 group
                  ${currentIndex === index
                    ? 'ring-2 ring-blue-400 ring-offset-1 ring-offset-slate-900 shadow-xl scale-105' 
                    : 'ring-1 ring-slate-600/50 hover:ring-slate-500/70 hover:scale-102'
                  }
                `}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }} 
                layout
              >
                <img
                  src={url}
                  alt={`Earth ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-110" 
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

                {currentIndex === index && (
                  <motion.div 
                    className="absolute inset-0 bg-blue-400/20 border border-blue-400/60 rounded-lg" 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }} 
                  />
                )}

                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center">
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

export default ThumbnailSidebar;