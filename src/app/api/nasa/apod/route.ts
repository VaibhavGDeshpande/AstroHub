import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type ApodEntry = {
  date?: string;
  title?: string;
  explanation?: string;
  media_type?: string;
  url?: string;
  hdurl?: string;
};

function normalizeEntry(entry: ApodEntry): ApodEntry | null {
  if (!entry.date || !entry.title || !entry.explanation || !entry.media_type) return null;

  if (entry.media_type === 'image') {
    const imageUrl = entry.hdurl;
    if (!imageUrl || /nasa-logo/i.test(imageUrl)) return null;
    return { ...entry, url: imageUrl, hdurl: imageUrl };
  }

  return entry.url ? entry : null;
}

export async function GET(request: Request) {
  try {
    const incoming = new URL(request.url).searchParams;
    const url = new URL('https://science.nasa.gov/wp-json/wp/v2/apod-basic');

    for (const name of ['date', 'start_date', 'end_date'] as const) {
      const value = incoming.get(name);
      if (value) url.searchParams.set(name, value);
    }

    const response = await fetch(url, { next: { revalidate: 3600 } });
    const payload = await response.json();
    if (!response.ok) {
      return NextResponse.json({ error: 'NASA APOD request failed' }, { status: response.status });
    }

    const entries = Array.isArray(payload) ? payload : [payload];
    const normalized = entries.map(normalizeEntry);
    if (!normalized.length || normalized.some((entry) => !entry)) {
      return NextResponse.json({ error: 'NASA returned invalid APOD data' }, { status: 502 });
    }

    return NextResponse.json(Array.isArray(payload) ? normalized : normalized[0]);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'NASA APOD request failed' },
      { status: 502 },
    );
  }
}
