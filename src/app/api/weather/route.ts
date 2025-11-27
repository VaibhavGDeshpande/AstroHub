import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "Pune";
  const aqi = searchParams.get("aqi") || "yes";
  const apiKey = process.env.WEATHERAPI_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Missing WEATHERAPI_KEY" }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(query)}&aqi=${encodeURIComponent(
        aqi
      )}`,
      { next: { revalidate: 300 } }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`WeatherAPI error ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Weather API fetch failed:", error);
    return NextResponse.json({ error: "Failed to fetch weather" }, { status: 500 });
  }
}
