// app/api/nasa/neo/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date') || undefined;
    const endDate = searchParams.get('end_date') || undefined;

    const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'NASA_API_KEY is not configured on the server' },
        { status: 500 }
      );
    }

    const baseUrl = 'https://api.nasa.gov/neo/rest/v1/feed';
    const qs = new URLSearchParams({ api_key: apiKey });
    if (startDate) qs.set('start_date', startDate);
    if (endDate) qs.set('end_date', endDate);

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
    console.error('NEO API Error:', error);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}