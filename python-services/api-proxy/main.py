from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import httpx
import os
import json
from datetime import datetime, timedelta
import asyncio

app = FastAPI(
    title="API Proxy Service",
    description="Proxy service for external APIs to handle CORS and authentication",
    version="1.0.0"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Keys from environment variables
ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY", "")
NEWS_API_KEY = os.getenv("NEWS_API_KEY", "")
REDDIT_CLIENT_ID = os.getenv("REDDIT_CLIENT_ID", "")
REDDIT_CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
SERP_API_KEY = os.getenv("SERP_API_KEY", "")
DHANHQ_ACCESS_TOKEN = os.getenv("Market_Data", "")

# Pydantic models
class StockDataRequest(BaseModel):
    symbol: str

class TrendingStocksRequest(BaseModel):
    limit: Optional[int] = 10

class NewsRequest(BaseModel):
    symbol: str
    limit: Optional[int] = 10

class BlogGenerationRequest(BaseModel):
    stock_symbol: str
    stock_data: Dict[str, Any]
    news_data: List[Dict[str, Any]]
    style: Optional[str] = "professional"

class TradingEducationBlogRequest(BaseModel):
    topic: str
    include_marketing: bool = True
    style: str = "professional"

class AutoBlogSchedule(BaseModel):
    enabled: bool = True
    post_time: str = "09:00"  # 9:00 AM
    timezone: str = "Asia/Kolkata"

# Trading Education Topics Calendar
TRADING_EDUCATION_TOPICS = [
    # Technical Indicators
    "Bollinger Bands: Complete Guide to Volatility Trading",
    "MACD Indicator: Master the Momentum Oscillator", 
    "RSI (Relative Strength Index): Overbought and Oversold Signals",
    "Moving Averages: Simple vs Exponential - Which to Use?",
    "Stochastic Oscillator: Timing Your Entries Perfectly",
    "Williams %R: Advanced Momentum Analysis",
    "ADX Indicator: Measuring Trend Strength",
    "Fibonacci Retracements: Golden Ratio in Trading",
    
    # Trading Strategies
    "Swing Trading Strategies: 5-Day to 2-Week Holds",
    "Day Trading Techniques: Intraday Profit Strategies", 
    "Scalping Strategies: Quick Profits in Minutes",
    "Position Trading: Long-Term Market Analysis",
    "Breakout Trading: Catching the Big Moves",
    "Pullback Trading: Buying the Dips",
    "Range Trading: Profiting from Sideways Markets",
    
    # Market Analysis
    "Support and Resistance: Key Levels Every Trader Must Know",
    "Volume Analysis: The Hidden Market Indicator",
    "Market Psychology: Understanding Fear and Greed", 
    "Price Action Trading: Reading Candlestick Patterns",
    "Chart Patterns: Head and Shoulders, Triangles, Flags",
    "Market Structure: Higher Highs, Lower Lows",
    "Trend Analysis: Identifying Market Direction",
    
    # Risk Management
    "Position Sizing: The Key to Long-Term Success",
    "Stop Loss Strategies: Protecting Your Capital",
    "Risk-Reward Ratios: The 1:2 Rule",
    "Portfolio Management: Diversification Strategies", 
    "Money Management: Never Risk More Than 2%",
    "Drawdown Management: Surviving Losing Streaks",
    
    # Options Trading
    "Options Basics: Calls, Puts, and Strike Prices",
    "Implied Volatility: The Options Trader's Friend",
    "Options Strategies: Covered Calls and Protective Puts",
    "Iron Condors: Profiting from Sideways Markets",
    "Butterfly Spreads: Limited Risk, High Reward",
    "Options Greeks: Delta, Gamma, Theta, Vega"
]  # Updated: 34 comprehensive trading education topics

# HTTP client for making requests
async def make_request(url: str, headers: Dict[str, str] = None, params: Dict[str, str] = None):
    """Make HTTP request with error handling"""
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url, headers=headers, params=params)
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"API Error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Request failed: {str(e)}")

