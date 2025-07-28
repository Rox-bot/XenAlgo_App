# 🚀 XenAlgo Python Microservices Deployment Guide

## 📋 Overview

This guide will help you deploy the Python microservices for XenAlgo's AI features, specifically the **Trading Psychology AI** service.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase      │    │   Python        │
│   (React/TS)    │◄──►│   (Database)    │◄──►│   Microservices │
│                 │    │                 │    │                 │
│ • UI Components │    │ • PostgreSQL    │    │ • AI/ML Models  │
│ • State Mgmt    │    │ • Real-time     │    │ • Data Science  │
│ • Routing       │    │ • Auth          │    │ • Calculations  │
│ • Charts        │    │ • Storage       │    │ • Analytics     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 Deployment Options

### Option 1: Railway (Recommended) ⭐
- **Cost**: $5-20/month for 0.1M users
- **Features**: Auto-scaling, easy deployment
- **Setup**: Git-based deployment

### Option 2: Render
- **Cost**: $7-25/month for 0.1M users
- **Features**: Good Python support
- **Setup**: Simple configuration

### Option 3: DigitalOcean App Platform
- **Cost**: $12-30/month for 0.1M users
- **Features**: Reliable, good performance
- **Setup**: Container-based deployment

## 🚀 Quick Deployment (Railway)

### Step 1: Prerequisites
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login
```

### Step 2: Deploy Using Script
```bash
# Run the deployment script
./python-services/deploy.sh
```

### Step 3: Manual Deployment (Alternative)
```bash
# Navigate to Python service
cd python-services/trading-psychology-ai

# Initialize Railway project
railway init

# Deploy to Railway
railway up

# Get deployment URL
railway status
```

## 🗄️ Database Setup

### Step 1: Run SQL Migration
Execute this SQL in your Supabase dashboard:

```sql
-- Add behavioral_analysis table
CREATE TABLE public.behavioral_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  risk_score DECIMAL(3,2) NOT NULL,
  behavioral_patterns JSONB NOT NULL DEFAULT '[]',
  emotional_trends JSONB NOT NULL DEFAULT '{}',
  performance_correlation JSONB NOT NULL DEFAULT '{}',
  recommendations JSONB NOT NULL DEFAULT '[]',
  risk_level VARCHAR(10) NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
  confidence_score DECIMAL(3,2) NOT NULL,
  analyzed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_behavioral_analysis_user_id ON public.behavioral_analysis(user_id);
CREATE INDEX idx_behavioral_analysis_analyzed_at ON public.behavioral_analysis(analyzed_at);

-- Add RLS policies
ALTER TABLE public.behavioral_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own behavioral analysis" ON public.behavioral_analysis
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own behavioral analysis" ON public.behavioral_analysis
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add columns to profiles table for trading psychology
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS risk_tolerance INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS trading_experience VARCHAR(20) DEFAULT 'BEGINNER' CHECK (trading_experience IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
ADD COLUMN IF NOT EXISTS capital_amount DECIMAL(15,2) DEFAULT 100000,
ADD COLUMN IF NOT EXISTS trading_goals JSONB DEFAULT '["GROWTH"]';

-- Add columns to trades table for emotions
ALTER TABLE public.trades 
ADD COLUMN IF NOT EXISTS emotion_before VARCHAR(50),
ADD COLUMN IF NOT EXISTS emotion_after VARCHAR(50);
```

### Step 2: Update Environment Variables
Create `.env.local` file in your React app root:

```bash
# XenAlgo AI Service URLs
REACT_APP_AI_SERVICE_URL=https://your-railway-app.railway.app
REACT_APP_TRADING_PSYCHOLOGY_AI_URL=https://your-railway-app.railway.app
```

## 🧪 Testing the Deployment

### Step 1: Test Health Endpoint
```bash
# Test the deployed service
curl https://your-railway-app.railway.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "trading-psychology-ai",
  "timestamp": "2024-01-01T00:00:00",
  "models_loaded": true
}
```

### Step 2: Test AI Analysis
```bash
# Test behavior analysis
curl -X POST https://your-railway-app.railway.app/analyze-behavior \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-user",
    "trades": [],
    "risk_tolerance": 5,
    "trading_experience": "BEGINNER",
    "capital_amount": 100000,
    "goals": ["GROWTH"]
  }'
