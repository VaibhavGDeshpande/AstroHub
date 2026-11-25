import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { createAdminClient } from '@/lib/supabase/server';
import { getAdminSession } from '@/lib/auth';

export const runtime = 'nodejs';

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const MAX_EDGE_PX = 2560;
const BUCKET = 'blog-images';

// Field name -> max length. title and photographer are required.
const TEXT_FIELDS = {
  title: 120,
  photographer: 80,
  target: 120,
  telescope: 160,
  camera: 160,
  mount: 160,
  exposure: 200,
  location: 120,
  description: 1500,
} as const;

// Admin moderation queue: pending submissions, oldest first.
export async function GET() {
  const session = await getAdminSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { data, error } = await createAdminClient()
    .from('gallery_submissions')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// Public submission. Nothing is shown on the site until an admin approves it.
// shortcut: spam is stopped only by the honeypot and moderation; add a per-IP rate limit (e.g. a Vercel Firewall rule on POST /api/gallery) if junk arrives
export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  // Honeypot: a hidden field people never fill. Pretend success so bots don't retry.
  if (String(form.get('website') || '').trim()) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const fields: Record<string, string | null> = {};
  for (const [name, max] of Object.entries(TEXT_FIELDS)) {
    const value = String(form.get(name) ?? '').trim();
    if (value.length > max) {
      return NextResponse.json({ error: `${name} must be ${max} characters or fewer` }, { status: 400 });
    }
    fields[name] = value || null;
  }
  if (!fields.title || !fields.photographer) {
    return NextResponse.json({ error: 'Title and your name are required' }, { status: 400 });
  }

  const capturedOn = String(form.get('captured_on') ?? '').trim();
  if (capturedOn && (!/^\d{4}-\d{2}-\d{2}$/.test(capturedOn) || Number.isNaN(Date.parse(capturedOn)))) {
    return NextResponse.json({ error: 'Capture date must be a valid date' }, { status: 400 });
  }

  if (form.get('consent') !== 'on') {
    return NextResponse.json({ error: 'Please confirm you took this photo and agree to it being shown' }, { status: 400 });
  }

  const file = form.get('image');
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: 'Please attach an image' }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: 'Image must be 15 MB or smaller' }, { status: 413 });
  }

  // Re-encoding proves the file really is an image, drops all metadata (EXIF GPS can reveal a home address)
  // and keeps files a sensible size. SVG and anything sharp can't decode are refused.
  let jpeg: { data: Buffer; info: sharp.OutputInfo };
  try {
    jpeg = await sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 100_000_000 })
      .rotate()
      .resize({ width: MAX_EDGE_PX, height: MAX_EDGE_PX, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 88, mozjpeg: true })
      .toBuffer({ resolveWithObject: true });
  } catch {
    return NextResponse.json({ error: 'That file could not be read as a JPEG, PNG, WebP or TIFF image' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const path = `gallery/${crypto.randomUUID()}.jpg`;
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, jpeg.data, { contentType: 'image/jpeg', cacheControl: '31536000', upsert: false });
  if (uploadError) {
    console.error('Gallery upload failed:', uploadError);
    return NextResponse.json({ error: 'Upload failed, please try again' }, { status: 500 });
  }
  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);

  const { error: insertError } = await supabase.from('gallery_submissions').insert({
    ...fields,
    captured_on: capturedOn || null,
    image_url: publicUrl,
    image_path: path,
    width: jpeg.info.width,
    height: jpeg.info.height,
  });
  if (insertError) {
    console.error('Gallery insert failed:', insertError);
    await supabase.storage.from(BUCKET).remove([path]); // don't leave an orphaned file
    return NextResponse.json({ error: 'Could not save your submission, please try again' }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
