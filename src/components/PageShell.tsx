import Link from 'next/link';
import { ArrowLeftIcon, HomeIcon } from '@heroicons/react/24/outline';
import SectionTitle from '@/components/SectionTitle';

// The page frame used by APOD, Space Quiz and the other tool pages: black sky, soft glows,
// a Back button on desktop and the gradient section title.
export default function PageShell({
  title,
  subtitle,
  backHref = '/',
  backLabel = 'Back',
  width = 'max-w-5xl',
  children,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  width?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="absolute top-10 left-20 w-80 h-80 bg-purple-500/20 blur-[120px]" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500/20 blur-[100px]" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-40 bg-pink-500/20 blur-[100px]" />
      </div>

      <div className="fixed top-4 left-4 z-50 hidden md:block">
        <Link
          href={backHref}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/40 backdrop-blur-sm transition duration-300 text-sm"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          {backHref === '/' && <HomeIcon className="h-4 w-4 hidden sm:block" />}
          <span>{backLabel}</span>
        </Link>
      </div>

      <div className={`${width} mx-auto px-4 sm:px-6 lg:px-10 pt-24 pb-16`}>
        <SectionTitle title={title} subtitle={subtitle} />
        {children}
      </div>
    </main>
  );
}
