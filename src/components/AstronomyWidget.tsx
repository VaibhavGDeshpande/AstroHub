"use client";

import { useEffect, useMemo, useState } from "react";
import { getAstronomy } from "@/api_service/astronomy";

type AstronomyAPI = {
  astronomy?: {
    sunrise?: string;
    sunset?: string;
    moonrise?: string;
    moonset?: string;
    moon_phase?: string;
    moon_illumination?: string | number;
    moon_illumination_percentage?: string | number;
    current_time_12h?: string;
    current_time?: string;
    local_time_12h?: string;
    local_time?: string;
    time?: string;
    morning?: {
      civil_twilight_begin?: string;
      nautical_twilight_begin?: string;
      astronomical_twilight_begin?: string;
    };
    evening?: {
      civil_twilight_end?: string;
      nautical_twilight_end?: string;
      astronomical_twilight_end?: string;
    };
    date?: string;
  };
  location?: {
    city?: string;
    state_prov?: string;
    country_name?: string;
  };
};

type AstronomyData = {
  sunrise?: string;
  sunset?: string;
  moonrise?: string;
  moonset?: string;
  moon_phase?: string;
  moon_illumination?: string | number;
  astronomy?: { current_time?: string };
  civil_twilight_begin?: string;
  civil_twilight_end?: string;
  nautical_twilight_begin?: string;
  nautical_twilight_end?: string;
  astronomical_twilight_begin?: string;
  astronomical_twilight_end?: string;
  location_label?: string;
  date?: string;
};

type CachedData = {
  data: AstronomyData;
  location: string;
  timestamp: string;
};

const CACHE_KEY = "astronomy_widget_cache_v2"; // versioned to avoid stale shapes

function getMoonPhaseIcon(phase?: string) {
  if (!phase) return "🌘";
  const p = phase.replace(/_/g, " ").toLowerCase();
  if (p.includes("new")) return "🌑";
  if (p.includes("waxing crescent")) return "🌒";
  if (p.includes("first quarter") || p.includes("first-quarter") || p.includes("first_quarter")) return "🌓";
  if (p.includes("waxing gibbous")) return "🌔";
  if (p.includes("full")) return "🌕";
  if (p.includes("waning gibbous")) return "🌖";
  if (p.includes("last quarter") || p.includes("third quarter") || p.includes("last-quarter") || p.includes("third-quarter") || p.includes("last_quarter") || p.includes("third_quarter")) return "🌗";
  if (p.includes("waning crescent")) return "🌘";
  if (p.includes("waxing")) return "🌔";
  if (p.includes("waning")) return "🌖";
  return "🌕";
}

