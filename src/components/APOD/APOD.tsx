// components/APOD/APOD.tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VideoCameraIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

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

interface APODImageInfoProps {
  data: APODData | APODData[];
  currentImageIndex: number;
  useHD: boolean;
  setUseHD: (useHD: boolean) => void;
  imageLoaded: boolean;
  setImageLoaded: (loaded: boolean) => void;
  openImageInNewTab: (url: string) => void;
  navigateImages?: (direction: 'prev' | 'next') => void;
  searchSection?: React.ReactNode;
}

const APODImageInfo: React.FC<APODImageInfoProps> = ({
  data,
  currentImageIndex,
  useHD,
  setUseHD,
  imageLoaded,
  setImageLoaded,
  openImageInNewTab,
  navigateImages,
  searchSection
}) => {
  const getCurrentData = (): APODData => {
    if (Array.isArray(data)) {
      return data[currentImageIndex] || data[0];
    }
    return data as APODData;
  };

  const currentAPOD = getCurrentData();
  const imageUrl = useHD && currentAPOD.hdurl ? currentAPOD.hdurl : currentAPOD.url;
  const hasHDVersion = !!currentAPOD.hdurl;
  const isMultipleImages = Array.isArray(data) && data.length > 1;

  // State for "See More"
  const [seeMore, setSeeMore] = useState(false);

  // Function to shorten text
  const getShortText = (text: string, limit: number) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  };

  return (
    <div className="h-full flex flex-col">
      {/* NASA Funding Lapse Disclaimer */}
      <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
        <div className="flex items-start gap-2 sm:gap-3">
          <ExclamationTriangleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-yellow-400 font-semibold mb-1 text-sm sm:text-base">Notice</h3>
            <p className="text-yellow-200/90 text-xs sm:text-sm leading-relaxed">
              Due to the lapse in federal government funding, NASA is not updating this website. We sincerely regret this inconvenience.
            </p>
          </div>
        </div>
      </div>

      {/* Search Section - Shown on all devices */}
      <div className="mb-4">
        {searchSection}
      </div>

      {/* Mobile & Tablet Layout (Hidden on Desktop) */}
      <div className="block lg:hidden space-y-4 flex-1 overflow-y-auto">
        {/* Date */}
        <div className="text-xl sm:text-2xl font-bold text-blue-400">
          {currentAPOD.date}
        </div>

        {/* Image/Video Section */}
        <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4">
          {currentAPOD.media_type === 'image' ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={imageUrl + currentImageIndex}
                className="relative w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <img
                  src={imageUrl}
                  alt={currentAPOD.title}
                  className="w-full h-auto max-h-[60vh] sm:max-h-[70vh] object-contain rounded-lg cursor-pointer"
                  onLoad={() => setImageLoaded(true)}
                  onLoadStart={() => setImageLoaded(false)}
                  onClick={() => openImageInNewTab(imageUrl)}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 rounded-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div className="py-8 sm:py-12 text-center">
              <VideoCameraIcon className="h-12 w-12 sm:h-16 sm:w-16 text-blue-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Today&apos;s APOD is a Video</h3>
              <a
                href={currentAPOD.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-red-500 to-purple-600 text-white rounded-lg shadow-lg text-sm sm:text-base font-medium hover:scale-105 transition-transform"
              >
                Watch Video
              </a>
            </motion.div>
          )}
        </div>

        {/* Title + Controls */}
        <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4">
          <motion.h2 className="text-lg sm:text-xl font-bold text-white mb-3">
            {currentAPOD.title}
          </motion.h2>

          {/* Control Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {hasHDVersion && currentAPOD.media_type === 'image' && (
              <button
                onClick={() => setUseHD(!useHD)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md text-xs sm:text-sm font-medium hover:scale-105 transition-transform"
              >
                {useHD ? 'Standard Quality' : 'HD Quality'}
              </button>
            )}
          </div>

          {/* Navigation for Multiple Images */}
          {isMultipleImages && navigateImages && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/30">
              <button
                onClick={() => navigateImages('prev')}
                disabled={currentImageIndex === 0}
                className="flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors text-xs sm:text-sm"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </button>
              <span className="text-slate-400 text-xs sm:text-sm font-medium">
                {currentImageIndex + 1} / {(data as APODData[]).length}
              </span>
              <button
                onClick={() => navigateImages('next')}
                disabled={currentImageIndex === (data as APODData[]).length - 1}
                className="flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4">
          <div className="flex items-center space-x-2 mb-3">
            <ClockIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
            <h3 className="text-base sm:text-lg font-semibold text-white">Discovery Details</h3>
          </div>
          <motion.p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-2">
            {seeMore ? currentAPOD.explanation : getShortText(currentAPOD.explanation, 200)}
          </motion.p>
          {currentAPOD.explanation.length > 200 && (
            <button
              onClick={() => setSeeMore(!seeMore)}
              className="text-blue-400 hover:text-blue-300 hover:underline text-xs sm:text-sm font-medium transition-colors"
            >
              {seeMore ? "See Less" : "See More"}
            </button>
          )}
        </div>

        {/* Metadata */}
        <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4">
          <h4 className="text-sm sm:text-base font-semibold text-white mb-2">Information</h4>
          <div className="space-y-2">
            {currentAPOD.copyright && (
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs sm:text-sm">
                <span className="text-slate-400">Copyright</span>
                <span className="text-white font-medium">© {currentAPOD.copyright}</span>
              </div>
            )}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs sm:text-sm">
              <span className="text-slate-400">Media Type</span>
              <span className="text-white font-medium capitalize">{currentAPOD.media_type}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout (Hidden on Mobile/Tablet) */}
      <div className="hidden lg:flex flex-1 overflow-y-auto gap-8 xl:gap-10">
        {/* Left Side: Date + Info */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          {/* Date */}
          <div className="text-2xl xl:text-3xl font-bold text-blue-400">
            {currentAPOD.date}
          </div>

          {/* Title + Controls */}
          <div className="bg-slate-800/50 rounded-xl p-4 xl:p-5">
            <motion.h2 className="text-xl xl:text-2xl font-bold text-white mb-4">
              {currentAPOD.title}
            </motion.h2>

            <div className="flex items-center gap-2">
              {hasHDVersion && currentAPOD.media_type === 'image' && (
                <button
                  onClick={() => setUseHD(!useHD)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md text-sm font-medium hover:scale-105 transition-transform"
                >
                  {useHD ? 'Standard Quality' : 'HD Quality'}
                </button>
              )}
            </div>

            {isMultipleImages && navigateImages && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/30">
                <button
                  onClick={() => navigateImages('prev')}
                  disabled={currentImageIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  Previous
                </button>
                <span className="text-slate-400 text-sm font-medium">
                  {currentImageIndex + 1} of {(data as APODData[]).length}
                </span>
                <button
                  onClick={() => navigateImages('next')}
                  disabled={currentImageIndex === (data as APODData[]).length - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
                >
                  Next
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Description with See More */}
          <div className="bg-slate-800/50 rounded-xl p-4 xl:p-5">
            <div className="flex items-center space-x-2 mb-3">
              <ClockIcon className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Discovery Details</h3>
            </div>
            <motion.p className="text-slate-300 text-sm leading-relaxed mb-2">
              {seeMore ? currentAPOD.explanation : getShortText(currentAPOD.explanation, 300)}
            </motion.p>
            {currentAPOD.explanation.length > 300 && (
              <button
                onClick={() => setSeeMore(!seeMore)}
                className="text-blue-400 hover:text-blue-300 hover:underline text-sm font-medium transition-colors"
              >
                {seeMore ? "See Less" : "See More"}
              </button>
            )}
          </div>

          {/* Metadata */}
          <div className="bg-slate-800/50 rounded-xl p-4 xl:p-5">
            <h4 className="text-base font-semibold text-white mb-3">Information</h4>
            <div className="space-y-2">
              {currentAPOD.copyright && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Copyright</span>
                  <span className="text-white font-medium">© {currentAPOD.copyright}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Media Type</span>
                <span className="text-white font-medium capitalize">{currentAPOD.media_type}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Large Image */}
        <div className="flex-1 flex items-center justify-center min-w-0">
          <div className="w-full h-full flex items-center justify-center bg-slate-800/30 rounded-xl p-4">
            {currentAPOD.media_type === 'image' ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={imageUrl + currentImageIndex}
                  className="relative w-full h-full flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <img
                    src={imageUrl}
                    alt={currentAPOD.title}
                    className="max-w-full max-h-[650px] xl:max-h-[750px] object-contain cursor-pointer rounded-lg"
                    onLoad={() => setImageLoaded(true)}
                    onLoadStart={() => setImageLoaded(false)}
                    onClick={() => openImageInNewTab(imageUrl)}
                  />
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400"></div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            ) : (
              <motion.div className="p-8 text-center w-full flex flex-col justify-center">
                <VideoCameraIcon className="h-20 w-20 text-blue-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-4">Today&apos;s APOD is a Video</h3>
                <a
                  href={currentAPOD.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 bg-gradient-to-r from-red-500 to-purple-600 text-white rounded-lg shadow-lg mx-auto font-semibold hover:scale-105 transition-transform"
                >
                  Watch Video
                </a>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default APODImageInfo;
