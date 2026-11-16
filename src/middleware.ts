import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { getSecret } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  // Protect all /admin routes except /admin/login
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    const sessionCookie = request.cookies.get('admin_session')?.value;

    let isAuthenticated = false;

    if (sessionCookie) {
      try {
        const { payload } = await jwtVerify(sessionCookie, getSecret());
        const session = payload as Record<string, unknown>;
        isAuthenticated = !!(session.author_id && session.author_name);
      } catch {
        isAuthenticated = false;
      }
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
