'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, X } from 'lucide-react';
import type { Blog } from '@/lib/blogsDb';

export default function LatestBlogBanner() {
  const [latestPost, setLatestPost] = useState<Blog | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    fetch('/api/blogs?limit=1')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setLatestPost(data[0]);
        }
      })
      .catch(err => console.error("Error fetching latest post:", err));
  }, []);

  if (!latestPost || !isVisible) return null;

  const typeLabels: Record<string, string> = {
    'whats-up': 'Eyes on the Sky',
    'tutorial': 'Tutorial',
    'explainer': 'Explainer'
  };

  // const label = typeLabels[latestPost.contentType] || 'Blog';

  return (
    <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl animate-in fade-in slide-in-from-top-10 duration-700">
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 rounded-full p-[2px] shadow-lg shadow-blue-500/20">
        <div className="flex items-center justify-between px-3 py-2 sm:px-5 sm:py-2.5 bg-slate-950/90 backdrop-blur-xl rounded-full">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 shrink-0">
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 overflow-hidden">
              <span className="text-[10px] sm:text-xs font-bold text-blue-300 uppercase tracking-wider shrink-0">
                Latest Uploaded:
              </span>
              <span className="text-sm font-medium text-white truncate max-w-[150px] sm:max-w-xs">
                {latestPost.title}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0 pl-3">
            <Link 
              href={`/blogs/${latestPost.slug}`}
              className="flex items-center gap-1.5 text-[10px] sm:text-sm font-bold text-slate-900 bg-white hover:bg-slate-200 px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-full transition-colors whitespace-nowrap"
            >
              Check it out <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-slate-400 hover:text-white transition-colors p-1"
              aria-label="Close banner"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
