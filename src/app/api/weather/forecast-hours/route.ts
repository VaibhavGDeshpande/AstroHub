import { NextResponse } from 'next/server';
import { fetchOpenMeteoWeather } from '../openMeteo';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const hours = searchParams.get('hours') || '48'; // Default 48 hours

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 });
  }

  try {
    const parsedHours = Number(hours);
    const safeHours = Number.isFinite(parsedHours) ? Math.min(Math.max(parsedHours, 1), 168) : 48;

    const data = await fetchOpenMeteoWeather({ lat, lon, hours: safeHours });
    return NextResponse.json({ 
      forecastHours: data.forecastHours,
      timezone: data.timezone 
    }, { headers: { 'Cache-Control': 's-maxage=1800' } });
  } catch (error) {
    console.error('Failed to fetch hourly forecast', error);
    return NextResponse.json({ error: 'Failed to fetch hourly forecast' }, { status: 500 });
  }
}
