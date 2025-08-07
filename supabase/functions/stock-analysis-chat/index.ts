import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  peRatio: number;
  eps: number;
  roe: number;
  dividendYield: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
}

interface NewsItem {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
}

interface AnalysisResponse {
  summary: string;
  insights: string[];
  riskFactors: string[];
  recommendations: string[];
  dataSources: string[];
  lastUpdated: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, symbol } = await req.json()

    if (!query && !symbol) {
      return new Response(
        JSON.stringify({ error: 'Query or symbol is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Extract stock symbol from query if not provided directly
    const stockSymbol = symbol || extractStockSymbol(query)
    
    if (!stockSymbol) {
      return new Response(
        JSON.stringify({ error: 'Could not identify stock symbol from query' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Fetch real-time stock data
    const stockData = await fetchStockData(stockSymbol)
    const newsData = await fetchNewsData(stockSymbol)
    const earningsData = await fetchEarningsData(stockSymbol)

    // Generate AI analysis
    const analysis = await generateAnalysis(stockSymbol, stockData, newsData, earningsData, query)

    return new Response(
      JSON.stringify({
        success: true,
        symbol: stockSymbol,
        stockData,
        newsData,
        earningsData,
        analysis
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in stock analysis chat:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze stock',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function extractStockSymbol(query: string): string | null {
  // Simple regex to extract stock symbols (1-5 capital letters)
  const symbolMatch = query.match(/\b[A-Z]{1,5}\b/)
  return symbolMatch ? symbolMatch[0] : null
}

async function fetchStockData(symbol: string): Promise<StockData> {
  const apiKey = Deno.env.get('ALPHA_VANTAGE_API_KEY')
  if (!apiKey) {
    throw new Error('Alpha Vantage API key not configured')
  }

  // Fetch quote data
  const quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
  const quoteResponse = await fetch(quoteUrl)
  const quoteData = await quoteResponse.json()

  // Fetch overview data for additional metrics
  const overviewUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`
  const overviewResponse = await fetch(overviewUrl)
  const overviewData = await overviewResponse.json()

  const quote = quoteData['Global Quote']
  if (!quote || !quote['05. price']) {
    throw new Error(`No data found for symbol ${symbol}`)
  }

  return {
    symbol: symbol.toUpperCase(),
    price: parseFloat(quote['05. price']),
    change: parseFloat(quote['09. change']),
    changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
    marketCap: parseFloat(overviewData.MarketCapitalization || '0'),
    peRatio: parseFloat(overviewData.PERatio || '0'),
    eps: parseFloat(overviewData.EPS || '0'),
    roe: parseFloat(overviewData.ReturnOnEquityTTM || '0'),
    dividendYield: parseFloat(overviewData.DividendYield || '0'),
    volume: parseInt(quote['06. volume']),
    high: parseFloat(quote['03. high']),
    low: parseFloat(quote['04. low']),
    open: parseFloat(quote['02. open']),
    previousClose: parseFloat(quote['08. previous close'])
  }
}

async function fetchNewsData(symbol: string): Promise<NewsItem[]> {
  const apiKey = Deno.env.get('NEWS_API_KEY')
  if (!apiKey) {
    return []
  }

  try {
    const url = `https://newsapi.org/v2/everything?q=${symbol}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`
    const response = await fetch(url)
    const data = await response.json()

    return data.articles?.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      publishedAt: article.publishedAt,
      source: article.source.name
    })) || []
  } catch (error) {
    console.error('Error fetching news:', error)
    return []
  }
}

async function fetchEarningsData(symbol: string) {
  const apiKey = Deno.env.get('ALPHA_VANTAGE_API_KEY')
  if (!apiKey) {
    return null
  }

  try {
    const url = `https://www.alphavantage.co/query?function=EARNINGS&symbol=${symbol}&apikey=${apiKey}`
    const response = await fetch(url)
    const data = await response.json()

    return data.annualEarnings?.slice(0, 5) || []
  } catch (error) {
    console.error('Error fetching earnings:', error)
    return null
  }
}

async function generateAnalysis(
  symbol: string, 
  stockData: StockData, 
  newsData: NewsItem[], 
  earningsData: any, 
  userQuery: string
): Promise<AnalysisResponse> {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured')
  }

  const prompt = createAnalysisPrompt(symbol, stockData, newsData, earningsData, userQuery)

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional financial analyst providing concise, accurate, and well-cited stock market analysis. Always include specific data points and cite your sources.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    })
  })

  const data = await response.json()
  
  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Failed to generate analysis')
  }

  const analysisText = data.choices[0].message.content

  // Parse the analysis response
  return parseAnalysisResponse(analysisText, stockData)
}

function createAnalysisPrompt(
  symbol: string, 
  stockData: StockData, 
  newsData: NewsItem[], 
  earningsData: any, 
  userQuery: string
): string {
  const newsSummary = newsData.slice(0, 3).map(news => 
    `- ${news.title} (${news.source})`
  ).join('\n')

  const earningsSummary = earningsData ? 
    earningsData.map((earning: any) => 
      `${earning.fiscalDateEnding}: $${earning.reportedEPS} EPS`
    ).join(', ') : 'No recent earnings data available'

  return `
Analyze ${symbol} stock based on the following data and user query: "${userQuery}"

STOCK DATA:
- Current Price: $${stockData.price}
- Change: $${stockData.change} (${stockData.changePercent}%)
- Market Cap: $${(stockData.marketCap / 1e9).toFixed(2)}B
- P/E Ratio: ${stockData.peRatio}
- EPS: $${stockData.eps}
- ROE: ${stockData.roe}%
- Dividend Yield: ${stockData.dividendYield}%
- Volume: ${stockData.volume.toLocaleString()}
- 52-week range: $${stockData.low} - $${stockData.high}

RECENT NEWS:
${newsSummary}

EARNINGS HISTORY:
${earningsSummary}

Please provide a structured analysis in the following JSON format:
{
  "summary": "Brief overview of the stock's current position",
  "insights": ["Key insight 1", "Key insight 2", "Key insight 3"],
  "riskFactors": ["Risk factor 1", "Risk factor 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "dataSources": ["Alpha Vantage", "News API", "Company Filings"]
}

Focus on providing actionable insights and cite specific data points. Be concise but comprehensive.
`
}

function parseAnalysisResponse(analysisText: string, stockData: StockData): AnalysisResponse {
  try {
    // Try to extract JSON from the response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        ...parsed,
        lastUpdated: new Date().toISOString()
      }
    }
  } catch (error) {
    console.error('Failed to parse JSON response:', error)
  }

  // Fallback parsing
  return {
    summary: analysisText.substring(0, 200) + '...',
    insights: ['Analysis generated successfully'],
    riskFactors: ['Market volatility', 'Economic conditions'],
    recommendations: ['Consult with a financial advisor'],
    dataSources: ['Alpha Vantage', 'News API'],
    lastUpdated: new Date().toISOString()
  }
} 