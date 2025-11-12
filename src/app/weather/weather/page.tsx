'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, HomeIcon } from '@heroicons/react/24/outline';
import LoaderWrapper from '@/components/Loader';
import AstroWeatherDashboard from '../../../components/Weather/AstroWeatherDashboard';

const DEFAULT_COORDINATES = {
  lat: 18.516726,
  lon: 73.856255
};

export default function WeatherPage() {

  return (
    <LoaderWrapper>
      <div className="relative min-h-screen overflow-hidden bg-black text-white">
        {/* Back button */}
        <div className="fixed left-4 top-4 z-30 hidden md:block">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Link
              href="/"
              className="group flex items-center gap-2 rounded-xl border border-white/15 bg-slate-900/60 px-3 py-2 text-sm text-white backdrop-blur transition hover:bg-slate-800/70"
            >
              <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <HomeIcon className="h-4 w-4 hidden sm:block" />
              <span>Back</span>
            </Link>
          </motion.div>
        </div>

        <div className="relative z-10 mx-auto flex max-w-8xl flex-col gap-10 mt-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 text-center"
          >
            <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-300 bg-clip-text text-transparent">
              Weather Dashboard
            </h1>
          </motion.div>
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur"
          >
            <AstroWeatherDashboard {...DEFAULT_COORDINATES} />
          </motion.section>
        </div>
      </div>
    </LoaderWrapper>
  );
}
