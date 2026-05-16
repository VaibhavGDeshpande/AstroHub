import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { MONTHS } from "@/lib/blogsDb";
import type { Blog } from "@/lib/blogsDb";
import { Clock, ArrowLeft, ArrowRight, User, Telescope, BookOpen, Lightbulb, Wrench } from "lucide-react";
import LoaderWrapper from "@/components/Loader";
import BlogContent from "@/components/BlogContent";

export const revalidate = 0;

function getReadingTime(text: string) {
  return Math.ceil(text.trim().split(/\s+/).length / 200);
}

const diffColors: Record<string, string> = {
  beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  advanced: "bg-red-500/10 text-red-400 border-red-500/20",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const tables = ['whats_up', 'tutorials', 'explainers'];
  let blog: Blog | null = null;

  for (const table of tables) {
    const { data } = await supabase.from(table).select("*").eq("slug", slug).single();
    if (data) {
      blog = data as Blog;
      break;
    }
  }

  if (!blog) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: blog.title,
    description: blog.excerpt || `Read about ${blog.title} on AstroHub Transmission.`,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: blog.coverImage ? [blog.coverImage] : ["/assets/AstroHub.avif"],
      type: "article",
      publishedTime: blog.publishDate || blog.createdAt,
      authors: [blog.author || "AstroHub"],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: blog.coverImage ? [blog.coverImage] : ["/assets/AstroHub.avif"],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  // Search across all three tables for the slug
  type ContentType = 'whats-up' | 'tutorial' | 'explainer';
  const tables: { type: ContentType; table: string }[] = [
    { type: 'whats-up', table: 'whats_up' },
    { type: 'tutorial', table: 'tutorials' },
    { type: 'explainer', table: 'explainers' },
  ];

  let blog: Record<string, unknown> | null = null;
  let foundType: ContentType = 'explainer';

  for (const { type, table } of tables) {
    const { data } = await supabase.from(table).select("*").eq("slug", slug).single();
    if (data) {
      blog = data;
      foundType = type;
      break;
    }
  }

  if (!blog || !blog.published) notFound();

  const post = { ...blog, contentType: foundType } as Blog;
  const typeIcon = post.contentType === "whats-up" ? Telescope : post.contentType === "tutorial" ? BookOpen : Lightbulb;
  const TypeIcon = typeIcon;
  const typeLabel = post.contentType === "whats-up" ? "What's Up" : post.contentType === "tutorial" ? "Tutorial" : "Explainer";
  const typeColor = post.contentType === "whats-up" ? "blue" : post.contentType === "tutorial" ? "emerald" : "purple";
  const backLink = post.contentType === "whats-up" ? "/blogs/eyes-on-the-sky" : post.contentType === "tutorial" ? "/blogs/tutorials" : "/blogs/explainers";

  // Fetch previous/next for what's-up
  let prevPost: Blog | null = null;
  let nextPost: Blog | null = null;
  if (post.contentType === "whats-up" && post.skyMonth && post.skyYear) {
    if (post.previousMonthSlug) {
      const { data } = await supabase.from("whats_up").select("slug,title").eq("slug", post.previousMonthSlug).single();
      if (data) prevPost = data as Blog;
    } else {
      const prevMonth = post.skyMonth === 1 ? 12 : post.skyMonth - 1;
      const prevYear = post.skyMonth === 1 ? post.skyYear - 1 : post.skyYear;
      const { data } = await supabase.from("whats_up").select("slug,title").eq("skyMonth", prevMonth).eq("skyYear", prevYear).eq("published", true).single();
      if (data) prevPost = data as Blog;
    }
    const nxtMonth = post.skyMonth === 12 ? 1 : post.skyMonth + 1;
    const nxtYear = post.skyMonth === 12 ? post.skyYear + 1 : post.skyYear;
    const { data: nxt } = await supabase.from("whats_up").select("slug,title").eq("skyMonth", nxtMonth).eq("skyYear", nxtYear).eq("published", true).single();
    if (nxt) nextPost = nxt as Blog;
  }

  const badgeColors = typeColor === "blue" ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
    : typeColor === "emerald" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    : "bg-purple-500/10 text-purple-400 border-purple-500/20";

  return (
    <LoaderWrapper>
    <article className="min-h-screen bg-slate-950 text-slate-200 pb-24 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Content */}
      <div className="max-w-3xl mx-auto px-4 pt-24 md:pt-32 pb-4 z-10 relative">
        <Link href={backLink} className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-8 group w-fit">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to {typeLabel}s
        </Link>

        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${badgeColors}`}>
            <TypeIcon className="w-3.5 h-3.5" /> {typeLabel}
          </span>
          {post.contentType === "whats-up" && post.skyMonth && post.skyYear && (
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-800 text-white">{MONTHS[post.skyMonth - 1]} {post.skyYear}</span>
          )}
          {post.contentType === "tutorial" && post.difficultyLevel && (
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${diffColors[post.difficultyLevel]}`}>
              {post.difficultyLevel.charAt(0).toUpperCase() + post.difficultyLevel.slice(1)}
            </span>
          )}
          {post.contentType === "explainer" && post.topicCategory && (
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">{post.topicCategory}</span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">{post.title}</h1>
        
        {post.excerpt && (
          <p className="text-xl text-slate-400 mb-8 leading-relaxed">{post.excerpt}</p>
        )}

        {/* Author & Meta */}
        <div className="flex items-center justify-between border-y border-slate-800/60 py-5 mt-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700 shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              {post.author ? (
                <Link href={`/authors/${encodeURIComponent(post.author)}`} className="text-base font-semibold text-white hover:text-blue-400 transition-colors block">
                  {post.author}
                </Link>
              ) : (
                <span className="text-base font-semibold text-white block">AstroHub Transmission</span>
              )}
              <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.estimatedReadTime || getReadingTime(post.content)} min read</span>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span className="flex items-center gap-1.5">{new Date(post.publishDate || post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="max-w-4xl mx-auto px-4 mb-14">
          <figure className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl shadow-2xl border border-slate-800/60">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 960px"
              className="object-cover"
            />
          </figure>
          <p className="text-center text-sm text-slate-500 mt-4">Image from AstroHub Media.</p>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 gap-12 items-start">
          <div className="w-full">
        {/* Tutorial: Tools Needed */}
        {post.contentType === "tutorial" && post.toolsNeeded && post.toolsNeeded.length > 0 && (
          <div className="mb-10 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/15">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-3"><Wrench className="w-4 h-4" /> Tools & Equipment</div>
            <div className="flex flex-wrap gap-2">
              {post.toolsNeeded.map((t, i) => <span key={i} className="text-sm bg-slate-800 text-slate-200 px-3 py-1.5 rounded-lg">{t}</span>)}
            </div>
          </div>
        )}

        {/* Explainer: Key Concepts */}
        {post.contentType === "explainer" && post.keyConcepts && post.keyConcepts.length > 0 && (
          <div className="mb-10 p-5 rounded-2xl bg-purple-500/5 border border-purple-500/15">
            <div className="text-purple-400 font-semibold mb-3">Key Concepts</div>
            <div className="flex flex-wrap gap-2">
              {post.keyConcepts.map((c, i) => <span key={i} className="text-sm bg-purple-500/10 text-purple-300 border border-purple-500/15 px-3 py-1.5 rounded-lg">{c}</span>)}
            </div>
          </div>
        )}

        {/* What's Up: Sky Events */}
        {post.contentType === "whats-up" && post.skyEvents && post.skyEvents.length > 0 && (
          <div className="mb-10 p-5 rounded-2xl bg-blue-500/5 border border-blue-500/15">
            <div className="flex items-center gap-2 text-blue-400 font-semibold mb-4"><Telescope className="w-4 h-4" /> Sky Events This Month</div>
            <div className="space-y-4">
              {post.skyEvents.map((evt, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="shrink-0 w-20 text-center">
                    <span className="text-xs font-bold bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-lg border border-blue-500/20">{evt.date || "TBD"}</span>
                  </div>
                  <div className="flex-1 border-l border-slate-800 pl-4">
                    <div className="font-semibold text-white text-sm">{evt.title}</div>
                    <div className="text-sm text-slate-400 mt-1">{evt.description}</div>
                    {evt.visibility && <div className="text-xs text-slate-500 mt-1">Visibility: {evt.visibility}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <BlogContent
          html={post.content}
          className="prose prose-invert prose-lg prose-headings:font-sans prose-headings:text-slate-100 prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-p:text-slate-300 prose-p:font-serif prose-p:text-xl prose-p:leading-relaxed prose-strong:text-white prose-li:text-slate-300 prose-li:font-serif prose-li:text-xl w-full max-w-none prose-img:rounded-xl prose-img:shadow-xl [&>p:first-of-type]:first-letter:text-7xl [&>p:first-of-type]:first-letter:font-bold [&>p:first-of-type]:first-letter:text-white [&>p:first-of-type]:first-letter:mr-4 [&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:leading-[0.8] [&>p:first-of-type]:first-letter:mt-2 [&>p:first-of-type]:first-letter:font-serif"
        />

        {/* Explainer: Visual Aids Gallery */}
        {post.contentType === "explainer" && post.visualAids && post.visualAids.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-bold text-white mb-6">Visual Aids</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {post.visualAids.map((aid, i) => (
                <figure key={i} className="rounded-xl overflow-hidden border border-slate-800">
                  <div className="relative w-full h-48">
                    <Image
                      src={aid.url}
                      alt={aid.caption || 'Visual aid'}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  {aid.caption && <figcaption className="text-sm text-slate-400 p-3 bg-slate-900">{aid.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        )}

        {/* What's Up: Previous/Next Navigation */}
        {post.contentType === "whats-up" && (prevPost || nextPost) && (
          <div className="mt-12 flex justify-between gap-4 border-t border-slate-800 pt-8">
            {prevPost ? (
              <Link href={`/blogs/${prevPost.slug}`} className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Previous Month
              </Link>
            ) : <div />}
            {nextPost && (
              <Link href={`/blogs/${nextPost.slug}`} className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors group ml-auto">
                Next Month <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <Link href={backLink} className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-white font-medium transition-all">
            <ArrowLeft className="w-4 h-4" /> More {typeLabel}s
          </Link>
        </div>
          </div>
        </div>
      </div>
    </article>
    </LoaderWrapper>
  );
}
