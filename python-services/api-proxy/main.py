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
YAHOO_FINANCE_API_KEY = os.getenv("YAHOO_FINANCE_API_KEY", "")
ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY", "")
NEWS_API_KEY = os.getenv("NEWS_API_KEY", "")
REDDIT_CLIENT_ID = os.getenv("REDDIT_CLIENT_ID", "")
REDDIT_CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
SERP_API_KEY = os.getenv("SERP_API_KEY", "")

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

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/api-status")
async def api_status():
    """Check status of all API keys"""
    return {
        "yahoo_finance": bool(YAHOO_FINANCE_API_KEY),
        "alpha_vantage": bool(ALPHA_VANTAGE_API_KEY),
        "news_api": bool(NEWS_API_KEY),
        "reddit": bool(REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET),
        "openai": bool(OPENAI_API_KEY),
        "serp": bool(SERP_API_KEY)
    }

@app.post("/yahoo-finance/quote")
async def get_yahoo_finance_quote(request: StockDataRequest):
    """Get stock quote from Yahoo Finance"""
    try:
        url = f"https://query2.finance.yahoo.com/v10/finance/quoteSummary/{request.symbol}"
        params = {
            "modules": "price,summaryDetail,defaultKeyStatistics,financialData"
        }
        
        data = await make_request(url, params=params)
        
        if not data.get("quoteSummary", {}).get("result"):
            raise HTTPException(status_code=404, detail="Stock not found")
            
        result = data["quoteSummary"]["result"][0]
        
        # Extract relevant data
        price_data = result.get("price", {})
        summary_data = result.get("summaryDetail", {})
        financial_data = result.get("financialData", {})
        
        return {
            "symbol": request.symbol,
            "price": price_data.get("regularMarketPrice", {}).get("raw"),
            "change": price_data.get("regularMarketChange", {}).get("raw"),
            "change_percent": price_data.get("regularMarketChangePercent", {}).get("raw"),
            "volume": price_data.get("regularMarketVolume", {}).get("raw"),
            "market_cap": summary_data.get("marketCap", {}).get("raw"),
            "pe_ratio": financial_data.get("forwardPE", {}).get("raw"),
            "eps": financial_data.get("trailingEps", {}).get("raw"),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch Yahoo Finance data: {str(e)}")

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
    """Get trending stocks from multiple sources"""
    try:
        trending_stocks = []
        
        # Get Reddit trending
        try:
            reddit_data = await get_reddit_trending()
            trending_stocks.extend(reddit_data["trending_stocks"])
        except Exception as e:
            print(f"Reddit API error: {e}")
        
        # Add some popular stocks as fallback
        popular_stocks = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN", "NVDA", "META", "NFLX", "AMD", "INTC"]
        
        # Get data for top mentions and popular stocks
        all_symbols = list(set([stock["symbol"] for stock in trending_stocks[:5]] + popular_stocks[:5]))
        
        stock_data = []
        for symbol in all_symbols:
            try:
                # Get basic quote
                quote_data = await get_yahoo_finance_quote(StockDataRequest(symbol=symbol))
                stock_data.append(quote_data)
            except Exception as e:
                print(f"Error fetching data for {symbol}: {e}")
                continue
        
        return {
            "trending_stocks": stock_data,
            "sources": ["reddit", "popular"],
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get trending stocks: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001) 