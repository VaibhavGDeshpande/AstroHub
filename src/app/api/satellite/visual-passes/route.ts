import { NextRequest, NextResponse } from 'next/server';

const N2YO_API_KEY = process.env.NEXT_PUBLIC_N2YO_API_KEY;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const noradId = searchParams.get('noradId');
  const observerLat = searchParams.get('lat') || '18.5204';
  const observerLng = searchParams.get('lng') || '73.8567';
  const observerAlt = searchParams.get('alt') || '0.56';
  const days = searchParams.get('days') || '10';
  const minElevation = searchParams.get('minElevation') || '0';

  if (!noradId) {
    return NextResponse.json(
      { error: 'NORAD ID is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://api.n2yo.com/rest/v1/satellite/visualpasses/${noradId}/${observerLat}/${observerLng}/${observerAlt}/${days}/${minElevation}&apiKey=${N2YO_API_KEY}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch visual passes');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching visual passes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch visual passes' },
      { status: 500 }
    );
  }
}
