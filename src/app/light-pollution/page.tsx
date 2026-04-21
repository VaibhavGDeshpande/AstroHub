"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import BortleComprehensiveTable from "@/components/LightPollution/BortleComprehensiveTable";
import BortleScaleChart from "@/components/LightPollution/BortleScaleChart";
import LightPollutionMap from "@/components/LightPollution/LightPollutionMap";
import LoaderWrapper from "@/components/Loader";
import Link from "next/link";
import {
  ArrowLeftIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import SectionTitle from "@/components/SectionTitle";

const quickStats = [
  { label: "Best Viewing", value: "Class 1-3", icon: "🌟" },
  { label: "Urban Areas", value: "Class 7-9", icon: "🏙️" },
  { label: "Naked Eye Limit", value: "7.5+ mag", icon: "👁️" },
  { label: "Dark Sites", value: "Worldwide", icon: "🌍" },
];

const infoCards = [
  {
    icon: "🔭",
    title: "Perfect Stargazing",
    description: "Classes 1-3 offer the best conditions for deep-sky observation and astrophotography.",
    color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30",
  },
  {
    icon: "🌃",
    title: "Urban Challenges",
    description: "Classes 7-9 represent significant light pollution found in most cities worldwide.",
    color: "from-orange-500/20 to-red-500/20 border-orange-500/30",
  },
  {
    icon: "💡",
    title: "Conservation Efforts",
    description: "Dark sky preservation helps astronomy and reduces energy waste and ecological impact.",
    color: "from-green-500/20 to-emerald-500/20 border-green-500/30",
  },
];

export default function LightPollutionRedesign() {
  const [activeTab, setActiveTab] = useState("scale");

  return (
    <LoaderWrapper>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 text-white overflow-x-hidden">
      <header className="relative z-10 pt-16 px-4">
        <SectionTitle 
          title="Light Pollution Map" 
          subtitle="Discover the darkness of the night sky and find the perfect stargazing locations worldwide"
        />
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-16 space-y-8 md:space-y-12">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-[2rem] p-5 md:p-8 border border-white/10 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl md:text-3xl font-black text-cyan-300 tracking-tight flex items-center gap-2">
                <span className="text-2xl">🗺️</span> Global Overlay
              </h2>
            </div>

            <LightPollutionMap className="border border-white/10 shadow-inner" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6">
              {quickStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors group"
                >
                  <div className="text-2xl mb-2 transition-transform group-hover:scale-110 duration-300">{stat.icon}</div>
                  <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">{stat.label}</div>
                  <div className="text-base md:text-xl font-black text-white">{stat.value}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-[2rem] p-5 md:p-8 border border-white/10 shadow-2xl">
            <h2 className="text-xl md:text-3xl font-black text-purple-300 tracking-tight mb-6 flex items-center gap-2">
              <span className="text-2xl">📊</span> Bortle scale
            </h2>

            <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 mb-6">
              <button
                onClick={() => setActiveTab("scale")}
                className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm uppercase tracking-widest transition-all duration-500 ${
                  activeTab === "scale"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Visual Guide
              </button>
              <button
                onClick={() => setActiveTab("table")}
                className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm uppercase tracking-widest transition-all duration-500 ${
                  activeTab === "table"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Telemetry
              </button>
            </div>

            <div className="min-h-[400px]">
              {activeTab === "scale" && <BortleScaleChart />}
              {activeTab === "table" && <BortleComprehensiveTable />}
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {infoCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className={`bg-gradient-to-br ${card.color} backdrop-blur-xl rounded-2xl p-6 border shadow-xl`}
            >
              <div className="text-4xl mb-3">{card.icon}</div>
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{card.description}</p>
            </motion.div>
          ))}
        </motion.section>
      </div>
    </div>
    </LoaderWrapper>
  );
}
