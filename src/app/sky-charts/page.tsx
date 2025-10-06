"use client"
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, HomeIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';

// Dynamically import SkyMapsDownloader with SSR disabled
const SkyMapsDownloader = dynamic(
  () => import('@/components/SkyMaps/SkyMapsDownloader'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading Sky Maps...</div>
      </div>
    )
  }
);

export default function SkyMapsPage() {
  return (
    <>
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
      <SkyMapsDownloader />
    </>
  )
}
