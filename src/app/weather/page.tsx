/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { motion } from "framer-motion";
import CurrentWeatherShowcase from "@/components/Weather/CurrentWeatherShowcase";
import AstroWeatherDashboard from "@/components/Weather/AstroWeatherDashboard";
import { 
  ArrowLeftIcon,
  HomeIcon 
} from '@heroicons/react/24/outline';
import Link from "next/link";
import LoaderWrapper from '@/components/Loader';
import SectionTitle from "@/components/SectionTitle";

export default function WeatherPage() {
  return (
    <LoaderWrapper>
    <div className="min-h-screen bg-[#050510] text-white overflow-x-hidden selection:bg-blue-500/30">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[0%] right-[-10%] w-[50%] h-[50%] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="fixed top-6 left-6 z-50 hidden md:block">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/"
              className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all duration-300 shadow-xl"
            >
              <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <HomeIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Return Home</span>
            </Link>
          </motion.div>
        </div>

      <header className="pt-20 px-6 relative z-10">
        <SectionTitle 
          title="Global Weather" 
          subtitle="Harnessing real-time atmospheric data-streams to provide hyper-accurate telemetry across celestial coordinates."
        />
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
        <motion.section 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
          aria-label="Weather Telemetry Dashboard"
        >
          <AstroWeatherDashboard lat={18.5246} lon={73.8786} />
        </motion.section>
      </main>
    </div>
    </LoaderWrapper>
  );
}
