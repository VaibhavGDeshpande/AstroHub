// app/mars-photos/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NASA Mars Rover Photos | Explore the Red Planet',
  description:
    "Discover stunning images captured by NASA's Mars rovers including Curiosity, Opportunity, and Spirit. Browse photos by date, camera, and mission to explore Mars like never before.",
  keywords: ['NASA', 'Mars rover', 'Curiosity', 'Opportunity', 'Spirit', 'Mars photos', 'space exploration', 'red planet', 'JPL'],
  openGraph: {
    title: 'NASA Mars Rover Photos | Explore the Red Planet',
    description:
      "Discover stunning images captured by NASA's Mars rovers including Curiosity, Opportunity, and Spirit.",
    url: 'https://yourdomain.com/mars-photos',
    siteName: 'NASA Mars Explorer',
    images: [
      {
        url: '/mars-photos-og.png', // Replace with your Open Graph preview
        width: 1200,
        height: 630,
        alt: 'NASA Mars Rover Photos',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NASA Mars Rover Photos | Explore the Red Planet',
    description:
      "Discover stunning images captured by NASA's Mars rovers including Curiosity, Opportunity, and Spirit.",
    images: ['/mars-photos-twitter.png'], // Replace with your Twitter preview
  },
};

export default function MarsPhotosLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50">
      {children}
    </main>
  );
}
