import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import type { ContentType } from '@/lib/blogsDb';
import { TABLE_MAP } from '@/lib/blogsDb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeUnpublished = searchParams.get('all') === 'true';
  const contentType = searchParams.get('type') as ContentType | null;
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
  const supabase = await createClient();

  if (includeUnpublished) {
    const cookieStore = await cookies();
    if (cookieStore.get('admin_token')?.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // If a specific type is requested, query only that table
  if (contentType && TABLE_MAP[contentType]) {
    const tableName = TABLE_MAP[contentType];
    let query = supabase.from(tableName).select('*').order('createdAt', { ascending: false });
    if (!includeUnpublished) query = query.eq('published', true);
    if (limit) query = query.limit(limit);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Tag each row with its contentType
    const tagged = (data || []).map((row: Record<string, unknown>) => ({ ...row, contentType }));
    return NextResponse.json(tagged);
  }

  // No type specified — query all three tables and merge
  const tables: { type: ContentType; table: string }[] = [
    { type: 'whats-up', table: 'whats_up' },
    { type: 'tutorial', table: 'tutorials' },
    { type: 'explainer', table: 'explainers' },
  ];

  const results = await Promise.all(
    tables.map(async ({ type, table }) => {
      let query = supabase.from(table).select('*').order('createdAt', { ascending: false });
      if (!includeUnpublished) query = query.eq('published', true);
      if (limit) query = query.limit(limit);
      const { data } = await query;
      return (data || []).map((row: Record<string, unknown>) => ({ ...row, contentType: type }));
    })
  );

  // Merge and sort by createdAt descending
  type MergedRow = Record<string, unknown> & { createdAt: string; contentType: string };
  const merged = (results.flat() as MergedRow[]).sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json(merged);
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (cookieStore.get('admin_token')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();

  try {
    const data = await request.json();
    const contentType = (data.contentType || 'explainer') as ContentType;
    const tableName = TABLE_MAP[contentType];

    if (!tableName) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    // Check slug uniqueness in the target table
    const { data: existing } = await supabase.from(tableName).select('slug').eq('slug', data.slug).single();
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    // Build row — common fields
    const newRow: Record<string, unknown> = {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt || '',
      content: data.content,
      coverImage: data.coverImage || '',
      published: data.published || false,
      author: data.author || 'AstroHub',
      publishDate: data.publishDate || null,
    };

    // Type-specific fields
    if (contentType === 'whats-up') {
      newRow.skyMonth = data.skyMonth || null;
      newRow.skyYear = data.skyYear || null;
      newRow.skyEvents = data.skyEvents || [];
      newRow.previousMonthSlug = data.previousMonthSlug || null;
    } else if (contentType === 'tutorial') {
      newRow.difficultyLevel = data.difficultyLevel || null;
      newRow.estimatedReadTime = data.estimatedReadTime || null;
      newRow.toolsNeeded = data.toolsNeeded || [];
    } else if (contentType === 'explainer') {
      newRow.topicCategory = data.topicCategory || null;
      newRow.keyConcepts = data.keyConcepts || [];
      newRow.visualAids = data.visualAids || [];
    }

    const { data: inserted, error } = await supabase.from(tableName).insert([newRow]).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ...inserted, contentType }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
