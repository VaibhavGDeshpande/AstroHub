"use client"

import { motion } from 'framer-motion';
import Link from 'next/link';
import MoonViewer from '../../components/3D Maps/3D Moon/MoonViewer';
import { 
  ArrowLeftIcon,
  HomeIcon 
} from '@heroicons/react/24/outline';

export default function MoonPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Cosmic Background Gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-20 w-80 h-80 bg-purple-500/20 blur-[120px]" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500/20 blur-[100px]" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-40 bg-pink-500/20 blur-[100px]" />
        <div className="absolute top-1/2 left-10 w-64 h-64 bg-indigo-500/15 blur-[90px]" />
        <div className="absolute bottom-32 right-32 w-56 h-56 bg-cyan-500/15 blur-[80px]" />
      </div>

      {/* Fixed Back Button */}
      <div className="fixed top-4 left-4 z-50">
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

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center pb-1 mt-4"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse mb-2"
        >
          Lunar Observatory
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-lg text-slate-300"
        >
          Interactive 3D Moon Visualization
        </motion.p>
      </motion.div>

      {/* Main Moon Viewer Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="px-4 sm:px-6 lg:px-10 pb-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/40 rounded-xl overflow-hidden">
            <div className="moon-viewer-container">
              <MoonViewer />
            </div>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .moon-viewer-container {
          position: relative;
          width: 100%;
          height: 80vh;
          min-height: 600px;
          max-height: 900px;
          background: rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }

        .moon-viewer-container > :global(div) {
          width: 100% !important;
          height: 100% !important;
          max-width: 100% !important;
          max-height: 100% !important;
        }

        /* Ensure Cesium container fits properly */
        .moon-viewer-container :global(#cesiumContainer) {
          width: 100% !important;
          height: 100% !important;
          max-width: 100% !important;
          max-height: 100% !important;
          border-radius: 0.75rem;
        }

        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          .moon-viewer-container {
            height: 60vh;
            min-height: 400px;
          }
        }

        @media (max-width: 480px) {
          .moon-viewer-container {
            height: 50vh;
            min-height: 350px;
          }
        }
      `}</style>
    </div>
  );
}
