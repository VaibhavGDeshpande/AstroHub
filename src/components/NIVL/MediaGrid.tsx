'use client'
import { motion } from 'framer-motion';
import {
  PhotoIcon,
  VideoCameraIcon,
  SpeakerWaveIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import { MediaGridProps } from '../../types/nivl';

const MediaGrid: React.FC<MediaGridProps> = ({ items, onItemClick, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700/50 animate-pulse">
            <div className="aspect-video bg-slate-700/50" />
            <div className="p-3 space-y-2">
              <div className="h-4 bg-slate-700/50 rounded" />
              <div className="h-3 bg-slate-700/50 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
      {items.map((item, index) => {
        const data = item.data[0];
        const previewLink = item.links?.find(link => link.rel === 'preview');
        const isVideo = data.media_type === 'video';
        const isAudio = data.media_type === 'audio';

        return (
          <motion.div
            key={`${data.nasa_id}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            onClick={() => onItemClick(item)}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden cursor-pointer hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group"
          >
            {/* Media Preview */}
            <div className="relative aspect-video bg-slate-700/30 overflow-hidden">
              {previewLink && !isAudio && (
                <img
                  src={previewLink.href}
                  alt={data.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              )}
              
              {isAudio && (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600/20 to-pink-600/20">
                  <SpeakerWaveIcon className="h-16 w-16 text-purple-400" />
                </div>
              )}

              {/* Media type indicator */}
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs text-white flex items-center space-x-1">
                {isVideo && <VideoCameraIcon className="h-3 w-3" />}
                {isAudio && <SpeakerWaveIcon className="h-3 w-3" />}
                {!isVideo && !isAudio && <PhotoIcon className="h-3 w-3" />}
                <span className="capitalize">{data.media_type}</span>
              </div>

              {/* Play button for videos */}
              {isVideo && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-blue-500/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <PlayIcon className="h-6 w-6 text-white ml-1" />
                  </div>
                </div>
              )}

              {/* Date */}
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-xs text-white">
                {new Date(data.date_created).getFullYear()}
              </div>
            </div>

            {/* Content */}
            <div className="p-3">
              <h3 className="text-white font-medium text-sm line-clamp-2 mb-1 leading-tight">
                {data.title}
              </h3>
              <p className="text-slate-400 text-xs line-clamp-2 mb-2 leading-relaxed">
                {data.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-blue-400 text-xs font-medium">
                  {data.center || 'NASA'}
                </span>
                <span className="text-slate-500 text-xs font-mono">
                  {data.nasa_id}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MediaGrid;