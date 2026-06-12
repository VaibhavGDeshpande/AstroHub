import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { getAdminSession } from '@/lib/auth';
import type { ContentType } from '@/lib/blogsDb';
import { TABLE_MAP } from '@/lib/blogsDb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeUnpublished = searchParams.get('all') === 'true';
  const contentType = searchParams.get('type') as ContentType | null;
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
  const supabase = await createClient();

  // Get session for author scoping
  let session = null;
  if (includeUnpublished) {
    session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // If a specific type is requested, query only that table
  if (contentType && contentType !== 'custom-series' && TABLE_MAP[contentType]) {
    const tableName = TABLE_MAP[contentType];
    let query = supabase.from(tableName).select('*').order('createdAt', { ascending: false });
    if (!includeUnpublished) {
      query = query.eq('published', true).or(`publishDate.is.null,publishDate.lte.${new Date().toISOString()}`);
    } else if (session && session.role !== 'admin') {
      query = query.eq('app_author_id', session.author_id);
    }
    if (limit) query = query.limit(limit);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const tagged = (data || []).map((row: Record<string, unknown>) => ({ ...row, contentType }));
    return NextResponse.json(tagged);
  }

  // Custom series type — query custom_series_posts with series info
  if (contentType === 'custom-series') {
    let query = supabase
      .from('custom_series_posts')
      .select('*, custom_series(name, slug)')
      .order('createdAt', { ascending: false });

    if (!includeUnpublished) {
      query = query.eq('published', true);
    } else if (session && session.role !== 'admin') {
      query = query.eq('app_author_id', session.author_id);
    }
    if (limit) query = query.limit(limit);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const tagged = (data || []).map((row: Record<string, unknown>) => {
      const series = row.custom_series as { name: string; slug: string } | null;
      return {
        ...row,
        contentType: 'custom-series',
        seriesName: series?.name,
        seriesSlug: series?.slug,
        custom_series: undefined,
      };
    });
    return NextResponse.json(tagged);
  }

  // No type specified — query all tables and merge
  const tables: { type: ContentType; table: string }[] = [
    { type: 'whats-up', table: 'whats_up' },
    { type: 'tutorial', table: 'tutorials' },
    { type: 'explainer', table: 'explainers' },
  ];

  const results = await Promise.all(
    tables.map(async ({ type, table }) => {
      let query = supabase.from(table).select('*').order('createdAt', { ascending: false });
      if (!includeUnpublished) {
        query = query.eq('published', true).or(`publishDate.is.null,publishDate.lte.${new Date().toISOString()}`);
      } else if (session && session.role !== 'admin') {
        query = query.eq('app_author_id', session.author_id);
      }
      if (limit) query = query.limit(limit);
      const { data } = await query;
      return (data || []).map((row: Record<string, unknown>) => ({ ...row, contentType: type }));
    })
  );

  // Also include custom series posts
  let csQuery = supabase
    .from('custom_series_posts')
    .select('*, custom_series(name, slug)')
    .order('createdAt', { ascending: false });

  if (!includeUnpublished) {
    csQuery = csQuery.eq('published', true);
  } else if (session && session.role !== 'admin') {
    csQuery = csQuery.eq('app_author_id', session.author_id);
  }
  if (limit) csQuery = csQuery.limit(limit);

  const { data: csPosts } = await csQuery;
  const csTagged = (csPosts || []).map((row: Record<string, unknown>) => {
    const series = row.custom_series as { name: string; slug: string } | null;
    return {
      ...row,
      contentType: 'custom-series' as const,
      seriesName: series?.name,
      seriesSlug: series?.slug,
      custom_series: undefined,
    };
  });

  // Merge and sort by createdAt descending
  type MergedRow = Record<string, unknown> & { createdAt: string; contentType: string };
  const merged = ([...results.flat(), ...csTagged] as MergedRow[]).sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json(merged);
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

  try {
    const data = await request.json();
    const contentType = (data.contentType || 'explainer') as ContentType;

    // Custom series posts go through a different path
    if (contentType === 'custom-series') {
      if (!data.series_id) {
        return NextResponse.json({ error: 'series_id is required for custom series posts' }, { status: 400 });
      }

      const { data: existing } = await supabase
        .from('custom_series_posts')
        .select('slug')
        .eq('slug', data.slug)
        .single();
      if (existing) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
      }

      const newRow = {
        series_id: data.series_id,
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt || '',
        content: data.content,
        coverImage: data.coverImage || '',
        published: data.published || false,
        author: data.author || session.display_name,
        app_author_id: session.author_id,
        publishDate: data.publishDate || null,
        metadata: data.metadata || {},
      };

      const { data: inserted, error } = await supabase
        .from('custom_series_posts')
        .insert([newRow])
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      if (data.notifySubscribers && data.published) {
        try {
          const { notifySubscribers } = await import('@/lib/sendEmail');
          const { data: subsData } = await supabase
            .from('subscriptions')
            .select('subscriber_id, subscribers(email)')
            .or(`author_id.is.null,author_id.eq.${session.author_id}`);

          if (subsData && subsData.length > 0) {
            const emails = Array.from(
              new Set(
                (subsData as unknown as { subscribers: { email: string } | { email: string }[] | null }[]).map(s => {
                  const sub = s.subscribers;
                  return Array.isArray(sub) ? sub[0]?.email : sub?.email;
                }).filter(Boolean)
              )
            ) as string[];
            const subject = `New Series Post on AstroHub: ${data.title}`;
            const content = `Hello from AstroHub!\n\nA new post titled "${data.title}" has just been published by ${data.author || session.display_name}.\n\nRead it now at AstroHub!\n\n${data.excerpt || ''}`;
            notifySubscribers(emails, subject, content).catch(console.error);
          }
        } catch (err) {
          console.error("Failed to send notifications:", err);
        }
      }

      return NextResponse.json({ ...inserted, contentType: 'custom-series' }, { status: 201 });
    }

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
      author: data.author || session.display_name,
      app_author_id: session.author_id,
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

    if (data.notifySubscribers && data.published) {
      try {
        const { notifySubscribers } = await import('@/lib/sendEmail');
        
        // Fetch all generic subscribers and subscribers specifically for this author
        const { data: subsData } = await supabase
          .from('subscriptions')
          .select('subscriber_id, subscribers(email)')
          .or(`author_id.is.null,author_id.eq.${session.author_id}`);

        if (subsData && subsData.length > 0) {
          const emails = Array.from(
            new Set(
              (subsData as unknown as { subscribers: { email: string } | { email: string }[] | null }[]).map(s => {
                const sub = s.subscribers;
                return Array.isArray(sub) ? sub[0]?.email : sub?.email;
              }).filter(Boolean)
            )
          ) as string[];
          const subject = `New Post on AstroHub: ${data.title}`;
          const content = `Hello from AstroHub!\n\nA new post titled "${data.title}" has just been published by ${data.author || session.display_name}.\n\nRead it now at AstroHub!\n\n${data.excerpt || ''}`;
          
          // Send emails asynchronously
          notifySubscribers(emails, subject, content).catch(console.error);
        }
      } catch (err) {
        console.error("Failed to send notifications:", err);
      }
    }

    return NextResponse.json({ ...inserted, contentType }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
