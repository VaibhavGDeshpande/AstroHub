
// types/nivlCollection.ts
export interface NivlCollectionResponse {
  videos: string[];
  images: string[];
  captions: string[];
  metadata: string[];
  all: string[];
}

export interface NivlSearchParams {
  q?: string; 
  center?: string; 
  description?: string; 
  description_508?: string; 
  keywords?: string; 
  location?: string;  
  media_type?: "image" | "video" | "audio"; 
  nasa_id?: string; 
  page?: number; 
  page_size?: number; 
  photographer?: string; 
  secondary_creator?: string; 
  title?: string; 
  year_start?: string; 
  year_end?: string;
}

export interface NivlItemData {
  nasa_id: string;
  title: string;
  description: string;
  keywords?: string[];
  date_created: string;
  media_type: 'image' | 'video' | 'audio';
  center?: string;
  photographer?: string;
  location?: string;
  secondary_creator?: string;
  description_508?: string;
}

export interface NivlItemLink {
  href: string;
  rel: string;
  render: string;
}

export interface NivlItem {
  href: string;
  data: NivlItemData[];
  links: NivlItemLink[];
}

export interface NivlCollectionMetadata {
  total_hits: number;
}

export interface NivlCollection {
  version: string;
  href: string;
  metadata: NivlCollectionMetadata;
  items: NivlItem[];
}

export interface NivlSearchResponse {
  collection: NivlCollection;
}

export interface NivlAssetCollection {
  items: Array<{
    href: string;
  }>;
}

export interface NivlAssetResponse {
  collection: NivlAssetCollection;
}

// Local component types
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

export interface MediaGridProps {
  items: NivlItem[];
  onItemClick: (item: NivlItem) => void;
  loading: boolean;
}

export interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  searching: boolean;
}

export interface MediaDetailModalProps {
  item: NivlItem | null;
  onClose: () => void;
}

// NASA Centers
export const NASA_CENTERS = [
  'JPL', 'GSFC', 'JSC', 'KSC', 'LaRC', 
  'ARC', 'DFRC', 'GRC', 'LRC', 'MSFC', 'SSC'
] as const;

export type NASACenter = typeof NASA_CENTERS[number];