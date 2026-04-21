/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { fetchWeatherApi } from 'openmeteo';

export type OpenMeteoWeather = {
  currentConditions: Record<string, unknown>;
  forecastDays: Array<Record<string, unknown>>;
  forecastHours: Array<Record<string, unknown>>;
};

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

function windCardinalFromDegrees(degrees: number) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round((((degrees % 360) + 360) % 360) / 45) % 8;
  return directions[index];
}

function wmoCodeToText(code: number | null | undefined) {
  switch (code) {
    case 0:
      return 'Clear';
    case 1:
    case 2:
    case 3:
      return 'Partly cloudy';
    case 45:
    case 48:
      return 'Fog';
    case 51:
    case 53:
    case 55:
      return 'Drizzle';
    case 56:
    case 57:
      return 'Freezing drizzle';
    case 61:
    case 63:
    case 65:
      return 'Rain';
    case 66:
    case 67:
      return 'Freezing rain';
    case 71:
    case 73:
    case 75:
      return 'Snow';
    case 77:
      return 'Snow grains';
    case 80:
    case 81:
    case 82:
      return 'Rain showers';
    case 85:
    case 86:
      return 'Snow showers';
    case 95:
      return 'Thunderstorm';
    case 96:
    case 99:
      return 'Thunderstorm with hail';
    default:
      return 'Unknown';
  }
}

function buildTimes(series: any, utcOffsetSeconds: number) {
  const start = Number(series.time());
  const end = Number(series.timeEnd());
  const interval = Number(series.interval());
  const len = Math.max(0, Math.floor((end - start) / interval));

  return Array.from({ length: len }, (_, i) => new Date((start + i * interval + utcOffsetSeconds) * 1000));
}

function roundOrUndefined(value: number | undefined | null) {
  if (value === undefined || value === null || !Number.isFinite(value)) return undefined;
  return Math.round(value);
}

function safeValuesArray(variable: any): number[] {
  if (!variable) return [];
  const values = variable.valuesArray?.();
  if (!values) return [];
  try {
    return Array.from(values as any as number[]);
  } catch {
    return [];
  }
}

