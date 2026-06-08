import { cookies } from 'next/headers';

export interface AdminSession {
  author_id: string;
  author_name: string;
  display_name: string;
  role: 'author' | 'admin';
}

/**
 * Parse the admin session from the cookie.
 * Returns null if not authenticated.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get('admin_session')?.value;
  if (!raw) return null;

  try {
    const session = JSON.parse(raw) as AdminSession;
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
