-- =====================================================
-- COURSE MANAGEMENT SYSTEM - MANUAL SETUP
-- =====================================================

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

-- Create course sections table (for organizing lessons)
CREATE TABLE IF NOT EXISTS public.course_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    is_free BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    section_id UUID REFERENCES public.course_sections(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    video_url TEXT,
    video_duration INTEGER, -- in seconds
    lesson_type VARCHAR(20) DEFAULT 'video' CHECK (lesson_type IN ('video', 'text', 'quiz', 'assignment')),
    order_index INTEGER NOT NULL,
    is_free BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id, slug)
);

-- Create course enrollments table
CREATE TABLE IF NOT EXISTS public.course_enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completion_date TIMESTAMP WITH TIME ZONE,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'expired')),
    payment_id VARCHAR(255),
    payment_amount DECIMAL(10,2),
    payment_currency VARCHAR(10) DEFAULT 'INR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Create lesson progress tracking table
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    watched_duration INTEGER DEFAULT 0, -- in seconds
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- Create course reviews table
CREATE TABLE IF NOT EXISTS public.course_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    helpful_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Create course materials table (for downloadable resources)
CREATE TABLE IF NOT EXISTS public.course_materials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    file_type VARCHAR(50),
    is_free BOOLEAN DEFAULT false,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create course discussions table
CREATE TABLE IF NOT EXISTS public.course_discussions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES public.course_discussions(id) ON DELETE CASCADE, -- for replies
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Course indexes
CREATE INDEX IF NOT EXISTS idx_courses_status ON public.courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON public.courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_category ON public.courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_featured ON public.courses(featured);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);

-- Section indexes
CREATE INDEX IF NOT EXISTS idx_course_sections_course_id ON public.course_sections(course_id);
CREATE INDEX IF NOT EXISTS idx_course_sections_order ON public.course_sections(order_index);

-- Lesson indexes
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON public.lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_section_id ON public.lessons(section_id);
CREATE INDEX IF NOT EXISTS idx_lessons_status ON public.lessons(status);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON public.lessons(order_index);

-- Enrollment indexes
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_id ON public.course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course_id ON public.course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_status ON public.course_enrollments(status);

-- Progress indexes
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON public.lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_course_id ON public.lesson_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_completed ON public.lesson_progress(completed);

-- Review indexes
CREATE INDEX IF NOT EXISTS idx_course_reviews_course_id ON public.course_reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_course_reviews_user_id ON public.course_reviews(user_id);

-- Material indexes
CREATE INDEX IF NOT EXISTS idx_course_materials_course_id ON public.course_materials(course_id);

-- Discussion indexes
CREATE INDEX IF NOT EXISTS idx_course_discussions_course_id ON public.course_discussions(course_id);
CREATE INDEX IF NOT EXISTS idx_course_discussions_user_id ON public.course_discussions(user_id);
CREATE INDEX IF NOT EXISTS idx_course_discussions_parent_id ON public.course_discussions(parent_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_discussions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Courses policies
CREATE POLICY "Published courses are viewable by everyone" ON public.courses
    FOR SELECT USING (status = 'published');

CREATE POLICY "Instructors can manage their own courses" ON public.courses
    FOR ALL USING (auth.uid() = instructor_id);

-- Course sections policies
CREATE POLICY "Sections are viewable for published courses" ON public.course_sections
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.courses 
            WHERE courses.id = course_sections.course_id 
            AND courses.status = 'published'
        )
    );

CREATE POLICY "Instructors can manage sections for their courses" ON public.course_sections
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.courses 
            WHERE courses.id = course_sections.course_id 
            AND courses.instructor_id = auth.uid()
        )
    );

-- Lessons policies
CREATE POLICY "Published lessons are viewable for enrolled users" ON public.lessons
    FOR SELECT USING (
        status = 'published' AND (
            is_free = true OR 
            EXISTS (
                SELECT 1 FROM public.course_enrollments 
                WHERE course_enrollments.course_id = lessons.course_id 
                AND course_enrollments.user_id = auth.uid()
                AND course_enrollments.status = 'active'
            )
        )
    );

CREATE POLICY "Instructors can manage lessons for their courses" ON public.lessons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.courses 
            WHERE courses.id = lessons.course_id 
            AND courses.instructor_id = auth.uid()
        )
    );

-- Enrollment policies
CREATE POLICY "Users can view their own enrollments" ON public.course_enrollments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll in courses" ON public.course_enrollments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollments" ON public.course_enrollments
    FOR UPDATE USING (auth.uid() = user_id);

