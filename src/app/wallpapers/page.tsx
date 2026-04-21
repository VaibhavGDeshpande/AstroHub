import WallpaperGallery from '@/components/Wallpapers/WallpaperGallery';
import LoaderWrapper from '@/components/Loader';

export default function WallpapersPage() {
  return (
    <main className="min-h-screen bg-black">
      <LoaderWrapper>
      <WallpaperGallery />
      </LoaderWrapper>
    </main>
  );
}