export async function fetchOpenMeteoWeather({
  lat,
  lon,
  hours = 48
}: {
  lat: string;
  lon: string;
  hours?: number;
}): Promise<OpenMeteoWeather> {
  const params = {
    latitude: Number(lat),
    longitude: Number(lon),
    timezone: 'auto',
    forecast_days: 16,
    current: [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'visibility',
      'wind_speed_10m',
      'wind_gusts_10m',
      'wind_direction_10m',
      'pressure_msl',
      'uv_index'
    ].join(','),
    hourly: [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'dew_point_2m',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'visibility',
      'uv_index',
      'wind_speed_10m',
      'wind_gusts_10m',
      'wind_direction_10m',
      'pressure_msl',
      'is_day'
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'precipitation_sum',
      'uv_index_max',
      'cloud_cover_mean',
      'sunrise',
      'sunset'
    ].join(',')
  };

  const responses = await fetchWeatherApi(FORECAST_URL, params as any);
  const response = responses[0];
  const utcOffsetSeconds = Number(response.utcOffsetSeconds());

  const current = response.current?.();
  const hourly = response.hourly?.();
  const daily = response.daily?.();

  const hourlyTimes = hourly ? buildTimes(hourly, utcOffsetSeconds) : [];

  const getHourlyValues = (idx: number) => (hourly ? safeValuesArray(hourly.variables(idx)) : []);
  const [
    hourlyTemp,
    hourlyFeels,
    hourlyHumidity,
    hourlyDewPoint,
    hourlyPrecipProb,
    hourlyPrecip,
    hourlyWmo,
    hourlyCloud,
    hourlyVis,
    hourlyUv,
    hourlyWind,
    hourlyGust,
    hourlyWindDir,
    hourlyPressure,
    hourlyIsDay
  ] = Array.from({ length: 15 }, (_, i) => getHourlyValues(i));

  const forecastHours = hourlyTimes.slice(0, Math.max(0, hours)).map((time, i) => {
    const windDir = hourlyWindDir[i];
    return {
      interval: { startTime: time.toISOString() },
      temperature: { degrees: hourlyTemp[i] },
      feelsLikeTemperature: { degrees: hourlyFeels[i] },
      precipitationProbability: roundOrUndefined(hourlyPrecipProb[i]),
      precipitation: { probability: { percent: roundOrUndefined(hourlyPrecipProb[i]) } },
      relativeHumidity: roundOrUndefined(hourlyHumidity[i]),
      cloudCover: roundOrUndefined(hourlyCloud[i]),
      visibility: { value: hourlyVis[i] },
      uvIndex: roundOrUndefined(hourlyUv[i]),
      airPressure: { meanSeaLevelMillibars: hourlyPressure[i] },
      seaLevelPressure: { value: hourlyPressure[i] },
      wind: {
        speed: { value: hourlyWind[i] },
        gust: { value: hourlyGust[i] },
        direction: windDir !== undefined ? { degrees: windDir, cardinal: windCardinalFromDegrees(windDir) } : undefined
      },
      windSpeed: { value: hourlyWind[i] },
      windGust: { value: hourlyGust[i] },
      isDaytime: Boolean(hourlyIsDay[i]),
      weatherCondition: { description: { text: wmoCodeToText(hourlyWmo[i]) }, cloudCover: roundOrUndefined(hourlyCloud[i]) }
    };
  });

  const currentHour = forecastHours[0];
  const precipitationProbability = currentHour?.precipitationProbability ?? 0;
  const qpf = (current ? (current.variables(3)!.value() as any as number) : undefined) ?? hourlyPrecip?.[0];

  const currentConditions = {
    temperature: { degrees: current ? (current.variables(0)!.value() as any as number) : hourlyTemp?.[0] },
    feelsLikeTemperature: { degrees: current ? (current.variables(1)!.value() as any as number) : hourlyFeels?.[0] },
    relativeHumidity: current ? roundOrUndefined(current.variables(2)!.value() as any as number) : roundOrUndefined(hourlyHumidity?.[0]),
    precipitationProbability,
    precipitation: {
      probability: { percent: precipitationProbability },
      qpf: { quantity: qpf, unit: 'mm' }
    },
    weatherCondition: {
      description: { text: wmoCodeToText(current ? (current.variables(4)!.value() as any as number) : hourlyWmo?.[0]) },
      cloudCover: current ? roundOrUndefined(current.variables(5)!.value() as any as number) : roundOrUndefined(hourlyCloud?.[0])
    },
    cloudCover: current ? roundOrUndefined(current.variables(5)!.value() as any as number) : roundOrUndefined(hourlyCloud?.[0]),
    visibility: { value: current ? (current.variables(6)!.value() as any as number) : hourlyVis?.[0] },
    wind: {
      speed: { value: current ? (current.variables(7)!.value() as any as number) : hourlyWind?.[0] },
      gust: { value: current ? (current.variables(8)!.value() as any as number) : hourlyGust?.[0] },
      direction: (() => {
        const degrees = current ? (current.variables(9)!.value() as any as number) : hourlyWindDir?.[0];
        if (degrees === undefined || degrees === null || !Number.isFinite(degrees)) return undefined;
        return { degrees, cardinal: windCardinalFromDegrees(degrees) };
      })()
    },
    windSpeed: { value: current ? (current.variables(7)!.value() as any as number) : hourlyWind?.[0] },
    windGust: { value: current ? (current.variables(8)!.value() as any as number) : hourlyGust?.[0] },
    airPressure: { meanSeaLevelMillibars: current ? (current.variables(10)!.value() as any as number) : hourlyPressure?.[0] },
    seaLevelPressure: { value: current ? (current.variables(10)!.value() as any as number) : hourlyPressure?.[0] },
    uvIndex: current ? roundOrUndefined(current.variables(11)!.value() as any as number) : roundOrUndefined(hourlyUv?.[0])
  };

  const dailyTimes = daily ? buildTimes(daily, utcOffsetSeconds) : [];
  const getDailyValues = (idx: number) => (daily ? safeValuesArray(daily.variables(idx)) : []);

  const dailyWmo = getDailyValues(0);
  const dailyMax = getDailyValues(1);
  const dailyMin = getDailyValues(2);
  const dailyPrecipProbMax = getDailyValues(3);
  const dailyPrecipSum = getDailyValues(4);
  const dailyUvMax = getDailyValues(5);
  const dailyCloudMean = getDailyValues(6);
  const dailySunrise = daily ? safeValuesArray(daily.variables(7)) : [];
  const dailySunset = daily ? safeValuesArray(daily.variables(8)) : [];

  const forecastDays = dailyTimes.slice(0, 16).map((date, i) => {
    const sunrise = dailySunrise[i] ? new Date((dailySunrise[i] + utcOffsetSeconds) * 1000).toISOString() : undefined;
    const sunset = dailySunset[i] ? new Date((dailySunset[i] + utcOffsetSeconds) * 1000).toISOString() : undefined;
    const precipMax = roundOrUndefined(dailyPrecipProbMax[i]) ?? 0;

    const dayForecast: Record<string, unknown> = {
      interval: { startTime: date.toISOString() },
      maxTemperature: { degrees: dailyMax[i] },
      minTemperature: { degrees: dailyMin[i] },
      precipitation: { probability: { percent: precipMax }, qpf: { quantity: dailyPrecipSum[i], unit: 'mm' } },
      daytimeForecast: {
        interval: { startTime: date.toISOString() },
        weatherCondition: { description: { text: wmoCodeToText(dailyWmo[i]) }, cloudCover: roundOrUndefined(dailyCloudMean[i]) },
        precipitation: { probability: { percent: precipMax }, qpf: { quantity: dailyPrecipSum[i], unit: 'mm' } },
        relativeHumidity: undefined,
        cloudCover: roundOrUndefined(dailyCloudMean[i]),
        uvIndex: roundOrUndefined(dailyUvMax[i])
      },
      nighttimeForecast: {
        interval: { startTime: date.toISOString() },
        weatherCondition: { description: { text: wmoCodeToText(dailyWmo[i]) }, cloudCover: roundOrUndefined(dailyCloudMean[i]) },
        precipitation: { probability: { percent: precipMax }, qpf: { quantity: dailyPrecipSum[i], unit: 'mm' } },
        relativeHumidity: undefined,
        cloudCover: roundOrUndefined(dailyCloudMean[i]),
        uvIndex: undefined
      },
      sunEvents: { sunriseTime: sunrise, sunsetTime: sunset }
    };

    return dayForecast;
  });

  return {
    currentConditions,
    forecastDays,
    forecastHours
  };
}

export type OpenMeteoGeocodeResult = {
  latitude: number;
  longitude: number;
  name?: string;
  admin1?: string;
  country?: string;
  timezone?: string;
};

export async function geocodeOpenMeteo(query: string): Promise<OpenMeteoGeocodeResult | null> {
  const url = new URL(GEOCODING_URL);
  url.searchParams.set('name', query);
  url.searchParams.set('count', '1');
  url.searchParams.set('language', 'en');
  url.searchParams.set('format', 'json');

  const response = await fetch(url.toString(), { next: { revalidate: 86400 } });
  if (!response.ok) return null;

  const data = (await response.json()) as { results?: OpenMeteoGeocodeResult[] };
  const first = data?.results?.[0];
  if (!first || !Number.isFinite(first.latitude) || !Number.isFinite(first.longitude)) return null;
  return first;
}
