import Link from "next/link";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Blog } from "@/lib/blogsDb";
import { User, FileText, ArrowRight, Users } from "lucide-react";
import LoaderWrapper from "@/components/Loader";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Authors | AstroHub Transmission",
  description: "Meet the writers behind AstroHub Transmission — astronomers, educators, and space enthusiasts sharing their knowledge of the cosmos.",
  openGraph: {
    title: "Authors | AstroHub Transmission",
    description: "Meet the writers behind AstroHub Transmission.",
    images: ["/assets/AstroHub.avif"],
  },
};

interface AuthorSummary {
  name: string;
  postCount: number;
  latestPost: Blog;
  contentTypes: Set<string>;
}

export default async function AuthorsPage() {
  const supabase = await createClient();

  // Fetch published posts from all three tables
  const [whatsUpRes, tutorialsRes, explainersRes] = await Promise.all([
    supabase.from("whats_up").select("*").eq("published", true).order("createdAt", { ascending: false }),
    supabase.from("tutorials").select("*").eq("published", true).order("createdAt", { ascending: false }),
    supabase.from("explainers").select("*").eq("published", true).order("createdAt", { ascending: false }),
  ]);

  const allBlogs: Blog[] = [
    ...(whatsUpRes.data || []).map((r) => ({ ...r, contentType: "whats-up" as const })),
    ...(tutorialsRes.data || []).map((r) => ({ ...r, contentType: "tutorial" as const })),
    ...(explainersRes.data || []).map((r) => ({ ...r, contentType: "explainer" as const })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as Blog[];

  // Group by author
  const authorMap = new Map<string, AuthorSummary>();
  for (const blog of allBlogs) {
    const authorName = blog.author?.trim() || "AstroHub";
    if (!authorMap.has(authorName)) {
      authorMap.set(authorName, {
        name: authorName,
        postCount: 0,
        latestPost: blog,
        contentTypes: new Set(),
      });
    }
    const entry = authorMap.get(authorName)!;
    entry.postCount++;
    entry.contentTypes.add(blog.contentType);
  }

  const authors = Array.from(authorMap.values()).sort((a, b) => b.postCount - a.postCount);

  const typeLabels: Record<string, string> = {
    "whats-up": "Eyes on the Sky",
    tutorial: "Tutorials",
    explainer: "Explainers",
  };

  return (
    <LoaderWrapper>
      <div className="min-h-screen bg-slate-950 text-slate-200 pb-24 relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-900/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Header */}
        <div className="max-w-4xl mx-auto px-4 pt-28 md:pt-36 pb-16 relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Users className="w-7 h-7 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Our Authors</h1>
              <p className="text-slate-400 mt-1">The minds behind AstroHub Transmission</p>
            </div>
          </div>

          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
            Meet the astronomers, educators, and space enthusiasts who write for AstroHub.
            Each author brings their unique perspective on the cosmos.
          </p>
        </div>

        {/* Authors Grid */}
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          {authors.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-lg border border-slate-800 rounded-3xl bg-slate-900/50 backdrop-blur-sm">
              <p>No authors found yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {authors.map((author) => (
                <Link
                  key={author.name}
                  href={`/authors/${encodeURIComponent(author.name)}`}
                  className="group block bg-slate-900/60 border border-slate-800/60 rounded-3xl p-6 hover:border-indigo-500/30 hover:bg-slate-900/80 transition-all duration-300"
                >
                  {/* Author Header */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:border-indigo-500/40 transition-colors shrink-0">
                      <User className="w-7 h-7" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                        {author.name}
                      </h2>
                      <p className="text-sm text-slate-500">
                        {author.postCount} {author.postCount === 1 ? "article" : "articles"} published
                      </p>
                    </div>
                  </div>

                  {/* Content Types */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {Array.from(author.contentTypes).map((type) => {
                      const colors: Record<string, string> = {
                        "whats-up": "bg-blue-500/10 text-blue-400 border-blue-500/20",
                        tutorial: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                        explainer: "bg-purple-500/10 text-purple-400 border-purple-500/20",
                      };
                      return (
                        <span
                          key={type}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${colors[type] || "bg-slate-800 text-slate-400 border-slate-700"}`}
                        >
                          {typeLabels[type] || type}
                        </span>
                      );
                    })}
                  </div>

                  {/* Latest Post Preview */}
                  <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/40">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Latest article</span>
                    </div>
                    <p className="text-sm text-slate-300 font-medium line-clamp-2 leading-relaxed">
                      {author.latestPost.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      {new Date(author.latestPost.publishDate || author.latestPost.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-end gap-2 mt-5 text-sm font-medium text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    View profile <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
