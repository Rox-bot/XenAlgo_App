# API Proxy Deployment Checklist

## ✅ Pre-Deployment Checklist

- [ ] Railway account is set up
- [ ] GitHub repository is connected to Railway
- [ ] API keys are ready (Alpha Vantage, News API, OpenAI, etc.)

## 🚀 Deployment Steps

### Step 1: Create New Railway Project
- [ ] Go to [railway.app](https://railway.app)
- [ ] Click "New Project"
- [ ] Select "Deploy from GitHub repo"
- [ ] Choose your repository
- [ ] Set root directory to: `python-services/api-proxy`
- [ ] Deploy the project

### Step 2: Configure Environment Variables
- [ ] Go to your new Railway project dashboard
- [ ] Click "Variables" tab
- [ ] Add the following environment variables:

```bash
YAHOO_FINANCE_API_KEY=your_yahoo_key_here
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
NEWS_API_KEY=your_news_api_key_here
OPENAI_API_KEY=your_openai_key_here
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
SERP_API_KEY=your_serp_api_key_here
```

### Step 3: Get Deployment URL
- [ ] Copy the deployment URL from Railway dashboard
- [ ] It should look like: `https://your-service-name.railway.app`

### Step 4: Update Frontend Configuration
- [ ] Open your `.env` file in the project root
- [ ] Add the proxy URL:

```bash
VITE_API_PROXY_URL=https://your-service-name.railway.app
```

### Step 5: Test the Deployment
- [ ] Update the URL in `test-proxy-deployment.js`
- [ ] Run: `node test-proxy-deployment.js`
- [ ] Verify all tests pass

### Step 6: Test Frontend Integration
- [ ] Restart your development server: `npm run dev`
- [ ] Go to `/admin/blog-generator` in your app
- [ ] Check the "API Setup" tab
- [ ] Verify proxy service shows as connected

## 🧪 Testing Commands

### Test Health Check
```bash
curl https://your-service-name.railway.app/health
```

### Test API Status
```bash
curl https://your-service-name.railway.app/api-status
```

### Test Yahoo Finance
```bash
curl -X POST https://your-service-name.railway.app/yahoo-finance/quote \
  -H "Content-Type: application/json" \
  -d '{"symbol": "AAPL"}'
```

## 🔧 Troubleshooting

### If Health Check Fails:
- [ ] Check Railway logs for errors
- [ ] Verify the service is deployed
- [ ] Check if all dependencies are installed

### If API Calls Fail:
- [ ] Verify environment variables are set correctly
- [ ] Check API key permissions
- [ ] Verify API rate limits

### If Frontend Still Shows CORS Errors:
- [ ] Verify the proxy URL is correct in `.env`
- [ ] Restart the development server
- [ ] Clear browser cache

## 📊 Expected Results

After successful deployment, you should see:
- ✅ No CORS errors in browser console
- ✅ Real stock data loading
- ✅ Blog generation working
- ✅ API status showing as connected

## 💰 Cost Estimation

- **Railway Pro Plan**: $5/month
- **Estimated monthly cost**: $5-10 for 0.1M users
- **Free tier**: 500 hours/month (good for testing)

---

**Next Steps**: Once deployed, your AI-powered blog generator will be able to fetch real data and generate professional stock analysis blogs automatically! 