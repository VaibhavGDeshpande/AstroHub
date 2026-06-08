import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminSession } from '@/lib/auth';

// GET: list all custom series
export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('custom_series')
    .select('*, custom_series_posts(count)')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Flatten the count
  const result = (data || []).map((s: Record<string, unknown>) => ({
    ...s,
    postCount: Array.isArray(s.custom_series_posts)
      ? (s.custom_series_posts[0] as { count: number })?.count ?? 0
      : 0,
    custom_series_posts: undefined,
  }));

  return NextResponse.json(result);
}

// POST: create a new custom series
export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();

  try {
    const body = await request.json();
    const { name, slug, description, icon, color } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    // Check slug uniqueness
    const { data: existing } = await supabase
      .from('custom_series')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'A series with this slug already exists' }, { status: 400 });
    }

    const { data: created, error } = await supabase
      .from('custom_series')
      .insert([{
        name,
        slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        description: description || '',
        icon: icon || 'star',
        color: color || '#8b5cf6',
        created_by: session.author_id,
      }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}

// DELETE: delete a custom series by id (cascades to its posts)
export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Series id is required' }, { status: 400 });
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('custom_series')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
