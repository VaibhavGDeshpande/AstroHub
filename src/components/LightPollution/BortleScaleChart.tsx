"use client";

import { motion } from "framer-motion";

export const bortleScale = [
  {
    number: 1,
    color: "bg-black",
    className: "Excellent Dark Sky",
    location: "Remote wilderness, deserts, high mountains",
    stars: "⭐⭐⭐⭐⭐",
  },
  {
    number: 2,
    color: "bg-gray-800",
    className: "Average Dark Sky",
    location: "National parks, far from towns",
    stars: "⭐⭐⭐⭐",
  },
  {
    number: 3,
    color: "bg-blue-700",
    className: "Rural Sky",
    location: "Countryside with minimal light pollution",
    stars: "⭐⭐⭐⭐",
  },
  {
    number: 4,
    color: "bg-green-500",
    className: "Rural / Suburban Transition",
    location: "Outskirts of rural towns",
    stars: "⭐⭐⭐",
  },
  {
    number: 5,
    color: "bg-yellow-400",
    className: "Suburban Sky",
    location: "Residential suburbs",
    stars: "⭐⭐",
  },
  {
    number: 6,
    color: "bg-orange-500",
    className: "Bright Suburban Sky",
    location: "Heavily populated suburbs",
    stars: "⭐⭐",
  },
  {
    number: 7,
    color: "bg-red-600",
    className: "Suburban / Urban Transition",
    location: "Outer edges of major cities",
    stars: "⭐",
  },
  {
    number: 8,
    color: "bg-gray-300",
    className: "City Sky",
    location: "Dense urban areas",
    stars: "⭐",
  },
  {
    number: 9,
    color: "bg-white border border-gray-300",
    className: "Inner City Sky",
    location: "Downtown metropolitan centers",
    stars: "·",
  },
];

type BortleScaleChartProps = {
  className?: string;
};

export default function BortleScaleChart({ className = "" }: BortleScaleChartProps) {
  return (
    <div className={`grid gap-3 ${className}`}>
      {bortleScale.map((b, i) => (
        <motion.div
          key={b.number}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-700/20 to-slate-800/20 border border-slate-600/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold text-purple-400 w-8">{b.number}</div>
            <div className={`w-12 h-12 rounded-lg ${b.color} border-2 border-white/30 shadow-lg`} />
          </div>
          <div className="flex-1">
            <div className="font-bold text-lg text-white mb-1 flex items-center gap-2">
              {b.className}
              <span className="text-sm">{b.stars}</span>
            </div>
            <div className="text-sm text-slate-400">{b.location}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
