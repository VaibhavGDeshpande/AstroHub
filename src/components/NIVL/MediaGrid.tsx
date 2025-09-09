'use client';

import { NivlItem } from '@/types/nivl';
import { motion } from 'framer-motion';
import { PhotoIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

interface MediaGridProps {
  items: NivlItem[];
  onItemClick: (item: NivlItem) => void;
  loading: boolean;
}

const MediaGrid: React.FC<MediaGridProps> = ({ items, onItemClick, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full"
        />
        <span className="ml-3 text-slate-400">Loading media...</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl">
        <p className="text-slate-400">No results found. Try adjusting your search filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item, index) => {
        const previewUrl = item.links.find(link => link.rel === 'preview')?.href;
        const mediaType = item.data[0]?.media_type;
        const isVideo = mediaType === 'video';
        const isImage = mediaType === 'image';
        
        return (
          <motion.div
            key={item.data[0]?.nasa_id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 relative"
            onClick={() => onItemClick(item)}
          >
            {/* Media Type Tag */}
            <div className="absolute top-3 left-3 z-10">
              <div className={`
                flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm border
                ${isVideo 
                  ? 'bg-blue-500/90 text-white border-blue-400/50' 
                  : isImage 
                    ? 'bg-green-500/90 text-white border-green-400/50'
                    : 'bg-purple-500/90 text-white border-purple-400/50'
                }
              `}>
                {isVideo ? (
                  <>
                    <VideoCameraIcon className="h-3 w-3" />
                    <span>Video</span>
                  </>
                ) : isImage ? (
                  <>
                    <PhotoIcon className="h-3 w-3" />
                    <span>Image</span>
                  </>
                ) : (
                  <span>Audio</span>
                )}
              </div>
            </div>

            <div className="aspect-square bg-slate-700 relative overflow-hidden">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt={item.data[0]?.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-700">
                  <span className="text-slate-400 font-medium uppercase text-sm">
                    {item.data[0]?.media_type}
                  </span>
                </div>
              )}

              {/* Play icon overlay for videos */}
              {isVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <VideoCameraIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h4 className="font-semibold text-white line-clamp-2 mb-2 text-sm">
                {item.data[0]?.title || 'Untitled'}
              </h4>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="capitalize">{item.data[0]?.media_type}</span>
                <span>{item.data[0]?.date_created?.split('T')[0]}</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MediaGrid;