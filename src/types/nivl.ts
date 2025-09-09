export interface NivlItem {
  data: Array<{
    nasa_id: string;
    title: string;
    description?: string;
    date_created: string;
    media_type: 'image' | 'video' | 'audio';
    center?: string;
    photographer?: string;
    location?: string;
    keywords?: string[];
  }>;
  links: Array<{
    href: string;
    rel: string;
    render?: string;
  }>;
}

export interface NivlSearchParams {
  q?: string;
  media_type?: string;
  center?: string;
  year_start?: string;
  year_end?: string;
  keywords?: string;
  photographer?: string;
  location?: string;
  page?: number;
  page_size?: number;
}

export interface NivlSearchResponse {
  collection: {
    items: NivlItem[];
    metadata: {
      total_hits: number;
    };
    links?: Array<{
      rel: string;
      prompt: string;
      href: string;
    }>;
  };
}

export interface NivlAssetResponse {
  collection: {
    items: Array<{
      href: string;
    }>;
  };
}

export interface SearchFilters {
  query: string;
  mediaType: 'all' | 'image' | 'video' | 'audio';
  center: string;
  yearStart: string;
  yearEnd: string;
  keywords: string;
  photographer: string;
  location: string;
}

export const NASA_CENTERS = [
  'ARC', 'AFRC', 'GRC', 'GSFC', 'JPL', 'JSC', 'KSC', 'LaRC', 'MSFC', 'SSC'
];