-- =====================================================
-- COURSE MANAGEMENT SYSTEM
-- =====================================================

-- Create courses table
CREATE TABLE public.courses (
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
CREATE TABLE public.course_sections (
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
CREATE TABLE public.lessons (
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
CREATE TABLE public.course_enrollments (
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
CREATE TABLE public.lesson_progress (
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

-- Create quizzes table
CREATE TABLE public.quizzes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    time_limit INTEGER, -- in minutes, NULL for no limit
    passing_score INTEGER DEFAULT 70, -- percentage
    max_attempts INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz questions table
CREATE TABLE public.quiz_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false', 'fill_blank')),
    options JSONB, -- for multiple choice questions
    correct_answer TEXT,
    explanation TEXT,
    points INTEGER DEFAULT 1,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz attempts table
CREATE TABLE public.quiz_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    score INTEGER,
    max_score INTEGER,
    passed BOOLEAN,
    attempt_number INTEGER DEFAULT 1,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    answers JSONB, -- store user answers
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assignments table
CREATE TABLE public.assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    max_points INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assignment submissions table
CREATE TABLE public.assignment_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    submission_text TEXT,
    file_url TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    graded BOOLEAN DEFAULT false,
    score INTEGER,
    feedback TEXT,
    graded_by UUID REFERENCES auth.users(id),
    graded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create certificates table
CREATE TABLE public.certificates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    certificate_number VARCHAR(255) UNIQUE NOT NULL,
    issued_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expiry_date TIMESTAMP WITH TIME ZONE,
    certificate_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Create course reviews table
CREATE TABLE public.course_reviews (
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
CREATE TABLE public.course_materials (
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
CREATE TABLE public.course_discussions (
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
CREATE INDEX idx_courses_status ON public.courses(status);
CREATE INDEX idx_courses_instructor_id ON public.courses(instructor_id);
CREATE INDEX idx_courses_category ON public.courses(category);
CREATE INDEX idx_courses_featured ON public.courses(featured);
CREATE INDEX idx_courses_slug ON public.courses(slug);

-- Section indexes
CREATE INDEX idx_course_sections_course_id ON public.course_sections(course_id);
CREATE INDEX idx_course_sections_order ON public.course_sections(order_index);

-- Lesson indexes
CREATE INDEX idx_lessons_course_id ON public.lessons(course_id);
CREATE INDEX idx_lessons_section_id ON public.lessons(section_id);
CREATE INDEX idx_lessons_status ON public.lessons(status);
CREATE INDEX idx_lessons_order ON public.lessons(order_index);

-- Enrollment indexes
CREATE INDEX idx_course_enrollments_user_id ON public.course_enrollments(user_id);
CREATE INDEX idx_course_enrollments_course_id ON public.course_enrollments(course_id);
CREATE INDEX idx_course_enrollments_status ON public.course_enrollments(status);

-- Progress indexes
CREATE INDEX idx_lesson_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson_id ON public.lesson_progress(lesson_id);
CREATE INDEX idx_lesson_progress_course_id ON public.lesson_progress(course_id);
CREATE INDEX idx_lesson_progress_completed ON public.lesson_progress(completed);

-- Quiz indexes
CREATE INDEX idx_quizzes_lesson_id ON public.quizzes(lesson_id);
CREATE INDEX idx_quiz_questions_quiz_id ON public.quiz_questions(quiz_id);
CREATE INDEX idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON public.quiz_attempts(quiz_id);

-- Assignment indexes
CREATE INDEX idx_assignments_lesson_id ON public.assignments(lesson_id);
CREATE INDEX idx_assignment_submissions_user_id ON public.assignment_submissions(user_id);
CREATE INDEX idx_assignment_submissions_assignment_id ON public.assignment_submissions(assignment_id);

-- Certificate indexes
CREATE INDEX idx_certificates_user_id ON public.certificates(user_id);
CREATE INDEX idx_certificates_course_id ON public.certificates(course_id);

-- Review indexes
CREATE INDEX idx_course_reviews_course_id ON public.course_reviews(course_id);
CREATE INDEX idx_course_reviews_user_id ON public.course_reviews(user_id);

-- Material indexes
CREATE INDEX idx_course_materials_course_id ON public.course_materials(course_id);

-- Discussion indexes
CREATE INDEX idx_course_discussions_course_id ON public.course_discussions(course_id);
CREATE INDEX idx_course_discussions_user_id ON public.course_discussions(user_id);
CREATE INDEX idx_course_discussions_parent_id ON public.course_discussions(parent_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
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

-- Quiz policies
CREATE POLICY "Quizzes are viewable for enrolled users" ON public.quizzes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.course_enrollments 
            WHERE course_enrollments.course_id = (
                SELECT course_id FROM public.lessons WHERE lessons.id = quizzes.lesson_id
            )
            AND course_enrollments.user_id = auth.uid()
            AND course_enrollments.status = 'active'
        )
    );

CREATE POLICY "Instructors can manage quizzes" ON public.quizzes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.courses 
            WHERE courses.id = (
                SELECT course_id FROM public.lessons WHERE lessons.id = quizzes.lesson_id
            )
            AND courses.instructor_id = auth.uid()
        )
    );

-- Quiz questions policies
CREATE POLICY "Quiz questions are viewable for enrolled users" ON public.quiz_questions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.course_enrollments 
            WHERE course_enrollments.course_id = (
                SELECT course_id FROM public.lessons WHERE lessons.id = (
                    SELECT lesson_id FROM public.quizzes WHERE quizzes.id = quiz_questions.quiz_id
                )
            )
            AND course_enrollments.user_id = auth.uid()
            AND course_enrollments.status = 'active'
        )
    );

CREATE POLICY "Instructors can manage quiz questions" ON public.quiz_questions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.courses 
            WHERE courses.id = (
                SELECT course_id FROM public.lessons WHERE lessons.id = (
                    SELECT lesson_id FROM public.quizzes WHERE quizzes.id = quiz_questions.quiz_id
                )
            )
            AND courses.instructor_id = auth.uid()
        )
    );

-- Quiz attempts policies
CREATE POLICY "Users can view their own quiz attempts" ON public.quiz_attempts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quiz attempts" ON public.quiz_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quiz attempts" ON public.quiz_attempts
    FOR UPDATE USING (auth.uid() = user_id);

-- Assignment policies
CREATE POLICY "Assignments are viewable for enrolled users" ON public.assignments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.course_enrollments 
            WHERE course_enrollments.course_id = (
                SELECT course_id FROM public.lessons WHERE lessons.id = assignments.lesson_id
            )
            AND course_enrollments.user_id = auth.uid()
            AND course_enrollments.status = 'active'
        )
    );

