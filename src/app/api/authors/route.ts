import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createClient } from '@/lib/supabase/server';
import { getAdminSession } from '@/lib/auth';

// GET: list all authors (admin only, or return public author list)
export async function GET() {
  const session = await getAdminSession();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('authors')
    .select('id, name, display_name, avatar_url, role, created_at')
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // If not authenticated, return only public info (no role field)
  if (!session) {
    const publicData = (data || []).map(({ id, name, display_name, avatar_url }) => ({
      id, name, display_name, avatar_url,
    }));
    return NextResponse.json(publicData);
  }

  return NextResponse.json(data || []);
}

// POST: create a new author
export async function POST(request: Request) {
  const supabase = await createClient();

  // Check if any authors exist — if not, allow first-run seed without auth
  const { count } = await supabase.from('authors').select('*', { count: 'exact', head: true });
  const isFirstRun = (count ?? 0) === 0;

  if (!isFirstRun) {
    const session = await getAdminSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Only admins can create authors' }, { status: 403 });
    }
  }

  try {
    const { name, password, display_name, role } = await request.json();

    if (!name || !password) {
      return NextResponse.json({ error: 'Name and password are required' }, { status: 400 });
    }

    if (password.length < 4) {
      return NextResponse.json({ error: 'Password must be at least 4 characters' }, { status: 400 });
    }

    // Check if author name already exists
    const { data: existing } = await supabase
      .from('authors')
      .select('id')
      .ilike('name', name)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'An author with this name already exists' }, { status: 400 });
    }

    // Hash the password
    const password_hash = await bcrypt.hash(password, 10);

    // If first run, make the first author an admin
    const authorRole = isFirstRun ? 'admin' : (role || 'author');

    const { data: created, error } = await supabase
      .from('authors')
      .insert([{
        name: name.trim(),
        password_hash,
        display_name: (display_name || name).trim(),
        role: authorRole,
      }])
      .select('id, name, display_name, role, created_at')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}
