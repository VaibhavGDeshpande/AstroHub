"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "@/lib/starsData";

interface CosmicAgeResultCardProps {
  star: Star;
  age: number;
}

export default function CosmicAgeResultCard({ star, age }: CosmicAgeResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(30,58,138,0.5)] border border-blue-900/50 bg-slate-900"
    >
      {/* Background cinematic effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 z-0"></div>
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-blue-600/20 to-transparent z-0"></div>
      
      {/* Star glow effect */}
      <motion.div 
        animate={{ 
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/30 rounded-full blur-[100px] z-0"
      ></motion.div>

      <div className="relative z-10 p-8 md:p-12 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-8"
        >
          <p className="text-blue-300 font-medium tracking-widest uppercase text-sm mb-2">Your Cosmic Twin</p>
          <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight drop-shadow-lg">
            {star.name}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50">
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Distance</p>
            <p className="text-xl text-blue-200 font-semibold">{star.distanceLy} <span className="text-sm">ly</span></p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50">
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Constellation</p>
            <p className="text-xl text-blue-200 font-semibold">{star.constellation}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50">
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Star Type</p>
            <p className="text-xl text-blue-200 font-semibold">{star.type}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50">
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Your Age</p>
            <p className="text-xl text-purple-300 font-semibold">{age.toFixed(2)} <span className="text-sm">yrs</span></p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="bg-black/40 backdrop-blur-md rounded-2xl p-6 w-full border border-blue-500/20 mb-6"
        >
          <p className="text-xl md:text-2xl text-blue-100 font-light italic leading-relaxed">
            &quot;The light you see today from {star.name} left on its journey across the cosmos when you were born.&quot;
          </p>
        </motion.div>

        <div className="w-full flex items-center justify-between text-slate-400 text-sm px-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span>Earth</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-blue-500/20 via-blue-500/50 to-purple-500/20 mx-4 relative">
            <motion.div 
              initial={{ left: "0%" }}
              animate={{ left: "100%" }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 -translate-y-1/2 w-4 h-1 bg-white rounded-full shadow-[0_0_10px_#fff]"
            ></motion.div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-100 shadow-[0_0_15px_#fef08a]"></div>
            <span>{star.name}</span>
          </div>
        </div>

        {star.funFact && (
          <p className="mt-8 text-slate-500 text-sm max-w-lg">
            <span className="text-slate-300 font-semibold">Fun Fact:</span> {star.funFact}
          </p>
        )}
      </div>
    </motion.div>
  );
}
