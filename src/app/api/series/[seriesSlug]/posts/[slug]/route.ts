import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminSession } from '@/lib/auth';

// GET: get a single series post by slug
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ seriesSlug: string; slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from('custom_series_posts')
    .select('*, custom_series(name, slug)')
    .eq('slug', slug)
    .single();

  if (error || !post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  if (!post.published) {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const series = post.custom_series as { name: string; slug: string } | null;
  return NextResponse.json({
    ...post,
    contentType: 'custom-series',
    seriesName: series?.name,
    seriesSlug: series?.slug,
    custom_series: undefined,
  });
}

// PUT: update a series post
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ seriesSlug: string; slug: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await params;
  const supabase = await createClient();

  // Verify ownership (unless admin)
  if (session.role !== 'admin') {
    const { data: existing } = await supabase
      .from('custom_series_posts')
      .select('app_author_id')
      .eq('slug', slug)
      .single();

    if (existing && existing.app_author_id && existing.app_author_id !== session.author_id) {
      return NextResponse.json({ error: 'You can only edit your own posts' }, { status: 403 });
    }
  }

  try {
    const body = await request.json();

    const updateData: Record<string, unknown> = {
      title: body.title,
      slug: body.slug || slug,
      excerpt: body.excerpt,
      content: body.content,
      coverImage: body.coverImage,
      published: body.published,
      author: body.author,
      publishDate: body.publishDate || null,
      metadata: body.metadata || {},
      updatedAt: new Date().toISOString(),
    };

    const { data: updated, error } = await supabase
      .from('custom_series_posts')
      .update(updateData)
      .eq('slug', slug)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ...updated, contentType: 'custom-series' });
  } catch {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}

// DELETE: delete a series post
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ seriesSlug: string; slug: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await params;
  const supabase = await createClient();

  // Verify ownership (unless admin)
  if (session.role !== 'admin') {
    const { data: existing } = await supabase
      .from('custom_series_posts')
      .select('app_author_id')
      .eq('slug', slug)
      .single();

    if (existing && existing.app_author_id && existing.app_author_id !== session.author_id) {
      return NextResponse.json({ error: 'You can only delete your own posts' }, { status: 403 });
    }
  }

  const { error } = await supabase
    .from('custom_series_posts')
    .delete()
    .eq('slug', slug);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
