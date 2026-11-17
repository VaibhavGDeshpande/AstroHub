import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Sky Chart | What\'s Overhead Right Now',
  description: 'Interactive star chart centered on the sky above your location right now, with constellations, bright stars and deep-sky objects.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
