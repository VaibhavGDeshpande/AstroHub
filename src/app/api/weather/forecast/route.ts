/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { fetchOpenMeteoWeather, geocodeOpenMeteo } from "../openMeteo";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "Pune";
  const days = searchParams.get("days") || "10";

  try {
    const parsedDays = Number(days);
    const safeDays = Number.isFinite(parsedDays) ? Math.min(Math.max(parsedDays, 1), 16) : 10;

    const geocode = await geocodeOpenMeteo(query);
    if (!geocode) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    const data = await fetchOpenMeteoWeather({ lat: String(geocode.latitude), lon: String(geocode.longitude), hours: 48 });
    const forecastday = data.forecastDays.slice(0, safeDays).map((day: any) => ({
      date: day?.interval?.startTime ? String(day.interval.startTime).slice(0, 10) : undefined,
      day: {
        maxtemp_c: day?.maxTemperature?.degrees,
        mintemp_c: day?.minTemperature?.degrees,
        avghumidity: day?.daytimeForecast?.relativeHumidity,
        daily_chance_of_rain: day?.precipitation?.probability?.percent,
        uv: day?.daytimeForecast?.uvIndex,
        condition: {
          text: day?.daytimeForecast?.weatherCondition?.description?.text
        }
      }
    }));

    return NextResponse.json(
      {
        location: {
          name: geocode.name,
          region: geocode.admin1,
          country: geocode.country
        },
        forecast: { forecastday }
      },
      { headers: { "Cache-Control": "s-maxage=600" } }
    );
  } catch (error) {
    console.error("Weather forecast fetch failed:", error);
    return NextResponse.json({ error: "Failed to fetch forecast" }, { status: 500 });
  }
}
