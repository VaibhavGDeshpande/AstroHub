import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Protect all /admin routes except /admin/login
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    // Check new session cookie first, fall back to legacy token
    const sessionCookie = request.cookies.get('admin_session')?.value;
    const legacyToken = request.cookies.get('admin_token')?.value;

    let isAuthenticated = false;

    if (sessionCookie) {
      try {
        const session = JSON.parse(sessionCookie);
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
