import Link from "next/link";
import type { Metadata } from "next";
import { Search, FileText, Wrench } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { exploreCategories } from "@/lib/siteNav";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Search",
  description: "Search AstroHub articles, tools and sky guides.",
  robots: { index: false, follow: true },
};

const postTables = ["whats_up", "tutorials", "explainers", "custom_series_posts"];

type PostHit = { slug: string; title: string; excerpt: string | null; publishDate: string | null; createdAt: string };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim().slice(0, 100);
  // Characters that would change the PostgREST filter grammar are dropped, not escaped.
  const safe = query.replace(/[,()*%\\.:]/g, " ").trim();

  const tools = safe
    ? exploreCategories.flatMap((c) =>
        c.items
          .filter((i) => `${i.name} ${c.title}`.toLowerCase().includes(safe.toLowerCase()))
          .map((i) => ({ ...i, category: c.title })),
      )
    : [];

  let posts: PostHit[] = [];
  if (safe) {
    const supabase = await createClient();
    const now = new Date().toISOString();
    const results = await Promise.all(
      postTables.map((table) =>
        supabase
          .from(table)
          .select("slug, title, excerpt, publishDate, createdAt")
          .eq("published", true)
          .or(`publishDate.is.null,publishDate.lte.${now}`)
          .or(`title.ilike.%${safe}%,excerpt.ilike.%${safe}%,author.ilike.%${safe}%`)
          .limit(20),
      ),
    );
    posts = results
      .flatMap(({ data }) => (data ?? []) as PostHit[])
      .sort((a, b) => new Date(b.publishDate || b.createdAt).getTime() - new Date(a.publishDate || a.createdAt).getTime());
  }

  return (
    <PageShell title="Search AstroHub" subtitle="Find articles, sky guides and tools." width="max-w-3xl">

        <form action="/search" method="get" role="search" className="relative mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" aria-hidden />
          <input
            type="search"
            name="q"
            defaultValue={query}
            autoFocus
            maxLength={100}
            aria-label="Search articles and tools"
            placeholder="Try “Jupiter”, “exposure” or “Messier”"
            className="w-full pl-12 pr-4 py-4 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-600/40 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all"
          />
        </form>

        {safe && tools.length === 0 && posts.length === 0 && (
          <p className="text-slate-400">No results for “{query}”. Try a shorter word.</p>
        )}

        {tools.length > 0 && (
          <section className="mb-10">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              <Wrench className="h-4 w-4" /> Tools ({tools.length})
            </h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {tools.map((t) => (
                <li key={t.path}>
                  <Link href={t.path} className="block p-4 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-600/40 hover:border-blue-500/50 hover:bg-slate-700/50 transition-colors">
                    <span className="font-semibold text-white">{t.name}</span>
                    <span className="block text-xs text-slate-500 mt-1">{t.category}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {posts.length > 0 && (
          <section>
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              <FileText className="h-4 w-4" /> Articles ({posts.length})
            </h2>
            <ul className="space-y-3">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blogs/${p.slug}`} className="block p-4 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-600/40 hover:border-blue-500/50 hover:bg-slate-700/50 transition-colors">
                    <span className="font-semibold text-white">{p.title}</span>
                    {p.excerpt && <span className="text-sm text-slate-400 mt-1 line-clamp-2">{p.excerpt}</span>}
                    <span className="block text-xs text-slate-500 mt-2">
                      {new Date(p.publishDate || p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
    </PageShell>
  );
}
