import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

export interface AdminSession {
  author_id: string;
  author_name: string;
  display_name: string;
  role: 'author' | 'admin';
}

const getSecret = () => new TextEncoder().encode(process.env.SESSION_SECRET || 'fallback-dev-secret-key-at-least-32-chars-long');

/**
 * Sign a session payload into a JWT.
 */
export async function signAdminSession(payload: AdminSession): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());
}

/**
 * Parse the admin session from the cookie.
 * Returns null if not authenticated or signature is invalid.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const session = payload as unknown as AdminSession;
    if (!session.author_id || !session.author_name) return null;
    return session;
  } catch {
    return null;
  }
}

/**
 * Check if the current request has a valid admin session.
 * Convenience for quick auth checks.
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getAdminSession();
  return session !== null;
}