-- Progress policies
CREATE POLICY "Users can view their own progress" ON public.lesson_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.lesson_progress
    FOR ALL USING (auth.uid() = user_id);

-- Review policies
CREATE POLICY "Published reviews are viewable by everyone" ON public.course_reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for courses they're enrolled in" ON public.course_reviews
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.course_enrollments 
            WHERE course_enrollments.course_id = course_reviews.course_id 
            AND course_enrollments.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own reviews" ON public.course_reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- Material policies
CREATE POLICY "Materials are viewable for enrolled users" ON public.course_materials
    FOR SELECT USING (
        is_free = true OR
        EXISTS (
            SELECT 1 FROM public.course_enrollments 
            WHERE course_enrollments.course_id = course_materials.course_id 
            AND course_enrollments.user_id = auth.uid()
            AND course_enrollments.status = 'active'
        )
    );

CREATE POLICY "Instructors can manage materials for their courses" ON public.course_materials
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.courses 
            WHERE courses.id = course_materials.course_id 
            AND courses.instructor_id = auth.uid()
        )
    );

-- Discussion policies
CREATE POLICY "Discussions are viewable for enrolled users" ON public.course_discussions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.course_enrollments 
            WHERE course_enrollments.course_id = course_discussions.course_id 
            AND course_enrollments.user_id = auth.uid()
            AND course_enrollments.status = 'active'
        )
    );

CREATE POLICY "Enrolled users can create discussions" ON public.course_discussions
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.course_enrollments 
            WHERE course_enrollments.course_id = course_discussions.course_id 
            AND course_enrollments.user_id = auth.uid()
            AND course_enrollments.status = 'active'
        )
    );

CREATE POLICY "Users can update their own discussions" ON public.course_discussions
    FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update course enrollment count
CREATE OR REPLACE FUNCTION update_course_enrollment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.courses 
        SET enrollment_count = enrollment_count + 1
        WHERE id = NEW.course_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.courses 
        SET enrollment_count = enrollment_count - 1
        WHERE id = OLD.course_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to update course rating
CREATE OR REPLACE FUNCTION update_course_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.courses 
    SET 
        rating = (
            SELECT COALESCE(AVG(rating), 0) 
            FROM public.course_reviews 
            WHERE course_id = COALESCE(NEW.course_id, OLD.course_id)
        ),
        review_count = (
            SELECT COUNT(*) 
            FROM public.course_reviews 
            WHERE course_id = COALESCE(NEW.course_id, OLD.course_id)
        )
    WHERE id = COALESCE(NEW.course_id, OLD.course_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to update lesson progress
CREATE OR REPLACE FUNCTION update_lesson_progress()
RETURNS TRIGGER AS $$
DECLARE
    total_lessons INTEGER;
    completed_lessons INTEGER;
    course_progress DECIMAL(5,2);
BEGIN
    -- Get total lessons for the course
    SELECT COUNT(*) INTO total_lessons
    FROM public.lessons 
    WHERE course_id = NEW.course_id AND status = 'published';
    
    -- Get completed lessons for the user
    SELECT COUNT(*) INTO completed_lessons
    FROM public.lesson_progress 
    WHERE user_id = NEW.user_id 
    AND course_id = NEW.course_id 
    AND completed = true;
    
    -- Calculate progress percentage
    IF total_lessons > 0 THEN
        course_progress := (completed_lessons::DECIMAL / total_lessons::DECIMAL) * 100;
    ELSE
        course_progress := 0;
    END IF;
    
    -- Update enrollment progress
    UPDATE public.course_enrollments 
    SET progress_percentage = course_progress
    WHERE user_id = NEW.user_id AND course_id = NEW.course_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_course_enrollment_count_trigger
    AFTER INSERT OR DELETE ON public.course_enrollments
    FOR EACH ROW
    EXECUTE FUNCTION update_course_enrollment_count();

CREATE TRIGGER update_course_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.course_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_course_rating();

CREATE TRIGGER update_lesson_progress_trigger
    AFTER INSERT OR UPDATE ON public.lesson_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_lesson_progress();

-- Create triggers for updated_at
CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON public.courses
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_sections_updated_at
    BEFORE UPDATE ON public.course_sections
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
    BEFORE UPDATE ON public.lessons
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_enrollments_updated_at
    BEFORE UPDATE ON public.course_enrollments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lesson_progress_updated_at
    BEFORE UPDATE ON public.lesson_progress
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_reviews_updated_at
    BEFORE UPDATE ON public.course_reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_materials_updated_at
    BEFORE UPDATE ON public.course_materials
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_discussions_updated_at
    BEFORE UPDATE ON public.course_discussions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column(); 