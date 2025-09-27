// app/api/nasa/mars-photos/[rover]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface RouteParams {
  rover: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    // Await the params Promise
    const { rover } = await params;
    
    // Validate rover parameter
    const validRovers = ['curiosity', 'opportunity', 'spirit', 'perseverance'];
    if (!validRovers.includes(rover.toLowerCase())) {
      return NextResponse.json(
        { 
          error: 'Invalid rover name', 
          validRovers: validRovers 
        }, 
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const earth_date = searchParams.get('earth_date') || '2025-05-03';
    
    const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'NASA_API_KEY is not configured on the server' }, 
        { status: 500 }
      );
    }

    // Build the NASA Mars Photos API URL
    const baseUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover.toLowerCase()}/photos`;
    const queryParams = new URLSearchParams({
      api_key: apiKey,
      earth_date : earth_date,
    });

    const url = `${baseUrl}?${queryParams.toString()}`;
    const res = await fetch(url, { 
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: 'Upstream Mars Photos request failed', details: text }, 
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Mars Photos API Error:', error);
    return NextResponse.json(
      { error: 'Unexpected server error' }, 
      { status: 500 }
    );
  }
}