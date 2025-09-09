// components/MarsPhotoCard.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ArrowTopRightOnSquareIcon, CameraIcon } from '@heroicons/react/24/outline';
import { MarsOrbiter } from '@/types/mars_orbiter';

interface MarsPhotoCardProps {
  photo: MarsOrbiter;
  onOpenFull?: (url: string) => void;
}

export default function MarsPhotoCard({ photo, onOpenFull }: MarsPhotoCardProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.35 }}
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-600/50 transition-colors duration-300"
    >
      <div className="relative aspect-square bg-slate-800/30">
        <AnimatePresence mode="wait">
          <motion.img
            key={photo.img_src}
            src={photo.img_src}
            alt={`Mars photo from ${photo.camera.full_name}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: loaded ? 1 : 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onLoad={() => setLoaded(true)}
            draggable={false}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </AnimatePresence>

        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800/40 backdrop-blur-sm">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-8 h-8 border-2 border-blue-500/30 border-top-blue-500 rounded-full"
              style={{ borderTopColor: 'rgb(59 130 246)' }}
            />
          </div>
        )}

        <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full flex items-center gap-1">
          <CameraIcon className="h-3 w-3" />
          <span>{photo.camera.name}</span>
        </div>

        <div className="absolute bottom-3 right-3">
          <button
            onClick={() => onOpenFull?.(photo.img_src)}
            className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-1"
          >
            <ArrowTopRightOnSquareIcon className="h-3 w-3" />
            <span>Full Size</span>
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-white mb-1 leading-tight">
            {photo.camera.full_name}
          </h3>
          <p className="text-sm text-slate-400">
            Camera: <span className="text-slate-300 font-medium">{photo.camera.name}</span>
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center py-1 border-b border-slate-700/30">
            <span className="text-sm text-slate-400">Sol</span>
            <span className="text-sm text-white font-medium">{photo.sol}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-slate-700/30">
            <span className="text-sm text-slate-400">Earth Date</span>
            <span className="text-sm text-white font-medium">{photo.earth_date}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-slate-700/30">
            <span className="text-sm text-slate-400">Rover</span>
            <span className="text-sm text-white font-medium capitalize">{photo.rover.name}</span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-sm text-slate-400">Status</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                photo.rover.status === 'active'
                  ? 'bg-green-500/20 text-green-300 border border-green-400/40'
                  : 'bg-slate-600/30 text-slate-300 border border-slate-500/40'
              }`}
            >
              {photo.rover.status}
            </span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-700/30">
          <p className="text-xs text-slate-400">
            Photo ID: <span className="text-slate-300">{photo.id}</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
