// app/epic/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NASA EPIC | Daily Earth Images',
  description:
    "Explore daily Earth images captured by NASA's DSCOVR EPIC camera at the L1 Lagrange point. Browse by date and view our planet from space.",
  keywords: ['NASA', 'EPIC', 'Earth images', 'DSCOVR', 'satellite', 'space'],
  openGraph: {
    title: 'NASA EPIC | Daily Earth Images',
    description:
      "Explore daily Earth images captured by NASA's DSCOVR EPIC camera at the L1 Lagrange point.",
    url: 'https://yourdomain.com/epic',
    siteName: 'NASA EPIC Explorer',
    images: [
      {
        url: '/epic-og.png', // Replace with your Open Graph preview
        width: 1200,
        height: 630,
        alt: 'NASA EPIC Earth Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NASA EPIC | Daily Earth Images',
    description:
      "Explore daily Earth images captured by NASA's DSCOVR EPIC camera at the L1 Lagrange point.",
    images: ['/epic-twitter.png'], // Replace with your Twitter preview
  },
};

export default function EpicLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen">
      {children}
    </main>
  );
}
