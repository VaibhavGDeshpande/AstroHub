// app/3d-mars/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '3D Mars Explorer | Interactive Mars Visualization',
  description: 'Explore Mars in stunning 3D with interactive visualization. View Martian terrain, rover landing sites, and geological features from the Red Planet.',
  keywords: ['3D Mars', 'Mars visualization', 'Martian terrain', 'Mars rovers', 'Red Planet', 'space exploration', 'interactive'],
  authors: [{ name: 'AstroHub' }],
  openGraph: {
    title: '3D Mars Explorer | Interactive Mars Visualization',
    description: 'Explore Mars in stunning 3D with interactive visualization and Martian terrain data.',
    type: 'website',
    images: [
      {
        url: '/assets/AstroHub.avif',
        width: 1200,
        height: 630,
        alt: '3D Mars Explorer Preview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: '3D Mars Explorer',
    description: 'Explore Mars in stunning 3D with interactive visualization.',
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

export default function Mars3DLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mars-3d-layout">
      {children}
    </div>
  )
}

