import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://weather.googleapis.com/v1/currentConditions:lookup?key=${process.env.GOOGLE_WEATHER_API_KEY}&location.latitude=${lat}&location.longitude=${lon}&unitsSystem=METRIC`,
      { next: { revalidate: 600 } } // Cache for 10 minutes
    );

    if (!response.ok) throw new Error('Weather API failed');
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch weather', error);
    return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 500 });
  }
}
