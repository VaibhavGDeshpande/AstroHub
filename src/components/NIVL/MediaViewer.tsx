'use client';

import { NivlItem } from '@/types/nivl';
import { motion } from 'framer-motion';
import { 
  EyeIcon, 
  ArrowsPointingOutIcon,
  XMarkIcon,
  CalendarDaysIcon,
  UserIcon,
  MapPinIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';
import { useState, useRef, useCallback } from 'react';

interface MediaViewerProps {
  item: NivlItem;
  assetUrl: string;
  loading: boolean;
  onClose: () => void;
  onOpenInNewTab: (url: string) => void;
}

const MediaViewer: React.FC<MediaViewerProps> = ({
  item,
  assetUrl,
  loading,
  onClose,
  onOpenInNewTab
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

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

  const isVideo = assetUrl.includes('.mp4') || assetUrl.includes('.mov') || assetUrl.includes('.webm');

  return (
    <div className="fixed inset-0 bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Backdrop with blur effect */}
      <div className="absolute inset-0 bg-opacity-60 backdrop-blur-md"></div>
      
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col relative z-10 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white">
            {item.data[0]?.title}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors duration-200 p-1 rounded-full hover:bg-slate-800/80 backdrop-blur-sm"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Left Panel - Media */}
          <div className="lg:w-2/3 p-6 flex items-center justify-center bg-slate-800/20 backdrop-blur-sm">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full"
                />
              </div>
            ) : assetUrl ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full h-full max-h-[60vh] flex items-center justify-center group"
              >
                <div
                  ref={containerRef}
                  className="relative overflow-hidden rounded-xl bg-slate-800/30 backdrop-blur-md border border-slate-700/50 w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onWheel={!isVideo ? handleWheel : undefined}
                >
                  {isVideo ? (
                    <video
                      controls
                      className="w-full h-auto max-h-full object-contain rounded-xl"
                      src={assetUrl}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <motion.img
                      src={assetUrl}
                      alt={item.data[0]?.title}
                      className="max-w-full max-h-full object-contain rounded-xl"
                      style={{
                        transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                        transformOrigin: 'center center'
                      }}
                      onDoubleClick={() => zoom === 1 ? handleZoomIn() : handleResetView()}
                      draggable={false}
                    />
                  )}

                  {/* Zoom indicator */}
                  {!isVideo && zoom > 1 && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-green-500/90 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-green-400/50">
                      <div className="flex items-center space-x-1">
                        <EyeIcon className="h-4 w-4" />
                        <span>{(zoom * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  )}

                  {/* Instructions overlay */}
                  {!isVideo && (
                    <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Scroll to zoom • Drag to pan • Double-click to reset</span>
                    </div>
                  )}
                </div>

                {/* Controls for images */}
                {!isVideo && (
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <button
                      onClick={handleZoomIn}
                      disabled={zoom >= 5}
                      className="p-2 bg-slate-800/80 backdrop-blur-sm text-white rounded-md hover:bg-slate-700/80 transition-colors duration-200 disabled:opacity-50"
                    >
                      <span className="text-sm">Zoom In</span>
                    </button>
                    <button
                      onClick={handleZoomOut}
                      disabled={zoom <= 0.5}
                      className="p-2 bg-slate-800/80 backdrop-blur-sm text-white rounded-md hover:bg-slate-700/80 transition-colors duration-200 disabled:opacity-50"
                    >
                      <span className="text-sm">Zoom Out</span>
                    </button>
                    <button
                      onClick={handleResetView}
                      className="p-2 bg-slate-800/80 backdrop-blur-sm text-white rounded-md hover:bg-slate-700/80 transition-colors duration-200"
                    >
                      <span className="text-sm">Reset</span>
                    </button>
                    <button
                      onClick={() => onOpenInNewTab(assetUrl)}
                      className="p-2 bg-slate-800/80 backdrop-blur-sm text-white rounded-md hover:bg-slate-700/80 transition-colors duration-200"
                    >
                      <ArrowsPointingOutIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="text-slate-400">No media available</div>
            )}
          </div>

          {/* Right Panel - Metadata */}
          <div className="lg:w-1/3 p-6 bg-slate-800/60 backdrop-blur-sm overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <EyeIcon className="h-5 w-5 text-blue-400 mr-2" />
              Media Details
            </h3>

            {item.data[0]?.description && (
              <div className="mb-6">
                <p className="text-slate-300 text-sm leading-relaxed">
                  {item.data[0].description}
                </p>
              </div>
            )}

            <div className="space-y-4">
              {item.data[0]?.date_created && (
                <div className="flex items-center space-x-3">
                  <CalendarDaysIcon className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-slate-400 text-sm">Date Created</p>
                    <p className="text-white">{item.data[0].date_created}</p>
                  </div>
                </div>
              )}

              {item.data[0]?.photographer && (
                <div className="flex items-center space-x-3">
                  <UserIcon className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-slate-400 text-sm">Photographer</p>
                    <p className="text-white">{item.data[0].photographer}</p>
                  </div>
                </div>
              )}

              {item.data[0]?.location && (
                <div className="flex items-center space-x-3">
                  <MapPinIcon className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-slate-400 text-sm">Location</p>
                    <p className="text-white">{item.data[0].location}</p>
                  </div>
                </div>
              )}

              {item.data[0]?.center && (
                <div className="flex items-center space-x-3">
                  <BuildingLibraryIcon className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-slate-400 text-sm">NASA Center</p>
                    <p className="text-white">{item.data[0].center}</p>
                  </div>
                </div>
              )}

              {item.data[0]?.nasa_id && (
                <div className="pt-4 border-t border-slate-700/50">
                  <p className="text-slate-400 text-sm">NASA ID</p>
                  <p className="text-white font-mono text-sm">{item.data[0].nasa_id}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaViewer;