// app/example/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Examples | AstroHub API Usage',
  description: 'Explore examples and demonstrations of AstroHub features. Learn how to use NASA APIs, 3D visualizations, and astronomy tools effectively.',
  keywords: ['AstroHub examples', 'NASA API examples', 'space visualization examples', 'astronomy tools demo', 'tutorials'],
  authors: [{ name: 'AstroHub Team' }],
  openGraph: {
    title: 'Examples | AstroHub API Usage',
    description: 'Explore examples and demonstrations of AstroHub features and NASA APIs.',
    type: 'website',
    images: [
      {
        url: '/assets/AstroHub.png',
        width: 1200,
        height: 630,
        alt: 'AstroHub Examples Preview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AstroHub Examples',
    description: 'Explore examples and demonstrations of AstroHub features.',
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

export default function ExampleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="example-layout">
      {children}
    </div>
  )
}

