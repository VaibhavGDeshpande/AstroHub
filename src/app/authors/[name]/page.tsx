import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Author, Blog, ContentType } from "@/lib/blogsDb";
import { ArrowLeft, BookOpen, Clock, FileText, Lightbulb, Sparkles, Star, Telescope, User } from "lucide-react";
import LoaderWrapper from "@/components/Loader";

export const revalidate = 0;

type PublicAuthor = Pick<Author, "id" | "name" | "display_name" | "avatar_url" | "created_at">;

const typeConfig = {
  "whats-up": { label: "Eyes on the Sky", icon: Telescope },
  tutorial: { label: "Tutorial", icon: BookOpen },
  explainer: { label: "Explainer", icon: Lightbulb },
  "custom-series": { label: "Series", icon: Sparkles },
} satisfies Record<ContentType, { label: string; icon: typeof Telescope }>;

const typeColors: Record<ContentType, string> = {
  "whats-up": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  tutorial: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  explainer: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "custom-series": "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

function getReadingTime(text: string | null | undefined) {
  if (!text || typeof text !== "string") return 1;
  return Math.ceil(text.trim().split(/\s+/).length / 200);
}

async function getAuthorAndPosts(routeName: string) {
  const supabase = await createClient();
  const now = new Date().toISOString();
  const { data: authorData } = await supabase
    .from("authors")
    .select("id, name, display_name, avatar_url, created_at")
    .ilike("name", routeName)
    .maybeSingle();

  const author = authorData as PublicAuthor | null;
  const [whatsUpRes, tutorialsRes, explainersRes, seriesPostsRes] = await Promise.all([
    supabase.from("whats_up").select("*").eq("published", true).or(`publishDate.is.null,publishDate.lte.${now}`),
    supabase.from("tutorials").select("*").eq("published", true).or(`publishDate.is.null,publishDate.lte.${now}`),
    supabase.from("explainers").select("*").eq("published", true).or(`publishDate.is.null,publishDate.lte.${now}`),
    supabase
      .from("custom_series_posts")
      .select("*, custom_series(name, slug)")
      .eq("published", true)
      .or(`publishDate.is.null,publishDate.lte.${now}`),
  ]);

  const posts: Blog[] = [
    ...(whatsUpRes.data || []).map((row) => ({ ...row, contentType: "whats-up" as const })),
    ...(tutorialsRes.data || []).map((row) => ({ ...row, contentType: "tutorial" as const })),
    ...(explainersRes.data || []).map((row) => ({ ...row, contentType: "explainer" as const })),
    ...(seriesPostsRes.data || []).map((row) => {
      const series = row.custom_series as { name: string; slug: string } | null;
      return {
        ...row,
        contentType: "custom-series" as const,
        seriesName: series?.name,
        seriesSlug: series?.slug,
        custom_series: undefined,
      };
    }),
  ].filter((post) => {
    if (author) {
      if (post.app_author_id === author.id) return true;
      if (post.app_author_id) return false;
      const postAuthor = post.author?.trim().toLowerCase();
      return postAuthor === author.name.toLowerCase() || postAuthor === author.display_name.toLowerCase();
    }
    return !post.app_author_id && post.author?.trim().toLowerCase() === routeName.toLowerCase();
  }).sort((a, b) => new Date(b.publishDate || b.createdAt).getTime() - new Date(a.publishDate || a.createdAt).getTime());

  return { author, posts };
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params;
  const routeName = decodeURIComponent(name);
  const { author, posts } = await getAuthorAndPosts(routeName);
  const displayName = author?.display_name || posts[0]?.author || routeName;

  return {
    title: `${displayName} | AstroHub Authors`,
    description: `Read published astronomy articles by ${displayName} on AstroHub Transmission.`,
    openGraph: {
      title: `${displayName} | AstroHub Author`,
      description: `Explore all published articles by ${displayName}.`,
      images: author?.avatar_url ? [author.avatar_url] : ["/assets/AstroHub.avif"],
    },
  };
}

export default async function AuthorProfilePage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const routeName = decodeURIComponent(name);
  const { author, posts } = await getAuthorAndPosts(routeName);

  if (!author && posts.length === 0) notFound();

  const displayName = author?.display_name || posts[0]?.author || routeName;
  const joinedDate = author?.created_at
    ? new Date(author.created_at)
    : posts.length > 0
      ? new Date(posts[posts.length - 1].createdAt)
      : null;
  const latestPostDate = posts[0] ? new Date(posts[0].publishDate || posts[0].createdAt) : null;
  const contentTypeCounts = (Object.keys(typeConfig) as ContentType[]).map((type) => ({
    type,
    count: posts.filter((post) => post.contentType === type).length,
  }));

  return (
    <LoaderWrapper>
      <main className="min-h-screen bg-slate-950 text-slate-200 pb-24">
        <section className="border-b border-slate-800/70 bg-slate-900/30">
          <div className="max-w-4xl mx-auto px-4 pt-28 md:pt-36 pb-10">
            <Link href="/authors" className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white mb-8">
              <ArrowLeft className="w-4 h-4" /> All Authors
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                {author?.avatar_url ? (
                  <img src={author.avatar_url} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-11 h-11 text-slate-500" />
                )}
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white">{displayName}</h1>
                {author && <p className="text-sm text-slate-500 font-mono mt-2">@{author.name}</p>}
                <p className="text-slate-400 mt-3">
                  {joinedDate
                    ? `Contributing to AstroHub since ${joinedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`
                    : "AstroHub contributor"}
                </p>
                <div className="flex flex-wrap gap-2 mt-5">
                  {contentTypeCounts.filter(({ count }) => count > 0).map(({ type, count }) => {
                    const config = typeConfig[type];
                    const Icon = config.icon;
                    return (
                      <span key={type} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border ${typeColors[type]}`}>
                        <Icon className="w-3.5 h-3.5" /> {count} {config.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8">
              <div className="border border-slate-800 bg-slate-950/50 rounded-lg p-4">
                <FileText className="w-4 h-4 text-slate-500 mb-2" />
                <div className="text-2xl font-bold text-white">{posts.length}</div>
                <div className="text-xs text-slate-500 mt-1">Published articles</div>
              </div>
              <div className="border border-slate-800 bg-slate-950/50 rounded-lg p-4">
                <Clock className="w-4 h-4 text-slate-500 mb-2" />
                <div className="text-lg font-bold text-white">
                  {latestPostDate ? latestPostDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "None"}
                </div>
                <div className="text-xs text-slate-500 mt-1">Latest article</div>
              </div>
              <div className="hidden sm:block border border-slate-800 bg-slate-950/50 rounded-lg p-4">
                <Star className="w-4 h-4 text-slate-500 mb-2" />
                <div className="text-lg font-bold text-white">
                  {joinedDate ? joinedDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "New"}
                </div>
                <div className="text-xs text-slate-500 mt-1">Member since</div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Published Articles</h2>
              <p className="text-sm text-slate-500 mt-1">All public work by {displayName}</p>
            </div>
            {posts.length > 0 && (
              <Link href={`/blogs?author=${encodeURIComponent(displayName)}`} className="text-sm font-medium text-indigo-400 hover:text-indigo-300">
                Filter in blogs
              </Link>
            )}
          </div>

          {posts.length === 0 ? (
            <div className="border border-slate-800 rounded-xl py-16 text-center text-slate-500">
              No published articles yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/70">
              {posts.map((post) => {
                const config = typeConfig[post.contentType];
                const Icon = config.icon;
                return (
                  <Link key={`${post.contentType}:${post.id}`} href={`/blogs/${post.slug}`} className="group block py-7">
                    <div className="flex flex-col-reverse sm:flex-row gap-5 justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold border ${typeColors[post.contentType]}`}>
                            <Icon className="w-3 h-3" /> {post.seriesName || config.label}
                          </span>
                          <span className="text-slate-500">
                            {new Date(post.publishDate || post.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span className="text-slate-600">·</span>
                          <span className="text-slate-500">{post.estimatedReadTime || getReadingTime(post.content)} min read</span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                          {post.title}
                        </h3>
                        {post.excerpt && <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 mt-3">{post.excerpt}</p>}
                      </div>
                      <div className="w-full sm:w-36 shrink-0">
                        <div className="aspect-[2/1] sm:aspect-[4/3] rounded-lg overflow-hidden bg-slate-900 border border-slate-800">
                          {post.coverImage ? (
                            <img src={post.coverImage} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText className="w-7 h-7 text-slate-700" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </LoaderWrapper>
  );
}