function timeToMinutes(timeStr?: string): number {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

function isDaytime(sunriseTime?: string, sunsetTime?: string): boolean {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const sunrise = timeToMinutes(sunriseTime);
  const sunset = timeToMinutes(sunsetTime);
  return currentMinutes >= sunrise && currentMinutes < sunset;
}

function getTodayString(): string {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

export default function AstronomyWidget() {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState("Pune");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AstronomyData | null>(null);
  const [showMorning, setShowMorning] = useState(false);
  const [showEvening, setShowEvening] = useState(false);
  const [displayTime, setDisplayTime] = useState<string | undefined>(undefined); // mirrors API local time at change events

  // Prevent background scroll when modal is open but allow modal content scrolling
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const scrollY = window.scrollY;

      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [open]);

  // Close/hide when AstroBot opens
  useEffect(() => {
    const handleAstroBotOpen = () => setOpen(false);
    window.addEventListener('astrobot:open', handleAstroBotOpen);
    return () => {
      window.removeEventListener('astrobot:open', handleAstroBotOpen);
    };
  }, []);

  const loadCachedData = (loc: string): AstronomyData | null => {
    if (typeof window === "undefined") return null;
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      const parsed: CachedData = JSON.parse(cached);
      const today = getTodayString();
      if (parsed.timestamp === today && parsed.location.toLowerCase() === loc.toLowerCase()) {
        return parsed.data;
      }
      localStorage.removeItem(CACHE_KEY);
      return null;
    } catch {
      return null;
    }
  };

  const saveCachedData = (loc: string, astroData: AstronomyData) => {
    if (typeof window === "undefined") return;
    try {
      const cacheData: CachedData = {
        data: astroData,
        location: loc,
        timestamp: getTodayString(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch {}
  };

  // Fetch with force option to bypass cache on changes
  const fetchData = async (loc: string, opts?: { force?: boolean }) => {
    try {
      setLoading(true);
      setError(null);

      if (!opts?.force) {
        const cached = loadCachedData(loc);
        if (cached) {
          setData(cached);
          // keep previous displayTime; it changes only on explicit events
          setLoading(false);
          return;
        }
      }

      const result = (await getAstronomy(loc.trim())) as unknown as AstronomyAPI;
      const astro = result?.astronomy ?? {};
      const locInfo = result?.location ?? {};

      // Pick the location's local time from API in priority order
      const apiLocalTime =
        astro.current_time_12h ??
        astro.current_time ??
        astro.local_time_12h ??
        astro.local_time ??
        astro.time ??
        undefined;

      const prettyPhase =
        typeof astro.moon_phase === "string"
          ? astro.moon_phase
              .replace(/_/g, " ")
              .toLowerCase()
              .replace(/\b\w/g, (m: string) => m.toUpperCase())
          : astro.moon_phase;

      const mapped: AstronomyData = {
        sunrise: astro.sunrise,
        sunset: astro.sunset,
        moonrise: astro.moonrise,
        moonset: astro.moonset,
        moon_phase: prettyPhase,
        moon_illumination: astro.moon_illumination_percentage ?? astro.moon_illumination,
        astronomy: { current_time: apiLocalTime }, // location local time from API
        civil_twilight_begin: astro?.morning?.civil_twilight_begin,
        nautical_twilight_begin: astro?.morning?.nautical_twilight_begin,
        astronomical_twilight_begin: astro?.morning?.astronomical_twilight_begin,
        civil_twilight_end: astro?.evening?.civil_twilight_end,
        nautical_twilight_end: astro?.evening?.nautical_twilight_end,
        astronomical_twilight_end: astro?.evening?.astronomical_twilight_end,
        location_label: [locInfo.city, locInfo.state_prov, locInfo.country_name].filter(Boolean).join(", "),
        date: astro.date,
      };

      setData(mapped);
      saveCachedData(loc, mapped);

      // Reflect API local time into displayTime at fetch events
      setDisplayTime(apiLocalTime);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch astronomy data");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Initial mount: allow cache for speed
  useEffect(() => {
    fetchData(location); // cached if available
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const illuminationPct = useMemo(() => {
    if (!data?.moon_illumination && data?.moon_illumination !== 0) return undefined;
    const num = typeof data.moon_illumination === "string" ? parseFloat(data.moon_illumination) : data.moon_illumination;
    if (isNaN(num as number)) return undefined;
    const clamped = Math.min(100, Math.max(0, Number(num)));
    return `${clamped}%`;
  }, [data?.moon_illumination]);

  const isDay = isDaytime(data?.sunrise, data?.sunset);

  return (
    <>
      {/* Floating trigger */}
      <button
        id="astronomy-widget-trigger"
        aria-label="Open astronomy widget"
        className="fixed bottom-36 right-4 z-[2147483648] flex flex-col items-center gap-1 group p-0 hover:scale-110 active:scale-95 transition-all duration-300"
        onClick={() => {
          setOpen(true);
          fetchData(location, { force: true }); // always call API when opened
          // displayTime will be set from API by fetchData; no device time mixing
        }}
      >
        <div
          className="w-12 h-12 rounded-full 
                     shadow-lg group-hover:shadow-xl transition-shadow
                     bg-gradient-to-br from-blue-400/20 to-purple-500/20
                     backdrop-blur-sm border border-white/20
                     flex items-center justify-center"
        >
          <span className={`text-xl ${isDay ? "sun-emoji" : "moon-emoji"}`}>
            {isDay ? "☀️" : getMoonPhaseIcon(data?.moon_phase)}
          </span>
        </div>
        <span className="text-[10px] sm:text-xs font-medium text-white/90 whitespace-nowrap">
          {isDay ? "Day" : data?.moon_phase?.split(" ")[0] || "Moon"}
        </span>
      </button>

      {/* Modal */}
      {open && (
        <div
          id="astronomy-widget-modal"
          className="fixed inset-0 z-[2147483648] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out] overflow-hidden"
          onClick={() => {
            setOpen(false);
            fetchData(location, { force: true }); 
          }}
        >
          <div
            className="w-full sm:max-w-lg sm:rounded-2xl 
           bg-white/10 backdrop-blur-md 
           text-white shadow-2xl 
           p-5 sm:p-7 
           max-h-[92vh] overflow-y-auto
           border border-white/10
           animate-[slideUp_0.3s_ease-out] sm:animate-[scaleIn_0.3s_ease-out]
           scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-transparent
           touch-pan-y overscroll-contain" // Enhanced scroll properties

            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => {
              // Allow wheel scrolling within the modal
              e.stopPropagation();
            }}
            onTouchMove={(e) => {
              // Allow touch scrolling within the modal
              e.stopPropagation();
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
                  {isDay ? "☀️" : getMoonPhaseIcon(data?.moon_phase)}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Astronomy Today
                </h2>
              </div>
              <button
                className="text-white/60 hover:text-white text-2xl transition-colors"
                onClick={() => {
                  setOpen(false);
                  fetchData(location, { force: true }); // refresh on close
                }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Location Input */}
            <div className="flex gap-2 mb-5">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && location.trim()) {
                    fetchData(location, { force: true }); // call API on Enter
                  }
                }}
                placeholder="Enter city or place"
                className="flex-1 rounded-xl border border-white/20 bg-white/5 
                           px-4 py-2.5 text-white placeholder-white/40
                           focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                           backdrop-blur-sm transition-all"
              />
              <button
                className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 
                           text-white px-5 py-2.5 font-medium
                           hover:from-blue-500 hover:to-purple-500 
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all shadow-lg hover:shadow-xl"
                onClick={() => {
                  fetchData(location, { force: true }); // call API on Update
                }}
                disabled={loading || !location.trim()}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading
                  </span>
                ) : (
                  "Update"
                )}
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 px-4 py-3 text-sm backdrop-blur-sm">
                {error}
              </div>
            )}

            {/* Location Info */}
            <div className="mb-4 text-xs sm:text-sm text-white/60 flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1">📍 {data?.location_label || location}</span>
              {data?.date && (
                <>
                  <span>•</span>
                  <span>📅 {data.date}</span>
                  <span></span>
                </>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm hover:bg-white/10 transition-all">
                <div className="text-xs sm:text-sm text-white/60 mb-1">Current Time</div>
                <div className="text-lg sm:text-xl font-bold text-white">
                  {displayTime ?? data?.astronomy?.current_time ?? "—"}
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm hover:bg-white/10 transition-all">
                <div className="text-xs sm:text-sm text-white/60 mb-1">Sunrise</div>
                <div className="text-lg sm:text-xl font-bold text-white">{data?.sunrise ?? "—"}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm hover:bg-white/10 transition-all">
                <div className="text-xs sm:text-sm text-white/60 mb-1">Sunset</div>
                <div className="text-lg sm:text-xl font-bold text-white">{data?.sunset ?? "—"}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm hover:bg-white/10 transition-all">
                <div className="text-xs sm:text-sm text-white/60 mb-1">Moonrise</div>
                <div className="text-lg sm:text-xl font-bold text-white">{data?.moonrise ?? "—"}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm hover:bg-white/10 transition-all">
                <div className="text-xs sm:text-sm text-white/60 mb-1">Moonset</div>
                <div className="text-lg sm:text-xl font-bold text-white">{data?.moonset ?? "—"}</div>
              </div>
            </div>

            {/* Moon Phase */}
            <div className="mb-4 flex items-center gap-4 rounded-xl border border-white/10 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 p-4 backdrop-blur-sm">
              <div className="text-4xl sm:text-5xl moon-emoji" aria-hidden>
                {getMoonPhaseIcon(data?.moon_phase)}
              </div>
              <div className="flex-1">
                <div className="text-xs sm:text-sm text-white/60 mb-1">Moon Phase</div>
                <div className="text-base sm:text-lg font-bold text-white">{data?.moon_phase ?? "—"}</div>
                <div className="text-xs sm:text-sm text-white/70 mt-1">
                  Illumination: <span className="font-semibold">{illuminationPct ?? "—"}</span>
                </div>
              </div>
            </div>

            {/* Twilights */}
            <div className="space-y-3">
              <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden backdrop-blur-sm">
                <button
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all"
                  onClick={() => setShowMorning((s) => !s)}
                >
                  <span className="font-semibold text-sm sm:text-base flex items-center gap-2">Morning Twilights</span>
                  <span className="text-white/60 text-xl">{showMorning ? "▴" : "▾"}</span>
                </button>
                {showMorning && (
                  <div className="px-4 pb-4 space-y-2">
                    <div className="flex items-center justify-between rounded-lg bg-white/5 p-3 text-sm">
                      <span className="text-white/70">Astronomical Begin</span>
                      <span className="font-medium">{data?.astronomical_twilight_begin ?? "—"}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-white/5 p-3 text-sm">
                      <span className="text-white/70">Nautical Begin</span>
                      <span className="font-medium">{data?.nautical_twilight_begin ?? "—"}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-white/5 p-3 text-sm">
                      <span className="text-white/70">Civil Begin</span>
                      <span className="font-medium">{data?.civil_twilight_begin ?? "—"}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden backdrop-blur-sm">
                <button
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all"
                  onClick={() => setShowEvening((s) => !s)}
                >
                  <span className="font-semibold text-sm sm:text-base flex items-center gap-2">Evening Twilights</span>
                  <span className="text-white/60 text-xl">{showEvening ? "▴" : "▾"}</span>
                </button>
                {showEvening && (
                  <div className="px-4 pb-4 space-y-2">
                    <div className="flex items-center justify-between rounded-lg bg-white/5 p-3 text-sm">
                      <span className="text-white/70">Civil End</span>
                      <span className="font-medium">{data?.civil_twilight_end ?? "—"}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-white/5 p-3 text-sm">
                      <span className="text-white/70">Nautical End</span>
                      <span className="font-medium">{data?.nautical_twilight_end ?? "—"}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-white/5 p-3 text-sm">
                      <span className="text-white/70">Astronomical End</span>
                      <span className="font-medium">{data?.astronomical_twilight_end ?? "—"}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 text-[10px] sm:text-xs text-white/40 text-center">
              Source: ipgeolocation.io Astronomy API • Data cached daily
            </div>
          </div>
        </div>
      )}
    </>
  );
}