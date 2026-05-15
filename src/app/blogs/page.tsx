import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Blog } from "@/lib/blogsDb";
import {  Clock, ArrowRight, Telescope, BookOpen, Lightbulb, Star, User } from "lucide-react";
import HeroSlider from "@/components/blog/HeroSlider";
import SearchBar from "@/components/blog/SearchBar";
import LoaderWrapper from "@/components/Loader";

export const revalidate = 0;

function getReadingTime(text: string | null | undefined) {
  if (!text || typeof text !== "string") return 1;
  return Math.ceil(text.trim().split(/\s+/).length / 200);
}

function BlogCard({ blog }: { blog: Blog }) {
  const typeLabel = blog.contentType === "whats-up" ? "Eyes on the Sky" : blog.contentType === "tutorial" ? "Tutorial" : "Explainer";

  return (
    <Link
      href={`/blogs/${blog.slug}`}
      className="group block py-6 md:py-8 border-b border-slate-800/50 hover:bg-slate-900/20 transition-colors px-2 md:px-6 -mx-2 md:-mx-6 rounded-3xl"
    >
      <div className="flex flex-col-reverse md:flex-row gap-6 md:gap-12 items-start justify-between">
        <div className="flex-1 space-y-3 w-full">
          {/* Author & Date Row */}
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 overflow-hidden shrink-0 border border-slate-700">
               <User className="w-3.5 h-3.5" />
            </div>
            <span className="flex-wrap flex gap-1 items-center">
              <span><span className="text-slate-300 font-medium">{typeLabel}</span> by</span>
              <span className="text-white font-medium">{blog.author || "AstroHub"}</span>
              <span className="text-slate-600 px-1">•</span>
              <span>{new Date(blog.publishDate || blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
            </span>
          </div>
          
          {/* Title & Excerpt */}
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 group-hover:text-blue-400 transition-colors leading-tight line-clamp-3">
            {blog.title}
          </h2>
          <p className="text-slate-400 text-base leading-relaxed line-clamp-2 hidden sm:block">
            {blog.excerpt}
          </p>

          {/* Footer Stats */}
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500 pt-3">
             <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {blog.estimatedReadTime || getReadingTime(blog.content)} min read</span>
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
        
        {/* Thumbnail on Right */}
        <div className="w-full md:w-32 lg:w-48 shrink-0">
          <div className="aspect-[2/1] md:aspect-[4/3] rounded-xl overflow-hidden bg-slate-800 border border-slate-700/50 relative">
             {blog.coverImage ? (
               <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
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
}

function SectionHeader({ icon: Icon, title, href, color }: { icon: React.ElementType; title: string; href: string; color: string }) {
  const textColors: Record<string, string> = { blue: "text-blue-400", emerald: "text-emerald-400", purple: "text-purple-400" };
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl bg-slate-800/80 ${textColors[color]}`}><Icon className="w-5 h-5" /></div>
        <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
      </div>
      <Link href={href} className={`inline-flex items-center gap-2 text-sm font-semibold ${textColors[color]} hover:underline underline-offset-4 group`}>
        View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  try {
    const params = await searchParams;
    const authorParam = params.author;
    const decodedAuthor = typeof authorParam === "string" ? decodeURIComponent(authorParam) : undefined;
    
    const qParam = params.q;
    const decodedQ = typeof qParam === "string" ? decodeURIComponent(qParam) : undefined;

    const supabase = await createClient();

    let whatsUpQuery = supabase.from("whats_up").select("*").eq("published", true).order("createdAt", { ascending: false });
    let tutorialsQuery = supabase.from("tutorials").select("*").eq("published", true).order("createdAt", { ascending: false });
    let explainersQuery = supabase.from("explainers").select("*").eq("published", true).order("createdAt", { ascending: false });

    if (decodedAuthor) {
      whatsUpQuery = whatsUpQuery.ilike("author", decodedAuthor);
      tutorialsQuery = tutorialsQuery.ilike("author", decodedAuthor);
      explainersQuery = explainersQuery.ilike("author", decodedAuthor);
    } else if (decodedQ) {
      whatsUpQuery = whatsUpQuery.or(`title.ilike.%${decodedQ}%,author.ilike.%${decodedQ}%`);
      tutorialsQuery = tutorialsQuery.or(`title.ilike.%${decodedQ}%,author.ilike.%${decodedQ}%`);
      explainersQuery = explainersQuery.or(`title.ilike.%${decodedQ}%,author.ilike.%${decodedQ}%`);
    } else {
      whatsUpQuery = whatsUpQuery.limit(3);
      tutorialsQuery = tutorialsQuery.limit(3);
      explainersQuery = explainersQuery.limit(3);
    }

    const [whatsUpRes, tutorialsRes, explainersRes] = await Promise.all([
      whatsUpQuery,
      tutorialsQuery,
      explainersQuery,
    ]);

    if (whatsUpRes.error || tutorialsRes.error || explainersRes.error) {
      console.error("Supabase Error:", whatsUpRes.error || tutorialsRes.error || explainersRes.error);
      throw new Error("Failed to fetch blogs from database");
    }

    const whatsUp = (whatsUpRes.data || []).map((r) => ({ ...r, contentType: "whats-up" as const })) as Blog[];
    const tutorials = (tutorialsRes.data || []).map((r) => ({ ...r, contentType: "tutorial" as const })) as Blog[];
    const explainers = (explainersRes.data || []).map((r) => ({ ...r, contentType: "explainer" as const })) as Blog[];

    // Build hero slides: latest from each type that exists
    const heroSlides: Blog[] = [
      ...(whatsUp.length > 0 ? [whatsUp[0]] : []),
      ...(tutorials.length > 0 ? [tutorials[0]] : []),
      ...(explainers.length > 0 ? [explainers[0]] : []),
    ];

    return (
      <LoaderWrapper>
      <div className="min-h-screen bg-slate-950 text-slate-200 pb-24 relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-900/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-[50%] right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Hero Auto-Slider */}
        {!decodedAuthor && !decodedQ && heroSlides.length > 0 && (
          <div className="mb-12">
            <HeroSlider slides={heroSlides} />
          </div>
        )}

        {/* Search Bar */}
        <div className={`max-w-4xl mx-auto px-4 relative z-10 ${(!decodedAuthor && !decodedQ) ? 'mt-8' : 'mt-24'} mb-8`}>
          <SearchBar />
        </div>

        {/* Author Filter Header */}
        {decodedAuthor && (
          <div className="max-w-4xl mx-auto px-4 relative z-10 mb-12">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-sm">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Articles by {decodedAuthor}</h2>
                <p className="text-sm text-slate-400">Showing all published posts from this author.</p>
              </div>
              <Link href="/blogs" className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-colors border border-slate-700">
                Clear Filter
              </Link>
            </div>
          </div>
        )}

        {/* Search Results Header */}
        {decodedQ && (
          <div className="max-w-4xl mx-auto px-4 relative z-10 mb-12">
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-sm">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Search Results for &quot;{decodedQ}&quot;</h2>
                <p className="text-sm text-slate-400">Found {whatsUp.length + tutorials.length + explainers.length} matching articles.</p>
              </div>
              <Link href="/blogs" className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-colors border border-slate-700">
                Clear Search
              </Link>
            </div>
          </div>
        )}

      <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-20">
        {/* Eyes on the Sky Section */}
        {whatsUp.length > 0 && (
          <section>
            <SectionHeader icon={Telescope} title="Eyes on the Sky" href="/blogs/eyes-on-the-sky" color="blue" />
            <div className="flex flex-col">
              {whatsUp.map((b) => <BlogCard key={b.id} blog={b} />)}
            </div>
          </section>
        )}

        {/* Tutorials Section */}
        {tutorials.length > 0 && (
          <section>
            <SectionHeader icon={BookOpen} title="Tutorials" href="/blogs/tutorials" color="emerald" />
            <div className="flex flex-col">
              {tutorials.map((b) => <BlogCard key={b.id} blog={b} />)}
            </div>
          </section>
        )}

        {/* Explainers Section */}
        {explainers.length > 0 && (
          <section>
            <SectionHeader icon={Lightbulb} title="Learn Astronomy" href="/blogs/explainers" color="purple" />
            <div className="flex flex-col">
              {explainers.map((b) => <BlogCard key={b.id} blog={b} />)}
            </div>
          </section>
        )}

        {/* Empty state */}
        {whatsUp.length === 0 && tutorials.length === 0 && explainers.length === 0 && (
          <div className="text-center py-20 text-slate-500 text-lg border border-slate-800 rounded-3xl bg-slate-900/50 backdrop-blur-sm">
            <p>{decodedQ ? `No articles found matching "${decodedQ}".` : "No articles published yet. Check back soon!"}</p>
          </div>
        )}
      </div>
      </div>
      </LoaderWrapper>
    );
  } catch (error) {
    console.error("Critical Blog Page Error:", error);
    return (
      <LoaderWrapper>
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900/50 border border-red-500/20 p-8 rounded-3xl max-w-md w-full text-center backdrop-blur-md">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Telescope className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Transmission Interrupted</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            We&apos;re having trouble reaching the stellar database. Please check your connection or try again later.
          </p>
          <Link href="/" className="inline-flex items-center justify-center bg-white text-slate-950 font-bold px-6 py-3 rounded-xl transition-transform hover:scale-105 active:scale-95">
            Return to AstroHub
          </Link>
        </div>
      </div>
      </LoaderWrapper>
    );
  }
}
