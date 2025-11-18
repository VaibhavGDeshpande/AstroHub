import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*', // Allow all bots (Google, Bing, etc.)
      allow: '/',     
      disallow: [],   
    },
    sitemap: 'https://astrohub-live.vercel.app/sitemap.xml', 
  }
}