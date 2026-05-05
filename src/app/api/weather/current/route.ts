import { NextResponse } from 'next/server';
import { fetchOpenMeteoWeather } from '../openMeteo';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 });
  }

  try {
    const data = await fetchOpenMeteoWeather({ lat, lon, hours: 48 });
    return NextResponse.json({ 
      currentConditions: data.currentConditions,
      timezone: data.timezone 
    }, { headers: { 'Cache-Control': 's-maxage=600' } });
  } catch (error) {
    console.error('Failed to fetch weather', error);
    return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 500 });
  }
}
