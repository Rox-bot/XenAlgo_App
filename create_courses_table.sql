-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    thumbnail_url TEXT,
    banner_url TEXT,
    price DECIMAL(10,2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'INR',
    duration_hours INTEGER DEFAULT 0,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    category VARCHAR(100),
    tags TEXT[],
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    featured BOOLEAN DEFAULT false,
    enrollment_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    instructor_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a test course
INSERT INTO public.courses (
    title,
    slug,
    description,
    short_description,
    price,
    difficulty_level,
    category,
    tags,
    status,
    featured,
    duration_hours
) VALUES (
    'Complete Trading Masterclass',
    'complete-trading-masterclass',
    'Learn trading from scratch to advanced strategies. This comprehensive course covers everything from basic market concepts to advanced trading techniques.',
    'Master trading fundamentals and advanced strategies',
    0.00,
    'beginner',
    'Trading Strategies',
    ARRAY['trading', 'masterclass', 'beginner'],
    'published',
    true,
    10
);

-- Create another test course
INSERT INTO public.courses (
    title,
    slug,
    description,
    short_description,
    price,
    difficulty_level,
    category,
    tags,
    status,
    featured,
    duration_hours
) VALUES (
    'Advanced Options Trading',
    'advanced-options-trading',
    'Master the art of options trading with advanced strategies, risk management, and portfolio optimization techniques.',
    'Advanced options strategies and risk management',
    999.00,
    'advanced',
    'Options Trading',
    ARRAY['options', 'advanced', 'strategies'],
    'published',
    false,
    15
); 