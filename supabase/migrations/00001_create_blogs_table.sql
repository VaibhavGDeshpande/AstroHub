-- Create blogs table
CREATE TABLE public.blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  "coverImage" TEXT,
  published BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Create policies

-- 1. Allow public read access to published blogs
CREATE POLICY "Public users can view published blogs"
ON public.blogs
FOR SELECT
USING (published = true);

-- 2. Allow admins (or anyone with the secret for now, based on your current setup) to read all
-- Note: Since you're not using Supabase Auth for admins yet, we'll keep a broader policy or
-- rely on Server-Side admin_token check bypassing RLS using the service_role key, or
-- we can just allow public select for now and filter in the application layer.
-- Here we allow full read access to anonymous users, and we'll filter unpublished in Next.js
CREATE POLICY "Allow read access to all for now"
ON public.blogs
FOR SELECT
USING (true);

-- Since we are doing admin checks via Next.js middleware/api routes (using the admin_token cookie),
-- and using the Anon key for fetching, we will allow all operations but you should 
-- ideally use the service_role key or proper Supabase auth for inserts/updates.
-- For now, to keep it working with your current setup:
CREATE POLICY "Allow insert/update/delete for authenticated"
ON public.blogs
FOR ALL
USING (true)
WITH CHECK (true);

-- Note: The above policies are very permissive. In a production environment, 
-- you should restrict INSERT/UPDATE/DELETE strictly to authenticated admin users via Supabase Auth.
