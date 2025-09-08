import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: Request, { params }: { params: { rover: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const { rover } = params;
    
    // Validate rover name
    const validRovers = ['curiosity', 'opportunity', 'spirit'];
    if (!validRovers.includes(rover.toLowerCase())) {
      return NextResponse.json(
        { error: `Invalid rover name. Must be one of: ${validRovers.join(', ')}` },
        { status: 400 }
      );
    }

    // Extract query parameters
    const earthDate = searchParams.get('earth_date');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    // Validate that either earth_date or start_date & end_date are provided
    if (!earthDate && !(startDate && endDate)) {
      return NextResponse.json(
        { error: 'Either earth_date or both start_date and end_date are required' },
        { status: 400 }
      );
    }

    // Get NASA API key
    const apiKey = process.env.NASA_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'NASA_API_KEY is not configured on the server' },
        { status: 500 }
      );
    }

    // Build NASA API URL
    const baseUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover.toLowerCase()}/photos`;
    const qs = new URLSearchParams({ api_key: apiKey });

    // Add query parameters
    if (earthDate) {
      qs.set('earth_date', earthDate);
    }
    if (startDate && endDate) {
      qs.set('start_date', startDate);
      qs.set('end_date', endDate);
    }

    const url = `${baseUrl}?${qs.toString()}`;

    // Fetch from NASA API
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: 'Upstream Mars Photos API request failed', details: text, status: res.status },
        { status: res.status }
      );
    }

    const data = await res.json();
    
    // Return the photos data
    return NextResponse.json(data);

  } catch (error) {
    console.error('Mars Photos API Error:', error);
    return NextResponse.json(
      { error: 'Unexpected server error' },
      { status: 500 }
    );
  }
}
