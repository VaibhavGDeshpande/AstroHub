import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/server';
import { getAdminSession } from '@/lib/auth';

const isAdmin = async () => (await getAdminSession())?.role === 'admin';

// Approve a submission so it appears on /gallery.
export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  const { data, error } = await createAdminClient()
    .from('gallery_submissions')
    .update({ status: 'approved', approved_at: new Date().toISOString() })
    .eq('id', id)
    .select('id')
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  revalidatePath('/gallery');
  return NextResponse.json({ ok: true });
}

// Reject (or take down) a submission: removes the row and its image file.
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: row } = await supabase.from('gallery_submissions').select('image_path').eq('id', id).maybeSingle();
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { error } = await supabase.from('gallery_submissions').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await supabase.storage.from('blog-images').remove([row.image_path]);

  revalidatePath('/gallery');
  return NextResponse.json({ ok: true });
}
