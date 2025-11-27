"use client";

import { motion } from "framer-motion";
import CurrentWeatherShowcase from "@/components/Weather/CurrentWeatherShowcase";
import { 
  ArrowLeftIcon,
  HomeIcon 
} from '@heroicons/react/24/outline';
import Link from "next/link";
import LoaderWrapper from '@/components/Loader';

export default function WeatherPage() {
  return (
    <LoaderWrapper>
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white overflow-x-hidden">
      <div className="fixed top-4 left-4 z-50 hidden md:block">
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
      <header className="pt-10 pb-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-amber-300 bg-clip-text text-transparent mb-4">
            Live Weather
          </h1>
          <p className="text-slate-300 text-lg">
           Track current conditions anywhere on Earth.
          </p>
        </motion.div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-16 relative z-10">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <CurrentWeatherShowcase />
        </motion.section>
      </main>
    </div>
    </LoaderWrapper>
  );
}
