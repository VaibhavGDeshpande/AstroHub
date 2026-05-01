-- Migration: Create separate tables for each blog content type
-- Run this in the Supabase SQL Editor

-- =============================================
-- 1. WHAT'S UP IN THE SKY TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.whats_up (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  "coverImage" TEXT,
  published BOOLEAN DEFAULT false,
  author TEXT DEFAULT 'AstroHub',
  "publishDate" TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  -- What's Up specific fields
  "skyMonth" INTEGER,
  "skyYear" INTEGER,
  "skyEvents" JSONB DEFAULT '[]',
  "previousMonthSlug" TEXT
);

ALTER TABLE public.whats_up ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published whats_up"
ON public.whats_up FOR SELECT USING (true);

CREATE POLICY "Allow all operations on whats_up"
ON public.whats_up FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- 2. TUTORIALS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.tutorials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  "coverImage" TEXT,
  published BOOLEAN DEFAULT false,
  author TEXT DEFAULT 'AstroHub',
  "publishDate" TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  -- Tutorial specific fields
  "difficultyLevel" TEXT CHECK ("difficultyLevel" IN ('beginner', 'intermediate', 'advanced') OR "difficultyLevel" IS NULL),
  "estimatedReadTime" INTEGER,
  "toolsNeeded" TEXT[] DEFAULT '{}'
);

ALTER TABLE public.tutorials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published tutorials"
ON public.tutorials FOR SELECT USING (true);

CREATE POLICY "Allow all operations on tutorials"
ON public.tutorials FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- 3. EXPLAINERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.explainers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  "coverImage" TEXT,
  published BOOLEAN DEFAULT false,
  author TEXT DEFAULT 'AstroHub',
  "publishDate" TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  -- Explainer specific fields
  "topicCategory" TEXT,
  "keyConcepts" TEXT[] DEFAULT '{}',
  "visualAids" JSONB DEFAULT '[]'
);

ALTER TABLE public.explainers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published explainers"
ON public.explainers FOR SELECT USING (true);

CREATE POLICY "Allow all operations on explainers"
ON public.explainers FOR ALL USING (true) WITH CHECK (true);
