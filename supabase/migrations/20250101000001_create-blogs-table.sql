-- Create blogs table for auto-generated content
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    keywords TEXT[],
    estimated_read_time TEXT,
    difficulty_level TEXT,
    topic TEXT NOT NULL,
    marketing_included BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    author_id UUID REFERENCES auth.users(id),
    slug TEXT UNIQUE,
    meta_description TEXT,
    featured_image_url TEXT,
    category TEXT DEFAULT 'trading-education',
    tags TEXT[]
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_blogs_status ON public.blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON public.blogs(published_at);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON public.blogs(category);

-- Enable RLS (Row Level Security)
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public blogs are viewable by everyone" ON public.blogs
    FOR SELECT USING (status = 'published');

CREATE POLICY "Users can insert their own blogs" ON public.blogs
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own blogs" ON public.blogs
    FOR UPDATE USING (auth.uid() = author_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_blogs_updated_at 
    BEFORE UPDATE ON public.blogs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'))
           || '-' || extract(epoch from now())::text;
END;
$$ LANGUAGE plpgsql; 