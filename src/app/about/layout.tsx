// app/about/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About AstroHub | Space Exploration Platform',
  description: 'Learn about AstroHub, the comprehensive space exploration platform providing access to NASA APIs, 3D visualizations, and professional astronomy tools.',
  keywords: ['about AstroHub', 'space platform', 'NASA APIs', 'astronomy tools', 'space exploration', 'mission'],
  authors: [{ name: 'AstroHub Team' }],
  openGraph: {
    title: 'About AstroHub | Space Exploration Platform',
    description: 'Learn about AstroHub, the comprehensive space exploration platform with NASA APIs and astronomy tools.',
    type: 'website',
    images: [
      {
        url: '/assets/AstroHub.png',
        width: 1200,
        height: 630,
        alt: 'About AstroHub Preview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About AstroHub',
    description: 'Learn about AstroHub, the comprehensive space exploration platform.',
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

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="about-layout">
      {children}
    </div>
  )
}

