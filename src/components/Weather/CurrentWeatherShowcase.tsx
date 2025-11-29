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
  air_quality?: Record<string, number>;
};

type WeatherApiLocation = {
  name?: string;
  region?: string;
  country?: string;
  localtime?: string;
};

type WeatherApiDayCondition = {
  text?: string;
  icon?: string;
};

type WeatherApiForecastDay = {
  date?: string;
  day?: {
    maxtemp_c?: number;
    mintemp_c?: number;
    avghumidity?: number;
    daily_chance_of_rain?: number;
    uv?: number;
    condition?: WeatherApiDayCondition;
  };
};

type WeatherApiResponse = {
  location?: WeatherApiLocation;
  current?: WeatherApiCurrent;
  forecast?: { forecastday?: WeatherApiForecastDay[] };
  error?: string;
};

const statOrder = [
  { key: "humidity", label: "Humidity", unit: "%", icon: "💧" },
  { key: "wind_kph", label: "Wind", unit: "km/h", icon: "🌬️" },
  { key: "pressure_mb", label: "Pressure", unit: "hPa", icon: "🎚️" },
  { key: "uv", label: "UV Index", unit: "/11", icon: "☀️" },
  { key: "cloud", label: "Cloud Cover", unit: "%", icon: "☁️" },
  { key: "vis_km", label: "Visibility", unit: "km", icon: "👁️" },
  { key: "gust_kph", label: "Wind Gust", unit: "km/h", icon: "🌀" },
];

function formatNumber(value?: number) {
  if (value === undefined || value === null || Number.isNaN(value)) return "—";
  return Math.round(value).toString();
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value.replace(" ", "T"));
  return date.toLocaleString(undefined, { hour: "2-digit", minute: "2-digit", weekday: "short" });
}

