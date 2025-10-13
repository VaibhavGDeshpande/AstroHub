'use client'

import LoaderWrapper from '@/components/Loader'
import React, { useEffect, useState } from 'react'
import RevolveRotateFocus from '@/components/solar-system/SolarSystem'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeftIcon, HomeIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline'

function Page() {
  const [isPortrait, setIsPortrait] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
        || window.innerWidth < 768;
      setIsMobile(mobile);
      return mobile;
    };

    // Check orientation using matchMedia
    const checkOrientation = () => {
      const portrait = window.matchMedia("(orientation: portrait)").matches;
      setIsPortrait(portrait);
      return portrait;
    };

    // Initial check
    const mobile = checkMobile();
    const portrait = checkOrientation();
    
    // Show prompt only if mobile and in portrait mode
    setShowPrompt(mobile && portrait);

    // Listen for orientation changes
    const orientationQuery = window.matchMedia("(orientation: portrait)");
    const handleOrientationChange = (e: MediaQueryListEvent) => {
      const isPortraitNow = e.matches;
      setIsPortrait(isPortraitNow);
      
      // Show prompt if mobile and switched to portrait
      if (mobile && isPortraitNow) {
        setShowPrompt(true);
      } else {
        setShowPrompt(false);
      }
    };

    // Add event listener for orientation changes
    orientationQuery.addEventListener("change", handleOrientationChange);

    // Listen for resize events (backup method)
    const handleResize = () => {
      checkOrientation();
      checkMobile();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      orientationQuery.removeEventListener("change", handleOrientationChange);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Function to dismiss the prompt
  const dismissPrompt = () => {
    setShowPrompt(false);
  };

  return (
    <LoaderWrapper>
      <div className="relative w-full h-screen">
        {/* Back Button */}
        <div className="fixed top-3 sm:top-4 left-3 sm:left-4 z-50">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              href="/"
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 active:bg-slate-700/70 border border-slate-600/40 backdrop-blur-sm transition-all duration-300 shadow-lg"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <HomeIcon className="h-4 w-4 hidden sm:block" />
              <span className="text-xs sm:text-sm font-medium text-white">Back</span>
            </Link>
          </motion.div>
        </div>

        {/* Landscape Orientation Prompt - Only on Mobile Portrait */}
        <AnimatePresence>
          {isMobile && isPortrait && showPrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="relative max-w-sm mx-4 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-slate-600/50 rounded-2xl p-6 shadow-2xl text-center"
              >
                {/* Animated Phone Icon */}
                <motion.div
                  animate={{ 
                    rotate: [0, -90, -90, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: "easeInOut"
                  }}
                  className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl"
                >
                  <DevicePhoneMobileIcon className="w-10 h-10 text-white" />
                </motion.div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-white mb-2">
                  Rotate Your Device
                </h2>

                {/* Description */}
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                  For the best viewing experience of the Solar System, please rotate your device to <span className="font-semibold text-cyan-400">landscape mode</span>.
                </p>

                {/* Landscape Icon Visual */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-16 border-2 border-slate-600 rounded-lg mb-1 flex items-center justify-center">
                      <span className="text-slate-600 text-xs">Portrait</span>
                    </div>
                    <span className="text-xs text-slate-500">Current</span>
                  </div>

                  <motion.svg
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-6 h-6 text-cyan-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>

                  <div className="flex flex-col items-center">
                    <div className="w-16 h-12 border-2 border-cyan-400 rounded-lg mb-1 flex items-center justify-center bg-cyan-400/10">
                      <span className="text-cyan-400 text-xs font-semibold">Landscape</span>
                    </div>
                    <span className="text-xs text-cyan-400 font-semibold">Better</span>
                  </div>
                </div>

                {/* Dismiss Button */}
                <button
                  onClick={dismissPrompt}
                  className="w-full px-4 py-3 bg-slate-700/60 hover:bg-slate-600/60 active:bg-slate-600/80 text-white rounded-xl transition-all duration-200 font-medium text-sm"
                >
                  Continue Anyway
                </button>

                {/* Additional Info */}
                <p className="text-xs text-slate-500 mt-4">
                  You can rotate your device at any time
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Solar System Component */}
        <RevolveRotateFocus />
      </div>
    </LoaderWrapper>
  )
}

export default Page
