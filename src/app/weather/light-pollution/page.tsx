'use client'
import BortleScaleChart from "@/components/LightPollution/BortleScaleChart";
import BortleComprehensiveTable from "@/components/LightPollution/BortleComprehensiveTable";
import LightPollutionMap from "@/components/LightPollution/LightPollutionMap";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeftIcon, HomeIcon } from "@heroicons/react/24/outline";

export default function Page() {
  return (
    <main className="bg-gradient-to-b from-slate-950 via-black to-slate-900 min-h-screen text-white">
      <div className="fixed top-4 left-4 z-50 hidden md:block">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/40 backdrop-blur-sm transition duration-300"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <HomeIcon className="h-4 w-4 hidden sm:block" />
              <span className="text-sm">Back</span>
            </Link>
          </motion.div> 
        </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Title */}
        <h1 className="text-center text-4xl font-extrabold mb-10 tracking-wide text-emerald-300 drop-shadow">
          Light Pollution Map
        </h1>
        
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12 items-start">

          <LightPollutionMap />

          <div className="w-full flex justify-center">
            <BortleScaleChart />
          </div>
        </section>

        <section className="mt-8">
          <BortleComprehensiveTable />
        </section>
      </div>
    </main>
  );
}
