'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import MarsRoverExplorer from '@/components/3D Maps/3D Mars/MarsViewer';
import { 
  ArrowLeftIcon,
  HomeIcon 
} from '@heroicons/react/24/outline';
import LoaderWrapper from '@/components/Loader';

export default function MarsPage() {
  return (
    <LoaderWrapper>
      <div className="fixed inset-0 w-screen h-screen bg-black text-white overflow-hidden">
        {/* Cosmic Background Gradients */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-20 w-80 h-80 bg-red-500/20 blur-[120px]" />
          <div className="absolute top-40 right-20 w-72 h-72 bg-orange-500/20 blur-[100px]" />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-40 bg-amber-500/20 blur-[100px]" />
          <div className="absolute top-1/2 left-10 w-64 h-64 bg-red-600/15 blur-[90px]" />
          <div className="absolute bottom-32 right-32 w-56 h-56 bg-orange-400/15 blur-[80px]" />
        </div>

        {/* Fixed Back Button */}
        <div className="fixed top-4 left-4 z-50 pt-29">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/40 backdrop-blur-sm transition duration-300 group"
            >
              <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <HomeIcon className="h-4 w-4 hidden sm:block" />
              <span className="text-sm">Back</span>
            </Link>
          </motion.div>
        </div>

        {/* Fullscreen Mars Viewer Container */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          <div className="mars-viewer-container">
            <MarsRoverExplorer />
          </div>
        </motion.div>

        <style jsx>{`
          .mars-viewer-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.2);
            overflow: hidden;
          }

          .mars-viewer-container > :global(div) {
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
          }

          /* Ensure Cesium container fits properly */
          .mars-viewer-container :global(#cesiumContainer) {
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
          }
        `}</style>
      </div>
    </LoaderWrapper>
  );
}
