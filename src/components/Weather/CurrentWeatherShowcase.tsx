"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type WeatherApiCondition = {
  text?: string;
  icon?: string;
};

type WeatherApiCurrent = {
  temp_c?: number;
  feelslike_c?: number;
  humidity?: number;
  wind_kph?: number;
  wind_dir?: string;
  pressure_mb?: number;
  uv?: number;
  last_updated?: string;
  condition?: WeatherApiCondition;
  cloud?: number;
  vis_km?: number;
  gust_kph?: number;
};

type WeatherApiLocation = {
  name?: string;
  region?: string;
  country?: string;
  localtime?: string;
};

type WeatherApiForecastDay = {
  date?: string;
  day?: {
    maxtemp_c?: number;
    mintemp_c?: number;
    daily_chance_of_rain?: number;
    uv?: number;
    condition?: { text?: string; icon?: string };
  };
};

type WeatherApiResponse = {
  location?: WeatherApiLocation;
  current?: WeatherApiCurrent;
  forecast?: { forecastday?: WeatherApiForecastDay[] };
  error?: string;
};

const statCards = [
  { key: "humidity", label: "Humidity", unit: "%"},
  { key: "wind_kph", label: "Wind", unit: "km/h"},
  { key: "gust_kph", label: "Gust", unit: "km/h"},
  { key: "pressure_mb", label: "Pressure", unit: "hPa"},
  { key: "uv", label: "UV", unit: "" },
  { key: "cloud", label: "Cloud", unit: "%" },
  { key: "vis_km", label: "Visibility", unit: "km" }
] as const;

function formatNumber(value?: number) {
  if (value === undefined || value === null || Number.isNaN(value)) return "—";
  return Math.round(value).toString();
}

export default function CurrentWeatherShowcase() {
  const [query, setQuery] = useState("Pune");
  const [days, setDays] = useState(3);
  const [weather, setWeather] = useState<WeatherApiResponse | null>(null);
  const [forecast, setForecast] = useState<WeatherApiForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const safeDays = useMemo(() => Math.min(16, Math.max(1, Math.round(days) || 1)), [days]);

  const loadWeather = async (city: string) => {
    if (!city.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(`/api/weather?q=${encodeURIComponent(city.trim())}&aqi=yes`),
        fetch(`/api/weather/forecast?q=${encodeURIComponent(city.trim())}&days=${safeDays}`),
      ]);

      const [currentData, forecastData] = (await Promise.all([currentRes.json(), forecastRes.json()])) as WeatherApiResponse[];

      if (!currentRes.ok || currentData?.error) throw new Error(typeof currentData?.error === "string" ? currentData.error : "Current lookup failed");
      if (!forecastRes.ok || forecastData?.error) throw new Error(typeof forecastData?.error === "string" ? forecastData.error : "Forecast lookup failed");

      setWeather(currentData);
      setForecast(forecastData?.forecast?.forecastday ?? []);
    } catch (err) {
      console.error("Weather fetch failed", err);
      setError("Unable to load weather right now. Please try again.");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = weather?.current;
  const location = weather?.location;
  const conditionText = current?.condition?.text || "—";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Live Telemetry</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
            {location?.name ?? query}
            <span className="text-slate-500 font-semibold"> {location?.country ? `· ${location.country}` : ""}</span>
          </h2>
          <p className="mt-1 text-sm text-slate-400">{conditionText}</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city…"
              className="w-full sm:w-72 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-white/20"
            />
            <button
              onClick={() => loadWeather(query)}
              className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:opacity-95"
            >
              Search
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-slate-500">Days</span>
            <input
              type="number"
              min={1}
              max={16}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-20 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/20"
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/50 via-slate-900/30 to-slate-900/10 p-6 shadow-2xl backdrop-blur-xl">
        {loading ? (
          <div className="text-sm text-slate-400">Loading weather…</div>
        ) : error ? (
          <div className="text-sm text-red-200">{error}</div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex items-center gap-5">
              {current?.condition?.icon ? (
                <img src={current.condition.icon} alt="" className="h-16 w-16 object-contain drop-shadow" />
              ) : (
                <div className="h-16 w-16 rounded-2xl bg-white/5" />
              )}
              <div>
                <div className="text-6xl font-black tracking-tighter text-white">
                  {Math.round(current?.temp_c ?? 0)}°C
                </div>
                <div className="text-sm text-slate-400">
                  Feels like <span className="text-white font-semibold">{Math.round(current?.feelslike_c ?? 0)}°C</span>
                  {current?.last_updated ? <span className="text-slate-500"> · updated {current.last_updated}</span> : null}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {statCards.map((s) => (
                <div key={s.key} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-500">{s.label}</p>
                  <p className="mt-2 text-2xl font-black text-white">
                    {formatNumber(current?.[s.key as keyof WeatherApiCurrent] as number | undefined)}
                    <span className="ml-1 text-xs font-semibold text-slate-500">{s.unit}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {!!forecast.length && !loading && !error && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.45)]" />
            <h3 className="text-2xl font-black text-white tracking-tight">Forecast</h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {forecast.slice(0, safeDays).map((day, idx) => (
              <motion.div
                key={(day.date ?? "day") + idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * idx }}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg transition hover:bg-white/10"
              >
                <p className="text-xs font-black uppercase tracking-[0.35em] text-slate-500">
                  {day.date ? new Date(day.date).toLocaleDateString(undefined, { weekday: "short", day: "numeric" }) : "—"}
                </p>
                <p className="mt-4 text-4xl font-black tracking-tight text-white">
                  {Math.round(day.day?.maxtemp_c ?? 0)}°
                  <span className="ml-2 text-base font-bold text-slate-500">/ {Math.round(day.day?.mintemp_c ?? 0)}°</span>
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-400 truncate">{day.day?.condition?.text ?? "—"}</p>
                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-4 text-xs text-slate-400">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Rain</p>
                    <p className="mt-1 text-sm font-bold text-white">{Math.round(day.day?.daily_chance_of_rain ?? 0)}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">UV</p>
                    <p className="mt-1 text-sm font-bold text-white">{Math.round(day.day?.uv ?? 0)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

