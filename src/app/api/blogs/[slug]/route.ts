import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: blog, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error || !blog) {
    return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
  }

  // If unpublished, require admin auth
  if (!blog.published) {
    const cookieStore = await cookies();
    if (cookieStore.get('admin_token')?.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.json(blog);
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const cookieStore = await cookies();
  if (cookieStore.get('admin_token')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await params;
  const data = await request.json();
  const supabase = await createClient();

  const updateData = {
    ...data,
    slug: data.slug || slug, // Allow changing slug
    updatedAt: new Date().toISOString()
  };

  const { data: updatedBlog, error } = await supabase
    .from('blogs')
    .update(updateData)
    .eq('slug', slug)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(updatedBlog);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const cookieStore = await cookies();
  if (cookieStore.get('admin_token')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await params;
  const supabase = await createClient();

  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('slug', slug);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
