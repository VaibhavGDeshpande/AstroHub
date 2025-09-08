// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EPIC Earth Observatory | NASA Earth Images',
  description: 'View daily Earth images from NASA\'s DSCOVR satellite at the L1 Lagrange point. Interactive zoom and date selection for Earth observation.',
  keywords: ['NASA', 'Earth images', 'DSCOVR', 'EPIC', 'satellite imagery'],
  viewport: 'width=device-width, initial-scale=1',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full">
      <body 
        className={`
          h-full
          antialiased 
          bg-gradient-to-br 
          from-slate-900 
          via-blue-900 
          to-indigo-900 
          text-white
          overflow-x-hidden
        `}
      >
        {children}
      </body>
    </html>
  );
}
