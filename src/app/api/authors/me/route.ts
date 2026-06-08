import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminSession, signAdminSession } from '@/lib/auth';

type AuthorProfile = {
  id: string;
  name: string;
  display_name: string;
  avatar_url: string;
  role: 'author' | 'admin';
  created_at: string;
  updated_at: string;
};

async function sessionResponse(author: AuthorProfile) {
  const sessionPayload = {
    author_id: author.id,
    author_name: author.name,
    display_name: author.display_name || author.name,
    role: author.role || 'author',
  };

  const sessionToken = await signAdminSession(sessionPayload);

  const response = NextResponse.json({ author });
  response.cookies.set('admin_session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();
  const { data: author, error } = await supabase
    .from('authors')
    .select('id, name, display_name, avatar_url, role, created_at, updated_at')
    .eq('id', session.author_id)
    .single();

  if (error || !author) {
    return NextResponse.json({ error: 'Author profile not found' }, { status: 404 });
  }

  return NextResponse.json({ author });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { display_name, avatar_url } = await request.json();
    const displayName = String(display_name || '').trim();
    const avatarUrl = String(avatar_url || '').trim();

    if (!displayName) {
      return NextResponse.json({ error: 'Display name is required' }, { status: 400 });
    }

    if (displayName.length > 80) {
      return NextResponse.json({ error: 'Display name must be 80 characters or fewer' }, { status: 400 });
    }

    if (avatarUrl.length > 500) {
      return NextResponse.json({ error: 'Avatar URL must be 500 characters or fewer' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: author, error } = await supabase
      .from('authors')
      .update({
        display_name: displayName,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.author_id)
      .select('id, name, display_name, avatar_url, role, created_at, updated_at')
      .single();

    if (error || !author) {
      return NextResponse.json({ error: error?.message || 'Unable to update profile' }, { status: 500 });
    }

    return sessionResponse(author as AuthorProfile);
  } catch {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}
