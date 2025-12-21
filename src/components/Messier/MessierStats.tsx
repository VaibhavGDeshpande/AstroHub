"use client";

import { motion } from "framer-motion";
import { SparklesIcon, StarIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { MessierEntry } from "@/types/messier";

export default function MessierStats({ items }: { items: MessierEntry[] }) {
  const brightCount = items.filter((item) => (item.magnitude || 99) <= 7).length;
  const clusterCount = items.filter((item) => item.type.toLowerCase().includes("cluster")).length;
  const galaxyCount = items.filter((item) => item.type.toLowerCase().includes("galaxy")).length;

  const stats = [
    { label: "Objects", value: items.length, icon: SparklesIcon },
    { label: "Mag < 7", value: brightCount, icon: StarIcon },
    { label: "Clusters", value: clusterCount, icon: GlobeAltIcon },
    { label: "Galaxies", value: galaxyCount, icon: GlobeAltIcon },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
    >
      {stats.map((stat, idx) => {
        const StatIcon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * idx }}
            className="bg-slate-900/70 border border-slate-700/60 rounded-xl p-4 flex items-center gap-3 shadow-lg"
          >
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <StatIcon className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

