import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createClient } from '@/lib/supabase/server';
import { signAdminSession, getAdminSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { name, password } = await request.json();

    if (!name || !password) {
      return NextResponse.json({ error: 'Name and password are required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Look up the author by name (case-insensitive)
    const { data: author, error } = await supabase
      .from('authors')
      .select('*')
      .ilike('name', name)
      .single();

    if (error || !author) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify the password against the stored bcrypt hash
    const isValid = await bcrypt.compare(password, author.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Build the session payload
    const sessionPayload = {
      author_id: author.id,
      author_name: author.name,
      display_name: author.display_name || author.name,
      role: author.role || 'author',
    };

    const sessionToken = await signAdminSession(sessionPayload);

    const response = NextResponse.json({
      success: true,
      author: {
        id: author.id,
        name: author.name,
        display_name: author.display_name,
        role: author.role,
      },
    });

    // Set secure HTTP-only cookie with session info
    response.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Also keep the old cookie for backwards compatibility during transition
    response.cookies.set('admin_token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET: return the current session info
export async function GET() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, ...session });
}

// DELETE: logout — clear both cookies
export async function DELETE() {
  const response = NextResponse.json({ success: true });

  response.cookies.set('admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
  response.cookies.set('admin_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });

  return response;
}
