// app/api/nasa/apod/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || undefined;
    const startDate = searchParams.get('start_date') || undefined;
    const endDate = searchParams.get('end_date') || undefined;
    const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        error: 'NASA API key not configured',
        solution: 'Add NASA_API_KEY to your .env.local file'
      }, { status: 500 });
    }

    // Validate date formats.
    if (date && isNaN(Date.parse(date))) {
      return NextResponse.json({
        error: 'Invalid date format',
        solution: 'Use YYYY-MM-DD format'
      }, { status: 400 });
    }
    if (startDate && endDate && (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate)))) {
      return NextResponse.json({
        error: 'Invalid date range format',
        solution: 'Use YYYY-MM-DD for both dates'
      }, { status: 400 });
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return NextResponse.json({
        error: 'Start date must be before end date'
      }, { status: 400 });
    }

    // Build URL and make request.
    const params = new URLSearchParams({ api_key: apiKey });
    if (date) params.set('date', date);
    if (startDate && endDate) {
      params.set('start_date', startDate);
      params.set('end_date', endDate);
    }

    const url = `https://api.nasa.gov/planetary/apod?${params.toString()}`;
    const response = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { 'User-Agent': 'NASA-Explorer/1.0' }
    });

    if (!response.ok) {
      const text = await response.text();
      if (response.status === 403) {
        return NextResponse.json({
          error: 'NASA API access denied',
          details: 'Invalid API key or rate limit exceeded',
          solutions: [
            'Check your NASA_API_KEY',
            'Get a new API key from https://api.nasa.gov/',
            'Wait and try again to avoid rate limit'
          ]
        }, { status: 403 });
      }
      if (response.status === 404) {
        return NextResponse.json({
          error: 'No APOD data available',
          details: 'No picture for requested date'
        }, { status: 404 });
      }
      return NextResponse.json({
        error: `NASA API error (${response.status})`,
        details: text
      }, { status: response.status });
    }

    const data = await response.json();
    if (!data) {
      return NextResponse.json({
        error: 'Empty response from NASA API'
      }, { status: 502 });
    }

    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
