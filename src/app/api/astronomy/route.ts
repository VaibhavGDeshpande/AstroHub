import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location') || '';
    const date = searchParams.get('date') || undefined; 

    if (!location) {
      return NextResponse.json(
        { error: 'Missing required query parameter: location' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_ASTRONOMY_TOKEN;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'Astronomy API key not configured',
          solution: 'Add NEXT_PUBLIC_ASTRONOMY_TOKEN to your .env.local file',
        },
        { status: 500 }
      );
    }

    const params = new URLSearchParams({ apiKey, location });
    if (date) params.set('date', date);

    const url = `https://api.ipgeolocation.io/v2/astronomy?${params.toString()}`;

    const response = await fetch(url, {
      // astronomy is location/date-based; cache briefly to reduce API calls
      next: { revalidate: 300 },
      headers: { 'User-Agent': 'Explore-NASA/astronomy-proxy' },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      return NextResponse.json(
        {
          error: 'Failed to fetch astronomy data',
          status: response.status,
          details: text || 'Upstream error',
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

