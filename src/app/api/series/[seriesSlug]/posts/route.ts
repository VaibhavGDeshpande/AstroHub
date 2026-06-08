import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminSession } from '@/lib/auth';

// GET: list posts for a series
export async function GET(
  request: Request,
  { params }: { params: Promise<{ seriesSlug: string }> }
) {
  const { seriesSlug } = await params;
  const { searchParams } = new URL(request.url);
  const includeUnpublished = searchParams.get('all') === 'true';

  const supabase = await createClient();

  // Resolve series
  const { data: series } = await supabase
    .from('custom_series')
    .select('id, name, slug')
    .eq('slug', seriesSlug)
    .single();

  if (!series) {
    return NextResponse.json({ error: 'Series not found' }, { status: 404 });
  }

  let query = supabase
    .from('custom_series_posts')
    .select('*')
    .eq('series_id', series.id)
    .order('createdAt', { ascending: false });

  if (!includeUnpublished) {
    query = query.eq('published', true);
  } else {
    // Must be authenticated
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Author isolation: only show own posts unless admin
    if (session.role !== 'admin') {
      query = query.eq('app_author_id', session.author_id);
    }
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Tag with contentType + series info
  const tagged = (data || []).map((row: Record<string, unknown>) => ({
    ...row,
    contentType: 'custom-series',
    seriesName: series.name,
    seriesSlug: series.slug,
  }));

  return NextResponse.json(tagged);
}

// POST: create a post in this series
export async function POST(
  request: Request,
  { params }: { params: Promise<{ seriesSlug: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { seriesSlug } = await params;
  const supabase = await createClient();

  // Resolve series
  const { data: series } = await supabase
    .from('custom_series')
    .select('id')
    .eq('slug', seriesSlug)
    .single();

  if (!series) {
    return NextResponse.json({ error: 'Series not found' }, { status: 404 });
  }

  try {
    const body = await request.json();

    // Check slug uniqueness
    const { data: existing } = await supabase
      .from('custom_series_posts')
      .select('slug')
      .eq('slug', body.slug)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const newRow = {
      series_id: series.id,
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt || '',
      content: body.content,
      coverImage: body.coverImage || '',
      published: body.published || false,
      author: body.author || session.display_name,
      app_author_id: session.author_id,
      publishDate: body.publishDate || null,
      metadata: body.metadata || {},
    };

    const { data: inserted, error } = await supabase
      .from('custom_series_posts')
      .insert([newRow])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ...inserted, contentType: 'custom-series' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
