import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Blog } from "@/lib/blogsDb";
import { MONTHS } from "@/lib/blogsDb";
import { Calendar, ArrowRight, ArrowLeft, Telescope, Star } from "lucide-react";
import LoaderWrapper from "@/components/Loader";

export const revalidate = 0;

export const metadata = {
  title: "Eyes on the Sky",
  description: "Monthly sky guides and astronomical event updates from AstroHub.",
};

export default async function WhatsUpPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("whats_up")
    .select("*")
    .eq("published", true)
    .order("skyYear", { ascending: false })
    .order("skyMonth", { ascending: false });

  const posts = (data || []).map((r) => ({ ...r, contentType: "whats-up" as const })) as Blog[];

  return (
    <LoaderWrapper>
    <div className="min-h-screen bg-slate-950 text-slate-200 pt-32 pb-24 md:pt-40 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-900/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <Link href="/blogs" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Blog
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400"><Telescope className="w-6 h-6" /></div>
          <h1 className="text-3xl md:text-5xl font-bold text-white">Eyes on the Sky</h1>
        </div>
        <p className="text-lg text-slate-400 mb-12 max-w-2xl">Monthly sky guides to help you know what to look for when you step outside at night.</p>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-slate-500 border border-slate-800 rounded-3xl bg-slate-900/50">
            <p>No sky updates published yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/blogs/${post.slug}`} className="group flex flex-col md:flex-row bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all">
                <div className="relative w-full md:w-72 h-48 md:h-auto shrink-0 bg-slate-800 overflow-hidden">
                  {post.coverImage ? (
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Star className="w-10 h-10 text-slate-700" /></div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-3">
                    {post.skyMonth && post.skyYear && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {MONTHS[post.skyMonth - 1]} {post.skyYear}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5" /> {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{post.title}</h2>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2 flex-grow">{post.excerpt}</p>
                  {post.skyEvents && post.skyEvents.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.skyEvents.slice(0, 4).map((evt, i) => (
                        <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">{evt.title}</span>
                      ))}
                      {post.skyEvents.length > 4 && <span className="text-xs text-slate-500">+{post.skyEvents.length - 4} more</span>}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm font-semibold text-blue-400">
                    Read guide <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
