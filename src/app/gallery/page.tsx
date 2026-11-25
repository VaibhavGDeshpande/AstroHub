import Link from 'next/link';
import type { Metadata } from 'next';
import { Upload } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import PageShell from '@/components/PageShell';
import PhotoCard, { type GalleryPhoto } from '@/components/Gallery/PhotoCard';

export const metadata: Metadata = {
  title: 'Astrophotography Gallery',
  description: 'Deep-sky, planetary and nightscape photos from the AstroHub community, with the telescope, camera and exposure details behind each shot.',
  openGraph: {
    title: 'Astrophotography Gallery | AstroHub',
    description: 'Community astrophotos with full equipment and exposure details.',
    images: ['/opengraph-image'],
  },
};

// Approving or removing a photo revalidates this path; the timer is only a fallback.
export const revalidate = 3600;

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('gallery_submissions')
    .select('id, title, photographer, image_url, width, height, target, telescope, camera, mount, exposure, location, captured_on, description')
    .eq('status', 'approved')
    .order('approved_at', { ascending: false })
    .limit(120);
  const photos = (data ?? []) as GalleryPhoto[];

  return (
    <PageShell
      title="Astrophotography Gallery"
      subtitle="Shots from the AstroHub community, with the gear and settings behind each one so you can try them yourself."
      width="max-w-7xl"
    >
      <div className="flex justify-center -mt-4 mb-10">
        <Link
          href="/gallery/submit"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
        >
          <Upload className="w-4 h-4" aria-hidden /> Submit your photo
        </Link>
      </div>

      {error && <p className="text-red-400 text-center">The gallery could not be loaded right now. Please try again later.</p>}

      {!error && photos.length === 0 && (
        <div className="max-w-xl mx-auto text-center py-16 px-6 bg-slate-800/50 backdrop-blur-sm border border-slate-600/40 rounded-lg">
          <p className="text-gray-200 text-lg">No photos yet.</p>
          <p className="text-slate-400 mt-2">
            Be the first: <Link href="/gallery/submit" className="text-blue-400 hover:underline">submit your astrophoto</Link>.
          </p>
        </div>
      )}

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
        {photos.map((photo) => <PhotoCard key={photo.id} photo={photo} />)}
      </div>
    </PageShell>
  );
}
