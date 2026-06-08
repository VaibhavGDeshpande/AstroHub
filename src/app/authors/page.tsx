import Link from "next/link";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Author, Blog, ContentType } from "@/lib/blogsDb";
import { ArrowRight, FileText, Sparkles, User, Users } from "lucide-react";
import LoaderWrapper from "@/components/Loader";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Authors | AstroHub Transmission",
  description: "Meet the writers behind AstroHub Transmission and explore their published astronomy articles.",
  openGraph: {
    title: "Authors | AstroHub Transmission",
    description: "Meet the writers behind AstroHub Transmission.",
    images: ["/assets/AstroHub.avif"],
  },
};

type PublicAuthor = Pick<Author, "id" | "name" | "display_name" | "avatar_url" | "created_at">;

interface AuthorSummary {
  key: string;
  routeName: string;
  displayName: string;
  avatarUrl: string;
  joinedAt?: string;
  postCount: number;
  latestPost?: Blog;
  contentTypes: Set<ContentType>;
}

const typeLabels: Record<ContentType, string> = {
  "whats-up": "Eyes on the Sky",
  tutorial: "Tutorials",
  explainer: "Explainers",
  "custom-series": "Series",
};

const typeColors: Record<ContentType, string> = {
  "whats-up": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  tutorial: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  explainer: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "custom-series": "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default async function AuthorsPage() {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const [authorsRes, whatsUpRes, tutorialsRes, explainersRes, seriesPostsRes] = await Promise.all([
    supabase
      .from("authors")
      .select("id, name, display_name, avatar_url, created_at")
      .order("display_name", { ascending: true }),
    supabase.from("whats_up").select("*").eq("published", true).or(`publishDate.is.null,publishDate.lte.${now}`),
    supabase.from("tutorials").select("*").eq("published", true).or(`publishDate.is.null,publishDate.lte.${now}`),
    supabase.from("explainers").select("*").eq("published", true).or(`publishDate.is.null,publishDate.lte.${now}`),
    supabase
      .from("custom_series_posts")
      .select("*, custom_series(name, slug)")
      .eq("published", true)
      .or(`publishDate.is.null,publishDate.lte.${now}`),
  ]);

  const registeredAuthors = (authorsRes.data || []) as PublicAuthor[];
  const allBlogs: Blog[] = [
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
  ].sort((a, b) => new Date(b.publishDate || b.createdAt).getTime() - new Date(a.publishDate || a.createdAt).getTime());

  const summaries = new Map<string, AuthorSummary>();
  const registeredById = new Map(registeredAuthors.map((author) => [author.id, author]));
  const registeredByName = new Map<string, PublicAuthor>();

  for (const author of registeredAuthors) {
    if (author.name) {
      registeredByName.set(author.name.toLowerCase().trim(), author);
    }
    if (author.display_name) {
      registeredByName.set(author.display_name.toLowerCase().trim(), author);
    }
  }

  for (const author of registeredAuthors) {
    summaries.set(author.id, {
      key: author.id,
      routeName: author.name,
      displayName: author.display_name || author.name,
      avatarUrl: author.avatar_url || "",
      joinedAt: author.created_at,
      postCount: 0,
      contentTypes: new Set(),
    });
  }

  for (const blog of allBlogs) {
    let registered = blog.app_author_id ? registeredById.get(blog.app_author_id) : undefined;
    if (!registered && blog.author) {
      registered = registeredByName.get(blog.author.toLowerCase().trim());
    }
    const legacyName = blog.author?.trim() || "AstroHub";
    const key = registered?.id || `legacy:${legacyName.toLowerCase()}`;

    if (!summaries.has(key)) {
      summaries.set(key, {
        key,
        routeName: legacyName,
        displayName: legacyName,
        avatarUrl: "",
        postCount: 0,
        contentTypes: new Set(),
      });
    }

    const summary = summaries.get(key)!;
    summary.postCount += 1;
    summary.contentTypes.add(blog.contentType);
    if (!summary.latestPost) summary.latestPost = blog;
  }

  const authors = Array.from(summaries.values()).sort(
    (a, b) => b.postCount - a.postCount || a.displayName.localeCompare(b.displayName)
  );
  const totalArticles = allBlogs.length;

  return (
    <LoaderWrapper>
      <main className="min-h-screen bg-slate-950 text-slate-200 pb-24">
        <section className="border-b border-slate-800/70 bg-slate-900/30">
          <div className="max-w-5xl mx-auto px-4 pt-28 md:pt-36 pb-12">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white">Authors</h1>
                <p className="text-slate-400 mt-1">{authors.length} contributors, {totalArticles} published articles</p>
              </div>
            </div>
            <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
              Meet the astronomers, educators, and space enthusiasts writing for AstroHub.
            </p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 py-12">
          {authors.length === 0 ? (
            <div className="text-center py-20 text-slate-500 border border-slate-800 rounded-2xl">
              No authors found yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {authors.map((author) => (
                <Link
                  key={author.key}
                  href={`/authors/${encodeURIComponent(author.routeName)}`}
                  className="group border border-slate-800 bg-slate-900/55 rounded-xl p-5 hover:border-indigo-500/40 hover:bg-slate-900 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                      {author.avatarUrl ? (
                        <img src={author.avatarUrl} alt={author.displayName} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-7 h-7 text-slate-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                            {author.displayName}
                          </h2>
                          <p className="text-sm text-slate-500">
                            {author.postCount} {author.postCount === 1 ? "article" : "articles"}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all mt-1" />
                      </div>

                      {author.contentTypes.size > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {Array.from(author.contentTypes).map((type) => (
                            <span key={type} className={`px-2.5 py-1 rounded-md text-xs font-medium border ${typeColors[type]}`}>
                              {typeLabels[type]}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-600 mt-4">Profile created, no published articles yet.</p>
                      )}
                    </div>
                  </div>

                  {author.latestPost && (
                    <div className="mt-5 pt-4 border-t border-slate-800/80">
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        {author.latestPost.contentType === "custom-series" ? (
                          <Sparkles className="w-3.5 h-3.5" />
                        ) : (
                          <FileText className="w-3.5 h-3.5" />
                        )}
                        Latest article
                      </div>
                      <p className="text-sm font-medium text-slate-300 line-clamp-2">{author.latestPost.title}</p>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </LoaderWrapper>
  );
}
