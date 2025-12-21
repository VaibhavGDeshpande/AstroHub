"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeftIcon, HomeIcon } from "@heroicons/react/24/outline";
import { getMessierCatalog } from "@/api_service/messier";
import { MessierEntry, MessierInfo } from "@/types/messier";
import LoaderWrapper from "@/components/Loader";
import ErrorMessage from "@/components/Error";
import MessierHeader from "@/components/Messier/MessierHeader";
import MessierFilters from "@/components/Messier/MessierFilters";
import MessierStats from "@/components/Messier/MessierStats";
import MessierGrid from "@/components/Messier/MessierGrid";
import MessierAttribution from "@/components/Messier/MessierAttribution";
import { buildOptionMap, formatLabel, sortCatalog, SortOption } from "@/components/Messier/utils";

export default function MessierExplorer() {
  const [catalog, setCatalog] = useState<MessierEntry[]>([]);
  const [info, setInfo] = useState<MessierInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [seasonFilter, setSeasonFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("number");

  const loadCatalog = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMessierCatalog();
      setCatalog(response.data);
      setInfo(response.info ?? null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load Messier catalog";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  const typeOptions = useMemo(() => {
    const lookup = buildOptionMap(catalog, (item) => item.type);
    return Array.from(lookup.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [catalog]);

  const seasonOptions = useMemo(() => {
    const lookup = buildOptionMap(catalog, (item) => item.viewingSeason || "");
    return Array.from(lookup.entries())
      .map(([value, label]) => ({ value, label: formatLabel(label) }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [catalog]);

  const difficultyOptions = useMemo(() => {
    const lookup = buildOptionMap(catalog, (item) => item.viewingDifficulty || "");
    return Array.from(lookup.entries())
      .map(([value, label]) => ({ value, label: formatLabel(label) }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [catalog]);

  const filteredCatalog = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    const matchesSearch = (item: MessierEntry) => {
      if (!term) return true;
      return (
        item.name.toLowerCase().includes(term) ||
        item.id.toLowerCase().includes(term) ||
        (item.NGC || "").toLowerCase().includes(term) ||
        item.constellation.toLowerCase().includes(term) ||
        item.type.toLowerCase().includes(term) ||
        item.alternateNames.some((name) => name.toLowerCase().includes(term))
      );
    };

    const matchesType = (item: MessierEntry) => typeFilter === "all" || item.type.toLowerCase() === typeFilter;

    const matchesSeason = (item: MessierEntry) => {
      if (seasonFilter === "all") return true;
      return (item.viewingSeason || "").toLowerCase() === seasonFilter;
    };

    const matchesDifficulty = (item: MessierEntry) => {
      if (difficultyFilter === "all") return true;
      return (item.viewingDifficulty || "").toLowerCase() === difficultyFilter;
    };

    const filtered = catalog.filter(
      (item) => matchesSearch(item) && matchesType(item) && matchesSeason(item) && matchesDifficulty(item),
    );

    return sortCatalog(filtered, sortBy);
  }, [catalog, searchTerm, typeFilter, seasonFilter, difficultyFilter, sortBy]);

  if (error && !loading) {
    return <ErrorMessage error={error} onRetry={loadCatalog} />;
  }

  return (
    <LoaderWrapper isVisible={loading} minDuration={800}>
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-6 left-10 w-72 h-72 bg-purple-500/20 blur-[120px]" />
          <div className="absolute top-1/2 right-12 w-80 h-80 bg-blue-500/20 blur-[120px]" />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-40 bg-pink-500/20 blur-[100px]" />
        </div>

        {/* Back Button */}
        <div className="fixed top-4 left-4 z-50 hidden md:block">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-12">
          <MessierHeader />
          <MessierFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            seasonFilter={seasonFilter}
            setSeasonFilter={setSeasonFilter}
            difficultyFilter={difficultyFilter}
            setDifficultyFilter={setDifficultyFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            typeOptions={typeOptions}
            seasonOptions={seasonOptions}
            difficultyOptions={difficultyOptions}
          />

          <MessierStats items={filteredCatalog} />
          <MessierGrid items={filteredCatalog} />

          {filteredCatalog.length === 0 && !loading && (
            <div className="text-center text-slate-400 mt-10">
              No objects match those filters. Try clearing filters or searching by a broader term.
            </div>
          )}

          {info && <MessierAttribution info={info} />}
        </div>
      </div>
    </LoaderWrapper>
  );
}

