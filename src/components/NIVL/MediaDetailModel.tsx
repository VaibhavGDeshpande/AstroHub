'use client'
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PhotoIcon,
  VideoCameraIcon,
  SpeakerWaveIcon,
  ArrowsPointingOutIcon,
  XMarkIcon,
  PlayIcon,
  PauseIcon,
  SpeakerXMarkIcon
} from '@heroicons/react/24/outline';
import { MediaDetailModalProps } from '../../types/nivl';

const MediaDetailModal: React.FC<MediaDetailModalProps> = ({ item, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!item) return null;

  const data = item.data[0];
  const isVideo = data.media_type === 'video';
  const isAudio = data.media_type === 'audio';
  const mediaLink = item.links?.find(link => link.rel === 'preview' && link.render !== 'image');
  const imageLink = item.links?.find(link => link.rel === 'preview');

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const openFullSize = () => {
    const fullSizeLink = mediaLink?.href || imageLink?.href;
    if (fullSizeLink) {
      window.open(fullSizeLink, '_blank');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-xl max-w-5xl w-full max-h-[95vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-slate-700/50">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white mb-2 leading-tight">
                {data.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                <span className="flex items-center space-x-1">
                  {isVideo && <VideoCameraIcon className="h-4 w-4" />}
                  {isAudio && <SpeakerWaveIcon className="h-4 w-4" />}
                  {!isVideo && !isAudio && <PhotoIcon className="h-4 w-4" />}
                  <span className="capitalize">{data.media_type}</span>
                </span>
                <span>{new Date(data.date_created).toLocaleDateString()}</span>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                  {data.center || 'NASA'}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700/50 rounded-full transition-colors ml-4 flex-shrink-0"
            >
              <XMarkIcon className="h-6 w-6 text-slate-400" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Media Display */}
            <div className="relative">
              {isVideo && mediaLink ? (
                <div className="relative bg-black rounded-xl overflow-hidden">
                  <video
                    ref={videoRef}
                    src={mediaLink.href}
                    className="w-full max-h-[60vh] object-contain"
                    controls={false}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                  />
                  
                  {/* Custom Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handlePlayPause}
                        className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors"
                      >
                        {isPlaying ? (
                          <PauseIcon className="h-5 w-5 text-white" />
                        ) : (
                          <PlayIcon className="h-5 w-5 text-white ml-0.5" />
                        )}
                      </button>
                      
                      <button
                        onClick={handleMute}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                      >
                        {isMuted ? (
                          <SpeakerXMarkIcon className="h-5 w-5 text-white" />
                        ) : (
                          <SpeakerWaveIcon className="h-5 w-5 text-white" />
                        )}
                      </button>

                      <div className="flex-1" />
                      
                      <button
                        onClick={openFullSize}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <ArrowsPointingOutIcon className="h-5 w-5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : isAudio && mediaLink ? (
                <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl p-8 text-center border border-purple-500/20">
                  <SpeakerWaveIcon className="h-24 w-24 text-purple-400 mx-auto mb-6" />
                  <h3 className="text-white font-medium mb-4">Audio Content</h3>
                  <audio controls className="w-full max-w-md mx-auto">
                    <source src={mediaLink.href} type="audio/mpeg" />
                    <source src={mediaLink.href} type="audio/wav" />
                    <source src={mediaLink.href} type="audio/ogg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              ) : (
                <div className="relative bg-slate-900/30 rounded-xl overflow-hidden">
                  <img
                    src={imageLink?.href}
                    alt={data.title}
                    className="w-full max-h-[60vh] object-contain rounded-xl"
                    loading="lazy"
                  />
                  <button
                    onClick={openFullSize}
                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                  >
                    <ArrowsPointingOutIcon className="h-5 w-5 text-white" />
                  </button>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <PhotoIcon className="h-4 w-4 mr-2 text-blue-400" />
                Description
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {data.description || 'No description available for this media item.'}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Details Card */}
              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                <h3 className="text-white font-semibold mb-4">Technical Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-start py-1 border-b border-slate-600/30">
                    <span className="text-slate-400 text-sm">NASA ID</span>
                    <span className="text-white font-mono text-sm break-all">
                      {data.nasa_id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-600/30">
                    <span className="text-slate-400 text-sm">Date Created</span>
                    <span className="text-white text-sm">
                      {new Date(data.date_created).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-600/30">
                    <span className="text-slate-400 text-sm">Media Type</span>
                    <span className="text-white text-sm capitalize">
                      {data.media_type}
                    </span>
                  </div>
                  {data.center && (
                    <div className="flex justify-between items-center py-1 border-b border-slate-600/30">
                      <span className="text-slate-400 text-sm">NASA Center</span>
                      <span className="text-white text-sm">{data.center}</span>
                    </div>
                  )}
                  {data.photographer && (
                    <div className="flex justify-between items-start py-1 border-b border-slate-600/30">
                      <span className="text-slate-400 text-sm">Photographer</span>
                      <span className="text-white text-sm text-right">
                        {data.photographer}
                      </span>
                    </div>
                  )}
                  {data.location && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400 text-sm">Location</span>
                      <span className="text-white text-sm">{data.location}</span>
                    </div>
                  )}
                  {data.secondary_creator && (
                    <div className="flex justify-between items-start py-1">
                      <span className="text-slate-400 text-sm">Secondary Creator</span>
                      <span className="text-white text-sm text-right">
                        {data.secondary_creator}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Keywords Card */}
              {data.keywords && data.keywords.length > 0 && (
                <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                  <h3 className="text-white font-semibold mb-4">Keywords & Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  
                  {/* Keywords count */}
                  <div className="mt-4 pt-3 border-t border-slate-600/30">
                    <span className="text-slate-400 text-xs">
                      {data.keywords.length} keyword{data.keywords.length !== 1 ? 's' : ''} associated
                    </span>
                  </div>
                </div>
              )}

              {/* Additional Description (508 compliant) */}
              {data.description_508 && (
                <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30 lg:col-span-2">
                  <h3 className="text-white font-semibold mb-3">
                    Accessibility Description
                  </h3>
                  <p className="text-slate-300 leading-relaxed text-sm">
                    {data.description_508}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-700/30">
              <button
                onClick={openFullSize}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <ArrowsPointingOutIcon className="h-4 w-4" />
                <span>View Full Size</span>
              </button>
              
              <button
                onClick={() => {
                  const url = `https://images.nasa.gov/details-${data.nasa_id}.html`;
                  window.open(url, '_blank');
                }}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>View on NASA.gov</span>
              </button>

              <button
                onClick={() => {
                  const shareText = `Check out this amazing ${data.media_type} from NASA: ${data.title}`;
                  const shareUrl = `https://images.nasa.gov/details-${data.nasa_id}.html`;
                  
                  if (navigator.share) {
                    navigator.share({
                      title: data.title,
                      text: shareText,
                      url: shareUrl,
                    });
                  } else {
                    navigator.clipboard.writeText(`${shareText} - ${shareUrl}`);
                  }
                }}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span>Share</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MediaDetailModal;
