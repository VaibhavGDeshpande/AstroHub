import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const baseUrl = "https://www.astrohub.live";

// Revalidate hourly so new posts reach the sitemap without a redeploy.
export const revalidate = 3600;

type RouteConfig = {
  path: string;
  priority: number;
  changeFrequency: "hourly" | "daily" | "weekly" | "monthly" | "yearly";
};

const routes: RouteConfig[] = [
  // --- 1. CORE & HIGH FREQUENCY (Daily/Hourly Content) ---
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  { path: "/weather", priority: 0.9, changeFrequency: "hourly" },
  { path: "/space-news", priority: 0.9, changeFrequency: "daily" },
  { path: "/blogs", priority: 0.9, changeFrequency: "daily" },
  { path: "/blogs/eyes-on-the-sky", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blogs/tutorials", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blogs/explainers", priority: 0.8, changeFrequency: "weekly" },
  { path: "/authors", priority: 0.7, changeFrequency: "weekly" },
  { path: "/neo", priority: 0.8, changeFrequency: "daily" },
  { path: "/apod", priority: 0.8, changeFrequency: "daily" },
  { path: "/epic", priority: 0.7, changeFrequency: "daily" },

  // TEMPORARILY SHUTDOWN - Uncomment when fixed
  // { path: "/mars-rover", priority: 0.8, changeFrequency: "daily" },
  // { path: "/solar-system", priority: 0.7, changeFrequency: "monthly" },

  // --- 2. TOOLS & RESOURCES ---
  // { path: "/stellarium", priority: 0.7, changeFrequency: "monthly" }, // hidden for now
  { path: "/sky-chart", priority: 0.7, changeFrequency: "monthly" },
  { path: "/sky-charts", priority: 0.7, changeFrequency: "monthly" },
  { path: "/satellite-tracker", priority: 0.7, changeFrequency: "monthly" },
  { path: "/telescope-calculator", priority: 0.7, changeFrequency: "monthly" },
  { path: "/exposure-calculator", priority: 0.7, changeFrequency: "monthly" },
  { path: "/cosmic-age", priority: 0.7, changeFrequency: "monthly" },
  { path: "/light-pollution", priority: 0.7, changeFrequency: "monthly" },
  { path: "/messier", priority: 0.7, changeFrequency: "monthly" },
  { path: "/images", priority: 0.6, changeFrequency: "weekly" },
  { path: "/wallpapers", priority: 0.6, changeFrequency: "weekly" },
  { path: "/space-quiz", priority: 0.6, changeFrequency: "weekly" },
  { path: "/gallery", priority: 0.7, changeFrequency: "daily" },

  // --- 3. 3D VISUALIZATIONS ---
  { path: "/3d-earth", priority: 0.7, changeFrequency: "monthly" },
  { path: "/3d-mars", priority: 0.7, changeFrequency: "monthly" },
  { path: "/3d-moon", priority: 0.7, changeFrequency: "monthly" },
  { path: "/nasa-eyes", priority: 0.7, changeFrequency: "monthly" },
  { path: "/nasa-eyes/asteroids", priority: 0.6, changeFrequency: "monthly" },
  { path: "/nasa-eyes/earth", priority: 0.6, changeFrequency: "monthly" },
  { path: "/nasa-eyes/exoplanet", priority: 0.6, changeFrequency: "monthly" },
  { path: "/nasa-eyes/solar-system", priority: 0.6, changeFrequency: "monthly" },

  // --- 4. STATIC INFO & LEGAL ---
  { path: "/about", priority: 0.5, changeFrequency: "yearly" },
  { path: "/contact-us", priority: 0.5, changeFrequency: "yearly" },
  { path: "/resources", priority: 0.4, changeFrequency: "yearly" },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms-and-conditions", priority: 0.3, changeFrequency: "yearly" },
];

const postTables = ["whats_up", "tutorials", "explainers", "custom_series_posts"];

// Published posts and author pages come from Supabase. A failure must not break
// the sitemap, so any error just drops the dynamic entries.
async function dynamicEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } },
    );
    const now = new Date().toISOString();

    const [authors, ...posts] = await Promise.all([
      supabase.from("authors").select("name"),
      ...postTables.map((table) =>
        supabase
          .from(table)
          .select("slug, updatedAt, publishDate")
          .eq("published", true)
          .or(`publishDate.is.null,publishDate.lte.${now}`),
      ),
    ]);

    const postEntries = posts.flatMap(({ data }) =>
      (data ?? []).map((p) => ({
        url: `${baseUrl}/blogs/${p.slug}`,
        lastModified: new Date(p.updatedAt ?? p.publishDate ?? Date.now()),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    );
    const authorEntries = (authors.data ?? []).map((a) => ({
      url: `${baseUrl}/authors/${encodeURIComponent(a.name)}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));
    return [...postEntries, ...authorEntries];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // No lastModified on static routes: a fake "modified now" on every URL teaches
  // Google to ignore the field.
  const staticEntries = routes.map((route) => ({
    url: new URL(route.path, baseUrl).toString(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  return [...staticEntries, ...(await dynamicEntries())];
}
