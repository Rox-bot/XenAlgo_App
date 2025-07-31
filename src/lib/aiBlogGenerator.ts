// AI Blog Generator for Trending Stocks
// Uses OpenAI API to generate professional stock analysis blogs

import { makeProxyRequest, shouldUseProxy, API_CONFIG } from './apiConfig';

export interface BlogPost {
  title: string;
  content: string;
  symbol: string;
  generatedAt: string;
  style: string;
  tags: string[];
}

export interface BlogGenerationRequest {
  stockSymbol: string;
  stockData: any;
  newsData: any[];
  style?: string;
}

// Mock OpenAI for fallback
const mockOpenAI = {
  generateBlogPost: async (request: BlogGenerationRequest): Promise<BlogPost> => {
    const { stockSymbol, stockData, newsData, style = 'professional' } = request;
    
    // Generate mock blog content
    const mockContent = `
# ${stockSymbol} Stock Analysis - Market Update

## Current Market Position
${stockSymbol} is currently trading at $${stockData.price || 150.00}, showing a ${stockData.changePercent > 0 ? 'positive' : 'negative'} movement of ${Math.abs(stockData.changePercent || 2.5)}% today.

## Key Developments
${newsData.length > 0 ? newsData.map(news => `- ${news.title}`).join('\n') : '- Market sentiment remains mixed\n- Technical indicators show consolidation\n- Volume is above average'}

## Technical Analysis
The stock is currently ${stockData.changePercent > 0 ? 'bullish' : 'bearish'} with strong support at $${(stockData.price * 0.95).toFixed(2)} and resistance at $${(stockData.price * 1.05).toFixed(2)}.

## Investment Outlook
Based on current market conditions and technical indicators, ${stockSymbol} presents ${stockData.changePercent > 0 ? 'positive' : 'mixed'} opportunities for investors. Consider your risk tolerance and investment goals before making decisions.

*This analysis is for informational purposes only and should not be considered as financial advice.*
    `.trim();

    return {
      title: `${stockSymbol} Stock Analysis - Market Update`,
      content: mockContent,
      symbol: stockSymbol,
      generatedAt: new Date().toISOString(),
      style,
      tags: [stockSymbol, 'stock analysis', 'market update', 'trading'],
    };
  }
};

// Real OpenAI integration
const openAI = {
  generateBlogPost: async (request: BlogGenerationRequest): Promise<BlogPost> => {
    const { stockSymbol, stockData, newsData, style = 'professional' } = request;
    
    try {
      if (shouldUseProxy()) {
        // Use proxy service
        const data = await makeProxyRequest(API_CONFIG.PROXY_SERVICE.endpoints.openai, {
          method: 'POST',
          body: JSON.stringify({
            stock_symbol: stockSymbol,
            stock_data: stockData,
            news_data: newsData,
            style,
          }),
        });
        
        return {
          title: data.title,
          content: data.content,
          symbol: data.symbol,
          generatedAt: data.generated_at,
          style: data.style,
          tags: [stockSymbol, 'stock analysis', 'market update', 'trading'],
        };
      } else {
        // Direct OpenAI API call (fallback)
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
        if (!apiKey) {
          throw new Error('OpenAI API key not configured');
        }

        const prompt = `
Generate a professional blog post about ${stockSymbol} based on the following data:

Stock Data: ${JSON.stringify(stockData, null, 2)}
News: ${JSON.stringify(newsData, null, 2)}

Style: ${style}

Please create a well-structured blog post with:
1. Introduction
2. Current market position
3. Key news and developments
4. Technical analysis
5. Conclusion

Make it engaging and informative for traders and investors.
        `;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: 'You are a professional financial analyst and blogger.' },
              { role: 'user', content: prompt }
            ],
            max_tokens: 1000,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const blogContent = data.choices[0].message.content;

        return {
          title: `Analysis: ${stockSymbol} - Market Update`,
          content: blogContent,
          symbol: stockSymbol,
          generatedAt: new Date().toISOString(),
          style,
          tags: [stockSymbol, 'stock analysis', 'market update', 'trading'],
        };
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
      // Fallback to mock generation
      return await mockOpenAI.generateBlogPost(request);
    }
  }
};

// Export the appropriate implementation
export const generateBlogPost = async (request: BlogGenerationRequest): Promise<BlogPost> => {
  try {
    return await openAI.generateBlogPost(request);
  } catch (error) {
    console.error('Blog generation failed, using mock:', error);
    return await mockOpenAI.generateBlogPost(request);
  }
};

// Batch blog generation
export const generateMultipleBlogPosts = async (requests: BlogGenerationRequest[]): Promise<BlogPost[]> => {
  const blogPosts: BlogPost[] = [];
  
  for (const request of requests) {
    try {
      const blogPost = await generateBlogPost(request);
      blogPosts.push(blogPost);
      
      // Add delay between requests to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Failed to generate blog for ${request.stockSymbol}:`, error);
    }
  }
  
  return blogPosts;
};

// Blog post validation
export const validateBlogPost = (blogPost: BlogPost): boolean => {
  return !!(
    blogPost.title &&
    blogPost.content &&
    blogPost.symbol &&
    blogPost.generatedAt &&
    blogPost.content.length > 100
  );
};

// Blog post formatting
export const formatBlogPost = (blogPost: BlogPost): BlogPost => {
  return {
    ...blogPost,
    title: blogPost.title.trim(),
    content: blogPost.content.trim(),
    tags: blogPost.tags.filter(tag => tag && tag.length > 0),
  };
}; 