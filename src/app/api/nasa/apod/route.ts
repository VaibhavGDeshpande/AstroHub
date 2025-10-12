// app/api/nasa/apod/route.ts
import { NextResponse } from 'next/server';

// Remove force-static or change to force-dynamic
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || undefined;
    const startDate = searchParams.get('start_date') || undefined;
    const endDate = searchParams.get('end_date') || undefined;
    
    // Use server-only environment variable
    const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        error: 'NASA API key not configured',
        solution: 'Add NASA_API_KEY to your .env.local file'
      }, { status: 500 });
    }

    // Existing validation code...
    
    const params = new URLSearchParams({ api_key: apiKey });
    if (date) params.set('date', date);
    if (startDate && endDate) {
      params.set('start_date', startDate);
      params.set('end_date', endDate);
    }

    const url = `https://api.nasa.gov/planetary/apod?${params.toString()}`;
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: { 'User-Agent': 'NASA-Explorer/1.0' }
    });

    // Check rate limit headers
    const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
    
    if (!response.ok) {
      if (response.status === 403) {
        return NextResponse.json({
          error: 'NASA API access denied',
          details: 'Invalid API key or rate limit exceeded',
          rateLimitRemaining: rateLimitRemaining || 'unknown',
          solutions: [
            'Check your NASA_API_KEY',
            'Get a new API key from https://api.nasa.gov/',
            'Wait for rate limit reset (rolling hourly basis)'
          ]
        }, { status: 403 });
      }
      // Handle other errors...
    }

    const data = await response.json();
    
    // Include rate limit info in successful responses
    const responseHeaders = new Headers();
    if (rateLimitRemaining) {
      responseHeaders.set('X-RateLimit-Remaining', rateLimitRemaining);
    }
    
    return NextResponse.json(data, { headers: responseHeaders });

  } catch (error) {
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
