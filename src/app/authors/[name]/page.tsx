import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Blog } from "@/lib/blogsDb";
import { User, Clock, ArrowLeft, Star, Telescope, BookOpen, Lightbulb, FileText } from "lucide-react";
import LoaderWrapper from "@/components/Loader";

export const revalidate = 0;

function getReadingTime(text: string | null | undefined) {
  if (!text || typeof text !== "string") return 1;
  return Math.ceil(text.trim().split(/\s+/).length / 200);
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  return {
    title: `${decodedName} | AstroHub Authors`,
    description: `Read articles written by ${decodedName} on AstroHub Transmission — astronomy, space, and stargazing.`,
    openGraph: {
      title: `${decodedName} — AstroHub Author`,
      description: `Explore all articles by ${decodedName}.`,
      images: ["/assets/AstroHub.avif"],
    },
  };
}

export default async function AuthorProfilePage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  const supabase = await createClient();

  // Fetch all published posts by this author from all three tables
  const [whatsUpRes, tutorialsRes, explainersRes] = await Promise.all([
    supabase.from("whats_up").select("*").eq("published", true).ilike("author", decodedName).order("createdAt", { ascending: false }),
    supabase.from("tutorials").select("*").eq("published", true).ilike("author", decodedName).order("createdAt", { ascending: false }),
    supabase.from("explainers").select("*").eq("published", true).ilike("author", decodedName).order("createdAt", { ascending: false }),
  ]);

  const allBlogs: Blog[] = [
    ...(whatsUpRes.data || []).map((r) => ({ ...r, contentType: "whats-up" as const })),
    ...(tutorialsRes.data || []).map((r) => ({ ...r, contentType: "tutorial" as const })),
    ...(explainersRes.data || []).map((r) => ({ ...r, contentType: "explainer" as const })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as Blog[];

  if (allBlogs.length === 0) notFound();

  // Stats
  const totalArticles = allBlogs.length;
  const contentTypeCounts = {
    "whats-up": allBlogs.filter((b) => b.contentType === "whats-up").length,
    tutorial: allBlogs.filter((b) => b.contentType === "tutorial").length,
    explainer: allBlogs.filter((b) => b.contentType === "explainer").length,
  };
  const firstPostDate = new Date(allBlogs[allBlogs.length - 1].createdAt);
  const latestPostDate = new Date(allBlogs[0].publishDate || allBlogs[0].createdAt);

  const typeConfig = {
    "whats-up": { label: "Eyes on the Sky", icon: Telescope, color: "blue" },
    tutorial: { label: "Tutorial", icon: BookOpen, color: "emerald" },
    explainer: { label: "Explainer", icon: Lightbulb, color: "purple" },
  };

  const typeColors: Record<string, string> = {
    "whats-up": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    tutorial: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    explainer: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };

  return (
    <LoaderWrapper>
      <div className="min-h-screen bg-slate-950 text-slate-200 pb-24 relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-900/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Author Profile Header */}
        <div className="max-w-3xl mx-auto px-4 pt-28 md:pt-36 pb-6 relative z-10">
          <Link
            href="/authors"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-8 group w-fit"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> All Authors
          </Link>

          {/* Profile Card */}
          <div className="bg-slate-900/60 border border-slate-800/60 rounded-3xl p-8 mb-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-blue-500/20 border-2 border-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                <User className="w-12 h-12" />
              </div>

              {/* Name & Meta */}
              <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">{decodedName}</h1>
                <p className="text-slate-400 text-base mb-4">
                  Contributing to AstroHub since{" "}
                  {firstPostDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </p>

                {/* Content Type Badges */}
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {Object.entries(contentTypeCounts)
                    .filter(([, count]) => count > 0)
                    .map(([type, count]) => {
                      const cfg = typeConfig[type as keyof typeof typeConfig];
                      const Icon = cfg.icon;
                      return (
                        <span
                          key={type}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${typeColors[type]}`}
                        >
                          <Icon className="w-3.5 h-3.5" /> {count} {cfg.label}
                        </span>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Stats Strip */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Articles", value: totalArticles, icon: FileText },
                {
                  label: "Latest Post",
                  value: latestPostDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
                  icon: Clock,
                },
                {
                  label: "Writing Since",
                  value: firstPostDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
                  icon: Star,
                },
              ].map((stat) => (
                <div key={stat.label} className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/40 text-center">
                  <stat.icon className="w-4 h-4 text-slate-500 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Articles List */}
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <h2 className="text-2xl font-bold text-white mb-8">
            Articles by {decodedName}
          </h2>

          <div className="space-y-0 divide-y divide-slate-800/50">
            {allBlogs.map((blog) => {
              const cfg = typeConfig[blog.contentType] || typeConfig.explainer;
              const Icon = cfg.icon;
              return (
                <Link
                  key={blog.id}
                  href={`/blogs/${blog.slug}`}
                  className="group block py-7 hover:bg-slate-900/20 transition-colors px-2 md:px-6 -mx-2 md:-mx-6 rounded-2xl"
                >
                  <div className="flex flex-col-reverse md:flex-row gap-5 md:gap-10 items-start justify-between">
                    {/* Text Content */}
                    <div className="flex-1 space-y-3 w-full">
                      {/* Meta Row */}
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${typeColors[blog.contentType]}`}>
                          <Icon className="w-3 h-3" /> {cfg.label}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span>
                          {new Date(blog.publishDate || blog.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl md:text-2xl font-extrabold text-slate-100 group-hover:text-indigo-400 transition-colors leading-tight line-clamp-2">
                        {blog.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 hidden sm:block">
                        {blog.excerpt}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center gap-4 text-xs font-medium text-slate-500 pt-2">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> {blog.estimatedReadTime || getReadingTime(blog.content)} min read
                        </span>
                        {blog.contentType === "tutorial" && blog.difficultyLevel && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-800/50 border border-slate-700/50">
                            {blog.difficultyLevel.charAt(0).toUpperCase() + blog.difficultyLevel.slice(1)}
                          </span>
                        )}
                        {blog.contentType === "explainer" && blog.topicCategory && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-800/50 border border-slate-700/50">
                            {blog.topicCategory}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Thumbnail */}
                    <div className="w-full md:w-32 lg:w-44 shrink-0">
                      <div className="aspect-[2/1] md:aspect-[4/3] rounded-xl overflow-hidden bg-slate-800 border border-slate-700/50 relative">
                        {blog.coverImage ? (
                          <img
                            src={blog.coverImage}
                            alt={blog.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Star className="w-8 h-8 text-slate-600 opacity-50" />
                          </div>
                        )}
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Back Link */}
          <div className="mt-16 pt-8 border-t border-slate-800 text-center">
            <Link
              href="/authors"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-white font-medium transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> All Authors
            </Link>
          </div>
        </div>
      </div>
    </LoaderWrapper>
  );
}
