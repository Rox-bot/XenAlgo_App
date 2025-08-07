# 🔧 Environment Variables Setup Guide

## 🚨 Current Issue
Your `.env` file contains placeholder values instead of actual Supabase credentials, which is causing the course page to show blank.

## ✅ Quick Fix

### Step 1: Get Your Supabase Credentials

1. **Go to your Supabase Dashboard:**
   - https://supabase.com/dashboard/project/tbgzjvxgkslgkcppsmcl

2. **Navigate to Settings → API:**
   - Copy the **Project URL**
   - Copy the **anon public** key

### Step 2: Update Your .env File

Replace the placeholder values in your `.env` file:

```bash
# Current (placeholder values)
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Replace with your actual values (example)
VITE_SUPABASE_URL=https://tbgzjvxgkslgkcppsmcl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

### Step 3: Restart Your Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## 🔍 How to Find Your Credentials

### In Supabase Dashboard:

1. **Project URL:**
   - Go to Settings → API
   - Copy the "Project URL" (starts with `https://`)

2. **Anon Key:**
   - In the same Settings → API page
   - Copy the "anon public" key (starts with `eyJ`)

## 🧪 Test the Setup

After updating your `.env` file:

1. **Visit:** http://localhost:5173/courses
2. **You should see:**
   - The courses page loads without errors
   - No more "Configuration Error" messages
   - The page shows "0 courses found" (since no courses exist yet)

## 🚀 Create Your First Course

Once the environment is set up, you can create a test course:

```bash
curl -X POST https://tbgzjvxgkslgkcppsmcl.supabase.co/functions/v1/create-course \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACTUAL_ANON_KEY" \
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

## 🐛 Troubleshooting

### If you still see errors:

1. **Check your .env file:**
   ```bash
   cat .env
   ```

2. **Verify the values are correct:**
   - No placeholder text
   - URLs start with `https://`
   - Keys start with `eyJ`

3. **Restart the dev server:**
   ```bash
   npm run dev
   ```

4. **Clear browser cache:**
   - Hard refresh (Ctrl+Shift+R)

## ✅ Success Indicators

- ✅ No more "Configuration Error" messages
- ✅ Courses page loads without blank screen
- ✅ No console errors about environment variables
- ✅ API calls work properly

---

**🎯 Once you update the environment variables, the course system will work perfectly!** 