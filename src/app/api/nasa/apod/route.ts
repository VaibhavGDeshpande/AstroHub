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

const SOURCE = 'https://science.nasa.gov/wp-json/wp/v2/apod-basic';
const PER_PAGE = 25; // the source ignores per_page and always returns 25
const FIRST_APOD = '1995-06-16';
const MAX_RANGE_DAYS = 31; // keeps a range to 2-3 upstream calls, which trip the bot check less
const DAY_MS = 86_400_000;
// APOD is missing about 8 days in total, so an entry can sit a few places earlier than its day count says
const GAP_SLACK = 12;

function normalizeEntry(entry: ApodEntry): ApodEntry | null {
  if (!entry.date || !entry.title || !entry.explanation || !entry.media_type) return null;

  if (entry.media_type === 'image') {
    const imageUrl = entry.hdurl;
    if (!imageUrl || /nasa-logo/i.test(imageUrl)) return null;
    return { ...entry, url: imageUrl, hdurl: imageUrl };
  }

  return entry.url ? entry : null;
}

const isIsoDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(`${v}T00:00:00Z`));
const daysAgo = (v: string) => Math.floor((Date.now() - Date.parse(`${v}T00:00:00Z`)) / DAY_MS);

// science.nasa.gov sometimes answers with a "Checking your browser" HTML page (403) instead of JSON.
// It clears within seconds, so retry briefly; cached pages keep serving while it lasts.
async function fetchPage(page: number): Promise<ApodEntry[]> {
  const url = new URL(SOURCE);
  url.searchParams.set('page', String(page));

  for (const waitMs of [0, 800, 2000]) {
    if (waitMs) await new Promise((r) => setTimeout(r, waitMs));
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (response.status === 400) return []; // page past the end of the archive
    const isJson = response.headers.get('content-type')?.includes('application/json');
    if (response.ok && isJson) {
      const payload = await response.json();
      return Array.isArray(payload) ? payload : [];
    }
    if (response.status !== 403 && response.status !== 429 && isJson) {
      throw new Error(`NASA APOD request failed (${response.status})`);
    }
  }
  throw new Error('NASA is briefly blocking requests. Please try again in a minute.');
}

// The source ignores date filters (its date_from/date_to reject every format), and the list is
// newest first with one entry per day. So map dates to list positions, fetch those pages, then filter.
async function fetchDateRange(start: string, end: string): Promise<ApodEntry[]> {
  const firstIndex = Math.max(0, daysAgo(end) - GAP_SLACK);
  const lastIndex = Math.max(0, daysAgo(start) + 2);
  const pages: number[] = [];
  for (let p = Math.floor(firstIndex / PER_PAGE) + 1; p <= Math.floor(lastIndex / PER_PAGE) + 1; p++) pages.push(p);

  const entries = (await Promise.all(pages.map((p) => fetchPage(p)))).flat();
  return entries
    .filter((e) => e.date && e.date >= start && e.date <= end)
    .sort((a, b) => a.date!.localeCompare(b.date!));
}

export async function GET(request: Request) {
  try {
    const incoming = new URL(request.url).searchParams;
    const date = incoming.get('date');
    const start = incoming.get('start_date');
    const end = incoming.get('end_date');

    // No dates: the latest batch, as before
    if (!date && !start && !end) {
      const valid = (await fetchPage(1)).map(normalizeEntry).filter(Boolean);
      if (!valid.length) return NextResponse.json({ error: 'NASA returned invalid APOD data' }, { status: 502 });
      return NextResponse.json(valid);
    }

    const from = date ?? start;
    const to = date ?? end;
    if (!from || !to || !isIsoDate(from) || !isIsoDate(to)) {
      return NextResponse.json({ error: 'Dates must be in YYYY-MM-DD format' }, { status: 400 });
    }
    if (from > to) {
      return NextResponse.json({ error: 'Start date must be before end date' }, { status: 400 });
    }
    if (from < FIRST_APOD) {
      return NextResponse.json({ error: `APOD starts on ${FIRST_APOD}` }, { status: 400 });
    }
    if (daysAgo(from) - daysAgo(to) + 1 > MAX_RANGE_DAYS) {
      return NextResponse.json({ error: `Pick a range of ${MAX_RANGE_DAYS} days or fewer` }, { status: 400 });
    }

    const valid = (await fetchDateRange(from, to)).map(normalizeEntry).filter(Boolean);
    if (!valid.length) {
      return NextResponse.json({ error: 'No Astronomy Picture of the Day for that date' }, { status: 404 });
    }

    return NextResponse.json(date ? valid[0] : valid);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'NASA APOD request failed' },
      { status: 502 },
    );
  }
}
