"use client";

import { motion } from "framer-motion";
import { ArrowTopRightOnSquareIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { MessierEntry } from "@/types/messier";
import { difficultyTone, formatDistance, formatLabel, formatMagnitude, seasonTone } from "@/components/Messier/utils";

export default function MessierCard({ item, index }: { item: MessierEntry; index: number }) {
  const openImageInNewTab = () => {
    if (!item.image) return;
    window.open(item.image, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.03 * index }}
      className="group bg-slate-900/70 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl hover:border-purple-400/50 hover:shadow-purple-500/20 transition-all duration-300 flex flex-col"
    >
      <div
        className="relative h-44 bg-slate-800 cursor-pointer"
        role="button"
        tabIndex={0}
        aria-label={`Open ${item.id} image in a new tab`}
        onClick={openImageInNewTab}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") openImageInNewTab();
        }}
      >
        <img
          src={item.image}
          alt={`${item.id} - ${item.name}`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='360'%3E%3Crect width='600' height='360' fill='%23111'/%3E%3Ctext x='50%25' y='50%25' fill='%23555' font-family='sans-serif' font-size='20' text-anchor='middle'%3ENo image%3C/text%3E%3C/svg%3E";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute top-3 right-3 opacity-90 group-hover:opacity-100 transition-opacity">
          <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-600/40 backdrop-blur-sm text-xs text-slate-100">
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            <span>Fullscreen</span>
          </div>
        </div>
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className={`text-xs px-2 py-1 rounded-full border ${seasonTone(item.viewingSeason)}`}>
            {formatLabel(item.viewingSeason)}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full border ${difficultyTone(item.viewingDifficulty)}`}>
            {formatLabel(item.viewingDifficulty)}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-200">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-md bg-slate-900/70 border border-slate-700/60 font-semibold">
              {item.id.padEnd(3, " ")}
            </span>
            <span className="font-semibold">{item.name}</span>
          </div>
          {item.NGC && (
            <span className="px-2 py-1 rounded-md bg-blue-500/20 border border-blue-500/40 text-blue-100">
              {item.NGC}
            </span>
          )}
        </div>
      </div>

      <div className="p-5 space-y-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <GlobeAltIcon className="w-4 h-4 text-blue-300" />
            <span className="font-medium">{item.constellation}</span>
          </div>
          <span className="text-xs px-2 py-1 rounded-md bg-purple-500/10 text-purple-200 border border-purple-500/30">
            {item.type}
          </span>
        </div>

        {item.alternateNames.length > 0 && (
          <div className="flex flex-wrap gap-2 text-xs text-slate-400">
            {item.alternateNames.slice(0, 3).map((alias) => (
              <span key={alias} className="px-2 py-1 rounded-md bg-slate-800/70 border border-slate-700/60">
                {alias}
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 text-sm text-slate-300">
          <div>
            <p className="text-xs text-slate-400">Magnitude</p>
            <p className="font-semibold">{formatMagnitude(item.magnitude)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Distance</p>
            <p className="font-semibold">{formatDistance(item.distance)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Size</p>
            <p className="font-semibold">{item.size}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">RA / Dec</p>
            <p className="font-semibold">{item.rightAscension}</p>
            <p className="text-xs text-slate-400">{item.declination}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