CREATE POLICY "Instructors can manage assignments" ON public.assignments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.courses 
            WHERE courses.id = (
                SELECT course_id FROM public.lessons WHERE lessons.id = assignments.lesson_id
            )
            AND courses.instructor_id = auth.uid()
        )
    );

-- Assignment submission policies
CREATE POLICY "Users can view their own submissions" ON public.assignment_submissions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own submissions" ON public.assignment_submissions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions" ON public.assignment_submissions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Instructors can view all submissions for their courses" ON public.assignment_submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.courses 
            WHERE courses.id = (
                SELECT course_id FROM public.lessons WHERE lessons.id = (
                    SELECT lesson_id FROM public.assignments WHERE assignments.id = assignment_submissions.assignment_id
                )
            )
            AND courses.instructor_id = auth.uid()
        )
    );

CREATE POLICY "Instructors can grade submissions" ON public.assignment_submissions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.courses 
            WHERE courses.id = (
                SELECT course_id FROM public.lessons WHERE lessons.id = (
                    SELECT lesson_id FROM public.assignments WHERE assignments.id = assignment_submissions.assignment_id
                )
            )
            AND courses.instructor_id = auth.uid()
        )
    );

-- Certificate policies
CREATE POLICY "Users can view their own certificates" ON public.certificates
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Instructors can view certificates for their courses" ON public.certificates
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.courses 
            WHERE courses.id = certificates.course_id 
            AND courses.instructor_id = auth.uid()
        )
    );

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

-- Function to generate certificate number
CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'CERT-' || extract(epoch from now())::text || '-' || floor(random() * 1000)::text;
END;
$$ LANGUAGE plpgsql;

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

CREATE TRIGGER update_quizzes_updated_at
    BEFORE UPDATE ON public.quizzes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quiz_questions_updated_at
    BEFORE UPDATE ON public.quiz_questions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quiz_attempts_updated_at
    BEFORE UPDATE ON public.quiz_attempts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at
    BEFORE UPDATE ON public.assignments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assignment_submissions_updated_at
    BEFORE UPDATE ON public.assignment_submissions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_certificates_updated_at
    BEFORE UPDATE ON public.certificates
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
