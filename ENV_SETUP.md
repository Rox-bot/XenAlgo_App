# Environment Setup Guide

## Create your `.env` file

Create a `.env` file in the root directory of your project with the following content:

```env
# API Proxy Service URL (deployed on Railway)
VITE_API_PROXY_URL=https://xen-algo-api-proxy-production.up.railway.app

# API Keys (optional - the proxy service handles these)
VITE_ALPHA_VANTAGE_API_KEY=
VITE_NEWS_API_KEY=
VITE_OPENAI_API_KEY=
VITE_REDDIT_CLIENT_ID=
VITE_REDDIT_CLIENT_SECRET=
VITE_SERP_API_KEY=

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Razorpay Configuration (for payments)
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here
VITE_RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

## Steps to fix the current CORS issue:

1. **Create the `.env` file** in your project root with the content above
2. **Update the proxy URL** to use the deployed Railway service
3. **Restart your development server** after creating the `.env` file
4. **Test the connection** by visiting the blog generator page

## What this fixes:

- ✅ **CORS errors**: The frontend will now use the deployed proxy instead of localhost
- ✅ **Yahoo Finance API**: Will work through the proxy with proper headers
- ✅ **Reddit API**: Will work through the proxy without CORS issues
- ✅ **All other APIs**: Will be routed through the secure proxy

## Verification:

After creating the `.env` file and restarting your dev server, you should see:
- No more `net::ERR_CONNECTION_REFUSED` errors
- No more CORS policy errors
- The API status should show "✅ Connected" for all services
- Trending stocks should load properly in the blog generator

## Troubleshooting:

If you still see errors:
1. Make sure the `.env` file is in the project root (same level as `package.json`)
2. Restart your development server completely
3. Clear your browser cache
4. Check the browser console for any remaining errors 