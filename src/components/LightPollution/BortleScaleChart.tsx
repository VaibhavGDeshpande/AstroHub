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
    <div className={`grid gap-4 ${className}`}>
      {bortleScale.map((b, i) => (
        <motion.div
          key={b.number}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="group flex items-center gap-4 p-4 md:p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20"
        >
          <div className="flex items-center gap-4">
            <div className="text-2xl md:text-3xl font-black text-purple-400 w-8 md:w-10 tabular-nums">{b.number}</div>
            <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl ${b.color} border border-white/20 shadow-xl group-hover:scale-110 transition-transform duration-500`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-base md:text-xl text-white mb-1 flex flex-wrap items-center gap-2">
              <span className="truncate">{b.className}</span>
              <span className="text-xs md:text-sm bg-black/40 px-2 py-0.5 rounded-full border border-white/10 group-hover:bg-purple-500/20 transition-all duration-500">{b.stars}</span>
            </div>
            <div className="text-xs md:text-sm text-slate-500 font-medium group-hover:text-slate-300 transition-colors line-clamp-2 md:line-clamp-none">
              {b.location}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
