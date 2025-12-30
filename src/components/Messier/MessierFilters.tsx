"use client";

import { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { AdjustmentsHorizontalIcon, ArrowPathIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { SortOption } from "@/components/Messier/utils";

type Option = { value: string; label: string };

export default function MessierFilters({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  seasonFilter,
  setSeasonFilter,
  difficultyFilter,
  setDifficultyFilter,
  sortBy,
  setSortBy,
  typeOptions,
  seasonOptions,
  difficultyOptions,
}: {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  typeFilter: string;
  setTypeFilter: Dispatch<SetStateAction<string>>;
  seasonFilter: string;
  setSeasonFilter: Dispatch<SetStateAction<string>>;
  difficultyFilter: string;
  setDifficultyFilter: Dispatch<SetStateAction<string>>;
  sortBy: SortOption;
  setSortBy: Dispatch<SetStateAction<SortOption>>;
  typeOptions: Option[];
  seasonOptions: Option[];
  difficultyOptions: Option[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-slate-900/70 border border-slate-700/60 rounded-2xl p-5 sm:p-6 mb-8 shadow-xl backdrop-blur"
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30">
            <AdjustmentsHorizontalIcon className="w-5 h-5 text-purple-200" />
          </div>
          <div>
            <p className="text-sm text-slate-300 font-semibold">Filter the catalog</p>
            <p className="text-xs text-slate-400">Search by name, constellation, or Messier/NGC number</p>
          </div>
        </div>
        <div className="flex gap-2 lg:ml-auto">
          <button
            onClick={() => {
              setSearchTerm("");
              setTypeFilter("all");
              setSeasonFilter("all");
              setDifficultyFilter("all");
              setSortBy("number");
            }}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/70 border border-slate-700/70 text-xs sm:text-sm hover:border-blue-400/50 hover:text-white transition"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <label className="text-xs text-slate-400 mb-1 block">Search</label>
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Try 'Andromeda', 'M13', 'globular', or 'Orion'"
              className="w-full rounded-xl bg-slate-800/70 border border-slate-700/60 text-sm text-white pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Object type</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full rounded-xl bg-slate-800/70 border border-slate-700/60 text-sm text-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          >
            <option value="all">All types</option>
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Best season</label>
          <select
            value={seasonFilter}
            onChange={(e) => setSeasonFilter(e.target.value)}
            className="w-full rounded-xl bg-slate-800/70 border border-slate-700/60 text-sm text-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          >
            <option value="all">All seasons</option>
            {seasonOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Difficulty</label>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="w-full rounded-xl bg-slate-800/70 border border-slate-700/60 text-sm text-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          >
            <option value="all">Any</option>
            {difficultyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Sort</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full rounded-xl bg-slate-800/70 border border-slate-700/60 text-sm text-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          >
            <option value="number">Messier number</option>
            <option value="brightness">Brightness (mag)</option>
            <option value="distance">Closest first</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
}