export default function CurrentWeatherShowcase() {
  const [query, setQuery] = useState("Pune");
  const [days, setDays] = useState(3);
  const [weather, setWeather] = useState<WeatherApiResponse | null>(null);
  const [forecast, setForecast] = useState<WeatherApiForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = async (city: string, requestedDays = days) => {
    if (!city.trim()) return;
    const safeDays = Math.min(10, Math.max(1, Math.round(requestedDays) || 1));
    setLoading(true);
    setError(null);
    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(`/api/weather?q=${encodeURIComponent(city.trim())}&aqi=yes`),
        fetch(`/api/weather/forecast?q=${encodeURIComponent(city.trim())}&days=${safeDays}`),
      ]);

      const [currentData, forecastData] = (await Promise.all([
        currentRes.json(),
        forecastRes.json(),
      ])) as WeatherApiResponse[];

      if (!currentRes.ok || currentData?.error) {
        throw new Error(typeof currentData?.error === "string" ? currentData.error : "Weather lookup failed");
      }
      if (!forecastRes.ok || forecastData?.error) {
        throw new Error(typeof forecastData?.error === "string" ? forecastData.error : "Forecast lookup failed");
      }

      setWeather(currentData);
      setForecast(forecastData?.forecast?.forecastday ?? []);
    } catch (err) {
      console.error("Weather fetch failed", err);
      setError("Unable to load weather right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const primaryStats = useMemo(() => {
    const current = weather?.current;
    if (!current) return [];
    const base = statOrder.map(stat => ({
      ...stat,
      value: formatNumber(current[stat.key as keyof WeatherApiCurrent] as number | undefined),
    }));
    const aqiIndex = current.air_quality?.["us-epa-index"];
    const pm25 = current.air_quality?.pm2_5;
    if (aqiIndex !== undefined) {
      base.unshift({
        key: "aqi",
        label: "US AQI (EPA)",
        unit: pm25 !== undefined ? `PM2.5 ${pm25.toFixed(1)} µg/m³` : "",
        icon: "🫧",
        value: formatNumber(aqiIndex),
      });
    }
    return base;
  }, [weather]);

  const locationLabel = useMemo(() => {
    const loc = weather?.location;
    if (!loc) return "—";
    return [loc.name, loc.region, loc.country].filter(Boolean).join(", ");
  }, [weather]);

  const condition = weather?.current?.condition?.text ?? "Loading...";
  const conditionIcon = weather?.current?.condition?.icon ? `https:${weather.current.condition.icon}` : null;
  // Friendly, readable sans stack for the chart labels
  const chartFont = "'Plus Jakarta Sans', 'SF Pro Text', 'Segoe UI', system-ui, -apple-system, sans-serif";
  const chartData = useMemo(() => {
    const points = (forecast ?? []).slice(0, 10).map(day => ({
      label: day.date ? new Date(day.date).toLocaleDateString(undefined, { weekday: "short" }) : "",
      max: day.day?.maxtemp_c ?? 0,
      min: day.day?.mintemp_c ?? 0,
      rain: day.day?.daily_chance_of_rain ?? 0,
    }));
    if (!points.length) return null;
    const maxTemp = Math.max(...points.map(p => p.max));
    const minTemp = Math.min(...points.map(p => p.min));
    const tempRange = Math.max(1, maxTemp - minTemp);
    const yFor = (temp: number) => 100 - ((temp - minTemp) / tempRange) * 70 - 15;
    const xStep = points.length > 1 ? 100 / (points.length - 1) : 0;
    const coords = points.map((p, i) => ({
      x: xStep * i,
      yMax: yFor(p.max),
      yMin: yFor(p.min),
    }));
    const line = (selector: (c: { x: number; yMax: number; yMin: number }) => number) =>
      points
        .map((_, i) => {
          const x = coords[i].x;
          const y = selector(coords[i]);
          return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
        })
        .join(" ");
    const area = `${coords
      .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(2)} ${c.yMax.toFixed(2)}`)
      .join(" ")} L ${coords[coords.length - 1].x.toFixed(2)} 110 L ${coords[0].x.toFixed(2)} 110 Z`;
    const ticks = Array.from({ length: 5 }).map((_, i) => {
      const value = minTemp + (tempRange / 4) * i;
      return { value: Math.round(value), y: yFor(value) };
    });
    return {
      points,
      coords,
      maxLine: line(c => c.yMax),
      minLine: line(c => c.yMin),
      bars: points.map((p, i) => ({ x: xStep * i, rain: p.rain })),
      area,
      ticks,
    };
  }, [forecast]);

  return (
    <div className="bg-gradient-to-br from-slate-900/70 via-slate-950 to-black rounded-3xl border border-white/10 p-6 md:p-8 shadow-2xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Current Weather</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">{locationLabel || "—"}</h2>
          <p className="text-slate-400 text-sm">Updated {formatDate(weather?.current?.last_updated)}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900/70 px-3 py-2">
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              onKeyDown={event => event.key === "Enter" && loadWeather(query, days)}
              placeholder="Search city..."
              className="w-40 md:w-56 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
            <span className="text-xs text-slate-500">City</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900/70 px-3 py-2">
            <input
              type="number"
              min={1}
              max={10}
              value={days}
              onChange={event => setDays(Number(event.target.value))}
              onKeyDown={event => event.key === "Enter" && loadWeather(query, days)}
              className="w-20 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
            <span className="text-xs text-slate-500">Days (1-10)</span>
          </div>
          <button
            onClick={() => loadWeather(query, days)}
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold shadow-lg shadow-purple-500/30 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-900/30 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr,1fr]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/60 p-6 shadow-lg"
        >
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <p className="text-sm text-slate-400">{condition}</p>
              <div className="flex items-end gap-3">
                <h3 className="text-5xl md:text-6xl font-extrabold text-white">
                  {weather?.current?.temp_c !== undefined ? Math.round(weather.current.temp_c) : "—"}°
                </h3>
                <div className="text-slate-400 text-sm space-y-1">
                  <div>Feels like {formatNumber(weather?.current?.feelslike_c)}°C</div>
                  <div>Wind {formatNumber(weather?.current?.wind_kph)} km/h {weather?.current?.wind_dir || ""}</div>
                  <div>Local time {weather?.location?.localtime || "—"}</div>
                </div>
              </div>
            </div>
            {conditionIcon && (
              <div className="relative">
                <div className="absolute inset-0 blur-3xl bg-purple-500/30 rounded-full" />
                <img src={conditionIcon} alt={condition} className="relative h-20 w-20" />
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl bg-gradient-to-br from-purple-600/20 via-pink-500/20 to-amber-400/20 border border-white/10 p-4 shadow-lg"
        >
          <h4 className="text-lg font-semibold text-white">Quick Facts</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li>Condition: {condition}</li>
            <li>Region: {weather?.location?.region || "—"}</li>
            <li>Country: {weather?.location?.country || "—"}</li>
          </ul>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {primaryStats.map(stat => (
          <div
            key={stat.key}
            className="rounded-xl bg-slate-900/60 border border-slate-700/60 p-4 shadow-lg backdrop-blur transition hover:border-purple-400/50 hover:shadow-purple-500/20"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="text-xl font-semibold text-white">
              {stat.value} <span className="text-sm text-slate-400">{stat.unit}</span>
            </p>
          </div>
        ))}
      </motion.div>

      {chartData && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.11 }}
          className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/70 to-slate-950 p-6 shadow-2xl"
        >
          <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Trend</p>
              <h3 className="text-xl font-bold text-white">10-Day Temperature & Rain Chance</h3>
            </div>
            <div className="flex gap-4 text-sm text-slate-200">
              <div className="flex items-center gap-2">
                <span className="inline-block h-1 w-5 rounded-full bg-pink-400" />
                High
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-1 w-5 rounded-full bg-cyan-400" />
                Low
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-amber-300" />
                Rain %
              </div>
            </div>
          </div>
          <div
            className="relative rounded-2xl border border-white/5 bg-slate-900/60 p-4 overflow-hidden"
            style={{ aspectRatio: "16 / 7", minHeight: 260 }}
          >
            <svg viewBox="0 0 100 115" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
              <defs>
                <linearGradient id="rainFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="tempFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {chartData.ticks.map(tick => (
                <g key={tick.value}>
                  <line x1="0" x2="100" y1={tick.y} y2={tick.y} stroke="rgba(255,255,255,0.07)" strokeWidth="0.4" />
                  <text
                    x="2"
                    y={tick.y - 1.5}
                    fontSize="3.2"
                    fill="#94a3b8"
                    style={{ fontFamily: chartFont, fontWeight: 500, letterSpacing: 0.2 }}
                  >
                    {tick.value}°
                  </text>
                </g>
              ))}

              {/* Rain bars */}
              {chartData.bars.map(bar => (
                <rect
                  key={bar.x}
                  x={bar.x - 2}
                  y={105 - (bar.rain / 100) * 35}
                  width={4}
                  height={(bar.rain / 100) * 35}
                  rx={1}
                  fill="url(#rainFill)"
                  opacity={0.85}
                />
              ))}

              {/* High temp area + lines */}
              <path d={chartData.area} fill="url(#tempFill)" stroke="none" />
              <path d={chartData.maxLine} fill="none" stroke="#ec4899" strokeWidth="1.8" strokeLinecap="round" />
              <path d={chartData.minLine} fill="none" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" />

              {/* Points + labels */}
              {chartData.points.map((p, i) => {
                const { x, yMax, yMin } = chartData.coords[i];
                return (
                  <g key={p.label + i}>
                    <circle cx={x} cy={yMax} r={1.4} fill="#ec4899" />
                    <circle cx={x} cy={yMin} r={1.4} fill="#22d3ee" />
                    <text
                      x={x}
                      y={110}
                      textAnchor="middle"
                      fontSize="3.4"
                      fill="#cbd5e1"
                      style={{ fontFamily: chartFont, fontWeight: 600, letterSpacing: 0.3 }}
                    >
                      {p.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="mt-8"
      >
        <h3 className="text-xl font-bold text-white mb-4">Days Outlook</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {forecast.map(day => (
            <div
              key={day.date}
              className="rounded-2xl bg-slate-900/60 border border-slate-700/60 p-4 shadow-lg backdrop-blur hover:border-purple-400/50 hover:shadow-purple-500/20 transition"
            >
              <p className="text-sm text-slate-400">{new Date(day.date || "").toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</p>
              <div className="flex items-center gap-3 mt-3">
                {day.day?.condition?.icon && (
                  <img
                    src={`https:${day.day.condition.icon}`}
                    alt={day.day.condition.text || "weather icon"}
                    className="h-10 w-10"
                  />
                )}
                <div>
                  <p className="text-white text-lg font-semibold">{Math.round(day.day?.maxtemp_c ?? 0)}° / {Math.round(day.day?.mintemp_c ?? 0)}°</p>
                  <p className="text-slate-400 text-sm">{day.day?.condition?.text || "—"}</p>
                </div>
              </div>
              <div className="mt-2 text-xs text-slate-400 space-y-1">
                <p>Humidity {Math.round(day.day?.avghumidity ?? 0)}%</p>
                <p>Chance of rain {Math.round(day.day?.daily_chance_of_rain ?? 0)}%</p>
                <p>UV {Math.round(day.day?.uv ?? 0)}</p>
              </div>
            </div>
          ))}
          {forecast.length === 0 && (
            <div className="col-span-full text-slate-400 text-sm">Forecast unavailable for this location.</div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
