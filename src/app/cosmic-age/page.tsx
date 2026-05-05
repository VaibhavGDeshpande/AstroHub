"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { findClosestStar, Star } from "@/lib/starsData";
import CosmicAgeResultCard from "@/components/CosmicAgeResultCard";
import LoaderWrapper from "@/components/Loader";

export default function CosmicAgePage() {
  const [dob, setDob] = useState("");
  const [result, setResult] = useState<{ age: number; star: Star } | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const calculateCosmicAge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob) return;

    const birthDate = new Date(dob);
    const today = new Date();
    
    // Calculate exact age in years including decimals
    const millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25;
    const ageInYears = (today.getTime() - birthDate.getTime()) / millisecondsInYear;

    if (ageInYears < 0) {
      alert("Please select a date in the past.");
      return;
    }

    setIsFetching(true);

    try {
      // 1. Try to fetch from API Ninjas via our backend route
      const res = await fetch(`/api/stars?age=${ageInYears}`);
      const data = await res.json();

      if (res.ok && data.stars && data.stars.length > 0) {
        // Map API response to our Star interface
        const topMatch = data.stars[0];
        const apiStar: Star = {
          name: topMatch.name,
          distanceLy: parseFloat(topMatch.distance_light_year),
          constellation: topMatch.constellation,
          type: topMatch.spectral_class ? `Spectral Class ${topMatch.spectral_class}` : "Unknown Type",
          funFact: `This star is located exactly ${topMatch.distance_light_year} light-years away, matching your cosmic age. Data sourced live from astronomical catalogs.`
        };
        setResult({ age: ageInYears, star: apiStar });
      } else {
        // 2. Fallback to local dataset if API returns no results or fails
        console.log("Falling back to local star dataset...");
        const closestStar = findClosestStar(ageInYears);
        setResult({ age: ageInYears, star: closestStar });
      }
    } catch (err) {
      console.error("Error fetching star data:", err);
      // Fallback on network error
      const closestStar = findClosestStar(ageInYears);
      setResult({ age: ageInYears, star: closestStar });
    } finally {
      setIsFetching(false);
    }
  };

  const resetCalculator = () => {
    setResult(null);
    setDob("");
  };

  return (
    <LoaderWrapper>
    <div className="min-h-screen bg-slate-950 text-slate-200 pt-32 pb-24 md:pt-32 px-4 overflow-hidden relative">
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
        
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 mb-6"
          >
            Cosmic Age Calculator
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Discover your cosmic twin. We map your exact age on Earth to the vast distances of space, finding the star whose light began its journey to us the moment you were born.
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.form 
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 0.4 }}
              onSubmit={calculateCosmicAge}
              className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl w-full max-w-md"
            >
              <div className="mb-6 relative">
                <label htmlFor="dob" className="block text-sm font-medium text-slate-400 mb-2">
                  When were you born?
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="date"
                    id="dob"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isFetching}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-900/30 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{isFetching ? "Calculating Distance..." : "Find My Star"}</span>
                {!isFetching && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </motion.form>
          ) : (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full flex flex-col items-center"
            >
              <CosmicAgeResultCard star={result.star} age={result.age} />
              
              <button
                onClick={resetCalculator}
                className="mt-12 text-slate-400 hover:text-white transition-colors underline underline-offset-4 decoration-slate-700 hover:decoration-slate-400"
              >
                Try another date
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </LoaderWrapper>
  );
}