```

## 🔧 Frontend Integration

### Step 1: Import the Service
```typescript
import { tradingPsychologyAI } from '@/services/tradingPsychologyAI';
```

### Step 2: Use in Components
```typescript
// In your React component
const [analysis, setAnalysis] = useState(null);
const [loading, setLoading] = useState(false);

const analyzeBehavior = async () => {
  setLoading(true);
  try {
    const result = await tradingPsychologyAI.analyzeBehavior(user.id);
    setAnalysis(result);
  } catch (error) {
    console.error('Analysis failed:', error);
  } finally {
    setLoading(false);
  }
};
```

## 📊 Monitoring & Maintenance

### Railway Dashboard
- Visit [Railway Dashboard](https://railway.app)
- Monitor service health
- View logs and metrics
- Scale resources as needed

### Health Checks
```bash
# Check service health
curl https://your-railway-app.railway.app/health

# Check model info
curl https://your-railway-app.railway.app/model-info
```

### Logs
```bash
# View Railway logs
railway logs
```

## 💰 Cost Analysis

### Railway Pricing
- **Free Tier**: 500 hours/month
- **Pro Plan**: $5/month for unlimited hours
- **Team Plan**: $20/month for team features

### Estimated Costs for 0.1M Users
```javascript
const costBreakdown = {
  frontend: "Vercel/Netlify - Free",
  database: "Supabase Pro - $25/month",
  pythonServices: "Railway Pro - $5/month",
  total: "$30/month for 0.1M users"
};
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Railway Deployment Fails
```bash
# Check logs
railway logs

# Redeploy
railway up
```

#### 2. CORS Errors
```python
# In main.py, update CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### 3. Database Connection Issues
```bash
# Check Supabase connection
# Verify environment variables
# Test database queries
```

#### 4. Model Loading Issues
```python
# Check if models are loaded
curl https://your-railway-app.railway.app/model-info
```

## 🔄 Updating the Service

### Step 1: Update Code
```bash
# Make changes to Python service
cd python-services/trading-psychology-ai
# Edit main.py, requirements.txt, etc.
```

### Step 2: Redeploy
```bash
# Deploy changes
railway up
```

### Step 3: Test
```bash
# Test the updated service
curl https://your-railway-app.railway.app/health
```

## 📈 Scaling

### Auto-scaling (Railway)
- Railway automatically scales based on traffic
- No manual configuration needed

### Manual Scaling
```bash
# Scale up resources in Railway dashboard
# Or use Railway CLI
railway scale
```

## 🔒 Security

### Environment Variables
```bash
# Set sensitive data in Railway
railway variables set SUPABASE_URL=your_supabase_url
railway variables set SUPABASE_KEY=your_supabase_key
```

### CORS Configuration
```python
# Update allowed origins for production
allow_origins=["https://your-domain.com"]
```

## 📞 Support

### Railway Support
- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)

### XenAlgo Support
- Check logs for errors
- Test endpoints individually
- Verify database connections

## 🎉 Success Checklist

- [ ] Railway service deployed successfully
- [ ] Health endpoint returns 200
- [ ] Database migration executed
- [ ] Environment variables configured
- [ ] Frontend integration working
- [ ] AI analysis endpoint responding
- [ ] Monitoring set up
- [ ] Cost analysis completed

## 🚀 Next Steps

1. **Deploy additional services** (market data processor, technical analysis)
2. **Implement advanced AI features** (sentiment analysis, pattern recognition)
3. **Add real-time data integration** (market feeds, news APIs)
4. **Scale based on usage** (monitor performance, optimize resources)

---

**🎯 You're now ready to deploy XenAlgo's Python microservices!**

The hybrid architecture gives you the best of both worlds: fast development with React + the power of Python for AI and financial calculations. 