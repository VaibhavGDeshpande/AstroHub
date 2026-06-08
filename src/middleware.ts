import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const getSecret = () => new TextEncoder().encode(process.env.SESSION_SECRET || 'fallback-dev-secret-key-at-least-32-chars-long');

export async function middleware(request: NextRequest) {
  // Protect all /admin routes except /admin/login
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    // Check new session cookie first, fall back to legacy token
    const sessionCookie = request.cookies.get('admin_session')?.value;
    const legacyToken = request.cookies.get('admin_token')?.value;

    let isAuthenticated = false;

    if (sessionCookie) {
      try {
        const { payload } = await jwtVerify(sessionCookie, getSecret());
        const session = payload as Record<string, unknown>;
        isAuthenticated = !!(session.author_id && session.author_name);
      } catch {
        isAuthenticated = false;
      }
    } else if (legacyToken === 'authenticated') {
      // Backwards compat — old single-password sessions still work
      isAuthenticated = true;
    }

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
