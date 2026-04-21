/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { fetchOpenMeteoWeather, geocodeOpenMeteo } from "./openMeteo";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "Pune";
  const aqi = searchParams.get("aqi") || "yes";
  void aqi; // Open-Meteo current endpoint here does not include AQI in this route.

  try {
    const geocode = await geocodeOpenMeteo(query);
    if (!geocode) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    const data = await fetchOpenMeteoWeather({ lat: String(geocode.latitude), lon: String(geocode.longitude), hours: 48 });
    const current: any = data.currentConditions;
    const windSpeed = current?.wind?.speed?.value ?? current?.windSpeed?.value;
    const windGust = current?.wind?.gust?.value ?? current?.windGust?.value;
    const visibilityMeters = current?.visibility?.value ?? current?.visibility?.distance;
    const pressure = current?.airPressure?.meanSeaLevelMillibars ?? current?.seaLevelPressure?.value;

    return NextResponse.json(
      {
        location: {
          name: geocode.name,
          region: geocode.admin1,
          country: geocode.country,
          localtime: new Date().toISOString().slice(0, 16).replace("T", " ")
        },
        current: {
          temp_c: current?.temperature?.degrees ?? current?.temperature?.value,
          feelslike_c: current?.feelsLikeTemperature?.degrees ?? current?.feelsLikeTemperature?.value,
          humidity: current?.relativeHumidity,
          wind_kph: windSpeed,
          wind_dir: current?.wind?.direction?.cardinal,
          pressure_mb: pressure,
          uv: current?.uvIndex,
          last_updated: new Date().toISOString().slice(0, 16).replace("T", " "),
          condition: { text: current?.weatherCondition?.description?.text },
          cloud: current?.cloudCover ?? current?.weatherCondition?.cloudCover,
          vis_km: typeof visibilityMeters === "number" ? visibilityMeters / 1000 : undefined,
          gust_kph: windGust
        }
      },
      { headers: { "Cache-Control": "s-maxage=300" } }
    );
  } catch (error) {
    console.error("Weather API fetch failed:", error);
    return NextResponse.json({ error: "Failed to fetch weather" }, { status: 500 });
  }
}
