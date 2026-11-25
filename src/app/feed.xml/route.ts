import { createClient } from "@supabase/supabase-js";

const baseUrl = "https://www.astrohub.live";
const postTables = ["whats_up", "tutorials", "explainers", "custom_series_posts"];

// Revalidate hourly, like the sitemap, so new posts reach readers without a redeploy.
export const revalidate = 3600;

type FeedPost = {
  slug: string;
  title: string;
  excerpt: string | null;
  author: string | null;
  coverImage: string | null;
  publishDate: string | null;
  createdAt: string;
};

const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!);

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
  const now = new Date().toISOString();

  const results = await Promise.all(
    postTables.map((table) =>
      supabase
        .from(table)
        .select("slug, title, excerpt, author, coverImage, publishDate, createdAt")
        .eq("published", true)
        .or(`publishDate.is.null,publishDate.lte.${now}`)
        .order("createdAt", { ascending: false })
        .limit(50),
    ),
  );

  const posts = results
    .flatMap(({ data }) => (data ?? []) as FeedPost[])
    .map((p) => ({ ...p, date: new Date(p.publishDate || p.createdAt) }))
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 50);

  const items = posts
    .map((p) => {
      const url = `${baseUrl}/blogs/${encodeURIComponent(p.slug)}`;
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${p.date.toUTCString()}</pubDate>
      ${p.author ? `<dc:creator>${escapeXml(p.author)}</dc:creator>` : ""}
      <description>${escapeXml(p.excerpt || "")}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>AstroHub Transmission</title>
    <link>${baseUrl}/blogs</link>
    <description>Sky guides, tutorials and explainers from AstroHub.</description>
    <language>en-us</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${posts[0] ? `<lastBuildDate>${posts[0].date.toUTCString()}</lastBuildDate>` : ""}
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
