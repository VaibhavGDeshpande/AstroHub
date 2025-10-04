export interface Author {
  name: string;
  socials: Record<string, string | null>;
}

export interface Article {
  id: number;
  title: string;
  authors: Author[];
  url: string;
  image_url: string;
  news_site: string;
  summary: string;
  published_at: string;
  updated_at: string;
  featured: boolean;
  launches: any[];
  events: any[];
}

export interface ArticlesResponse {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: Article[];
}

export async function getSpaceflightArticles(
  params: { [key: string]: string | number | boolean } = {}
): Promise<ArticlesResponse> {
  try {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      qs.set(key, String(value));
    });
    const url = `https://api.spaceflightnewsapi.net/v4/articles?${qs.toString()}`;
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data: ArticlesResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Spaceflight articles:', error);
    throw error;
  }
}
