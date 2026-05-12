// Blog type definitions for the multi-content-type blog system
// Each content type maps to its own Supabase table: whats_up, tutorials, explainers

export type ContentType = 'whats-up' | 'tutorial' | 'explainer';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// Maps content type to its Supabase table name
export const TABLE_MAP: Record<ContentType, string> = {
  'whats-up': 'whats_up',
  'tutorial': 'tutorials',
  'explainer': 'explainers',
};

export interface SkyEvent {
  title: string;
  date: string;
  description: string;
  visibility?: string;
}

export interface VisualAid {
  url: string;
  caption: string;
}

// Unified Blog type — all type-specific fields are optional
// since pages access them conditionally after checking contentType
export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  published: boolean;
  author: string;
  publishDate: string | null;
  createdAt: string;
  updatedAt: string;
  contentType: ContentType;
  // Eyes on the Sky fields
  skyMonth?: number;
  skyYear?: number;
  skyEvents?: SkyEvent[]; 
  previousMonthSlug?: string;
  // Tutorial fields
  difficultyLevel?: DifficultyLevel;
  estimatedReadTime?: number;
  toolsNeeded?: string[];
  // Explainer fields
  topicCategory?: string;
  keyConcepts?: string[];
  visualAids?: VisualAid[];
}

export const TOPIC_CATEGORIES = [
  'Planets',
  'Stars',
  'Galaxies',
  'Nebulae',
  'Black Holes',
  'Comets & Asteroids',
  'Telescopes & Instruments',
  'Space Missions',
  'Cosmology',
  'Astrophotography',
  'Solar System',
  'Exoplanets',
] as const;

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;
