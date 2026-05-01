-- Migration: Upgrade blogs table to support multiple content types
-- Content types: 'whats-up', 'tutorial', 'explainer'

-- Add content type discriminator
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS "contentType" TEXT DEFAULT 'explainer'
  CHECK ("contentType" IN ('whats-up', 'tutorial', 'explainer'));

-- Common new fields
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS author TEXT DEFAULT 'AstroHub';
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS "publishDate" TIMESTAMP WITH TIME ZONE;

-- "What's Up in the Sky" specific fields
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS "skyMonth" INTEGER;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS "skyYear" INTEGER;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS "skyEvents" JSONB DEFAULT '[]';
-- skyEvents shape: [{ "title": "...", "date": "...", "description": "...", "visibility": "..." }]
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS "previousMonthSlug" TEXT;

-- Tutorial specific fields
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS "difficultyLevel" TEXT
  CHECK ("difficultyLevel" IN ('beginner', 'intermediate', 'advanced') OR "difficultyLevel" IS NULL);
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS "estimatedReadTime" INTEGER;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS "toolsNeeded" TEXT[] DEFAULT '{}';

-- Explainer specific fields
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS "topicCategory" TEXT;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS "keyConcepts" TEXT[] DEFAULT '{}';
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS "visualAids" JSONB DEFAULT '[]';
-- visualAids shape: [{ "url": "...", "caption": "..." }]
