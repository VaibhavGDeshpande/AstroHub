// components/MarsOrbiter/MarsPhotoCard.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  ArrowTopRightOnSquareIcon, 
  CameraIcon,
  CalendarDaysIcon,
  RocketLaunchIcon,
  SignalIcon
} from '@heroicons/react/24/outline';
import { MarsOrbiter } from '@/types/mars_orbiter';

interface MarsPhotoCardProps {
  photo: MarsOrbiter;
  onOpenFull?: (url: string) => void;
}

export default function MarsPhotoCard({ photo, onOpenFull }: MarsPhotoCardProps) {
  const [loaded, setLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setLoaded(true);
    setImageError(true);
  };

  const openImageInNewTab = () => {
    if (!imageError && photo.img_src) {
      onOpenFull?.(photo.img_src);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ 
        duration: 0.4,
        hover: { duration: 0.2 }
      }}
      className="group bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm border border-slate-600/40 hover:border-slate-500/60 rounded-xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl"
    >
      {/* Image Section */}
      <div className="relative aspect-square bg-gradient-to-br from-slate-800/30 to-slate-900/50 overflow-hidden">
        <AnimatePresence mode="wait">
          {!imageError ? (
            <motion.img
              key={photo.img_src}
              src={photo.img_src}
              alt={`Mars surface captured by ${photo.camera.full_name} on ${photo.earth_date}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              initial={{ opacity: 0 }}
              animate={{ opacity: loaded ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              onLoad={handleImageLoad}
              onError={handleImageError}
              draggable={false}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full flex items-center justify-center bg-slate-800/60"
            >
              <div className="text-center">
                <CameraIcon className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">Image unavailable</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {!loaded && !imageError && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-slate-800/60 backdrop-blur-sm"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-blue-500/30 rounded-full mx-auto mb-2"
                style={{ borderTopColor: 'rgb(59 130 246)' }}
              />
              <p className="text-slate-300 text-sm">Loading Mars image...</p>
            </div>
          </motion.div>
        )}

        {/* Camera Badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute top-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-md text-white text-xs rounded-full flex items-center gap-1.5 border border-white/10"
        >
          <CameraIcon className="h-3 w-3 text-blue-400" />
          <span className="font-medium">{photo.camera.name}</span>
        </motion.div>

        {/* Full Size Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <motion.button
            onClick={openImageInNewTab}
            disabled={imageError}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white text-xs rounded-full shadow-lg transition-all duration-300 flex items-center gap-1.5 font-medium disabled:cursor-not-allowed"
          >
            <ArrowTopRightOnSquareIcon className="h-3 w-3" />
            <span>View Full</span>
          </motion.button>
        </motion.div>

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-1 leading-tight group-hover:text-blue-300 transition-colors duration-300">
            {photo.camera.full_name}
          </h3>
          <p className="text-sm text-slate-400">
            Martian surface imagery
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Sol */}
          <div className="bg-slate-700/30 rounded-lg p-2.5 border border-slate-600/30">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-orange-400" />
              <span className="text-xs text-slate-400 uppercase tracking-wide">Sol</span>
            </div>
            <span className="text-sm text-white font-semibold">{photo.sol}</span>
          </div>

          {/* Earth Date */}
          <div className="bg-slate-700/30 rounded-lg p-2.5 border border-slate-600/30">
            <div className="flex items-center gap-2 mb-1">
              <CalendarDaysIcon className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-slate-400 uppercase tracking-wide">Earth Date</span>
            </div>
            <span className="text-sm text-white font-semibold">{photo.earth_date}</span>
          </div>

          {/* Rover */}
          <div className="bg-slate-700/30 rounded-lg p-2.5 border border-slate-600/30">
            <div className="flex items-center gap-2 mb-1">
              <RocketLaunchIcon className="w-3 h-3 text-purple-400" />
              <span className="text-xs text-slate-400 uppercase tracking-wide">Rover</span>
            </div>
            <span className="text-sm text-white font-semibold capitalize">{photo.rover.name}</span>
          </div>

          {/* Status */}
          <div className="bg-slate-700/30 rounded-lg p-2.5 border border-slate-600/30">
            <div className="flex items-center gap-2 mb-1">
              <SignalIcon className="w-3 h-3 text-green-400" />
              <span className="text-xs text-slate-400 uppercase tracking-wide">Status</span>
            </div>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                photo.rover.status === 'active'
                  ? 'bg-green-500/20 text-green-300 border border-green-400/40'
                  : 'bg-slate-500/20 text-slate-300 border border-slate-400/40'
              }`}
            >
              {photo.rover.status}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-600/30">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Photo ID: <span className="text-slate-300 font-mono">{photo.id}</span>
            </p>
            <motion.div
              className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-60 group-hover:opacity-100"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
