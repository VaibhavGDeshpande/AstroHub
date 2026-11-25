import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit an Astrophoto',
  description: 'Share your astrophotography and the gear behind it in the AstroHub community gallery.',
};

export default function GallerySubmitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
