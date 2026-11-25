import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Offline',
  robots: { index: false, follow: false },
};

// Shown by the service worker when a page was never cached and there is no signal.
export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center px-4">
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="absolute top-10 left-20 w-80 h-80 bg-purple-500/20 blur-[120px]" />
        <div className="absolute bottom-10 right-20 w-72 h-72 bg-blue-500/20 blur-[100px]" />
      </div>
      <div className="max-w-md text-center bg-slate-800/50 backdrop-blur-sm border border-slate-600/40 rounded-lg p-8">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-3">You&apos;re offline</h1>
        <p className="text-slate-400 mb-8">
          This page hasn&apos;t been saved on this device yet. The live sky chart and any page you&apos;ve opened before still work without a connection.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/sky-chart" className="px-5 py-3 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold shadow-md">
            Open the sky chart
          </Link>
          <Link href="/" className="px-5 py-3 rounded-lg bg-slate-900/50 border border-slate-600/40 text-gray-200 hover:bg-slate-700/50 transition-colors">
            Try the homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
