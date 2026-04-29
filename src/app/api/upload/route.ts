import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  // Verify admin auth
  const cookieStore = await cookies();
  if (cookieStore.get('admin_token')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
    }

    const supabase = await createClient();

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;

    // Upload to Supabase Storage bucket named 'blog-images'
    const { error } = await supabase.storage
      .from('blog-images')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Supabase storage upload error:', error);
      return NextResponse.json({ error: 'Upload to Supabase failed' }, { status: 500 });
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filename);

    return NextResponse.json({ url: publicUrl }, { status: 201 });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
