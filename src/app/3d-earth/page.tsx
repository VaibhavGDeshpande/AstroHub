'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as Cesium from 'cesium';
import LoaderWrapper from '@/components/Loader';
import { motion} from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';

// Set Cesium base URL for Next.js
if (typeof window !== 'undefined') {
  (window as Window & { CESIUM_BASE_URL?: string }).CESIUM_BASE_URL = '/cesium';
}

// Set your Cesium Ion access token
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZmUyMDU3NS0wYTk5LTQ0ZjQtYmEzNi04NjllYTU3ZmE4ZTkiLCJpZCI6MzQwOTc4LCJpYXQiOjE3NTc3NzE3MDh9.p9lg0P5Rb9zgLUib_NE5qEYNCWwt_FyDFW5Ok2EQgUw';

const CesiumViewer: React.FC = () => {
  const cesiumContainer = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Only initialize if container exists and viewer hasn't been created
    if (cesiumContainer.current && !viewerRef.current) {
      try {
        // Create the Cesium viewer
        viewerRef.current = new Cesium.Viewer(cesiumContainer.current, {
          homeButton: true,
          sceneModePicker: true,
          baseLayerPicker: true,
          navigationHelpButton: true,
          animation: true,
          timeline: true,
          fullscreenButton: true,
          vrButton: false,
        });

        // Hide loading overlay when terrain tiles finish loading
        viewerRef.current.scene.globe.tileLoadProgressEvent.addEventListener(
          (queuedTileCount: number) => {
            if (queuedTileCount === 0) {
              setIsLoading(false);
            }
          }
        );

        // Set initial camera position - zoomed out to show full Earth
        viewerRef.current.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(0.0, 0.0, 20000000.0),
          orientation: {
            heading: 0.0,
            pitch: Cesium.Math.toRadians(-90.0),
            roll: 0.0
          }
        });
      } catch (error) {
        console.error('Error initializing Cesium viewer:', error);
        setIsLoading(false);
      }
    }

    // Listen for fullscreen changes
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }

      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

//   // Custom fullscreen handler
//   const handleCustomFullscreen = async (e: Event) => {
//     e.preventDefault();
//     e.stopPropagation();

//     try {
//       if (!document.fullscreenElement) {
//         if (cesiumContainer.current) {
//           if (cesiumContainer.current.requestFullscreen) {
//             await cesiumContainer.current.requestFullscreen();
//           } else if ((cesiumContainer.current as any).webkitRequestFullscreen) {
//             await (cesiumContainer.current as any).webkitRequestFullscreen();
//           } else if ((cesiumContainer.current as any).msRequestFullscreen) {
//             await (cesiumContainer.current as any).msRequestFullscreen();
//           }
//         }
//       } else {
//         if (document.exitFullscreen) {
//           await document.exitFullscreen();
//         } else if ((document as any).webkitExitFullscreen) {
//           await (document as any).webkitExitFullscreen();
//         } else if ((document as any).msExitFullscreen) {
//           await (document as any).msExitFullscreen();
//         }
//       }
//     } catch (error) {
//       console.error('Fullscreen error:', error);
//     }
//   };
  return (
    <>
    <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-4 left-4 z-50"
      >
        <Link
          href="/"
          className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-white rounded-lg hover:bg-slate-700/50 transition-all duration-300 hover:scale-105 shadow-lg group"
        >
          <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform duration-300" />
          <HomeIcon className="h-4 w-4 hidden sm:block" />
          <span className="text-sm font-medium">Back</span>
        </Link>
      </motion.div>
      {/* Cesium CSS import */}
      <style jsx global>{`
        @import url('https://cesium.com/downloads/cesiumjs/releases/1.107/Build/Cesium/Widgets/widgets.css');
        
        :fullscreen #toolbar,
        :-webkit-full-screen #toolbar,
        :-moz-full-screen #toolbar,
        :-ms-fullscreen #toolbar {
          display: none !important;
        }
        
        :fullscreen #cesiumContainer,
        :-webkit-full-screen #cesiumContainer,
        :-moz-full-screen #cesiumContainer,
        :-ms-fullscreen #cesiumContainer {
          width: 100vw !important;
          height: 100vh !important;
        }
      `}</style>

      <div className="relative w-full h-screen">
        {/* Cesium Container */}
        <div 
          ref={cesiumContainer}
          id="cesiumContainer"
          className="absolute top-0 left-0 w-full h-full border-0"
        />

        {/* Loading Overlay */}
        {isLoading && !isFullscreen && (
        //   <div 
        //     id="loadingOverlay"
        //     className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center text-white font-sans z-50 backdrop-blur-sm"
        //   >
        //     <div className="text-center bg-gray-800 bg-opacity-95 p-10 rounded-xl border border-gray-600 min-w-80">
        //       <h1 className="text-xl font-semibold mb-4">Loading Earth Viewer...</h1>
        //       <div className="w-70 h-2 bg-gray-700 rounded-full overflow-hidden mx-auto">
        //         <div className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        //       </div>
        //     </div>
        //   </div>
        <LoaderWrapper/>
        )}

      </div>
    </>
  );
};

export default CesiumViewer;
