import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Blog } from "@/lib/blogsDb";
import { Calendar, Clock, ArrowRight, Telescope, BookOpen, Lightbulb, Star } from "lucide-react";
import HeroSlider from "@/components/blog/HeroSlider";

export const revalidate = 0;

function getReadingTime(text: string) {
  return Math.ceil(text.trim().split(/\s+/).length / 200);
}

function BlogCard({ blog }: { blog: Blog }) {
  const diffColors: Record<string, string> = {
    beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    advanced: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <Link
      href={`/blogs/${blog.slug}`}
      className="group flex flex-col bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all duration-300"
    >
      <div className="relative h-44 w-full overflow-hidden bg-slate-800">
        {blog.coverImage ? (
          <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-900">
            <Star className="w-10 h-10 opacity-30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
        {blog.contentType === "tutorial" && blog.difficultyLevel && (
          <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold border ${diffColors[blog.difficultyLevel] || ""}`}>
            {blog.difficultyLevel.charAt(0).toUpperCase() + blog.difficultyLevel.slice(1)}
          </span>
        )}
        {blog.contentType === "explainer" && blog.topicCategory && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            {blog.topicCategory}
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-3 text-xs font-medium text-slate-400 mb-3">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(blog.publishDate || blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {blog.estimatedReadTime || getReadingTime(blog.content)} min
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">{blog.title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-2 flex-grow">{blog.excerpt}</p>
        <div className="flex items-center gap-2 text-sm font-semibold text-blue-400 mt-auto">
          Read article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

export default async function BlogsPage() {
  const supabase = await createClient();

  const [whatsUpRes, tutorialsRes, explainersRes] = await Promise.all([
    supabase.from("whats_up").select("*").eq("published", true).order("createdAt", { ascending: false }).limit(3),
    supabase.from("tutorials").select("*").eq("published", true).order("createdAt", { ascending: false }).limit(3),
    supabase.from("explainers").select("*").eq("published", true).order("createdAt", { ascending: false }).limit(3),
  ]);

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
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-24 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-900/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[50%] right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Auto-Slider */}
      {heroSlides.length > 0 && (
        <div className="mb-12">
          <HeroSlider slides={heroSlides} />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 relative z-10 space-y-20">
        {/* Eyes on the Sky Section */}
        {whatsUp.length > 0 && (
          <section>
            <SectionHeader icon={Telescope} title="Eyes on the Sky" href="/blogs/eyes-on-the-sky" color="blue" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {whatsUp.map((b) => <BlogCard key={b.id} blog={b} />)}
            </div>
          </section>
        )}

        {/* Tutorials Section */}
        {tutorials.length > 0 && (
          <section>
            <SectionHeader icon={BookOpen} title="Tutorials" href="/blogs/tutorials" color="emerald" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials.map((b) => <BlogCard key={b.id} blog={b} />)}
            </div>
          </section>
        )}

        {/* Explainers Section */}
        {explainers.length > 0 && (
          <section>
            <SectionHeader icon={Lightbulb} title="Learn Astronomy" href="/blogs/explainers" color="purple" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {explainers.map((b) => <BlogCard key={b.id} blog={b} />)}
            </div>
          </section>
        )}

        {/* Empty state */}
        {whatsUp.length === 0 && tutorials.length === 0 && explainers.length === 0 && (
          <div className="text-center py-20 text-slate-500 text-lg border border-slate-800 rounded-3xl bg-slate-900/50 backdrop-blur-sm">
            <p>No articles published yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
