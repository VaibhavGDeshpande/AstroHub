import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Author, Blog } from "@/lib/blogsDb";
import { ArrowRight, BookOpen, Clock, Lightbulb, Sparkles, Star, Telescope, User } from "lucide-react";
import HeroSlider from "@/components/blog/HeroSlider";
import SearchBar from "@/components/blog/SearchBar";
import LoaderWrapper from "@/components/Loader";

export const revalidate = 0;

type AuthorProfile = Pick<Author, "id" | "name" | "display_name" | "avatar_url">;

function getReadingTime(text: string | null | undefined) {
  if (!text || typeof text !== "string") return 1;
  return Math.ceil(text.trim().split(/\s+/).length / 200);
}

function BlogCard({ blog, author }: { blog: Blog; author?: AuthorProfile }) {
  const typeLabel = blog.contentType === "whats-up"
    ? "Eyes on the Sky"
    : blog.contentType === "tutorial"
      ? "Tutorial"
      : blog.contentType === "custom-series"
        ? (blog.seriesName || "Series")
        : "Explainer";
  const authorName = author?.display_name || blog.author || "AstroHub";

  return (
    <Link
      href={`/blogs/${blog.slug}`}
      className="group block py-6 md:py-8 border-b border-slate-800/50 hover:bg-slate-900/20 transition-colors px-2 md:px-6 -mx-2 md:-mx-6 rounded-xl"
    >
      <div className="flex flex-col-reverse md:flex-row gap-6 md:gap-12 items-start justify-between">
        <div className="flex-1 space-y-3 w-full">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 overflow-hidden shrink-0 border border-slate-700">
              {author?.avatar_url ? (
                <img src={author.avatar_url} alt={authorName} className="w-full h-full object-cover" />
              ) : (
                <User className="w-3.5 h-3.5" />
              )}
            </div>
            <span className="flex flex-wrap gap-1 items-center">
              <span><span className="text-slate-300 font-medium">{typeLabel}</span> by</span>
              <span className="text-white font-medium">{authorName}</span>
              <span className="text-slate-600 px-1">·</span>
              <span>{new Date(blog.publishDate || blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 group-hover:text-blue-400 transition-colors leading-tight line-clamp-3">
            {blog.title}
          </h2>
          <p className="text-slate-400 text-base leading-relaxed line-clamp-2 hidden sm:block">
            {blog.excerpt}
          </p>

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

        <div className="w-full md:w-32 lg:w-48 shrink-0">
          <div className="aspect-[2/1] md:aspect-[4/3] rounded-lg overflow-hidden bg-slate-800 border border-slate-700/50 relative">
            {blog.coverImage ? (
              <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Star className="w-8 h-8 text-slate-600 opacity-50" />
              </div>
            )}
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-lg" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function SectionHeader({ icon: Icon, title, href, color }: { icon: React.ElementType; title: string; href: string; color: string }) {
  const textColors: Record<string, string> = {
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    purple: "text-purple-400",
    amber: "text-amber-400",
  };
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
    const decodedAuthor = typeof params.author === "string" ? decodeURIComponent(params.author) : undefined;
    const decodedQ = typeof params.q === "string" ? decodeURIComponent(params.q) : undefined;
    const supabase = await createClient();
    const now = new Date().toISOString();

    const [authorsRes, authorLookupRes] = await Promise.all([
      supabase.from("authors").select("id, name, display_name, avatar_url"),
      decodedAuthor
        ? supabase.from("authors").select("id, name, display_name, avatar_url").or(`name.ilike.${decodedAuthor},display_name.ilike.${decodedAuthor}`).maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

    const authorProfiles = (authorsRes.data || []) as AuthorProfile[];
    const authorById = new Map(authorProfiles.map((author) => [author.id, author]));
    const authorLookup = authorLookupRes.data as AuthorProfile | null;

    let whatsUpQuery = supabase.from("whats_up").select("*").eq("published", true).or(`publishDate.is.null,publishDate.lte.${now}`).order("createdAt", { ascending: false });
    let tutorialsQuery = supabase.from("tutorials").select("*").eq("published", true).or(`publishDate.is.null,publishDate.lte.${now}`).order("createdAt", { ascending: false });
    let explainersQuery = supabase.from("explainers").select("*").eq("published", true).or(`publishDate.is.null,publishDate.lte.${now}`).order("createdAt", { ascending: false });
    let seriesQuery = supabase
      .from("custom_series_posts")
      .select("*, custom_series(name, slug)")
      .eq("published", true)
      .or(`publishDate.is.null,publishDate.lte.${now}`)
      .order("createdAt", { ascending: false });

    if (decodedQ) {
      whatsUpQuery = whatsUpQuery.or(`title.ilike.%${decodedQ}%,author.ilike.%${decodedQ}%`);
      tutorialsQuery = tutorialsQuery.or(`title.ilike.%${decodedQ}%,author.ilike.%${decodedQ}%`);
      explainersQuery = explainersQuery.or(`title.ilike.%${decodedQ}%,author.ilike.%${decodedQ}%`);
      seriesQuery = seriesQuery.or(`title.ilike.%${decodedQ}%,author.ilike.%${decodedQ}%`);
    } else if (!decodedAuthor) {
      whatsUpQuery = whatsUpQuery.limit(3);
      tutorialsQuery = tutorialsQuery.limit(3);
      explainersQuery = explainersQuery.limit(3);
      seriesQuery = seriesQuery.limit(3);
    }

    const [whatsUpRes, tutorialsRes, explainersRes, seriesRes] = await Promise.all([
      whatsUpQuery,
      tutorialsQuery,
      explainersQuery,
      seriesQuery,
    ]);

    if (whatsUpRes.error || tutorialsRes.error || explainersRes.error || seriesRes.error) {
      console.error("Supabase Error:", whatsUpRes.error || tutorialsRes.error || explainersRes.error || seriesRes.error);
      throw new Error("Failed to fetch blogs from database");
    }

    const matchesAuthor = (blog: Blog) => {
      if (!decodedAuthor) return true;
      if (authorLookup) {
        if (blog.app_author_id === authorLookup.id) return true;
        if (blog.app_author_id) return false;
        const legacyName = blog.author?.trim().toLowerCase();
        return legacyName === authorLookup.name.toLowerCase() || legacyName === authorLookup.display_name.toLowerCase();
      }
      return !blog.app_author_id && blog.author?.trim().toLowerCase() === decodedAuthor.toLowerCase();
    };

    const whatsUp = ((whatsUpRes.data || []).map((row) => ({ ...row, contentType: "whats-up" as const })) as Blog[]).filter(matchesAuthor);
    const tutorials = ((tutorialsRes.data || []).map((row) => ({ ...row, contentType: "tutorial" as const })) as Blog[]).filter(matchesAuthor);
    const explainers = ((explainersRes.data || []).map((row) => ({ ...row, contentType: "explainer" as const })) as Blog[]).filter(matchesAuthor);
    const seriesPosts = ((seriesRes.data || []).map((row) => {
      const series = row.custom_series as { name: string; slug: string } | null;
      return {
        ...row,
        contentType: "custom-series" as const,
        seriesName: series?.name,
        seriesSlug: series?.slug,
        custom_series: undefined,
      };
    }) as Blog[]).filter(matchesAuthor);

    const heroSlides: Blog[] = [
      ...(whatsUp.length > 0 ? [whatsUp[0]] : []),
      ...(tutorials.length > 0 ? [tutorials[0]] : []),
      ...(explainers.length > 0 ? [explainers[0]] : []),
      ...(seriesPosts.length > 0 ? [seriesPosts[0]] : []),
    ];
    const resultCount = whatsUp.length + tutorials.length + explainers.length + seriesPosts.length;

    const card = (blog: Blog) => (
      <BlogCard key={`${blog.contentType}:${blog.id}`} blog={blog} author={blog.app_author_id ? authorById.get(blog.app_author_id) : undefined} />
    );

    return (
      <LoaderWrapper>
      <div className="min-h-screen bg-slate-950 text-slate-200 pb-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-900/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-[50%] right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

        {!decodedAuthor && !decodedQ && heroSlides.length > 0 && (
          <div className="mb-12">
            <HeroSlider slides={heroSlides} />
          </div>
        )}

        <div className={`max-w-4xl mx-auto px-4 relative z-10 ${(!decodedAuthor && !decodedQ) ? 'mt-8' : 'mt-24'} mb-8`}>
          <SearchBar />
        </div>

        {decodedAuthor && (
          <div className="max-w-4xl mx-auto px-4 relative z-10 mb-12">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Articles by {authorLookup?.display_name || decodedAuthor}</h2>
                <p className="text-sm text-slate-400">Showing all published posts from this author.</p>
              </div>
              <Link href="/blogs" className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-colors border border-slate-700">
                Clear Filter
              </Link>
            </div>
          </div>
        )}

        {decodedQ && (
          <div className="max-w-4xl mx-auto px-4 relative z-10 mb-12">
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Search Results for &quot;{decodedQ}&quot;</h2>
                <p className="text-sm text-slate-400">Found {resultCount} matching articles.</p>
              </div>
              <Link href="/blogs" className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-colors border border-slate-700">
                Clear Search
              </Link>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-20">
          {whatsUp.length > 0 && (
            <section>
              <SectionHeader icon={Telescope} title="Eyes on the Sky" href="/blogs/eyes-on-the-sky" color="blue" />
              <div className="flex flex-col">{whatsUp.map(card)}</div>
            </section>
          )}

          {tutorials.length > 0 && (
            <section>
              <SectionHeader icon={BookOpen} title="Tutorials" href="/blogs/tutorials" color="emerald" />
              <div className="flex flex-col">{tutorials.map(card)}</div>
            </section>
          )}

          {explainers.length > 0 && (
            <section>
              <SectionHeader icon={Lightbulb} title="Learn Astronomy" href="/blogs/explainers" color="purple" />
              <div className="flex flex-col">{explainers.map(card)}</div>
            </section>
          )}

          {seriesPosts.length > 0 && (
            <section>
              <SectionHeader icon={Sparkles} title="Series" href="/blogs" color="amber" />
              <div className="flex flex-col">{seriesPosts.map(card)}</div>
            </section>
          )}

          {resultCount === 0 && (
            <div className="text-center py-20 text-slate-500 text-lg border border-slate-800 rounded-xl bg-slate-900/50">
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
        <div className="bg-slate-900/50 border border-red-500/20 p-8 rounded-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-xl flex items-center justify-center mx-auto mb-6">
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
