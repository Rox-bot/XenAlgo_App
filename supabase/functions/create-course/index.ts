// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { action, data } = await req.json()

    switch (action) {
      case 'create_course':
        return await handleCreateCourse(supabaseClient, data)
      
      case 'get_courses':
        return await handleGetCourses(supabaseClient, data)
      
      case 'enroll_course':
        return await handleEnrollCourse(supabaseClient, data)
      
      case 'get_course_progress':
        return await handleGetCourseProgress(supabaseClient, data)
      
      case 'update_lesson_progress':
        return await handleUpdateLessonProgress(supabaseClient, data)
      
      case 'get_course_details':
        return await handleGetCourseDetails(supabaseClient, data)
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function handleCreateCourse(supabase: any, data: any) {
  const { 
    title, 
    description, 
    short_description, 
    price = 0, 
    difficulty_level = 'beginner',
    category,
    tags = [],
    thumbnail_url,
    banner_url,
    duration_hours = 0
  } = data

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Generate slug from title
  const slug = title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-') + '-' + Date.now()

  // Create course
  const { data: course, error } = await supabase
    .from('courses')
    .insert({
      title,
      slug,
      description,
      short_description,
      price,
      difficulty_level,
      category,
      tags,
      thumbnail_url,
      banner_url,
      duration_hours,
      instructor_id: user.id,
      status: 'draft'
    })
    .select()
    .single()

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ success: true, course }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleGetCourses(supabase: any, data: any) {
  const { 
    status = 'published', 
    category, 
    difficulty_level, 
    featured,
    limit = 20,
    offset = 0
  } = data

  let query = supabase
    .from('courses')
    .select('*')
    .eq('status', status)
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }

  if (difficulty_level) {
    query = query.eq('difficulty_level', difficulty_level)
  }

  if (featured !== undefined) {
    query = query.eq('featured', featured)
  }

  const { data: courses, error } = await query

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ success: true, courses }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleEnrollCourse(supabase: any, data: any) {
  const { course_id } = data

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Check if already enrolled
  const { data: existingEnrollment } = await supabase
    .from('course_enrollments')
    .select()
    .eq('user_id', user.id)
    .eq('course_id', course_id)
    .single()

  if (existingEnrollment) {
    return new Response(
      JSON.stringify({ error: 'Already enrolled in this course' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Create enrollment
  const { data: enrollment, error } = await supabase
    .from('course_enrollments')
    .insert({
      user_id: user.id,
      course_id,
      status: 'active'
    })
    .select()
    .single()

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ success: true, enrollment }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleGetCourseProgress(supabase: any, data: any) {
  const { course_id } = data

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Get enrollment
  const { data: enrollment, error: enrollmentError } = await supabase
    .from('course_enrollments')
    .select()
    .eq('user_id', user.id)
    .eq('course_id', course_id)
    .single()

  if (enrollmentError || !enrollment) {
    return new Response(
      JSON.stringify({ error: 'Not enrolled in this course' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Get lesson progress
  const { data: lessonProgress, error: progressError } = await supabase
    .from('lesson_progress')
    .select(`
      *,
      lesson:lessons(*)
    `)
    .eq('user_id', user.id)
    .eq('course_id', course_id)

  if (progressError) {
    return new Response(
      JSON.stringify({ error: progressError.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      enrollment, 
      lessonProgress 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleUpdateLessonProgress(supabase: any, data: any) {
  const { 
    lesson_id, 
    course_id, 
    watched_duration, 
    completed = false 
  } = data

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Check if enrolled
  const { data: enrollment } = await supabase
    .from('course_enrollments')
    .select()
    .eq('user_id', user.id)
    .eq('course_id', course_id)
    .single()

  if (!enrollment) {
    return new Response(
      JSON.stringify({ error: 'Not enrolled in this course' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Update or create lesson progress
  const progressData = {
    user_id: user.id,
    lesson_id,
    course_id,
    watched_duration,
    completed,
    last_watched_at: new Date().toISOString()
  }

  if (completed) {
    progressData.completed_at = new Date().toISOString()
  }

  const { data: progress, error } = await supabase
    .from('lesson_progress')
    .upsert(progressData, { onConflict: 'user_id,lesson_id' })
    .select()
    .single()

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ success: true, progress }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleGetCourseDetails(supabase: any, data: any) {
  const { course_id } = data

  // Get course with instructor details
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select(`
      *,
      instructor:profiles!courses_instructor_id_fkey(full_name, avatar_url)
    `)
    .eq('id', course_id)
    .single()

  if (courseError || !course) {
    return new Response(
      JSON.stringify({ error: 'Course not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Get course sections
  const { data: sections, error: sectionsError } = await supabase
    .from('course_sections')
    .select(`
      *,
      lessons(*)
    `)
    .eq('course_id', course_id)
    .order('order_index')

  if (sectionsError) {
    return new Response(
      JSON.stringify({ error: sectionsError.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Get course materials
  const { data: materials, error: materialsError } = await supabase
    .from('course_materials')
    .select()
    .eq('course_id', course_id)

  if (materialsError) {
    return new Response(
      JSON.stringify({ error: materialsError.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Get course reviews
  const { data: reviews, error: reviewsError } = await supabase
    .from('course_reviews')
    .select(`
      *,
      user:profiles!course_reviews_user_id_fkey(full_name, avatar_url)
    `)
    .eq('course_id', course_id)
    .order('created_at', { ascending: false })
    .limit(10)

  if (reviewsError) {
    return new Response(
      JSON.stringify({ error: reviewsError.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      course, 
      sections, 
      materials, 
      reviews 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
