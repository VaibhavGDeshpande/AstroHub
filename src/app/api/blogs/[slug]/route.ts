import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import type { ContentType } from '@/lib/blogsDb';
import { TABLE_MAP } from '@/lib/blogsDb';

// Helper: find which table a slug belongs to
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
    const cookieStore = await cookies();
    if (cookieStore.get('admin_token')?.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.json(post);
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const cookieStore = await cookies();
  if (cookieStore.get('admin_token')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await params;
  const data = await request.json();
  const supabase = await createClient();

  const contentType = (data.contentType || 'explainer') as ContentType;
  const tableName = TABLE_MAP[contentType];

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
  const cookieStore = await cookies();
  if (cookieStore.get('admin_token')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await params;
  const supabase = await createClient();

  // Find which table the slug belongs to and delete from there
  const post = await findPostBySlug(supabase, slug);
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  const { error } = await supabase.from(post._table).delete().eq('slug', slug);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
