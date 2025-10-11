// components/APOD/APOD.tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VideoCameraIcon,
  ClockIcon,
  ExclamationTriangleIcon,
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
      <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-yellow-400 font-semibold mb-1">Notice</h3>
            <p className="text-yellow-200/90 text-sm">
              Due to the lapse in federal government funding, NASA is not updating this website. We sincerely regret this inconvenience.
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Search Section */}
      {searchSection}

      {/* Mobile Layout */}
      <div className="block lg:hidden space-y-4 flex-1 overflow-y-auto">
        {/* Mobile version stays the same */}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-1 overflow-y-auto gap-10">
        {/* Left Side: Date + Info */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Date */}
          <div className="text-2xl font-bold text-blue-400">
            {currentAPOD.date}
          </div>

          {/* Title + Controls */}
          <div className="bg-slate-800/50 rounded-xl p-4">
            <motion.h2 className="text-xl font-bold text-white mb-3">
              {currentAPOD.title}
            </motion.h2>

            <div className="flex items-center gap-1">
              {hasHDVersion && currentAPOD.media_type === 'image' && (
                <button
                  onClick={() => setUseHD(!useHD)}
                  className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md text-sm"
                >
                  {useHD ? 'Standard' : 'HD'}
                </button>
              )}
            </div>

            {isMultipleImages && navigateImages && (
              <div className="flex items-center justify-between pt-1 border-t border-slate-700/30">
                <button
                  onClick={() => navigateImages('prev')}
                  disabled={currentImageIndex === 0}
                  className="px-3 py-1.5 bg-slate-700 text-white rounded-md disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-slate-400 text-sm">
                  {currentImageIndex + 1} of {(data as APODData[]).length}
                </span>
                <button
                  onClick={() => navigateImages('next')}
                  disabled={currentImageIndex === (data as APODData[]).length - 1}
                  className="px-3 py-1.5 bg-slate-700 text-white rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Description with See More */}
          <div className="bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <ClockIcon className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Discovery Details</h3>
            </div>
            <motion.p className="text-slate-300 text-sm mb-2">
              {seeMore ? currentAPOD.explanation : getShortText(currentAPOD.explanation, 250)}
            </motion.p>
            {currentAPOD.explanation.length > 250 && (
              <button
                onClick={() => setSeeMore(!seeMore)}
                className="text-blue-400 hover:underline text-sm"
              >
                {seeMore ? "See Less" : "See More"}
              </button>
            )}
          </div>

          {/* Metadata */}
          <div className="bg-slate-800/50 rounded-xl p-4">
            <div className="space-y-2">
              {currentAPOD.copyright && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Copyright</span>
                  <span className="text-white">© {currentAPOD.copyright}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Large Image */}
        <div className="flex-1 flex items-center justify-center">
          {currentAPOD.media_type === 'image' ? (
            <AnimatePresence mode="wait">
              <motion.img
                key={imageUrl + currentImageIndex}
                src={imageUrl}
                alt={currentAPOD.title}
                className="w-full h-full max-h-[650px] object-contain cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: imageLoaded ? 1 : 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                onLoad={() => setImageLoaded(true)}
                onLoadStart={() => setImageLoaded(false)}
                onClick={() => openImageInNewTab(imageUrl)}
              />
            </AnimatePresence>
          ) : (
            <motion.div className="p-8 text-center w-full flex flex-col justify-center">
              <VideoCameraIcon className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-4">Today&apos;s APOD is a Video</h3>
              <a
                href={currentAPOD.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-purple-600 text-white rounded-lg shadow-lg mx-auto"
              >
                Watch Video
              </a>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default APODImageInfo;
