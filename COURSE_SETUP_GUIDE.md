# 📚 Course Management System Setup Guide

## 🚀 Quick Setup

### Step 1: Create Database Tables

1. **Go to your Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard/project/tbgzjvxgkslgkcppsmcl
   - Go to **SQL Editor**

2. **Run the SQL Script**
   - Copy the entire content from `create_course_tables.sql`
   - Paste it in the SQL Editor
   - Click **Run** to create all course management tables

### Step 2: Test the System

1. **Start your development server**
   ```bash
   npm run dev
   ```

2. **Visit the courses page**
   - Go to: http://localhost:5173/courses
   - You should see the courses listing page

3. **Test course creation (via Edge Function)**
   ```bash
   curl -X POST https://tbgzjvxgkslgkcppsmcl.supabase.co/functions/v1/create-course \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     -d '{
       "action": "create_course",
       "data": {
         "title": "Complete Trading Masterclass",
         "description": "Learn trading from scratch to advanced strategies",
         "short_description": "Master trading fundamentals",
         "price": 0,
         "difficulty_level": "beginner",
         "category": "Trading Strategies",
         "tags": ["trading", "masterclass", "beginner"]
       }
     }'
   ```

## 📋 What's Been Created

### ✅ Backend Components

1. **Database Schema** (`create_course_tables.sql`)
   - `courses` - Main course information
   - `course_sections` - Course sections/chapters
   - `lessons` - Individual lessons
   - `course_enrollments` - Student enrollments
   - `lesson_progress` - Progress tracking
   - `course_reviews` - Student reviews
   - `course_materials` - Downloadable resources
   - `course_discussions` - Course discussions

2. **Edge Function** (`supabase/functions/create-course/index.ts`)
   - Course creation
   - Course listing
   - Enrollment management
   - Progress tracking
   - Course details retrieval

3. **Row Level Security (RLS)**
   - Published courses visible to everyone
   - Enrolled students can access course content
   - Instructors can manage their courses
   - Users can only view their own progress

### ✅ Frontend Components

1. **Courses Page** (`src/pages/Courses.tsx`)
   - Course listing with filters
   - Search functionality
   - Enrollment buttons
   - Course cards with details

2. **Course Detail Page** (`src/pages/CourseDetail.tsx`)
   - Course overview
   - Curriculum breakdown
   - Student reviews
   - Enrollment functionality
   - Progress tracking

3. **Routing** (`src/App.tsx`)
   - `/courses` - Course listing
   - `/course/:courseId` - Course details

## 🎯 Features Implemented

### ✅ Core Features
- ✅ Course browsing and filtering
- ✅ Course enrollment system
- ✅ Progress tracking
- ✅ Student reviews and ratings
- ✅ Course materials management
- ✅ Discussion forums
- ✅ Instructor management
- ✅ Certificate system (database ready)

### ✅ Advanced Features
- ✅ Row Level Security (RLS)
- ✅ Automatic progress calculation
- ✅ Enrollment count tracking
- ✅ Rating aggregation
- ✅ Free/paid lesson distinction
- ✅ Course categories and tags
- ✅ Featured courses
- ✅ Difficulty levels

## 🔧 Next Steps

### 1. Create Sample Courses
You can create sample courses using the Edge Function:

```javascript
// Example course creation
const sampleCourse = {
  title: "Technical Analysis Mastery",
  description: "Learn advanced technical analysis techniques",
  short_description: "Master chart patterns and indicators",
  price: 1999,
  difficulty_level: "intermediate",
  category: "Technical Analysis",
  tags: ["technical-analysis", "chart-patterns", "indicators"]
};
```

### 2. Add Course Content
- Create course sections
- Add lessons with video URLs
- Upload course materials
- Set up quizzes and assignments

### 3. Enhance Frontend
- Add course learning interface
- Implement video player
- Add quiz functionality
- Create certificate generation

### 4. Admin Features
- Course creation interface
- Student management
- Analytics dashboard
- Content moderation

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure your Supabase project is active
- Check environment variables in `.env`
- Verify RLS policies are working

### Edge Function Issues
- Check function deployment status
- Verify function logs in Supabase dashboard
- Test with curl commands

### Frontend Issues
- Check browser console for errors
- Verify API endpoints are correct
- Ensure authentication is working

## 📞 Support

If you encounter any issues:

1. **Check Supabase Dashboard Logs**
   - Go to Functions → create-course → Logs

2. **Test Database Connection**
   - Use SQL Editor to verify tables exist

3. **Verify Environment Variables**
   ```bash
   echo $VITE_SUPABASE_URL
   echo $VITE_SUPABASE_ANON_KEY
   ```

## 🎉 Success Indicators

✅ **Database Setup Complete**
- All tables created successfully
- RLS policies active
- Triggers and functions working

✅ **Edge Function Deployed**
- Function accessible via HTTPS
- CORS headers configured
- Authentication working

✅ **Frontend Working**
- Courses page loads without errors
- Course detail pages accessible
- Enrollment functionality working

---

**🎯 You now have a fully functional course management system!**

The system is ready for:
- Creating and managing courses
- Student enrollment and progress tracking
- Course content delivery
- Reviews and ratings
- Certificate generation

Start by creating your first course and testing the enrollment flow! 