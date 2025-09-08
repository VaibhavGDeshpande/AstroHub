// app/api/nasa/apod/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || undefined;
    const startDate = searchParams.get('start_date') || undefined;
    const endDate = searchParams.get('end_date') || undefined;

    const apiKey = process.env.NASA_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'NASA_API_KEY is not configured on the server' }, { status: 500 });
    }

    const baseUrl = 'https://api.nasa.gov/planetary/apod';
    const qs = new URLSearchParams({ api_key: apiKey });
    if (date) qs.set('date', date);
    if (startDate && endDate) {
      qs.set('start_date', startDate);
      qs.set('end_date', endDate);
    }

    const url = `${baseUrl}?${qs.toString()}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: 'Upstream APOD request failed', details: text }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}


