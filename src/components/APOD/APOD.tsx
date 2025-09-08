// components/APOD/APOD.tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VideoCameraIcon,
  ArrowTopRightOnSquareIcon,
  SparklesIcon,
  EyeIcon,
  ClockIcon,
  ArrowsPointingOutIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

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

  return (
    <div className="h-full flex flex-col">
      {/* Desktop Search Section */}
      {searchSection}

      {/* Mobile Layout */}
      <div className="block lg:hidden space-y-4 flex-1 overflow-y-auto">
        {/* Title Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
          <motion.h2
            key={currentAPOD.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg sm:text-xl font-bold text-white mb-3 leading-tight"
          >
            {currentAPOD.title}
          </motion.h2>

          {/* Controls Row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {hasHDVersion && currentAPOD.media_type === 'image' && (
              <button
                onClick={() => setUseHD(!useHD)}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg text-xs sm:text-sm"
              >
                <EyeIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{useHD ? 'Standard' : 'HD'}</span>
              </button>
            )}

            {currentAPOD.media_type === 'image' && (
              <button
                onClick={() => openImageInNewTab(imageUrl)}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-md transition-all duration-300 hover:scale-105 shadow-lg text-xs sm:text-sm"
              >
                <ArrowsPointingOutIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Full Size</span>
              </button>
            )}

            <div className="flex items-center space-x-2 text-xs sm:text-sm">
              <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${useHD ? 'bg-green-400' : 'bg-blue-400'} animate-pulse`} />
              <span className="text-slate-400">
                <span className={useHD ? 'text-green-400' : 'text-blue-400'}>{useHD ? 'HD' : 'Standard'}</span>
              </span>
            </div>
          </div>

          {/* Navigation for multiple images */}
          {isMultipleImages && navigateImages && (
            <div className="flex items-center justify-between pt-3 border-t border-slate-700/30">
              <button
                onClick={() => navigateImages('prev')}
                disabled={currentImageIndex === 0}
                className="flex items-center space-x-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition-colors duration-300 text-sm"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                <span>Prev</span>
              </button>
              
              <span className="text-slate-400 text-sm">
                {currentImageIndex + 1} of {(data as APODData[]).length}
              </span>
              
              <button
                onClick={() => navigateImages('next')}
                disabled={currentImageIndex === (data as APODData[]).length - 1}
                className="flex items-center space-x-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition-colors duration-300 text-sm"
              >
                <span>Next</span>
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Image */}
        <motion.div
          key={currentAPOD.date}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative group"
        >
          {currentAPOD.media_type === 'image' ? (
            <div className="relative overflow-hidden rounded-xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/50">
              <AnimatePresence mode="wait">
                <motion.img
                  key={imageUrl + currentImageIndex}
                  src={imageUrl}
                  alt={currentAPOD.title}
                  className="w-full h-64 sm:h-80 md:h-96 object-contain rounded-xl cursor-pointer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: imageLoaded ? 1 : 0.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  onLoad={() => setImageLoaded(true)}
                  onLoadStart={() => setImageLoaded(false)}
                  onClick={() => openImageInNewTab(imageUrl)}
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

              {/* HD indicator */}
              <AnimatePresence>
                {useHD && currentAPOD.hdurl && imageLoaded && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute top-3 left-3 px-2 py-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-green-400/50"
                  >
                    <div className="flex items-center space-x-1">
                      <SparklesIcon className="h-3 w-3" />
                      <span>HD</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Full screen indicator */}
              <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center space-x-1">
                  <ArrowsPointingOutIcon className="h-3 w-3" />
                  <span>Full Size</span>
                </div>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 sm:p-8 text-center h-64 sm:h-80 flex flex-col justify-center"
            >
              <VideoCameraIcon className="h-12 w-12 sm:h-16 sm:w-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Today&apos;s APOD is a Video</h3>
              <p className="text-slate-400 mb-6 text-sm sm:text-base">Experience this cosmic wonder in motion</p>
              <a
                href={currentAPOD.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-500 to-purple-600 text-white rounded-lg hover:from-red-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg mx-auto text-sm sm:text-base"
              >
                <span>Watch Video</span>
                <ArrowTopRightOnSquareIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </motion.div>
          )}
        </motion.div>

        {/* Description and Details */}
        <div className="grid gap-4">
          {/* Description Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <ClockIcon className="h-4 w-4 text-blue-400" />
              <h3 className="text-base font-semibold text-white">Discovery Details</h3>
            </div>
            <motion.p
              key={currentAPOD.explanation}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-slate-300 leading-relaxed text-sm max-h-32 sm:max-h-40 overflow-y-auto"
            >
              {currentAPOD.explanation}
            </motion.p>
          </div>

          {/* Metadata Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
            <h3 className="text-base font-semibold text-white mb-3">Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-1 border-b border-slate-700/30">
                <span className="text-slate-400 text-sm">Date</span>
                <span className="text-white font-medium text-sm">{currentAPOD.date}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-700/30">
                <span className="text-slate-400 text-sm">Type</span>
                <span className="text-white font-medium text-sm capitalize">{currentAPOD.media_type}</span>
              </div>
              {currentAPOD.copyright && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400 text-sm">Copyright</span>
                  <span className="text-white font-medium text-sm">© {currentAPOD.copyright}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - FIXED */}
      <div className="hidden lg:flex lg:flex-row gap-6 flex-1 min-h-0">
        {/* Left Info Panel */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-2/5 flex flex-col space-y-4 overflow-hidden"
        >
          {/* Title Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 flex-shrink-0">
            <motion.h2
              key={currentAPOD.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-white mb-3 leading-tight"
            >
              {currentAPOD.title}
            </motion.h2>

            {/* Controls Row */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {hasHDVersion && currentAPOD.media_type === 'image' && (
                <button
                  onClick={() => setUseHD(!useHD)}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg text-sm"
                >
                  <EyeIcon className="h-4 w-4" />
                  <span>{useHD ? 'Standard' : 'HD'}</span>
                </button>
              )}

              {currentAPOD.media_type === 'image' && (
                <button
                  onClick={() => openImageInNewTab(imageUrl)}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-md transition-all duration-300 hover:scale-105 shadow-lg text-sm"
                >
                  <ArrowsPointingOutIcon className="h-4 w-4" />
                  <span>Full Size</span>
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2 text-sm mb-3">
              <div className={`w-2 h-2 rounded-full ${useHD ? 'bg-green-400' : 'bg-blue-400'} animate-pulse`} />
              <span className="text-slate-400">
                <span className={useHD ? 'text-green-400' : 'text-blue-400'}>{useHD ? 'HD' : 'Standard'}</span> quality
              </span>
            </div>

            {/* Navigation for multiple images */}
            {isMultipleImages && navigateImages && (
              <div className="flex items-center justify-between pt-3 border-t border-slate-700/30">
                <button
                  onClick={() => navigateImages('prev')}
                  disabled={currentImageIndex === 0}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition-colors duration-300 text-sm"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  <span>Prev</span>
                </button>
                
                <span className="text-slate-400 text-sm">
                  {currentImageIndex + 1} of {(data as APODData[]).length}
                </span>
                
                <button
                  onClick={() => navigateImages('next')}
                  disabled={currentImageIndex === (data as APODData[]).length - 1}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition-colors duration-300 text-sm"
                >
                  <span>Next</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Description Card - Scrollable */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 flex-1 min-h-0">
            <div className="flex items-center space-x-2 mb-3">
              <ClockIcon className="h-4 w-4 text-blue-400" />
              <h3 className="text-base font-semibold text-white">Discovery Details</h3>
            </div>
            <motion.div
              key={currentAPOD.explanation}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="overflow-y-auto h-full"
            >
              <p className="text-slate-300 leading-relaxed text-sm pr-2">
                {currentAPOD.explanation}
              </p>
            </motion.div>
          </div>

          {/* Metadata Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 flex-shrink-0">
            <h3 className="text-base font-semibold text-white mb-3">Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-1 border-b border-slate-700/30">
                <span className="text-slate-400 text-sm">Date</span>
                <span className="text-white font-medium text-sm">{currentAPOD.date}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-700/30">
                <span className="text-slate-400 text-sm">Type</span>
                <span className="text-white font-medium text-sm capitalize">{currentAPOD.media_type}</span>
              </div>
              {currentAPOD.copyright && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400 text-sm">Copyright</span>
                  <span className="text-white font-medium text-sm">© {currentAPOD.copyright}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Image Panel - FIXED */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-3/5 flex items-center justify-center"
        >
          <motion.div
            key={currentAPOD.date}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative group w-full h-full max-h-[calc(100vh-280px)] flex items-center justify-center"
          >
            {currentAPOD.media_type === 'image' ? (
              <div className="relative overflow-hidden rounded-xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 w-full h-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={imageUrl + currentImageIndex}
                    src={imageUrl}
                    alt={currentAPOD.title}
                    className="max-w-full max-h-full object-contain rounded-xl cursor-pointer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: imageLoaded ? 1 : 0.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    onLoad={() => setImageLoaded(true)}
                    onLoadStart={() => setImageLoaded(false)}
                    onClick={() => openImageInNewTab(imageUrl)}
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

                {/* HD indicator */}
                <AnimatePresence>
                  {useHD && currentAPOD.hdurl && imageLoaded && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute top-4 left-4 px-3 py-1 bg-green-500/90 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-green-400/50"
                    >
                      <div className="flex items-center space-x-1">
                        <SparklesIcon className="h-4 w-4" />
                        <span>HD</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Full screen indicator */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center space-x-1">
                    <ArrowsPointingOutIcon className="h-4 w-4" />
                    <span>Click for Full Size</span>
                  </div>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 text-center w-full max-w-md flex flex-col justify-center"
              >
                <VideoCameraIcon className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-4">Today&apos;s APOD is a Video</h3>
                <p className="text-slate-400 mb-6">Experience this cosmic wonder in motion</p>
                <a
                  href={currentAPOD.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-purple-600 text-white rounded-lg hover:from-red-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg mx-auto"
                >
                  <span>Watch Video</span>
                  <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                </a>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default APODImageInfo;