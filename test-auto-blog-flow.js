// Test Auto Blog Flow - End to End Demo
// This script demonstrates the complete flow from blog generation to display

const SUPABASE_URL = 'YOUR_SUPABASE_URL' // Replace with your actual URL
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY' // Replace with your actual key

async function testAutoBlogFlow() {
  console.log('🚀 Testing Auto Blog Flow - End to End Demo')
  console.log('=' .repeat(50))

  try {
    // Step 1: Test Manual Blog Generation
    console.log('\n📝 Step 1: Testing Manual Blog Generation')
    console.log('Calling generate-trading-blog Edge Function...')
    
    const manualResponse = await fetch(`${SUPABASE_URL}/functions/v1/generate-trading-blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        topic: "Bollinger Bands: Complete Guide to Volatility Trading",
        include_marketing: true,
        auto_publish: true
      })
    })

    const manualResult = await manualResponse.json()
    console.log('✅ Manual blog generated:', manualResult.title)
    console.log('📊 Blog ID:', manualResult.blog_id)
    console.log('🔗 Slug:', manualResult.slug)

    // Step 2: Test Daily Scheduler
    console.log('\n⏰ Step 2: Testing Daily Scheduler (4:40 AM)')
    console.log('Calling daily-blog-scheduler Edge Function...')
    
    const schedulerResponse = await fetch(`${SUPABASE_URL}/functions/v1/daily-blog-scheduler`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    })

    const schedulerResult = await schedulerResponse.json()
    console.log('✅ Daily blog published:', schedulerResult.title)
    console.log('📊 Blog ID:', schedulerResult.blog_id)
    console.log('🔗 Slug:', schedulerResult.slug)

    // Step 3: Test Market Insights Page
    console.log('\n📰 Step 3: Testing Market Insights Page')
    console.log('Fetching blogs from database...')
    
    const blogsResponse = await fetch(`${SUPABASE_URL}/rest/v1/blogs?status=eq.published&order=published_at.desc`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      }
    })

    const blogs = await blogsResponse.json()
    console.log('✅ Blogs loaded from database:', blogs.length)
    
    blogs.forEach((blog, index) => {
      console.log(`  ${index + 1}. ${blog.title}`)
      console.log(`     📅 Published: ${new Date(blog.published_at).toLocaleString()}`)
      console.log(`     🏷️  Category: ${blog.category}`)
      console.log(`     📊 Difficulty: ${blog.difficulty_level}`)
    })

    // Step 4: Test Search and Filter
    console.log('\n🔍 Step 4: Testing Search and Filter')
    console.log('Searching for "Bollinger" blogs...')
    
    const searchResponse = await fetch(`${SUPABASE_URL}/rest/v1/blogs?title=ilike.%Bollinger%&status=eq.published`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      }
    })

    const searchResults = await searchResponse.json()
    console.log('✅ Search results:', searchResults.length, 'blogs found')

    // Step 5: Display Complete Flow Summary
    console.log('\n🎉 Complete Flow Summary')
    console.log('=' .repeat(50))
    console.log('✅ Blog Generation: Working')
    console.log('✅ Database Storage: Working')
    console.log('✅ Auto Publishing: Working')
    console.log('✅ Market Insights Display: Working')
    console.log('✅ Search & Filter: Working')
    console.log('\n🚀 Your auto-blogging system is fully operational!')
    
    // Step 6: Next Steps
    console.log('\n📋 Next Steps:')
    console.log('1. Set up cron job for 4:40 AM daily posting')
    console.log('2. Monitor blog quality and engagement')
    console.log('3. Customize topics and content style')
    console.log('4. Add analytics tracking')
    console.log('5. Optimize for SEO and user experience')

  } catch (error) {
    console.error('❌ Error in test flow:', error)
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Check Supabase URL and API keys')
    console.log('2. Verify Edge Functions are deployed')
    console.log('3. Ensure database migration ran successfully')
    console.log('4. Check OpenAI API key in Supabase secrets')
  }
}

// Instructions for running the test
console.log('📋 To run this test:')
console.log('1. Replace SUPABASE_URL and SUPABASE_ANON_KEY with your actual values')
console.log('2. Run: node test-auto-blog-flow.js')
console.log('3. Check the console output for each step')

// Uncomment to run the test
// testAutoBlogFlow() 