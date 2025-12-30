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
      <header className="relative z-10 pt-8 pb-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r bg-clip-text mb-4">
            Light Pollution Map
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Discover the darkness of the night sky and find the perfect stargazing locations worldwide
          </p>
        </motion.div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-16">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-slate-700/50 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-cyan-300">🗺️ Global Light Pollution Overlay</h2>
            </div>

            <LightPollutionMap className="border-2 border-slate-700/50" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {quickStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 rounded-xl p-4 border border-slate-600/30"
                >
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-slate-700/50 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-purple-300 mb-6">📊 Bortle Dark Sky Scale</h2>

            <div className="flex gap-2 mb-6 bg-slate-800/50 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab("scale")}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === "scale"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Visual Scale
              </button>
              <button
                onClick={() => setActiveTab("table")}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === "table"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Detailed Data
              </button>
            </div>

            {activeTab === "scale" && <BortleScaleChart />}
            {activeTab === "table" && <BortleComprehensiveTable />}
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
