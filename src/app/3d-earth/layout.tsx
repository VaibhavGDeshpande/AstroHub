// app/3d-earth/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '3D Earth Explorer | Interactive Earth Visualization',
  description: 'Explore Earth in stunning 3D with interactive visualization. View real-time satellite imagery, terrain data, and atmospheric conditions from space.',
  keywords: ['3D Earth', 'Earth visualization', 'satellite imagery', 'terrain', 'atmosphere', 'space view', 'interactive'],
  authors: [{ name: 'AstroHub' }],
  openGraph: {
    title: '3D Earth Explorer | Interactive Earth Visualization',
    description: 'Explore Earth in stunning 3D with interactive visualization and real-time satellite imagery.',
    type: 'website',
    images: [
      {
        url: '/assets/AstroHub.png',
        width: 1200,
        height: 630,
        alt: '3D Earth Explorer Preview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: '3D Earth Explorer',
    description: 'Explore Earth in stunning 3D with interactive visualization.',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function Earth3DLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="earth-3d-layout">
      {children}
    </div>
  )
}
