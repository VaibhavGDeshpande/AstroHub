import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astrohub.live";


type RouteConfig = {
  path: string;
  priority: number;
  changeFrequency: "hourly" | "daily" | "weekly" | "monthly" | "yearly";
};

const routes: RouteConfig[] = [
  // --- 1. CORE & HIGH FREQUENCY (Daily/Hourly Content) ---
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  { path: "/weather", priority: 0.9, changeFrequency: "hourly" }, // Real-time data
  { path: "/space-news", priority: 0.9, changeFrequency: "daily" }, // Frequent articles
  { path: "/neo", priority: 0.8, changeFrequency: "daily" }, // Updates daily
  { path: "/epic", priority: 0.7, changeFrequency: "daily" }, 

  // TEMPORARILY SHUTDOWN - Uncomment when fixed
  // { path: "/apod", priority: 0.8, changeFrequency: "daily" }, 
  // { path: "/mars-rover", priority: 0.8, changeFrequency: "daily" },
  // { path: "/solar-system", priority: 0.7, changeFrequency: "monthly" },

  // --- 2. TOOLS & RESOURCES (Weekly/Monthly Updates) ---
  // These are high value, but the tool interface itself doesn't change often
  { path: "/stellarium", priority: 0.7, changeFrequency: "monthly" },
  { path: "/sky-charts", priority: 0.7, changeFrequency: "monthly" },
  { path: "/satellite-tracker", priority: 0.7, changeFrequency: "monthly" },
  { path: "/satellite-map", priority: 0.7, changeFrequency: "monthly" },
  { path: "/telescope-calculator", priority: 0.7, changeFrequency: "monthly" },
  { path: "/exposure-calculator", priority: 0.7, changeFrequency: "monthly" },
  { path: "/light-pollution", priority: 0.7, changeFrequency: "monthly" },
  { path: "/messier", priority: 0.7, changeFrequency: "monthly" },
  { path: "/images", priority: 0.6, changeFrequency: "weekly" },
  { path: "/space-quiz", priority: 0.6, changeFrequency: "weekly" },

  // --- 3. 3D VISUALIZATIONS ---
  { path: "/3d-earth", priority: 0.7, changeFrequency: "monthly" },
  { path: "/3d-mars", priority: 0.7, changeFrequency: "monthly" },
  { path: "/3d-moon", priority: 0.7, changeFrequency: "monthly" },
  { path: "/nasa-eyes", priority: 0.7, changeFrequency: "monthly" },
  { path: "/nasa-eyes/asteroids", priority: 0.6, changeFrequency: "monthly" },
  { path: "/nasa-eyes/earth", priority: 0.6, changeFrequency: "monthly" },
  { path: "/nasa-eyes/exoplanet", priority: 0.6, changeFrequency: "monthly" },
  { path: "/nasa-eyes/solar-system", priority: 0.6, changeFrequency: "monthly" },

  // --- 4. STATIC INFO & LEGAL (Rare Updates) ---
  { path: "/about", priority: 0.5, changeFrequency: "yearly" },
  { path: "/contact-us", priority: 0.5, changeFrequency: "yearly" },
  { path: "/resources", priority: 0.4, changeFrequency: "yearly" },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms-and-conditions", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: new URL(route.path, baseUrl).toString(),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
