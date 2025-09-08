// app/api/nasa/neo/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    // Validate required parameters
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Both start_date and end_date are required parameters' }, 
        { status: 400 }
      );
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      return NextResponse.json(
        { error: 'Dates must be in YYYY-MM-DD format' }, 
        { status: 400 }
      );
    }

    // Check if date range is within 7 days (NASA API limitation)
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff > 7) {
      return NextResponse.json(
        { error: 'Date range cannot exceed 7 days' }, 
        { status: 400 }
      );
    }

    const apiKey = process.env.NASA_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'NASA_API_KEY is not configured on the server' }, 
        { status: 500 }
      );
    }

    const baseUrl = 'https://api.nasa.gov/neo/rest/v1/feed';
    const qs = new URLSearchParams({ 
      api_key: apiKey,
      start_date: startDate,
      end_date: endDate
    });

    const url = `${baseUrl}?${qs.toString()}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: 'Upstream NEO request failed', details: text }, 
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Unexpected server error' }, 
      { status: 500 }
    );
  }
}
