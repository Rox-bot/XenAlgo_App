// API Configuration
// Set up your environment variables for real API integration

// API Proxy Service URL (update this to your deployed proxy URL)
const API_PROXY_URL = import.meta.env.VITE_API_PROXY_URL || 'http://localhost:8001';

export const API_CONFIG = {
  // API Proxy Service
  PROXY_SERVICE: {
    enabled: true,
    baseUrl: API_PROXY_URL,
    endpoints: {
      health: '/health',
      apiStatus: '/api-status',
      yahooFinance: '/yahoo-finance/quote',
      alphaVantage: '/alpha-vantage/technical',
      news: '/news/stock',
      reddit: '/reddit/trending',
      openai: '/openai/generate-blog',
      trendingStocks: '/trending-stocks',
    }
  },
  
  // Direct API fallbacks (for development)
  YAHOO_FINANCE: {
    enabled: true,
    baseUrl: 'https://query2.finance.yahoo.com',
    rateLimit: 100, // requests per minute
  },
  
  // Alpha Vantage API (free tier: 5 requests per minute)
  ALPHA_VANTAGE: {
    enabled: !!import.meta.env.VITE_ALPHA_VANTAGE_API_KEY,
    apiKey: import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || '',
    baseUrl: 'https://www.alphavantage.co',
    rateLimit: 5, // requests per minute (free tier)
  },
  
  // News API (free tier: 100 requests per day)
  NEWS_API: {
    enabled: !!import.meta.env.VITE_NEWS_API_KEY,
    apiKey: import.meta.env.VITE_NEWS_API_KEY || '',
    baseUrl: 'https://newsapi.org/v2',
    rateLimit: 100, // requests per day (free tier)
  },
  
  // OpenAI API (for blog generation)
  OPENAI: {
    enabled: !!import.meta.env.VITE_OPENAI_API_KEY,
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    baseUrl: 'https://api.openai.com/v1',
  },
  
  // Reddit API (optional)
  REDDIT: {
    enabled: !!import.meta.env.VITE_REDDIT_CLIENT_ID,
    clientId: import.meta.env.VITE_REDDIT_CLIENT_ID || '',
    clientSecret: import.meta.env.VITE_REDDIT_CLIENT_SECRET || '',
    baseUrl: 'https://www.reddit.com',
  },
  
  // SerpAPI (optional, for Google Trends)
  SERP_API: {
    enabled: !!import.meta.env.VITE_SERP_API_KEY,
    apiKey: import.meta.env.VITE_SERP_API_KEY || '',
    baseUrl: 'https://serpapi.com',
  }
};

// Environment setup instructions
export const SETUP_INSTRUCTIONS = `
🚀 API Setup Instructions:

1. Deploy the API Proxy Service:
   - Navigate to python-services/api-proxy/
   - Deploy to Railway: railway up
   - Get the deployment URL

2. Update your .env file:
VITE_API_PROXY_URL=https://your-proxy-service.railway.app

3. For the proxy service, add these environment variables:
YAHOO_FINANCE_API_KEY=your_key_here
ALPHA_VANTAGE_API_KEY=your_key_here
NEWS_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
SERP_API_KEY=your_serp_key

4. Restart your development server
5. The app will use the proxy service to avoid CORS issues
`;

// Check if APIs are properly configured
export const checkAPIConfiguration = async () => {
  try {
    // Check proxy service status
    const proxyResponse = await fetch(`${API_CONFIG.PROXY_SERVICE.baseUrl}${API_CONFIG.PROXY_SERVICE.endpoints.apiStatus}`);
    const proxyStatus = await proxyResponse.json();
    
    return {
      proxyService: API_CONFIG.PROXY_SERVICE.enabled,
      yahooFinance: proxyStatus.yahoo_finance || API_CONFIG.YAHOO_FINANCE.enabled,
      alphaVantage: proxyStatus.alpha_vantage || API_CONFIG.ALPHA_VANTAGE.enabled,
      newsAPI: proxyStatus.news_api || API_CONFIG.NEWS_API.enabled,
      openAI: proxyStatus.openai || API_CONFIG.OPENAI.enabled,
      reddit: proxyStatus.reddit || API_CONFIG.REDDIT.enabled,
      serpAPI: proxyStatus.serp || API_CONFIG.SERP_API.enabled,
    };
  } catch (error) {
    console.error('Failed to check proxy service status:', error);
    return {
      proxyService: false,
      yahooFinance: API_CONFIG.YAHOO_FINANCE.enabled,
      alphaVantage: API_CONFIG.ALPHA_VANTAGE.enabled,
      newsAPI: API_CONFIG.NEWS_API.enabled,
      openAI: API_CONFIG.OPENAI.enabled,
      reddit: API_CONFIG.REDDIT.enabled,
      serpAPI: API_CONFIG.SERP_API.enabled,
    };
  }
};

// Get API status for UI display
export const getAPIStatus = async () => {
  const config = await checkAPIConfiguration();
  
  // Log current API status
  console.log('🔧 Current API Status:');
  console.log('🌐 Proxy Service:', config.proxyService ? '✅ Connected' : '❌ Not Available');
  console.log('📊 Real Data (Yahoo):', config.yahooFinance ? '✅ Connected' : '❌ Not Available');
  console.log('📈 Technical Indicators (Alpha Vantage):', config.alphaVantage ? '✅ Connected' : '❌ API Key Needed');
  console.log('📰 News API:', config.newsAPI ? '✅ Connected' : '❌ API Key Needed');
  console.log('🤖 OpenAI (Blog Generation):', config.openAI ? '✅ Connected' : '❌ API Key Needed');
  console.log('📱 Reddit Trending:', config.reddit ? '✅ Connected' : '❌ Not Available');
  console.log('🔍 SerpAPI (Google Trends):', config.serpAPI ? '✅ Connected' : '❌ API Key Needed');
  
  return config;
};

// Helper function to make API calls through proxy
export const makeProxyRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_CONFIG.PROXY_SERVICE.baseUrl}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`Proxy request failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Proxy request error for ${endpoint}:`, error);
    throw error;
  }
};

// Check if we should use proxy or direct APIs
export const shouldUseProxy = () => {
  return API_CONFIG.PROXY_SERVICE.enabled && API_CONFIG.PROXY_SERVICE.baseUrl !== 'http://localhost:8001';
}; 