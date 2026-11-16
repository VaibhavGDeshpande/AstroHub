import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { getAdminSession } from '@/lib/auth';

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
    }

    // SVG can carry scripts, so it is refused even though it is an image type
    if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
      return NextResponse.json({ error: 'Only image files can be uploaded' }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: 'Image must be 10 MB or smaller' }, { status: 413 });
    }

    const supabase = createAdminClient();

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
