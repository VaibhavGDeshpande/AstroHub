'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import SatelliteMap from '@/components/Satellite/SatelliteMap';
import LoaderWrapper from "@/components/Loader";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeftIcon, HomeIcon } from "@heroicons/react/24/outline";

interface PresetSatellite {
  label: string;
  noradId: number;
  description: string;
}

const FAMOUS_SATELLITES: PresetSatellite[] = [
  {
    label: 'International Space Station (ISS)',
    noradId: 25544,
    description: 'Crewed orbital research laboratory'
  },
  {
    label: 'Hubble Space Telescope',
    noradId: 20580,
    description: 'Deep-space observatory since 1990'
  },
  {
    label: 'Landsat 9',
    noradId: 49260,
    description: 'Earth imaging mission for land change'
  },
  {
    label: 'Sentinel-2A',
    noradId: 40697,
    description: 'ESA multispectral climate sentinel'
  },
  {
    label: 'Terra (EOS AM-1)',
    noradId: 25994,
    description: 'Flagship Earth Observing System craft'
  }
];

interface SatelliteTrackerPageProps {
  params: { noradId?: string[] };
}

export default function SatelliteTrackerPage({ params }: SatelliteTrackerPageProps) {
  const router = useRouter();

  const currentParam = params?.noradId?.[0] ?? '';
  const parsedInitial = Number(currentParam);
  const matchedPreset = Number.isNaN(parsedInitial)
    ? undefined
    : FAMOUS_SATELLITES.find((sat) => sat.noradId === parsedInitial);
  const initialPreset = matchedPreset ?? FAMOUS_SATELLITES[0];
  const initialCustomValue = matchedPreset ? '' : currentParam;

  const [selectedPreset, setSelectedPreset] = useState<(typeof FAMOUS_SATELLITES)[number]>(initialPreset);
  const [customNorad, setCustomNorad] = useState(initialCustomValue);

  const activeSatellite = useMemo(() => {
    const trimmed = customNorad.trim();
    if (trimmed.length > 0) {
      const parsed = Number(trimmed);
      if (!Number.isNaN(parsed)) {
        return {
          label: `NORAD ${parsed}`,
          description: 'Custom NORAD selection',
          noradId: parsed
        };
      }
    }
    return selectedPreset;
  }, [customNorad, selectedPreset]);

  useEffect(() => {
    if (!currentParam) return;
    const parsed = Number(currentParam);
    if (!Number.isNaN(parsed)) {
      const presetMatch = FAMOUS_SATELLITES.find((sat) => sat.noradId === parsed);
      if (presetMatch) {
        setSelectedPreset(presetMatch);
        setCustomNorad('');
        return;
      }
    }
    setCustomNorad(currentParam);
  }, [currentParam]);

  useEffect(() => {
    const targetSegment = String(activeSatellite.noradId);
    if (currentParam === targetSegment) return;
    router.replace(`/satellite-tracker/${targetSegment}`, { scroll: false });
  }, [activeSatellite.noradId, currentParam, router]);

  const isISS = activeSatellite.noradId === 25544;

  return (
    <LoaderWrapper>
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
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
      {/* Header */}
      <header className="border-b border-white/5 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Satellite Tracker</h1>
                  <p className="text-sm text-slate-400">Real-time orbital tracking</p>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 ring-1 ring-emerald-400/20">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-emerald-200">Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Bento Grid */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-12 lg:grid-rows-[auto_1fr]">
          
          {/* Satellite Selection Panel - Top Left */}
          <div className="lg:col-span-4 lg:row-span-2">
            <div className="h-full rounded-2xl bg-slate-900/50 p-5 shadow-xl ring-1 ring-white/10 backdrop-blur-sm">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-white">Select Satellite</h2>
                <p className="mt-1 text-xs text-slate-400">Choose from featured missions or enter any NORAD ID</p>
              </div>

              {/* Featured Satellites */}
              <div className="space-y-2 mb-4">
                {FAMOUS_SATELLITES.map((sat) => {
                  const isActive = activeSatellite.noradId === sat.noradId;
                  return (
                    <button
                      key={sat.noradId}
                      onClick={() => {
                        setSelectedPreset(sat);
                        setCustomNorad('');
                      }}
                      className={`group relative w-full overflow-hidden rounded-lg border p-3 text-left transition-all ${
                        isActive 
                          ? 'border-emerald-400/50 bg-gradient-to-br from-emerald-400/20 to-cyan-400/10 shadow-lg shadow-emerald-500/20' 
                          : 'border-white/10 bg-slate-800/50 hover:border-white/30 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="relative z-10">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-white text-xs">{sat.label}</p>
                            <p className="mt-0.5 text-xs text-slate-300">{sat.description}</p>
                          </div>
                          {isActive && (
                            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400">
                              <svg className="h-2.5 w-2.5 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <span className="mt-1.5 inline-block rounded-full bg-slate-900/50 px-2 py-0.5 text-xs font-mono text-emerald-300">
                          {sat.noradId}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom NORAD Input */}
              <div className="mb-3">
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                  Custom NORAD ID
                </label>
                <div className="relative">
                  <input
                    value={customNorad}
                    onChange={(event) => setCustomNorad(event.target.value)}
                    placeholder="e.g., 43013"
                    className="w-full rounded-lg border border-white/10 bg-slate-800/80 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                  />
                  {customNorad && (
                    <button
                      onClick={() => setCustomNorad('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* SatNOGS Database Link */}
              <div className="rounded-lg bg-gradient-to-br from-blue-900/30 to-cyan-900/20 p-3 ring-1 ring-blue-400/20 mb-3">
                <div className="flex items-start gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 ring-1 ring-blue-400/30">
                    <svg className="h-4 w-4 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-200 mb-1">
                      Need more satellites?
                    </p>
                    <p className="text-xs text-slate-400 mb-2">
                      Browse thousands of satellites in the SatNOGS database
                    </p>
                    <a
                      href="https://db.satnogs.org/satellites/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md bg-blue-500/20 px-2.5 py-1.5 text-xs font-medium text-blue-200 transition-all hover:bg-blue-500/30 hover:text-blue-100 ring-1 ring-blue-400/30 hover:ring-blue-400/50"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View Full Satellite List
                    </a>
                  </div>
                </div>
              </div>

              {/* Active Satellite Info */}
              <div className="rounded-lg bg-gradient-to-br from-slate-800/80 to-slate-800/50 p-3 ring-1 ring-white/5">
                <p className="text-xs uppercase tracking-wide text-emerald-300/70 mb-1.5">Currently Tracking</p>
                <p className="text-base font-semibold text-white">{activeSatellite.label}</p>
                <p className="text-xs text-slate-300 mt-1">{activeSatellite.description}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-mono font-semibold text-emerald-300">
                    NORAD {activeSatellite.noradId}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Map - Top Right (Larger) */}
          <div className="lg:col-span-8 lg:row-span-1">
            <div className="h-full min-h-[400px] lg:min-h-[500px] rounded-2xl bg-slate-900/50 p-4 shadow-xl ring-1 ring-white/10 backdrop-blur-sm overflow-hidden">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">Live Orbital Track</h2>
                  <p className="text-sm text-slate-400">Real-time position updates</p>
                </div>
                <div className="rounded-lg bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-300">
                  🌍 Earth View
                </div>
              </div>
              <div className="h-[calc(100%-4rem)] rounded-xl overflow-hidden ring-1 ring-white/10">
                <SatelliteMap noradId={activeSatellite.noradId} satelliteName={activeSatellite.label} />
              </div>
            </div>
          </div>

          {/* ISS Live Stream - Bottom Right */}
          <div className="lg:col-span-8 lg:row-span-1">
            <div className="h-full rounded-2xl bg-slate-900/50 p-4 shadow-xl ring-1 ring-white/10 backdrop-blur-sm">
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-white">ISS Live Stream</h2>
                    {isISS && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-400/30">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                        </span>
                        Synced
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mt-1">
                    {isISS
                      ? 'Tracking matches the live camera feed'
                      : 'Select ISS (NORAD 25544) to sync with this stream'}
                  </p>
                </div>
              </div>
              <div className="aspect-video w-full overflow-hidden rounded-xl ring-1 ring-white/10 shadow-2xl">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/Ni-YkkvH6DQ"
                  title="International Space Station Live Stream"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              <p className="mt-3 text-xs text-slate-500">
                <span className="font-medium text-slate-400">NASA ISS Livestream</span> • Earth view from 400km altitude • Slight transmission delays may occur
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
    </LoaderWrapper>
  );
} 