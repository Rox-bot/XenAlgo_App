import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Daily rotating topics for variety
const DAILY_TOPICS = [
  "Bollinger Bands: Complete Guide to Volatility Trading",
  "MACD Indicator: Master the Momentum Oscillator", 
  "RSI (Relative Strength Index): Overbought and Oversold Signals",
  "Moving Averages: Simple vs Exponential - Which to Use?",
  "Stochastic Oscillator: Timing Your Entries Perfectly",
  "Williams %R: Advanced Momentum Analysis",
  "ADX Indicator: Measuring Trend Strength",
  "Fibonacci Retracements: Golden Ratio in Trading",
  "Support and Resistance: Key Levels Every Trader Must Know",
  "Volume Analysis: The Hidden Market Indicator",
  "Market Psychology: Understanding Fear and Greed",
  "Price Action Trading: Reading Candlestick Patterns",
  "Chart Patterns: Head and Shoulders, Triangles, Flags",
  "Swing Trading Strategies: 5-Day to 2-Week Holds",
  "Day Trading Techniques: Intraday Profit Strategies",
  "Position Sizing: The Key to Long-Term Success",
  "Stop Loss Strategies: Protecting Your Capital",
  "Risk-Reward Ratios: The 1:2 Rule",
  "Options Basics: Calls, Puts, and Strike Prices",
  "Implied Volatility: The Options Trader's Friend",
  "Iron Condors: Profiting from Sideways Markets",
  "Butterfly Spreads: Limited Risk, High Reward",
  "Options Greeks: Delta, Gamma, Theta, Vega",
  "Portfolio Management: Diversification Strategies",
  "Money Management: Never Risk More Than 2%",
  "Drawdown Management: Surviving Losing Streaks",
  "Market Structure: Higher Highs, Lower Lows",
  "Trend Analysis: Identifying Market Direction",
  "Breakout Trading: Catching the Big Moves",
  "Pullback Trading: Buying the Dips",
  "Range Trading: Profiting from Sideways Markets"
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get today's topic (rotate through topics based on day of month)
    const today = new Date()
    const dayOfMonth = today.getDate()
    const topicIndex = (dayOfMonth - 1) % DAILY_TOPICS.length
    const todayTopic = DAILY_TOPICS[topicIndex]

    // Check if we already published a blog today (for 4:40 AM testing)
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)

    const { data: existingBlogs, error: checkError } = await supabase
      .from('blogs')
      .select('id')
      .eq('status', 'published')
      .gte('published_at', startOfDay.toISOString())
      .lt('published_at', endOfDay.toISOString())

    if (checkError) {
      console.error('Error checking existing blogs:', checkError)
      return new Response(
        JSON.stringify({ error: 'Failed to check existing blogs' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // For testing: Allow multiple blogs per day, but add timestamp to avoid conflicts
    const blogSuffix = `-${Date.now()}`

    // Generate blog content using OpenAI
    const prompt = `# GPT-3.5 Optimized Auto-Blog Prompt

## Important: GPT-3.5 Specific Instructions
GPT-3.5 needs more explicit guidance and examples. Follow these instructions exactly to ensure consistent quality output.

## Role & Context
You are a trading education expert. Generate a complete HTML blog post for automatic publishing. Focus on simple explanations with concrete examples.

## Content Requirements - FOLLOW THIS STRUCTURE EXACTLY:

### 1. Title Format (Choose one pattern):
- "📈 Why [Concept] is Perfect for Beginners"
- "💡 The Simple [Strategy] That Actually Works"  
- "⚠️ [Mistake] 90% of New Traders Make"
- "🎯 How to [Action] Like a Pro Trader"

### 2. Required HTML Structure:
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[YOUR TITLE HERE]</title>
    <style>
        .blog-post{max-width:800px;margin:0 auto;padding:20px;font-family:'Segoe UI',sans-serif;line-height:1.6;color:#4a5568}
        .post-title{font-size:2.2rem;font-weight:bold;color:#1a365d;margin-bottom:10px}
        .post-meta{display:flex;gap:20px;margin-bottom:30px;font-size:0.9rem;color:#718096}
        h2{font-size:1.75rem;color:#2c5aa0;margin:40px 0 20px 0;border-left:4px solid #2c5aa0;padding-left:15px}
        h3{font-size:1.4rem;color:#2d3748;margin:30px 0 15px 0}
        .callout-box{margin:30px 0;padding:20px;border-radius:8px;border-left:5px solid;box-shadow:0 2px 8px rgba(0,0,0,0.1)}
        .pro-tip{background:linear-gradient(135deg,#e6fffa 0%,#b2f5ea 100%);border-left-color:#38a169}
        .warning{background:linear-gradient(135deg,#fffaf0 0%,#fed7aa 100%);border-left-color:#dd6b20}
        .calculation-box{background:#f7fafc;border:2px dashed #cbd5e0;padding:20px;margin:25px 0;border-radius:8px}
        .key-takeaways{background:linear-gradient(135deg,#f0fff4 0%,#c6f6d5 100%);padding:25px;border-radius:10px;margin:30px 0;border-left:5px solid #38a169}
        .takeaway-list{list-style:none;padding:0}
        .takeaway-list li{padding:8px 0;font-weight:500}
        .profit{color:#38a169;font-weight:bold}
        .loss{color:#e53e3e;font-weight:bold}
        .highlight{background:linear-gradient(120deg,#ffd700 0%,#ffed4e 100%);padding:2px 6px;border-radius:3px}
        .cta-box{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:30px;border-radius:12px;text-align:center;margin:40px 0}
        .cta-button{display:inline-block;background:white;color:#667eea;padding:12px 30px;border-radius:25px;text-decoration:none;font-weight:bold;margin-top:15px}
        @media (max-width:768px){.blog-post{padding:15px}.post-title{font-size:1.8rem}}
    </style>
</head>
<body>
    <article class="blog-post">
        <h1 class="post-title">[TITLE WITH EMOJI]</h1>
        <div class="post-meta">
            <span>📖 5 min read</span>
            <span>💹 Trading Education</span>
        </div>
        
        [CONTENT GOES HERE - FOLLOW STRUCTURE BELOW]
        
    </article>
</body>
</html>
\`\`\`

### 3. Content Structure - MUST INCLUDE ALL SECTIONS:

**INTRODUCTION (100-150 words):**
- Start with simple analogy (like comparing trading to everyday activity)
- Explain why beginners need this knowledge
- Promise specific value they'll get

**MAIN CONTENT (800-1000 words) - EXACTLY 3 SECTIONS:**

**Section 1: What is [Topic]?**
- Define the concept simply
- Use analogy to explain
- Include one calculation box with real numbers

**Section 2: How [Topic] Works in Practice**
- Show 2 specific examples with dollar amounts
- Include one callout box (pro-tip or warning)
- Use realistic stock prices and percentages

**Section 3: Simple Strategy You Can Use**
- Give actionable steps
- Include specific numbers
- Mention course connection naturally

### 4. Required Elements - MUST INCLUDE:

**ONE Calculation Box:**
\`\`\`html
<div class="calculation-box">
    <h4>📊 Example Calculation</h4>
    <p><strong>Scenario:</strong> [Setup]<br>
    <strong>Calculation:</strong> [Show math]<br>
    <strong>Result:</strong> <span class="profit">$XXX profit</span> or <span class="loss">$XXX loss</span></p>
</div>
\`\`\`

**ONE Callout Box (choose pro-tip OR warning):**
\`\`\`html
<div class="callout-box pro-tip">
    <h4>💡 Pro Tip</h4>
    <p>[Helpful insight that beginners wouldn't know]</p>
</div>
\`\`\`

**Key Takeaways Section:**
\`\`\`html
<div class="key-takeaways">
    <h3>🎯 Key Takeaways</h3>
    <ul class="takeaway-list">
        <li>✅ [Simple actionable point]</li>
        <li>✅ [Important concept to remember]</li>
        <li>✅ [Practical tip they can use today]</li>
        <li>✅ [Risk management reminder]</li>
    </ul>
</div>
\`\`\`

**Call-to-Action (EXACT FORMAT):**
\`\`\`html
<div class="cta-box">
    <h4>🚀 Ready to Learn More?</h4>
    <p>This strategy is one of 50+ techniques covered in our comprehensive trading course. Get step-by-step guidance and real-world examples.</p>
    <a href="/course" class="cta-button">Start Learning Today</a>
</div>
\`\`\`

## Writing Guidelines for GPT-3.5:

### Language Rules:
- Use simple sentences (under 20 words)
- Explain every trading term immediately
- Write like talking to a college student
- Use "you" throughout
- No complex compound sentences

### Examples Must Include:
- Specific stock prices (like $150, $145, etc.)
- Exact percentages (like 15% gain, 5% loss)
- Dollar amounts (like $1,000 investment, $150 profit)
- Time frames (like "over 30 days" or "in 2 weeks")

### Course Integration (Include 2-3 mentions):
- "This is exactly what we teach in Module 3 of our trading course..."
- "Students in our program practice this with real examples..."
- "Our comprehensive course covers this plus 49 other strategies..."

## Quality Checklist - VERIFY BEFORE OUTPUT:
✓ Title has emoji and is under 80 characters
✓ Introduction uses simple analogy
✓ Exactly 3 main sections with H2 headings
✓ One calculation box with real numbers
✓ One callout box (tip or warning)
✓ Key takeaways with checkmarks
✓ Natural course mentions (2-3 times)
✓ CTA section at the end
✓ All HTML tags properly closed
✓ Profit/loss spans used for numbers
✓ Highlight spans for important terms

## Specific Topic: "${todayTopic}"

## Marketing Integration:
- Naturally mention XenAlgo trading indicators throughout the content
- Include references to XenAlgo courses and tools
- Add call-to-action for XenAlgo premium indicators
- Mention how XenAlgo tools can help implement the strategies discussed
- Include testimonials or success stories related to XenAlgo

---

**CRITICAL:** Output ONLY the complete HTML code. Do not include any explanations or comments outside the HTML. Start with \`<!DOCTYPE html>\` and end with \`</html>\`.

Return the complete HTML as a JSON response with this structure:
{
  "title": "SEO-optimized blog title",
  "content": "Complete HTML blog post with embedded CSS",
  "summary": "2-3 sentence summary",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "estimated_read_time": "5-8 minutes",
  "difficulty_level": "Beginner",
  "sections": ["section1", "section2", "section3"],
  "examples_count": 2
}`

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional trading education content writer. Write engaging, informative blog posts about trading concepts.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`)
    }

    const openaiData = await openaiResponse.json()
    const blogContent = openaiData.choices[0].message.content

    // Parse JSON response
    let parsedBlog
    try {
      parsedBlog = JSON.parse(blogContent)
    } catch {
      // If not valid JSON, create a structured response
      parsedBlog = {
        title: todayTopic,
        content: blogContent,
        summary: "Comprehensive guide on trading education",
        keywords: ["trading", "education", "indicators"],
        estimated_read_time: "5-8 minutes",
        difficulty_level: "Beginner",
        sections: ["What is", "How it works", "Strategy"],
        examples_count: 2
      }
    }

    // Generate slug from title with timestamp for testing
    const slug = parsedBlog.title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      + blogSuffix

    // Save blog to database as published
    const { data: blogData, error: blogError } = await supabase
      .from('blogs')
      .insert({
        title: parsedBlog.title,
        content: parsedBlog.content,
        summary: parsedBlog.summary,
        keywords: parsedBlog.keywords,
        estimated_read_time: parsedBlog.estimated_read_time,
        difficulty_level: parsedBlog.difficulty_level,
        topic: todayTopic,
        marketing_included: true,
        status: 'published',
        published_at: new Date().toISOString(),
        slug: slug,
        category: 'trading-education',
        tags: parsedBlog.keywords
      })
      .select()
      .single()

    if (blogError) {
      console.error('Error saving blog:', blogError)
      throw new Error('Failed to save blog to database')
    }

    return new Response(
      JSON.stringify({
        message: 'Daily blog published successfully',
        blog_id: blogData.id,
        title: parsedBlog.title,
        topic: todayTopic,
        published_at: blogData.published_at,
        slug: slug
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in daily blog scheduler:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate daily blog' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 