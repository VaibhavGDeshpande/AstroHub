import { NextRequest, NextResponse } from 'next/server';

const N2YO_API_KEY = process.env.NEXT_PUBLIC_N2YO_API_KEY;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const observerLat = searchParams.get('lat') || '18.5204';
  const observerLng = searchParams.get('lng') || '73.8567';
  const observerAlt = searchParams.get('alt') || '0.56';
  const searchRadius = searchParams.get('radius') || '70';
  const categoryId = searchParams.get('categoryId') || '0';

  try {
    const response = await fetch(
      `https://api.n2yo.com/rest/v1/satellite/above/${observerLat}/${observerLng}/${observerAlt}/${searchRadius}/${categoryId}&apiKey=${N2YO_API_KEY}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch satellites above');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching satellites above:', error);
    return NextResponse.json(
      { error: 'Failed to fetch satellites' },
      { status: 500 }
    );
  }
}
