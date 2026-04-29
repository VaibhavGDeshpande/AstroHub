import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeUnpublished = searchParams.get('all') === 'true';
  const supabase = await createClient();

  if (includeUnpublished) {
    // Basic auth check for admin fetching all
    const cookieStore = await cookies();
    if (cookieStore.get('admin_token')?.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Fetch all blogs
    const { data: allBlogs, error } = await supabase
      .from('blogs')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(allBlogs);
  }
  
  // Public users only see published blogs
  const { data: publishedBlogs, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('published', true)
    .order('createdAt', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(publishedBlogs);
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (cookieStore.get('admin_token')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();

  try {
    const data = await request.json();
    
    // Check if slug exists
    const { data: existingBlog } = await supabase
      .from('blogs')
      .select('slug')
      .eq('slug', data.slug)
      .single();

    if (existingBlog) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const newBlog = {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt || '',
      content: data.content,
      coverImage: data.coverImage || '',
      published: data.published || false,
    };

    const { data: insertedBlog, error } = await supabase
      .from('blogs')
      .insert([newBlog])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(insertedBlog, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
