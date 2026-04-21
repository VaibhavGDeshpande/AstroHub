'use client';

import { type Dispatch, type ReactNode, type SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { CloudRain, MapPin, Moon, Search, Sun } from 'lucide-react';
const LocationPickerMap = dynamic(() => import('./LocationPickerMap'), { ssr: false });

type NumericValue = { value?: number };
type TemperatureValue = { degrees?: number; value?: number };
type ProbabilityValue = { percent?: number };
type PrecipAmount = { quantity?: number; unit?: string };
type WeatherDescription = { text?: string };

type WeatherCondition = {
  description?: WeatherDescription;
  cloudCover?: number;
};

type WindData = {
  direction?: { degrees?: number; cardinal?: string };
  speed?: NumericValue;
  gust?: NumericValue;
};

type PrecipitationData = {
  probability?: ProbabilityValue;
  qpf?: PrecipAmount;
  snowQpf?: PrecipAmount;
};

interface CurrentConditions {
  temperature?: TemperatureValue;
  feelsLikeTemperature?: TemperatureValue;
  dewPoint?: TemperatureValue;
  windChill?: TemperatureValue;
  heatIndex?: TemperatureValue;
  weatherCondition?: WeatherCondition;
  precipitation?: PrecipitationData;
  precipitationProbability?: number;
  thunderstormProbability?: number;
  relativeHumidity?: number;
  visibility?: { distance?: number; value?: number };
  cloudCover?: number;
  uvIndex?: number;
  airPressure?: { meanSeaLevelMillibars?: number };
  seaLevelPressure?: NumericValue;
  wind?: WindData;
  windSpeed?: NumericValue;
  windGust?: NumericValue;
  currentConditionsHistory?: { temperatureChange?: TemperatureValue };
}

interface ForecastInterval {
  interval?: { startTime?: string };
  weatherCondition?: WeatherCondition;
  precipitation?: PrecipitationData;
  relativeHumidity?: number;
  cloudCover?: number;
  uvIndex?: number;
}

interface ForecastDay {
  interval?: { startTime?: string };
  maxTemperature?: TemperatureValue;
  minTemperature?: TemperatureValue;
  temperature?: { high?: NumericValue; low?: NumericValue };
  feelsLikeMaxTemperature?: TemperatureValue;
  feelsLikeMinTemperature?: TemperatureValue;
  precipitation?: PrecipitationData;
  daytimeForecast?: ForecastInterval;
  nighttimeForecast?: ForecastInterval;
  sunEvents?: { sunriseTime?: string; sunsetTime?: string };
  moonEvents?: { moonPhase?: string; moonsetTimes?: string[] };
}

interface ForecastHour {
  interval?: { startTime?: string };
  temperature?: TemperatureValue;
  feelsLikeTemperature?: TemperatureValue;
  precipitation?: { probability?: ProbabilityValue };
  precipitationProbability?: number;
  uvIndex?: number;
  weatherCondition?: WeatherCondition;
  wind?: WindData;
  windSpeed?: NumericValue;
  windGust?: NumericValue;
  isDaytime?: boolean;
  cloudCover?: number;
}

interface WeatherData {
  current: CurrentConditions | null;
  daily: ForecastDay[];
  hourly: ForecastHour[];
  loading: boolean;
  error: string | null;
}

interface Coordinates {
  lat: number;
  lon: number;
}

interface SearchResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

const cardShell = 'rounded-3xl bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/20 border border-white/5 shadow-2xl backdrop-blur-xl';
const DAY_CARDS_PER_PAGE = 5;
const HOURS_PER_PAGE = 8;

export default function AstroWeatherDashboard({ lat = 18.516726, lon = 73.856255 }: Coordinates) {
  const [coordinates, setCoordinates] = useState<Coordinates>({ lat, lon });
  const [locationLabel, setLocationLabel] = useState('Pune, India');
  const [locationQuery, setLocationQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [dailyPage, setDailyPage] = useState(0);
  const [hourPage, setHourPage] = useState(0);
  const [activeTab, setActiveTab] = useState<'current' | 'daily' | 'hourly'>('current');

  const [weather, setWeather] = useState<WeatherData>({
    current: null,
    daily: [],
    hourly: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    let isMounted = true;

    const fetchWeather = async () => {
      setWeather(prev => ({ ...prev, loading: true, error: null }));

      try {
        const [currentRes, dailyRes, hourlyRes] = await Promise.all([
          fetch(`/api/weather/current?lat=${coordinates.lat}&lon=${coordinates.lon}`),
          fetch(`/api/weather/forecast-days?lat=${coordinates.lat}&lon=${coordinates.lon}`),
          fetch(`/api/weather/forecast-hours?lat=${coordinates.lat}&lon=${coordinates.lon}&hours=48`)
        ]);

        if (!currentRes.ok || !dailyRes.ok || !hourlyRes.ok) {
          throw new Error('One or more weather endpoints failed');
        }

        const [current, daily, hourly] = await Promise.all([
          currentRes.json(),
          dailyRes.json(),
          hourlyRes.json()
        ]);

        if (!isMounted) return;

        const normalizedCurrent = current?.currentConditions || current;
        const normalizedDaily = daily?.forecastDays || daily?.dailyForecasts || [];
        const normalizedHourly = hourly?.forecastHours || hourly?.hourlyForecasts || [];

        setWeather({
          current: normalizedCurrent,
          daily: normalizedDaily,
          hourly: normalizedHourly,
          loading: false,
          error: null
        });
        setSelectedDayIndex(0);
        setDailyPage(0);
        setHourPage(0);
      } catch (error) {
        console.error('Weather fetch error:', error);
        if (!isMounted) return;
        setWeather(prev => ({ ...prev, loading: false, error: 'Unable to load weather for this location.' }));
      }
    };

    fetchWeather();
    return () => {
      isMounted = false;
    };
  }, [coordinates.lat, coordinates.lon]);

  const handleLocationSearch = useCallback(async () => {
    if (!locationQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}&addressdetails=1&limit=5`,
        { headers: { Accept: 'application/json' } }
      );

      if (!response.ok) throw new Error('Location lookup failed');
      const results = (await response.json()) as SearchResult[] | undefined;
      setSearchResults(results ?? []);
    } catch (error) {
      console.error('Location search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [locationQuery]);

  const handleResultSelection = (result: SearchResult) => {
    const latValue = parseFloat(result.lat);
    const lonValue = parseFloat(result.lon);
    if (!Number.isFinite(latValue) || !Number.isFinite(lonValue)) return;

    setCoordinates({ lat: latValue, lon: lonValue });
    setLocationLabel(result.display_name || `Lat ${latValue.toFixed(2)}, Lon ${lonValue.toFixed(2)}`);
    setSearchResults([]);
    setLocationQuery('');
  };

  const handleUseMyLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      alert('Geolocation is not supported in this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lon: longitude });
        setLocationLabel('Your current location');
      },
      error => {
        console.error('Geolocation error:', error);
        alert('Unable to fetch your location. Please allow access or search manually.');
      }
    );
  };

  const activeLocationLabel = locationLabel || `Lat ${coordinates.lat.toFixed(2)}, Lon ${coordinates.lon.toFixed(2)}`;
  const { current } = weather;
  const dailyForecast = weather.daily.slice(0, 16);
  const dailyToday = dailyForecast?.[0];
  const selectedDay = dailyForecast[selectedDayIndex] ?? dailyForecast[0];
  const totalDailyPages = Math.max(1, Math.ceil((dailyForecast.length || 0) / DAY_CARDS_PER_PAGE));
  const visibleDayOffset = dailyPage * DAY_CARDS_PER_PAGE;
  const visibleDays = dailyForecast.slice(visibleDayOffset, visibleDayOffset + DAY_CARDS_PER_PAGE);
  useEffect(() => {
    if (dailyForecast.length === 0) {
      if (selectedDayIndex !== 0) setSelectedDayIndex(0);
      if (dailyPage !== 0) setDailyPage(0);
      return;
    }
    setSelectedDayIndex(prev => {
      const next = Math.min(prev, dailyForecast.length - 1);
      return next === prev ? prev : next;
    });
    const maxPage = Math.max(Math.ceil(dailyForecast.length / DAY_CARDS_PER_PAGE) - 1, 0);
    setDailyPage(prev => {
      const next = Math.min(prev, maxPage);
      return next === prev ? prev : next;
    });
  }, [dailyForecast.length, dailyPage, selectedDayIndex]);

  const hourlyWindow = weather.hourly.slice(0, 32);
  useEffect(() => {
    if (hourlyWindow.length === 0) {
      if (hourPage !== 0) setHourPage(0);
      return;
    }
    const maxHourPage = Math.max(Math.ceil(hourlyWindow.length / HOURS_PER_PAGE) - 1, 0);
    setHourPage(prev => {
      const next = Math.min(prev, maxHourPage);
      return next === prev ? prev : next;
    });
  }, [hourlyWindow.length, hourPage]);

  const cloudCoverValue = current?.cloudCover ?? current?.weatherCondition?.cloudCover ?? 0;
  const visibilityDistance = current?.visibility?.distance ?? current?.visibility?.value ?? 0;

  const statCards = useMemo(() => {
    return [
      {
        title: 'Wind Chill',
        value: formatNumber(current?.windChill?.degrees ?? current?.windChill?.value),
        unit: '°C',
        description: 'Cold relative to wind'
      },
      {
        title: 'Heat Index',
        value: formatNumber(current?.heatIndex?.degrees ?? current?.heatIndex?.value),
        unit: '°C',
        description: 'Heat relative to humidity'
      },
      {
        title: 'Visibility',
        value: formatNumber(visibilityDistance),
        unit: 'km',
        description: 'Clear sky distance'
      },
      {
        title: 'Cloud Cover',
        value: Math.round(cloudCoverValue),
        unit: '%',
        description: 'Sky obscuration'
      },
      {
        title: 'Wind',
        value: formatNumber(current?.wind?.speed?.value ?? current?.windSpeed?.value),
        unit: 'km/h',
        description: `${formatNumber(current?.wind?.gust?.value ?? current?.windGust?.value)} km/h gust`
      },
      {
        title: 'Relative Humidity',
        value: Math.round(current?.relativeHumidity ?? 0),
        unit: '%',
        description: `Dew point ${formatNumber(current?.dewPoint?.degrees ?? current?.dewPoint?.value)}°`
      },
      {
        title: 'UV Index',
        value: current?.uvIndex ?? 0,
        unit: '/11',
        description: 'Solar radiation intensity'
      },
      {
        title: 'Air Pressure',
        value: Math.round(current?.airPressure?.meanSeaLevelMillibars ?? current?.seaLevelPressure?.value ?? 0),
        unit: 'hPa',
        description: 'Mean sea level'
      }
    ];
  }, [cloudCoverValue, current, visibilityDistance]);

  return (
    <div className="space-y-8 rounded-3xl border border-white/5 bg-[#050715] p-6 text-white shadow-2xl">
      {/* Location Controls */}
      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <div className={`${cardShell} p-4`}>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Search Location</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={locationQuery}
                onChange={event => setLocationQuery(event.target.value)}
                onKeyDown={event => event.key === 'Enter' && handleLocationSearch()}
                placeholder="Type a city or observatory"
                className="w-full bg-transparent py-2 text-sm text-white placeholder:text-slate-500 outline-none"
              />
            </div>
            <button
              onClick={handleLocationSearch}
              disabled={isSearching}
              className="rounded-2xl border border-white/10 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 backdrop-blur transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSearching ? 'Searchingâ€¦' : 'Search'}
            </button>
            <button
              onClick={handleUseMyLocation}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 backdrop-blur transition hover:bg-white/10"
            >
              Use My Location
            </button>
          </div>
          {searchResults.length > 0 && (
            <div className="mt-3 max-h-80 overflow-y-auto rounded-2xl border border-white/10 bg-black/50">
              {searchResults.map(result => (
                <button
                  key={result.place_id}
                  onClick={() => handleResultSelection(result)}
                  className="w-full border-b border-white/5 px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-white/5 last:border-b-0"
                >
                  <div>{result.display_name}</div>
                  <div className="text-xs text-slate-500">
                    {parseFloat(result.lat).toFixed(2)}, {parseFloat(result.lon).toFixed(2)}
                  </div>
                </button>
              ))}
            </div>
          )}
          <p className="mt-3 text-xs uppercase tracking-[0.3em] text-slate-500">
            Viewing: <span className="text-white">{activeLocationLabel}</span>
          </p>
        </div>
      </div>

      {weather.error && (
        <div className="rounded-2xl border border-red-900/40 bg-red-950/30 p-4 text-sm text-red-200">{weather.error}</div>
      )}

      {weather.loading && (
        <div className="text-center text-sm text-slate-400">Fetching the latest data</div>
      )}

      {!weather.loading && current && (
        <>
          <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
            {(['current', 'daily', 'hourly'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-5 py-2 text-sm font-semibold transition ${
                  activeTab === tab
                    ? 'border border-white/30 bg-white/10 text-white'
                    : 'border border-transparent text-slate-400 hover:border-white/10 hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === 'current' && (
            <div className="space-y-8">
              <div className="grid gap-6 xl:grid-cols-2">
                <div className={`${cardShell} p-6`}>
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Current Weather</p>
                      <div className="mt-4 text-6xl font-semibold text-white">
                        {Math.round(current?.temperature?.degrees ?? current?.temperature?.value ?? 0)}°C
                      </div>
                      <div className="text-xl text-slate-200">{current?.weatherCondition?.description?.text || 'Clear skies'}</div>
                      <div className="text-sm text-slate-400">
                        Feels like {Math.round(current?.feelsLikeTemperature?.degrees ?? current?.feelsLikeTemperature?.value ?? 0)}°C
                      </div>
                    </div>
                    <div className="grid gap-3 text-sm text-slate-300">
                      <p>High: {Math.round(dailyToday?.maxTemperature?.degrees ?? dailyToday?.temperature?.high?.value ?? 0)}°</p>
                      <p>Low: {Math.round(dailyToday?.minTemperature?.degrees ?? dailyToday?.temperature?.low?.value ?? 0)}°</p>
                      <p>QPF: {formatNumber(current?.precipitation?.qpf?.quantity ?? dailyToday?.precipitation?.qpf?.quantity)} mm</p>
                      <p>Pressure: {formatNumber(current?.airPressure?.meanSeaLevelMillibars ?? current?.seaLevelPressure?.value)} hPa</p>
                    </div>
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <SummaryStat
                      icon={<CloudRain className="h-4 w-4 text-blue-300" />}
                      label="Rain Probability"
                      value={`${current?.precipitation?.probability?.percent ?? dailyToday?.precipitation?.probability?.percent ?? 0}%`}
                    />
                    <SummaryStat
                      icon={<Sun className="h-4 w-4 text-amber-300" />}
                      label="UV Index"
                      value={`${current?.uvIndex ?? dailyToday?.daytimeForecast?.uvIndex ?? 0}`}
                    />
                  </div>
                </div>
                <div className={`${cardShell} relative overflow-hidden p-0`}>
                  <div className="absolute left-4 top-4 z-10 rounded-2xl border border-white/10 bg-black/60 px-4 py-3 shadow-xl">
                    <p className="flex items-center gap-1 text-xs text-slate-300">
                      <MapPin className="h-3 w-3 text-red-300" /> {activeLocationLabel}
                    </p>
                    <p className="text-lg font-semibold text-white">
                      {Math.round(current?.temperature?.degrees ?? current?.temperature?.value ?? 0)}°C ·{' '}
                      {current?.weatherCondition?.description?.text || 'Clear'}
                    </p>
                  </div>
                  <div className="h-80 w-full">
                    <LocationPickerMap
                      coordinates={coordinates}
                      onSelect={coords => {
                        setCoordinates(coords);
                        setLocationLabel(`Lat ${coords.lat.toFixed(2)}, Lon ${coords.lon.toFixed(2)}`);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {statCards.map(card => (
                  <MetricCard key={card.title} title={card.title} value={card.value} unit={card.unit} description={card.description} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'daily' && (
            <div className={`${cardShell} p-6`}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Daily Forecast (16 Days)</p>
                <span className="text-xs text-slate-500">Tap a day to view daytime vs nighttime details.</span>
              </div>
              <div className="mt-5">
                <DailyForecastGraph days={dailyForecast} />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <button
                  className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 disabled:opacity-40"
                  onClick={() => setDailyPage(prev => Math.max(prev - 1, 0))}
                  disabled={dailyPage === 0}
                  aria-label="Previous days"
                >
                  ‹
                </button>
                <div className="flex-1 px-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
                    {visibleDays.map((day, idx) => (
                      <DailyPill
                        key={day?.interval?.startTime || idx}
                        day={day}
                        isSelected={visibleDayOffset + idx === selectedDayIndex}
                        isToday={visibleDayOffset + idx === 0}
                        onSelect={() => setSelectedDayIndex(visibleDayOffset + idx)}
                      />
                    ))}
                    {visibleDays.length < DAY_CARDS_PER_PAGE &&
                      Array.from({ length: DAY_CARDS_PER_PAGE - visibleDays.length }).map((_, fillerIdx) => (
                        <div key={`empty-${fillerIdx}`} className="rounded-2xl border border-dashed border-white/5 p-4 opacity-50" />
                      ))}
                  </div>
                </div>
                <button
                  className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 disabled:opacity-40"
                  onClick={() => setDailyPage(prev => Math.min(prev + 1, totalDailyPages - 1))}
                  disabled={dailyPage >= totalDailyPages - 1}
                  aria-label="Next days"
                >
                  ›
                </button>
              </div>
              {selectedDay && (
                <>
                  <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    <DayNightDetailCard title="Daytime Forecast" icon={<Sun className="h-5 w-5 text-amber-300" />} forecast={selectedDay.daytimeForecast} />
                    <DayNightDetailCard title="Nighttime Forecast" icon={<Moon className="h-5 w-5 text-indigo-200" />} forecast={selectedDay.nighttimeForecast} />
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 text-sm">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Temperature Range</p>
                      <div className="mt-3 grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-xs text-slate-400">Max</p>
                          <p className="text-2xl font-semibold text-white">
                            {Math.round(selectedDay?.maxTemperature?.degrees ?? selectedDay?.temperature?.high?.value ?? 0)}°
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Min</p>
                          <p className="text-2xl font-semibold text-white">
                            {Math.round(selectedDay?.minTemperature?.degrees ?? selectedDay?.temperature?.low?.value ?? 0)}°
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4 text-center text-xs text-slate-400">
                        <div>
                          <p className="text-lg font-semibold text-white">
                            {Math.round(selectedDay?.feelsLikeMaxTemperature?.degrees ?? selectedDay?.feelsLikeMaxTemperature?.value ?? 0)}°
                          </p>
                          <p>Feels Max</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-white">
                            {Math.round(selectedDay?.feelsLikeMinTemperature?.degrees ?? selectedDay?.feelsLikeMinTemperature?.value ?? 0)}°
                          </p>
                          <p>Feels Min</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Solar & Lunar</p>
                      <div className="mt-3 space-y-2 text-sm">
                        <div className="flex items-center justify-between text-slate-300">
                          <span>Sunrise</span>
                          <span className="text-white">{formatTimeLabel(selectedDay?.sunEvents?.sunriseTime)}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span>Sunset</span>
                          <span className="text-white">{formatTimeLabel(selectedDay?.sunEvents?.sunsetTime)}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span>Moon Phase</span>
                          <span className="text-white">{selectedDay?.moonEvents?.moonPhase || '--'}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span>Moonset</span>
                          <span className="text-white">{formatTimeLabel(selectedDay?.moonEvents?.moonsetTimes?.[0])}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'hourly' && <HourlyForecastPanel hourly={hourlyWindow} hourPage={hourPage} setHourPage={setHourPage} />}
        </>
      )}
      {!weather.loading && !current && (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-center text-sm text-slate-400">
          Weather data currently unavailable. Try another nearby location.
        </div>
      )}
    </div>
  );
}

function formatNumber(value?: number) {
  if (!Number.isFinite(value ?? NaN)) return '--';
  return Math.round((value as number) * 10) / 10;
}

function SummaryStat({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white/5">{icon}</span>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
        <p className="text-base font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  unit,
  description
}: {
  title: string;
  value: ReactNode;
  unit: ReactNode;
  description?: string;
}) {
  return (
    <div className={`${cardShell} p-5`}>
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{title}</p>
      <div className="mt-3 flex items-baseline gap-1 text-3xl font-semibold text-white">
        <span>{value}</span>
        {unit && <span className="text-base text-slate-400">{unit}</span>}
      </div>
      {description && <p className="mt-1 text-xs text-slate-400">{description}</p>}
    </div>
  );
}


function DailyPill({ day, isSelected, isToday, onSelect }: { day: ForecastDay; isSelected: boolean; isToday: boolean; onSelect: () => void }) {
  const { weekday, monthDay } = getDayDisplay(day);
  const high = Math.round(day?.maxTemperature?.degrees ?? day?.temperature?.high?.value ?? 0);

  return (
    <button
      onClick={onSelect}
      className={`rounded-2xl border px-4 py-3 text-left transition ${
        isSelected ? 'border-blue-400/60 bg-blue-500/20 shadow-inner' : 'border-white/10 bg-white/5 hover:border-white/30'
      }`}
    >
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{isToday ? 'Today' : weekday}</p>
      <p className="text-xs text-slate-500">{monthDay}</p>
      <div className="mt-2 flex items-center gap-2">
        <Sun className="h-5 w-5 text-amber-300" />
        <span className="text-2xl font-semibold text-white">{high}°</span>
      </div>
    </button>
  );
}

function DayNightDetailCard({ title, icon, forecast }: { title: string; icon: ReactNode; forecast?: ForecastInterval }) {
  const precipitation = forecast?.precipitation?.probability?.percent ?? 0;
  const qpf = formatNumber(forecast?.precipitation?.qpf?.quantity ?? 0);
  const humidity = forecast?.relativeHumidity ?? '--';
  const cloudCover = forecast?.cloudCover ?? '--';
  const uv = forecast?.uvIndex ?? '--';

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{title}</p>
      <div className="mt-3 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">{icon}</span>
        <div>
          <p className="text-lg font-semibold text-white">{forecast?.weatherCondition?.description?.text || 'No data available'}</p>
          <p className="text-xs text-slate-400">{title === 'Daytime Forecast' ? 'Sunlit conditions' : 'After dusk'}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-5 gap-2 text-center text-xs text-slate-300">
        <div>
          <p className="text-lg font-semibold text-white">{precipitation}%</p>
          <p>Rain</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-white">{qpf} mm</p>
          <p>QPF</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-white">{humidity}%</p>
          <p>Humidity</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-white">{cloudCover}%</p>
          <p>Clouds</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-white">{uv}</p>
          <p>UV</p>
        </div>
      </div>
    </div>
  );
}

function HourlyForecastPanel({
  hourly,
  hourPage,
  setHourPage
}: {
  hourly: ForecastHour[];
  hourPage: number;
  setHourPage: Dispatch<SetStateAction<number>>;
}) {
  const trimmedHours = hourly.slice(0, 32);
  const totalHourPages = Math.max(1, Math.ceil(trimmedHours.length / HOURS_PER_PAGE));
  const currentPage = Math.min(hourPage, totalHourPages - 1);
  const start = currentPage * HOURS_PER_PAGE;
  const visibleHours = trimmedHours.slice(start, start + HOURS_PER_PAGE);
  const panelDate = visibleHours[0]?.interval?.startTime
    ? new Date(visibleHours[0].interval.startTime).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  return (
    <div className={`${cardShell} p-6`}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Hourly Forecast ({trimmedHours.length}h max)</p>
          <p className="text-sm text-slate-500">{panelDate}</p>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 disabled:opacity-40"
            onClick={() => setHourPage((prev: number) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
            aria-label="Previous hours"
          >
            ‹
          </button>
          <button
            className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 disabled:opacity-40"
            onClick={() => setHourPage((prev: number) => Math.min(prev + 1, totalHourPages - 1))}
            disabled={currentPage >= totalHourPages - 1}
            aria-label="Next hours"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-5">
        <HourlyForecastGraph hours={trimmedHours} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {visibleHours.map((hour, idx) => (
          <HourSummaryCard key={hour?.interval?.startTime || idx} hour={hour} />
        ))}
      </div>
    </div>
  );
}

function HourSummaryCard({ hour }: { hour: ForecastHour }) {
  const label = formatHourLabel(hour);
  const temperature = Math.round(hour?.temperature?.degrees ?? hour?.temperature?.value ?? 0);
  const wind = formatNumber(hour?.wind?.speed?.value ?? hour?.windSpeed?.value ?? 0);
  const gust = formatNumber(hour?.wind?.gust?.value ?? hour?.windGust?.value ?? 0);
  const icon = hour?.isDaytime ? <Sun className="h-5 w-5 text-amber-300" /> : <Moon className="h-5 w-5 text-indigo-200" />;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-white">{label}</p>
        {icon}
      </div>
      <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-500">{hour?.weatherCondition?.description?.text || '—'}</p>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <span className="text-lg font-semibold text-white">{temperature}°C</span>
        <span>{wind} km/h · gust {gust} km/h</span>
      </div>
    </div>
  );
}

function getDayDisplay(day: ForecastDay | undefined) {
  if (!day?.interval?.startTime) {
    return { weekday: '--', monthDay: '--' };
  }
  const date = new Date(day.interval.startTime);
  if (Number.isNaN(date.getTime())) return { weekday: '--', monthDay: '--' };
  return {
    weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
    monthDay: date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })
  };
}

function formatTimeLabel(value?: string) {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatHourLabel(hour?: ForecastHour) {
  if (!hour?.interval?.startTime) return '--';
  const date = new Date(hour.interval.startTime);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleTimeString([], { hour: '2-digit' });
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function buildLinePath(values: number[], width = 360, height = 96, padding = 10) {
  const filtered = values.filter((v) => Number.isFinite(v));
  const minValue = filtered.length ? Math.min(...filtered) : 0;
  const maxValue = filtered.length ? Math.max(...filtered) : 1;
  const span = Math.max(1e-6, maxValue - minValue);

  const n = Math.max(1, values.length);
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  const points = values.map((v, i) => {
    const t = n === 1 ? 0 : i / (n - 1);
    const x = padding + innerW * t;
    const normalized = Number.isFinite(v) ? (v - minValue) / span : NaN;
    const y = Number.isFinite(normalized) ? padding + innerH * (1 - clamp(normalized, 0, 1)) : NaN;
    return { x, y, valid: Number.isFinite(v) && Number.isFinite(y) };
  });

  const segments: string[] = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (!p.valid) continue;
    const cmd = i === 0 || !points[i - 1]?.valid ? 'M' : 'L';
    segments.push(`${cmd} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`);
  }

  const d = segments.join(' ');
  const latest = values.findLast?.((v) => Number.isFinite(v)) ?? filtered[filtered.length - 1] ?? null;

  return { d, minValue, maxValue, latest, points, padding, width, height };
}

function GraphCard({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.03] p-4">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{title}</p>
        {subtitle ? <p className="text-xs text-slate-500">{subtitle}</p> : null}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function DailyForecastGraph({ days }: { days: ForecastDay[] }) {
  const series = days.slice(0, 16);
  const labels = series.map((d) => getDayDisplay(d).weekday);
  const maxTemps = series.map((d) => Number(d?.maxTemperature?.degrees ?? d?.temperature?.high?.value ?? NaN));
  const minTemps = series.map((d) => Number(d?.minTemperature?.degrees ?? d?.temperature?.low?.value ?? NaN));

  const maxPath = buildLinePath(maxTemps, 360, 96, 10);
  const minPath = buildLinePath(minTemps, 360, 96, 10);

  return (
    <GraphCard
      title="Temperature Trend"
      subtitle={
        maxPath.latest !== null && minPath.latest !== null
          ? `Latest: ${Math.round(maxPath.latest as number)}° / ${Math.round(minPath.latest as number)}°`
          : undefined
      }
    >
      <div className="w-full overflow-hidden">
        <svg viewBox="0 0 360 120" className="h-36 w-full">
          <defs>
            <linearGradient id="tempMax" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f472b6" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="tempMin" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* grid */}
          {Array.from({ length: 4 }).map((_, i) => {
            const y = 10 + ((96 - 20) * i) / 3;
            return <line key={i} x1="10" x2="350" y1={y} y2={y} stroke="rgba(148,163,184,0.18)" strokeWidth="1" />;
          })}
          {/* y-axis labels */}
          <text x="12" y="14" fontSize="9" fill="rgba(148,163,184,0.8)">
            {Math.round(maxPath.maxValue)}°
          </text>
          <text x="12" y="92" fontSize="9" fill="rgba(148,163,184,0.8)">
            {Math.round(minPath.minValue)}°
          </text>

          <path d={maxPath.d} fill="none" stroke="url(#tempMax)" strokeWidth="2.5" strokeLinecap="round" />
          <path d={minPath.d} fill="none" stroke="url(#tempMin)" strokeWidth="2.5" strokeLinecap="round" />

          {/* x-axis */}
          <line x1="10" x2="350" y1="96" y2="96" stroke="rgba(148,163,184,0.25)" strokeWidth="1" />
          {labels.map((l, i) => {
            if (i % 2 !== 0) return null;
            const x = maxPath.points[i]?.x ?? 10;
            return (
              <text key={l + i} x={x} y="114" textAnchor="middle" fontSize="9" fill="rgba(148,163,184,0.75)">
                {l}
              </text>
            );
          })}
        </svg>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-6 rounded-full bg-pink-500/80" />
            Max
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-6 rounded-full bg-cyan-400/80" />
            Min
          </span>
        </div>
      </div>
    </GraphCard>
  );
}

function HourlyForecastGraph({ hours }: { hours: ForecastHour[] }) {
  const series = hours.slice(0, 48);
  const temps = series.map((h) => Number(h?.temperature?.degrees ?? h?.temperature?.value ?? NaN));
  const labels = series.map((h) => formatHourLabel(h));
  const path = buildLinePath(temps, 360, 96, 10);

  return (
    <GraphCard
      title="Temperature (48h)"
      subtitle={path.latest !== null ? `Now: ${Math.round(path.latest as number)}°C` : undefined}
    >
      <div className="w-full overflow-hidden">
        <svg viewBox="0 0 360 120" className="h-36 w-full">
          <defs>
            <linearGradient id="tempHourly" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          {Array.from({ length: 4 }).map((_, i) => {
            const y = 10 + ((96 - 20) * i) / 3;
            return <line key={i} x1="10" x2="350" y1={y} y2={y} stroke="rgba(148,163,184,0.18)" strokeWidth="1" />;
          })}
          <text x="12" y="14" fontSize="9" fill="rgba(148,163,184,0.8)">
            {Math.round(path.maxValue)}°
          </text>
          <text x="12" y="92" fontSize="9" fill="rgba(148,163,184,0.8)">
            {Math.round(path.minValue)}°
          </text>
          <path d={path.d} fill="none" stroke="url(#tempHourly)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="10" x2="350" y1="96" y2="96" stroke="rgba(148,163,184,0.25)" strokeWidth="1" />

          {/* 1-hour x-axis ticks (labels every 3 hours to keep it readable) */}
          {labels.map((l, i) => {
            if (!l) return null;
            const x = path.points[i]?.x ?? 10;
            const isMajor = i % 3 === 0;
            return (
              <g key={l + i}>
                <line
                  x1={x}
                  x2={x}
                  y1={96}
                  y2={isMajor ? 102 : 100}
                  stroke="rgba(148,163,184,0.32)"
                  strokeWidth="1"
                />
                {isMajor ? (
                  <text x={x} y="114" textAnchor="middle" fontSize="9" fill="rgba(148,163,184,0.75)">
                    {l}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>
    </GraphCard>
  );
}

