import { NextRequest, NextResponse } from 'next/server';

const N2YO_API_KEY = process.env.NEXT_PUBLIC_N2YO_API_KEY;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const noradId = searchParams.get('noradId');

  if (!noradId) {
    return NextResponse.json(
      { error: 'NORAD ID is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://api.n2yo.com/rest/v1/satellite/tle/25544&apiKey=${N2YO_API_KEY}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch TLE data');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching TLE:', error);
    return NextResponse.json(
      { error: 'Failed to fetch satellite data' },
      { status: 500 }
    );
  }
}
