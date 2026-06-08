// Blog type definitions for the multi-content-type blog system
// Each content type maps to its own Supabase table: whats_up, tutorials, explainers, custom_series_posts

export type ContentType = 'whats-up' | 'tutorial' | 'explainer' | 'custom-series';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// Maps content type to its Supabase table name
export const TABLE_MAP: Record<string, string> = {
  'whats-up': 'whats_up',
  'tutorial': 'tutorials',
  'explainer': 'explainers',
  'custom-series': 'custom_series_posts',
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

// Author stored in DB for multi-author login
export interface Author {
  id: string;
  name: string;
  display_name: string;
  avatar_url: string;
  role: 'author' | 'admin';
  created_at: string;
  updated_at: string;
}

// Custom Series definition
export interface CustomSeries {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
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
  author_id?: string;
  app_author_id?: string;
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
  // Custom Series fields
  series_id?: string;
  seriesName?: string;
  seriesSlug?: string;
  metadata?: Record<string, unknown>;
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

// Lucide icon options for custom series
export const SERIES_ICONS = [
  'star', 'telescope', 'moon', 'sun', 'sparkles', 'orbit',
  'globe', 'rocket', 'zap', 'compass', 'flame', 'eye',
  'camera', 'mountain', 'cloud', 'atom', 'radio', 'satellite',
] as const;
