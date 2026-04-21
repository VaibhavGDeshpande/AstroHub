'use server';

export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

export interface PexelsResponse {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  next_page?: string;
  prev_page?: string;
}

export async function fetchWallpapers(query: string = 'astronomy space', page: number = 1): Promise<PexelsResponse> {
  const apiKey = process.env.PEXELS_API_KEY;
  
  if (!apiKey) {
    throw new Error('PEXELS_API_KEY is not defined in environment variables');
  }

  const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&page=${page}&per_page=30`, {
    headers: {
      Authorization: apiKey
    },
    // We can revalidate every hour or keep it cached
    next: { revalidate: 3600 }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch from Pexels API');
  }

  return res.json();
}
