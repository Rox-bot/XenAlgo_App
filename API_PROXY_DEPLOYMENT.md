# API Proxy Service Deployment Guide

## 🚀 Overview

This guide will help you deploy the API Proxy Service to resolve CORS and Unauthorized errors when fetching data from Yahoo Finance, Reddit, and other external APIs.

## 📋 Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **API Keys**: Get the following API keys:
   - [Alpha Vantage](https://www.alphavantage.co/support/#api-key) (Free)
   - [News API](https://newsapi.org/register) (Free)
   - [OpenAI](https://platform.openai.com/api-keys) (Paid)
   - [SerpAPI](https://serpapi.com/) (Optional)

## 🛠️ Step 1: Deploy the API Proxy Service

### Option A: Deploy to Railway (Recommended)

1. **Navigate to the API Proxy Directory**:
   ```bash
   cd python-services/api-proxy
   ```

2. **Install Railway CLI** (if not already installed):
   ```bash
   npm install -g @railway/cli
   ```

3. **Login to Railway**:
   ```bash
   railway login
   ```

4. **Initialize Railway Project**:
   ```bash
   railway init
   ```

5. **Deploy the Service**:
   ```bash
   railway up
   ```

6. **Get the Deployment URL**:
   ```bash
   railway domain
   ```
   Copy the URL (e.g., `https://your-proxy-service.railway.app`)

### Option B: Deploy to Render

1. **Create a new Web Service** on [render.com](https://render.com)
2. **Connect your GitHub repository**
3. **Set the build command**: `pip install -r requirements.txt`
4. **Set the start command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. **Add environment variables** (see Step 2)
6. **Deploy**

## 🔧 Step 2: Configure Environment Variables

### For Railway:
1. Go to your Railway project dashboard
2. Click on "Variables" tab
3. Add the following environment variables:

```bash
# API Keys
YAHOO_FINANCE_API_KEY=your_yahoo_key_here
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
NEWS_API_KEY=your_news_api_key_here
OPENAI_API_KEY=your_openai_key_here
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
SERP_API_KEY=your_serp_api_key_here

# Optional: Custom domain
CUSTOM_DOMAIN=your-custom-domain.com
```

### For Render:
1. Go to your service dashboard
2. Click on "Environment" tab
3. Add the same environment variables as above

## 🔗 Step 3: Update Frontend Configuration

1. **Update your `.env` file** in the project root:
   ```bash
   # API Proxy Service URL
   VITE_API_PROXY_URL=https://your-proxy-service.railway.app
   
   # Keep existing API keys for fallback
   VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
   VITE_NEWS_API_KEY=your_news_api_key_here
   VITE_OPENAI_API_KEY=your_openai_key_here
   VITE_REDDIT_CLIENT_ID=your_reddit_client_id
   VITE_REDDIT_CLIENT_SECRET=your_reddit_client_secret
   VITE_SERP_API_KEY=your_serp_api_key_here
   ```

2. **Restart your development server**:
   ```bash
   npm run dev
   ```

## 🧪 Step 4: Test the Deployment

1. **Check Proxy Service Health**:
   Visit: `https://your-proxy-service.railway.app/health`
   Should return: `{"status": "healthy", "timestamp": "..."}`

2. **Check API Status**:
   Visit: `https://your-proxy-service.railway.app/api-status`
   Should return API key status for all services

3. **Test Stock Data**:
   ```bash
   curl -X POST https://your-proxy-service.railway.app/yahoo-finance/quote \
     -H "Content-Type: application/json" \
     -d '{"symbol": "AAPL"}'
   ```

## 🔍 Step 5: Verify Frontend Integration

1. **Open your web app** and navigate to the Market Insights page
2. **Check the browser console** for API status messages
3. **Verify that real data is loading** instead of mock data
4. **Test the blog generator** to ensure OpenAI integration works

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors Still Occurring**:
   - Ensure the proxy URL is correct in your `.env` file
   - Check that the proxy service is running
   - Verify the proxy service CORS configuration

2. **API Key Errors**:
   - Double-check all API keys are correctly set
   - Ensure API keys have proper permissions
   - Check API rate limits

3. **Proxy Service Not Responding**:
   - Check Railway/Render logs for errors
   - Verify the service is deployed and running
   - Check environment variables are set correctly

4. **Frontend Still Using Mock Data**:
   - Clear browser cache
   - Restart development server
   - Check console for proxy connection errors

### Debug Commands:

```bash
# Check proxy service logs
railway logs

# Test proxy endpoints locally
curl -X POST http://localhost:8001/health

# Check environment variables
railway variables
```

## 📊 Monitoring

### Railway Dashboard:
- Monitor service health
- Check request logs
- View error rates
- Monitor resource usage

### Frontend Monitoring:
- Check browser console for API status
- Monitor network requests
- Verify data loading times

## 🔄 Updates and Maintenance

### Updating the Proxy Service:
1. Make changes to `python-services/api-proxy/main.py`
2. Commit and push to GitHub
3. Railway will automatically redeploy

### Adding New APIs:
1. Add new endpoint in `main.py`
2. Add environment variable for API key
3. Update frontend configuration
4. Deploy and test

## 💰 Cost Estimation

### Railway Pricing:
- **Free Tier**: 500 hours/month
- **Pro Plan**: $5/month for unlimited hours
- **Team Plan**: $20/month for team features

### Estimated Monthly Cost:
- **0.1M users**: ~$5-10/month
- **1M users**: ~$20-50/month
- **10M users**: ~$100-200/month

## 🎯 Success Metrics

After deployment, you should see:
- ✅ No CORS errors in browser console
- ✅ Real stock data loading from Yahoo Finance
- ✅ News data from News API
- ✅ Blog generation working with OpenAI
- ✅ Trending stocks from Reddit
- ✅ Technical indicators from Alpha Vantage

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Railway/Render logs
3. Test individual API endpoints
4. Verify environment variables
5. Check browser console for errors

---

**Next Steps**: Once the proxy service is deployed and working, your AI-powered blog generator will be able to fetch real data and generate professional stock analysis blogs automatically! 