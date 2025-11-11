// app/api/proxy-image/route.ts
import { NextRequest, NextResponse } from 'next/server';

const ALLOW_HOSTS = new Set<string>([
  'skyview.gsfc.nasa.gov', // NASA SkyView only
]);

export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get('url');
  if (!urlParam) {
    return new NextResponse('Missing url', { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(urlParam);
  } catch {
    return new NextResponse('Invalid url', { status: 400 });
  }

  if (!ALLOW_HOSTS.has(target.hostname)) {
    return new NextResponse('Host not allowed', { status: 403 });
  }

  if (target.protocol !== 'https:') {
    return new NextResponse('HTTPS required', { status: 400 });
  }

  const upstream = await fetch(target.toString(), {
    redirect: 'follow',
    cache: 'no-store',
  });

  if (!upstream.ok || !upstream.body) {
    return new NextResponse(`Upstream ${upstream.status}`, { status: 502 });
  }

  const contentType = upstream.headers.get('content-type') ?? 'application/octet-stream';
  const contentLength = upstream.headers.get('content-length') ?? undefined;

  const headers = new Headers();
  headers.set('Content-Type', contentType);
  if (contentLength) headers.set('Content-Length', contentLength);
  headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');

  return new NextResponse(upstream.body, { status: 200, headers });
}
