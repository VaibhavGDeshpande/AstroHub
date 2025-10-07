'use client';

import React, { useEffect } from 'react';
import AsteroidsEmbed from '@/components/Nasa-eyes/Asteroids/Asteroids';
import LoaderWrapper from '@/components/Loader';
import { toast } from 'react-toastify';
import ToastProvider from '@/components/Toast';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, HomeIcon } from '@heroicons/react/24/outline';

export default function SolarSystemPage() {
  useEffect(() => {
    // Show toast on component mount
    toast.info('🚀 This is for educational purposes only. All rights reserved to NASA.', {
      position: 'top-center',
      autoClose: 6000,
      hideProgressBar: true,
      closeOnClick: true,
      theme: 'dark',
    });
  }, []);

  return (
    <ToastProvider>
      <LoaderWrapper>
        {/* Header with Navigation only */}
        <div className="fixed top-4 left-4 z-50">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              href="/nasa-eyes"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/40 backdrop-blur-sm transition duration-300"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <HomeIcon className="h-4 w-4 hidden sm:block" />
              <span className="text-sm">Back</span>
            </Link>
          </motion.div> 
        </div>
        <AsteroidsEmbed 
          embedOptions={{
            logo: false,
            menu: false,
            featured: false
          }}
        />
      </LoaderWrapper>
    </ToastProvider>
  );
}
