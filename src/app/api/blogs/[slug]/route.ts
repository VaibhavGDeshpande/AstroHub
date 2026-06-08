import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminSession } from '@/lib/auth';
import type { ContentType } from '@/lib/blogsDb';
import { TABLE_MAP } from '@/lib/blogsDb';

// Helper: find which table a slug belongs to (now includes custom_series_posts)
async function findPostBySlug(supabase: Awaited<ReturnType<typeof createClient>>, slug: string) {
  const tables: { type: ContentType; table: string }[] = [
    { type: 'whats-up', table: 'whats_up' },
    { type: 'tutorial', table: 'tutorials' },
    { type: 'explainer', table: 'explainers' },
  ];

  for (const { type, table } of tables) {
    const { data } = await supabase.from(table).select('*').eq('slug', slug).single();
    if (data) return { ...data, contentType: type, _table: table };
  }

  // Also check custom_series_posts
  const { data: csPost } = await supabase
    .from('custom_series_posts')
    .select('*, custom_series(name, slug)')
    .eq('slug', slug)
    .single();

  if (csPost) {
    const series = csPost.custom_series as { name: string; slug: string } | null;
    return {
      ...csPost,
      contentType: 'custom-series' as const,
      _table: 'custom_series_posts',
      seriesName: series?.name,
      seriesSlug: series?.slug,
      custom_series: undefined,
    };
  }

  return null;
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const post = await findPostBySlug(supabase, slug);

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  if (!post.published) {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.role !== 'admin' && post.app_author_id !== session.author_id) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
  }

  return NextResponse.json(post);
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await params;
  const data = await request.json();
  const supabase = await createClient();

  const contentType = (data.contentType || 'explainer') as ContentType;
  const tableName = contentType === 'custom-series' ? 'custom_series_posts' : TABLE_MAP[contentType];

  if (!tableName) {
    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
  }

  // Verify ownership (unless admin)
  if (session.role !== 'admin') {
    const { data: existing } = await supabase
      .from(tableName)
      .select('app_author_id')
      .eq('slug', slug)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (existing.app_author_id !== session.author_id) {
      return NextResponse.json({ error: 'You can only edit your own posts' }, { status: 403 });
    }
  }

  // Build update data — common fields
  const updateData: Record<string, unknown> = {
    title: data.title,
    slug: data.slug || slug,
    excerpt: data.excerpt,
    content: data.content,
    coverImage: data.coverImage,
    published: data.published,
    author: data.author,
    publishDate: data.publishDate || null,
    updatedAt: new Date().toISOString(),
  };

  // Type-specific fields
  if (contentType === 'whats-up') {
    updateData.skyMonth = data.skyMonth || null;
    updateData.skyYear = data.skyYear || null;
    updateData.skyEvents = data.skyEvents || [];
    updateData.previousMonthSlug = data.previousMonthSlug || null;
  } else if (contentType === 'tutorial') {
    updateData.difficultyLevel = data.difficultyLevel || null;
    updateData.estimatedReadTime = data.estimatedReadTime || null;
    updateData.toolsNeeded = data.toolsNeeded || [];
  } else if (contentType === 'explainer') {
    updateData.topicCategory = data.topicCategory || null;
    updateData.keyConcepts = data.keyConcepts || [];
    updateData.visualAids = data.visualAids || [];
  } else if (contentType === 'custom-series') {
    updateData.metadata = data.metadata || {};
  }

  const { data: updated, error } = await supabase
    .from(tableName)
    .update(updateData)
    .eq('slug', slug)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ...updated, contentType });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await params;
  const supabase = await createClient();

  // Find which table the slug belongs to and delete from there
  const post = await findPostBySlug(supabase, slug);
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  // Verify ownership (unless admin)
  if (session.role !== 'admin' && post.app_author_id !== session.author_id) {
    return NextResponse.json({ error: 'You can only delete your own posts' }, { status: 403 });
  }

  const { error } = await supabase.from(post._table).delete().eq('slug', slug);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
