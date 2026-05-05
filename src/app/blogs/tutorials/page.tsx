"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { Blog, DifficultyLevel } from "@/lib/blogsDb";
import { Calendar, Clock, ArrowRight, ArrowLeft, BookOpen, Star } from "lucide-react";
import LoaderWrapper from "@/components/Loader";


const LEVELS: { value: DifficultyLevel | "all"; label: string }[] = [
  { value: "all", label: "All Levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const diffColors: Record<string, string> = {
  beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  advanced: "bg-red-500/10 text-red-400 border-red-500/20",
};

function getReadingTime(text: string) {
  return Math.ceil(text.trim().split(/\s+/).length / 200);
}

export default function TutorialsPage() {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<DifficultyLevel | "all">("all");

  useEffect(() => {
    fetch("/api/blogs?type=tutorial")
      .then((r) => r.json())
      .then((d) => setPosts(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? posts : posts.filter((p) => p.difficultyLevel === filter);

  return (
    <LoaderWrapper>
    <div className="min-h-screen bg-slate-950 text-slate-200 pt-32 pb-24 md:pt-40 px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-emerald-900/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <Link href="/blogs" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Blog
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400"><BookOpen className="w-6 h-6" /></div>
          <h1 className="text-3xl md:text-5xl font-bold text-white">Tutorials</h1>
        </div>
        <p className="text-lg text-slate-400 mb-10 max-w-2xl">Step-by-step guides for amateur astronomers of all levels.</p>

        {/* Filter Bar */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2">
          {LEVELS.map((lvl) => (
            <button
              key={lvl.value}
              onClick={() => setFilter(lvl.value)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                filter === lvl.value ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700"
              }`}
            >
              {lvl.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading tutorials...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500 border border-slate-800 rounded-3xl bg-slate-900/50">
            <p>No tutorials found{filter !== "all" ? ` for ${filter} level` : ""}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <Link key={post.id} href={`/blogs/${post.slug}`} className="group flex flex-col bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all duration-300">
                <div className="relative h-44 w-full overflow-hidden bg-slate-800">
                  {post.coverImage ? (
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Star className="w-10 h-10 text-slate-700" /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                  {post.difficultyLevel && (
                    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold border ${diffColors[post.difficultyLevel]}`}>
                      {post.difficultyLevel.charAt(0).toUpperCase() + post.difficultyLevel.slice(1)}
                    </span>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.estimatedReadTime || getReadingTime(post.content)} min</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2 flex-grow">{post.excerpt}</p>
                  {post.toolsNeeded && post.toolsNeeded.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.toolsNeeded.slice(0, 3).map((t, i) => (
                        <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">{t}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400 mt-auto">
                    Start learning <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
    </LoaderWrapper>
  );
}
