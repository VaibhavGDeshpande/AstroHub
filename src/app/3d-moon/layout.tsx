import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Moon Viewer - Interactive 3D Lunar Explorer',
  description: 'Explore the Moon in 3D with detailed terrain, Apollo landing sites, and lunar features using Cesium.js technology.',
  keywords: ['Moon', '3D', 'Cesium', 'Apollo', 'Lunar', 'Space Exploration'],
  openGraph: {
    title: 'Moon Viewer - Interactive 3D Lunar Explorer',
    description: 'Explore the Moon in 3D with detailed terrain and Apollo landing sites',
    type: 'website',
  },
};

export default function MoonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="moon-viewer-app">
      {children}
    </div>
  );
}