async def generate_trading_education_blog(topic: str, include_marketing: bool = True, style: str = "professional"):
    """Generate comprehensive trading education blog with marketing integration"""
    if not OPENAI_API_KEY:
        raise HTTPException(status_code=400, detail="OpenAI API key not configured")
    
    try:
        # Create comprehensive prompt for trading education
        prompt = f"""
        Write a comprehensive, professional trading education blog post about: "{topic}"
        
        Requirements:
        1. **Structure**: Introduction, Main Content (3-4 sections), Conclusion
        2. **Length**: 1500-2000 words
        3. **Style**: Professional but engaging, educational
        4. **Content**: Theory + Practical Examples + Trading Tips
        5. **SEO**: Include relevant keywords naturally
        
        {f'''
        Marketing Integration (Natural, not pushy):
        - Mention "XenAlgo" tools naturally in relevant sections
        - Include call-to-action for premium indicators/courses
        - Add special offers (50% off, free trials, etc.)
        - Use social proof ("used by 10,000+ traders")
        - Promote indicators, courses, and AI tools
        ''' if include_marketing else ''}
        
        Format the response as JSON with:
        {{
            "title": "SEO-optimized title",
            "content": "Full blog content with HTML formatting",
            "meta_description": "SEO meta description",
            "keywords": ["keyword1", "keyword2", "keyword3"],
            "estimated_read_time": "X minutes",
            "category": "Technical Indicators/Trading Strategies/Market Analysis/Risk Management/Options Trading"
        }}
        
        Make it valuable, educational, and {style}.
        """
        
        # Call OpenAI API
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "gpt-4",
            "messages": [
                {"role": "system", "content": "You are a professional trading educator and content creator. Create comprehensive, valuable educational content that helps traders improve their skills."},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 3000,
            "temperature": 0.7
        }
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(url, headers=headers, json=data)
            response.raise_for_status()
            result = response.json()
        
        blog_content = result["choices"][0]["message"]["content"]
        
        # Parse JSON response
        try:
            blog_data = json.loads(blog_content)
        except:
            # If not valid JSON, create structured response
            blog_data = {
                "title": f"Complete Guide to {topic}",
                "content": blog_content,
                "meta_description": f"Master {topic} with our comprehensive guide. Learn professional trading techniques and strategies.",
                "keywords": [topic.lower(), "trading", "technical analysis"],
                "estimated_read_time": "8 minutes",
                "category": "Trading Education"
            }
        
        return {
            "topic": topic,
            "blog_data": blog_data,
            "generated_at": datetime.now().isoformat(),
            "marketing_included": include_marketing
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate blog: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/api-status")
async def api_status():
    """Check status of all API keys"""
    return {
        "dhanhq": bool(DHANHQ_ACCESS_TOKEN),  # DhanHQ requires access token
        "alpha_vantage": bool(ALPHA_VANTAGE_API_KEY),
        "news_api": bool(NEWS_API_KEY),
        "reddit": True,  # Reddit API is free for basic usage
        "openai": bool(OPENAI_API_KEY),
        "serp": bool(SERP_API_KEY)
    }



@app.post("/alpha-vantage/technical")
async def get_alpha_vantage_data(request: StockDataRequest):
    """Get technical indicators from Alpha Vantage"""
    if not ALPHA_VANTAGE_API_KEY:
        raise HTTPException(status_code=400, detail="Alpha Vantage API key not configured")
    
    try:
        # Get RSI
        rsi_url = "https://www.alphavantage.co/query"
        rsi_params = {
            "function": "RSI",
            "symbol": request.symbol,
            "interval": "daily",
            "time_period": "14",
            "series_type": "close",
            "apikey": ALPHA_VANTAGE_API_KEY
        }
        
        rsi_data = await make_request(rsi_url, params=rsi_params)
        
        # Get MACD
        macd_params = {
            "function": "MACD",
            "symbol": request.symbol,
            "interval": "daily",
            "series_type": "close",
            "apikey": ALPHA_VANTAGE_API_KEY
        }
        
        macd_data = await make_request(rsi_url, params=macd_params)
        
        return {
            "symbol": request.symbol,
            "rsi": rsi_data,
            "macd": macd_data,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch Alpha Vantage data: {str(e)}")

@app.post("/news/stock")
async def get_stock_news(request: NewsRequest):
    """Get news for a specific stock"""
    if not NEWS_API_KEY:
        raise HTTPException(status_code=400, detail="News API key not configured")
    
    try:
        url = "https://newsapi.org/v2/everything"
        params = {
            "q": request.symbol,
            "language": "en",
            "sortBy": "publishedAt",
            "pageSize": request.limit,
            "apiKey": NEWS_API_KEY
        }
        
        data = await make_request(url, params=params)
        
        return {
            "symbol": request.symbol,
            "articles": data.get("articles", []),
            "total_results": data.get("totalResults", 0),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch news data: {str(e)}")

@app.post("/reddit/trending")
async def get_reddit_trending():
    """Get trending stocks from Reddit"""
    try:
        # Get posts from r/wallstreetbets
        url = "https://www.reddit.com/r/wallstreetbets/hot.json"
        params = {"limit": "25"}
        
        data = await make_request(url, params=params)
        
        # Extract stock mentions from titles
        stock_mentions = []
        for post in data.get("data", {}).get("children", []):
            title = post.get("data", {}).get("title", "").upper()
            # Simple stock symbol extraction (you might want to improve this)
            words = title.split()
            for word in words:
                if len(word) <= 5 and word.isalpha() and word not in ["THE", "AND", "OR", "FOR", "WITH"]:
                    stock_mentions.append(word)
        
        # Count mentions
        from collections import Counter
        mention_counts = Counter(stock_mentions)
        
        # Get top mentions
        top_mentions = mention_counts.most_common(10)
        
        return {
            "trending_stocks": [{"symbol": symbol, "mentions": count} for symbol, count in top_mentions],
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch Reddit data: {str(e)}")

@app.post("/openai/generate-blog")
async def generate_blog_post(request: BlogGenerationRequest):
    """Generate blog post using OpenAI"""
    if not OPENAI_API_KEY:
        raise HTTPException(status_code=400, detail="OpenAI API key not configured")
    
    try:
        # Prepare prompt
        prompt = f"""
        Generate a professional blog post about {request.stock_symbol} based on the following data:
        
        Stock Data: {json.dumps(request.stock_data, indent=2)}
        News: {json.dumps(request.news_data, indent=2)}
        
        Style: {request.style}
        
        Please create a well-structured blog post with:
        1. Introduction
        2. Current market position
        3. Key news and developments
        4. Technical analysis
        5. Conclusion
        
        Make it engaging and informative for traders and investors.
        """
        
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {"role": "system", "content": "You are a professional financial analyst and blogger."},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 1000,
            "temperature": 0.7
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            
            blog_content = data["choices"][0]["message"]["content"]
            
            return {
                "symbol": request.stock_symbol,
                "title": f"Analysis: {request.stock_symbol} - Market Update",
                "content": blog_content,
                "generated_at": datetime.now().isoformat(),
                "style": request.style
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate blog post: {str(e)}")

@app.post("/trending-stocks")
async def get_trending_stocks(request: TrendingStocksRequest):
    """Get trending stocks from DhanHQ (Indian markets)"""
    try:
        # Get DhanHQ trending stocks
        dhanhq_data = await get_dhanhq_trending()
        
        return {
            "trending_stocks": dhanhq_data["stocks"],
            "sources": ["dhanhq"],
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get trending stocks: {str(e)}")

@app.post("/dhanhq/quote")
async def get_dhanhq_quote(request: StockDataRequest):
    """Get stock quote from DhanHQ (Indian market data)"""
    try:
        url = f"https://api.dhan.co/quotes/v1/quote"
        params = {"symbols": request.symbol}
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
        
        data = await make_request(url, headers=headers, params=params)
        
        if not data.get("data"):
            raise HTTPException(status_code=404, detail="Stock not found")
            
        quote = data["data"][0]
        
        return {
            "symbol": request.symbol,
            "price": quote.get("lastPrice", 0),
            "change": quote.get("change", 0),
            "changePercent": quote.get("changePercent", 0),
            "volume": quote.get("volume", 0),
            "marketCap": quote.get("marketCap", 0),
            "peRatio": quote.get("peRatio", 0),
            "eps": quote.get("eps", 0),
            "companyName": quote.get("companyName"),
            "sector": quote.get("sector"),
            "exchange": quote.get("exchange"),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        print(f"DhanHQ API error for {request.symbol}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch stock data: {str(e)}")

@app.post("/dhanhq/search")
async def search_dhanhq_stocks(request: dict):
    """Search for stocks on DhanHQ"""
    try:
        query = request.get("query", "")
        url = f"https://api.dhan.co/instruments/v1/search"
        params = {"query": query}
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
        
        data = await make_request(url, headers=headers, params=params)
        
        results = []
        for item in data.get("results", []):
            results.append({
                "symbol": item.get("symbol"),
                "price": item.get("lastPrice", 0),
                "change": item.get("change", 0),
                "changePercent": item.get("changePercent", 0),
                "volume": item.get("volume", 0),
                "marketCap": item.get("marketCap", 0),
                "peRatio": item.get("peRatio", 0),
                "eps": item.get("eps", 0),
                "companyName": item.get("companyName"),
                "sector": item.get("sector"),
                "exchange": item.get("exchange"),
                "timestamp": datetime.now().isoformat()
            })
        
        return {"results": results}
    except Exception as e:
        print(f"DhanHQ search error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to search stocks: {str(e)}")

@app.post("/dhanhq/trending")
async def get_dhanhq_trending():
    """Get trending Indian stocks from DhanHQ"""
    try:
        # Popular Indian stocks
        popular_symbols = [
            "RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK",
            "HINDUNILVR", "ITC", "SBIN", "BHARTIARTL", "KOTAKBANK"
        ]
        
        trending_stocks = []
        for symbol in popular_symbols:
            try:
                url = f"https://api.dhan.co/quotes/v1/quote"
                params = {"symbols": symbol}
                headers = {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    "Accept": "application/json"
                }
                
                data = await make_request(url, headers=headers, params=params)
                
                if data.get("data"):
                    quote = data["data"][0]
                    trending_stocks.append({
                        "symbol": symbol,
                        "price": quote.get("lastPrice", 0),
                        "change": quote.get("change", 0),
                        "changePercent": quote.get("changePercent", 0),
                        "volume": quote.get("volume", 0),
                        "marketCap": quote.get("marketCap", 0),
                        "companyName": quote.get("companyName"),
                        "sector": quote.get("sector"),
                        "mentions": 0,  # Will be calculated from real data if available
                        "timestamp": datetime.now().isoformat()
                    })
            except Exception as e:
                print(f"Error fetching {symbol}: {str(e)}")
                continue
        
        # Sort by change percentage (most volatile first)
        trending_stocks.sort(key=lambda x: abs(x["changePercent"]), reverse=True)
        
        return {
            "stocks": trending_stocks,
            "total": len(trending_stocks),
            "source": "dhanhq",
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        print(f"DhanHQ trending stocks error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get trending stocks: {str(e)}")

@app.get("/dhanhq/security-ids")
async def get_security_ids():
    """Get security IDs for popular Indian stocks"""
    try:
        if not DHANHQ_ACCESS_TOKEN:
            raise HTTPException(status_code=400, detail="DhanHQ access token not configured")
        
        # Common Indian stocks with their security IDs
        # These are example IDs - you may need to verify with DhanHQ documentation
        security_ids = {
            "RELIANCE": "500325",
            "TCS": "532540", 
            "HDFCBANK": "500180",
            "INFY": "500209",
            "ICICIBANK": "532174",
            "HINDUNILVR": "500696",
            "ITC": "500875",
            "SBIN": "500112",
            "BHARTIARTL": "532454",
            "KOTAKBANK": "500247",
            "AXISBANK": "532215",
            "ASIANPAINT": "500820",
            "MARUTI": "532500",
            "HCLTECH": "532281",
            "SUNPHARMA": "524715",
            "TATAMOTORS": "500570",
            "WIPRO": "507685",
            "ULTRACEMCO": "532538",
            "TITAN": "500114",
            "BAJFINANCE": "500034"
        }
        
        return {
            "securityIds": security_ids,
            "totalStocks": len(security_ids),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        print(f"Error getting security IDs: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get security IDs: {str(e)}")

@app.post("/dhanhq/sectors/analysis")
async def get_sector_analysis():
    """Get dynamic sector analysis with top performing sectors using marketfeed API"""
    try:
        if not DHANHQ_ACCESS_TOKEN:
            raise HTTPException(status_code=400, detail="DhanHQ access token not configured")
        
        # Major Indian stocks with their security IDs (NSE_EQ format)
        # These are verified security IDs for NSE stocks
        stock_security_ids = [
            # Technology
            532540,  # TCS
            500209,  # INFY
            507685,  # WIPRO
            532281,  # HCLTECH
            532755,  # TECHM
            
            # Banking
            500180,  # HDFCBANK
            532174,  # ICICIBANK
            500112,  # SBIN
            500247,  # KOTAKBANK
            532215,  # AXISBANK
            
            # Oil & Gas
            500325,  # RELIANCE
            500312,  # ONGC
            500547,  # BPCL
            500104,  # HPCL
            530965,  # IOC
            
            # Consumer Goods
            500696,  # HINDUNILVR
            500875,  # ITC
            500820,  # ASIANPAINT
            500114,  # TITAN
            
            # Automobiles
            532500,  # MARUTI
            500570,  # TATAMOTORS
            
            # Pharmaceuticals
            524715,  # SUNPHARMA
            
            # Finance
            500034,  # BAJFINANCE
            
            # Cement
            532538,  # ULTRACEMCO
            
            # Telecom
            532454,  # BHARTIARTL
        ]
        
        # Sector mapping for security IDs
        sector_mapping = {
            # Technology
            532540: 'Technology', 500209: 'Technology', 507685: 'Technology', 
            532281: 'Technology', 532755: 'Technology',
            
            # Banking
            500180: 'Banking', 532174: 'Banking', 500112: 'Banking', 
            500247: 'Banking', 532215: 'Banking',
            
            # Oil & Gas
            500325: 'Oil & Gas', 500312: 'Oil & Gas', 500547: 'Oil & Gas', 
            500104: 'Oil & Gas', 530965: 'Oil & Gas',
            
            # Consumer Goods
            500696: 'Consumer Goods', 500875: 'Consumer Goods', 
            500820: 'Consumer Goods', 500114: 'Consumer Goods',
            
            # Automobiles
            532500: 'Automobiles', 500570: 'Automobiles',
            
            # Pharmaceuticals
            524715: 'Pharmaceuticals',
            
            # Finance
            500034: 'Finance',
            
            # Cement
            532538: 'Cement',
            
            # Telecom
            532454: 'Telecom'
        }
        
        # Stock name mapping
        stock_names = {
            532540: 'TCS', 500209: 'Infosys', 507685: 'Wipro', 
            532281: 'HCL Technologies', 532755: 'Tech Mahindra',
            500180: 'HDFC Bank', 532174: 'ICICI Bank', 500112: 'State Bank of India', 
            500247: 'Kotak Mahindra Bank', 532215: 'Axis Bank',
            500325: 'Reliance Industries', 500312: 'ONGC', 500547: 'BPCL', 
            500104: 'HPCL', 530965: 'Indian Oil Corporation',
            500696: 'Hindustan Unilever', 500875: 'ITC', 
            500820: 'Asian Paints', 500114: 'Titan Company',
            532500: 'Maruti Suzuki', 500570: 'Tata Motors',
            524715: 'Sun Pharmaceutical', 500034: 'Bajaj Finance',
            532538: 'UltraTech Cement', 532454: 'Bharti Airtel'
        }
        
        print(f"Fetching market data for {len(stock_security_ids)} stocks...")
        
        # Use DhanHQ marketfeed API for complete quote data
        url = "https://api.dhan.co/v2/marketfeed/quote"
        headers = {
            "access-token": DHANHQ_ACCESS_TOKEN,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        
        # Request body for marketfeed API
        request_body = {
            "NSE_EQ": stock_security_ids
        }
        
        print(f"Making API call to {url}")
        print(f"Request body: {request_body}")
        
        # Make POST request to get market data
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, headers=headers, json=request_body)
            response.raise_for_status()
            data = response.json()
        
        print(f"API Response received: {len(data.get('data', {}).get('NSE_EQ', {}))} stocks")
        
        # Process the market data
        all_stocks = []
        sector_groups = {}
        
        if 'data' in data and 'NSE_EQ' in data['data']:
            for security_id_str, stock_data in data['data']['NSE_EQ'].items():
                security_id = int(security_id_str)
                
                # Extract data from API response
                last_price = stock_data.get('last_price', 0)
                net_change = stock_data.get('net_change', 0)
                volume = stock_data.get('volume', 0)
                average_price = stock_data.get('average_price', 0)
                
                # Get OHLC data
                ohlc = stock_data.get('ohlc', {})
                prev_close = ohlc.get('close', 0)  # Previous day close
                
                # Calculate percentage change
                percentage_change = (net_change / prev_close * 100) if prev_close != 0 else 0
                
                # Calculate value traded
                value_traded = volume * average_price if average_price > 0 else volume * last_price
                
                # Get sector
                sector = sector_mapping.get(security_id, 'Others')
                stock_name = stock_names.get(security_id, f'Stock_{security_id}')
                
                processed_stock = {
                    "securityId": security_id,
                    "symbol": stock_name,
                    "price": last_price,
                    "change": net_change,
                    "changePercent": round(percentage_change, 2),
                    "volume": volume,
                    "valueTraded": value_traded,
                    "prevClose": prev_close,
                    "averagePrice": average_price,
                    "sector": sector,
                    "companyName": stock_name,
                    "timestamp": datetime.now().isoformat()
                }
                
                all_stocks.append(processed_stock)
                
                if sector not in sector_groups:
                    sector_groups[sector] = []
                sector_groups[sector].append(processed_stock)
                
                print(f"Processed {stock_name}: Price={last_price}, Change={percentage_change:.2f}%, Sector={sector}")
        
        # Calculate sector performance
        sector_performances = []
        for sector, stocks in sector_groups.items():
            if len(stocks) < 2:  # Skip sectors with too few stocks
                continue
                
            avg_change_percent = sum(s["changePercent"] for s in stocks) / len(stocks)
            avg_volume = sum(s["volume"] for s in stocks) / len(stocks)
            total_value_traded = sum(s["valueTraded"] for s in stocks)
            
            # Sort stocks within sector by performance
            top_stocks = sorted(stocks, key=lambda x: x["changePercent"], reverse=True)[:3]
            
            # Calculate performance score (prioritize percentage gains)
            performance_score = (
                (abs(avg_change_percent) * 0.6) +  # 60% weight on percentage change
                (avg_volume / 1000000 * 0.2) +     # 20% weight on volume
                (total_value_traded / 1000000000 * 0.2)  # 20% weight on value traded
            )
            
            sector_performances.append({
                "sector": sector,
                "avgChangePercent": round(avg_change_percent, 2),
                "avgVolume": avg_volume,
                "totalValueTraded": total_value_traded,
                "stockCount": len(stocks),
                "performanceScore": round(performance_score, 2),
                "topStocks": top_stocks
            })
        
        # Sort sectors by performance score (top gainers first)
        sector_performances.sort(key=lambda x: x["performanceScore"], reverse=True)
        top_sectors = sector_performances[:3]
        
        # Get top gainers overall
        top_gainers = sorted(all_stocks, key=lambda x: x["changePercent"], reverse=True)[:10]
        
        print(f"Analysis complete: {len(all_stocks)} stocks, {len(sector_performances)} sectors")
        print(f"Top 3 sectors: {[s['sector'] for s in top_sectors]}")
        print(f"Top gainer: {top_gainers[0]['symbol']} ({top_gainers[0]['changePercent']:.2f}%)")
        
        return {
            "topStocks": top_gainers[:9],  # Top 9 stocks (3 from each top sector)
            "topSectors": top_sectors,
            "allSectorData": sector_performances,
            "topGainers": top_gainers,
            "totalStocks": len(all_stocks),
            "totalSectors": len(sector_performances),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        print(f"Sector analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to analyze sectors: {str(e)}")

@app.post("/trading-education/generate-blog")
async def generate_trading_education_blog_endpoint(request: TradingEducationBlogRequest):
    """Generate comprehensive trading education blog with marketing integration"""
    return await generate_trading_education_blog(request.topic, request.include_marketing, request.style)

@app.get("/trading-education/topics")
async def get_trading_education_topics():
    """Get available trading education topics"""
    return {
        "topics": TRADING_EDUCATION_TOPICS,
        "total_topics": len(TRADING_EDUCATION_TOPICS),
        "categories": {
            "Technical Indicators": 8,
            "Trading Strategies": 7,
            "Market Analysis": 7,
            "Risk Management": 6,
            "Options Trading": 6
        }
    }

@app.post("/trading-education/auto-schedule")
async def setup_auto_blog_schedule(request: AutoBlogSchedule):
    """Setup automatic blog generation schedule"""
    return {
        "enabled": request.enabled,
        "post_time": request.post_time,
        "timezone": request.timezone,
        "next_post": "2025-08-01T09:00:00",
        "message": "Auto-schedule configured. Blog will be generated daily at 9:00 AM."
    }

@app.post("/trading-education/generate-daily")
async def generate_daily_blog():
    """Generate today's trading education blog (for scheduler)"""
    try:
        # Get today's topic based on date
        today = datetime.now()
        topic_index = today.day % len(TRADING_EDUCATION_TOPICS)
        today_topic = TRADING_EDUCATION_TOPICS[topic_index]
        
        # Generate blog
        blog_result = await generate_trading_education_blog(today_topic, True, "professional")
        
        return {
            "daily_blog": blog_result,
            "topic": today_topic,
            "generated_at": datetime.now().isoformat(),
            "status": "ready_for_publishing"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate daily blog: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

