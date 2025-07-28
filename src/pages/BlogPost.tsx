import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Share2, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const BlogPost = () => {
  const { slug } = useParams();

  // Blog post data - in a real app, this would come from an API
  const blogPosts = {
    "mastering-candlestick-trading": {
      title: "Mastering the Art of Candlestick Trading",
      excerpt: "Welcome to my blog post where we dive into the world of candlestick trading! Whether you're new to the stock market or a seasoned investor, understanding the nuances of candlestick patterns can significantly enhance your trading decisions.",
      author: "Sarthak Mathur",
      date: "Dec 15, 2024",
      category: "Technical Analysis",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
      content: `
        <h2>Introduction to Candlestick Trading</h2>
        <p>Candlestick patterns are one of the most powerful tools in technical analysis, providing traders with valuable insights into market sentiment and potential price movements. These patterns, originating from Japanese rice traders in the 18th century, have become a cornerstone of modern trading strategies.</p>
        
        <h3>Understanding the Basics</h3>
        <p>A candlestick consists of four main components:</p>
        <ul>
          <li><strong>Open:</strong> The price at which the security opened for trading</li>
          <li><strong>Close:</strong> The price at which the security closed for trading</li>
          <li><strong>High:</strong> The highest price reached during the trading period</li>
          <li><strong>Low:</strong> The lowest price reached during the trading period</li>
        </ul>
        
        <h3>Key Candlestick Patterns</h3>
        <p>Here are some of the most reliable candlestick patterns every trader should know:</p>
        
        <h4>1. Doji</h4>
        <p>A doji represents indecision in the market. It occurs when the opening and closing prices are virtually the same, creating a cross-like appearance. This pattern often signals a potential reversal, especially when it appears after a strong trend.</p>
        
        <h4>2. Hammer</h4>
        <p>The hammer is a bullish reversal pattern that appears at the bottom of a downtrend. It has a small body with a long lower shadow, indicating that sellers drove the price down during the session, but buyers managed to push it back up.</p>
        
        <h4>3. Shooting Star</h4>
        <p>The shooting star is the bearish counterpart to the hammer. It appears at the top of an uptrend and has a small body with a long upper shadow, suggesting that buyers initially drove the price up, but sellers gained control.</p>
        
        <h3>Trading Strategies</h3>
        <p>Successful candlestick trading requires more than just pattern recognition. Here are some key strategies:</p>
        
        <ol>
          <li><strong>Confirmation:</strong> Always wait for confirmation before acting on a candlestick pattern</li>
          <li><strong>Volume Analysis:</strong> Higher volume strengthens the reliability of a pattern</li>
          <li><strong>Support and Resistance:</strong> Patterns are more significant when they occur at key levels</li>
          <li><strong>Risk Management:</strong> Always use stop-losses and position sizing</li>
        </ol>
        
        <h3>Common Mistakes to Avoid</h3>
        <p>Many traders make these common errors when using candlestick patterns:</p>
        
        <ul>
          <li>Trading patterns in isolation without considering market context</li>
          <li>Ignoring volume confirmation</li>
          <li>Not waiting for pattern completion</li>
          <li>Overtrading based on every pattern</li>
        </ul>
        
        <h3>Conclusion</h3>
        <p>Candlestick trading is a powerful skill that can significantly improve your trading performance. However, it requires practice, patience, and a disciplined approach. Remember that no pattern is 100% accurate, and proper risk management is essential for long-term success.</p>
        
        <p>Start by focusing on a few key patterns and gradually expand your knowledge as you gain experience. With time and practice, you'll develop the ability to read market sentiment through candlestick patterns and make more informed trading decisions.</p>
      `
    },
    "market-volatility-2024": {
      title: "Understanding Market Volatility in 2024",
      excerpt: "Explore the key factors driving market volatility and how traders can adapt their strategies accordingly.",
      author: "Sarthak Mathur",
      date: "Dec 12, 2024",
      category: "Market Insights",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=400&fit=crop",
      content: `
        <h2>Market Volatility in 2024: A Comprehensive Analysis</h2>
        <p>2024 has been marked by unprecedented market volatility, driven by a confluence of economic, political, and technological factors. Understanding these dynamics is crucial for traders looking to navigate these turbulent waters successfully.</p>
        
        <h3>Key Drivers of Volatility</h3>
        <p>Several factors have contributed to the increased volatility we've seen in 2024:</p>
        
        <h4>1. Geopolitical Tensions</h4>
        <p>Ongoing conflicts and diplomatic tensions have created uncertainty in global markets, leading to sudden price swings in various asset classes.</p>
        
        <h4>2. Central Bank Policies</h4>
        <p>Changing interest rate policies and quantitative easing measures by major central banks have significantly impacted market stability.</p>
        
        <h4>3. Technology Disruption</h4>
        <p>The rapid advancement of AI and other technologies has created both opportunities and uncertainties, affecting market sentiment.</p>
        
        <h3>Strategies for Volatile Markets</h3>
        <p>Successful trading in volatile markets requires adapted strategies:</p>
        
        <ol>
          <li><strong>Diversification:</strong> Spread risk across different asset classes and sectors</li>
          <li><strong>Position Sizing:</strong> Use smaller position sizes to manage risk</li>
          <li><strong>Stop Losses:</strong> Implement tight stop-loss orders to limit downside</li>
          <li><strong>Volatility Indicators:</strong> Use VIX and other volatility measures to gauge market fear</li>
        </ol>
        
        <h3>Conclusion</h3>
        <p>While volatility can be challenging, it also presents opportunities for skilled traders. The key is to remain disciplined, manage risk effectively, and adapt your strategies to changing market conditions.</p>
      `
    },
    "risk-management-day-trading": {
      title: "Risk Management Strategies for Day Traders",
      excerpt: "Learn essential risk management techniques that can protect your capital and improve your trading performance.",
      author: "Sarthak Mathur",
      date: "Dec 10, 2024",
      category: "Trading",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
      content: `
        <h2>Risk Management: The Foundation of Successful Day Trading</h2>
        <p>Risk management is arguably the most important aspect of day trading. Without proper risk management, even the most profitable strategies can lead to significant losses. This comprehensive guide will teach you the essential techniques to protect your capital and improve your trading performance.</p>
        
        <h3>The 1% Rule</h3>
        <p>Never risk more than 1% of your trading capital on a single trade. This rule helps ensure that even a series of losses won't significantly impact your overall account balance.</p>
        
        <h3>Position Sizing</h3>
        <p>Calculate your position size based on your risk tolerance and stop-loss level. Use the formula: Position Size = (Account Balance × Risk %) / (Entry Price - Stop Loss Price)</p>
        
        <h3>Stop-Loss Orders</h3>
        <p>Always use stop-loss orders to limit your downside risk. Set your stop-loss before entering a trade, not after you're already in a losing position.</p>
        
        <h3>Risk-Reward Ratio</h3>
        <p>Aim for a minimum risk-reward ratio of 1:2. This means for every dollar you risk, you should aim to make at least two dollars in profit.</p>
        
        <h3>Diversification</h3>
        <p>Don't put all your eggs in one basket. Spread your trades across different stocks, sectors, and strategies to reduce overall portfolio risk.</p>
        
        <h3>Emotional Control</h3>
        <p>Develop the discipline to stick to your risk management rules, even when emotions are running high. Fear and greed are the enemies of successful trading.</p>
        
        <h3>Conclusion</h3>
        <p>Remember, the goal of day trading is not to be right all the time, but to be profitable over the long term. Proper risk management is what separates successful traders from those who blow up their accounts.</p>
      `
    }
  };

  const post = blogPosts[slug as keyof typeof blogPosts];

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/blogs">← Back to Blogs</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Back Button */}
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild>
          <Link to="/blogs">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blogs
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Badge variant="secondary" className="mb-4">
                {post.category}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {post.excerpt}
              </p>
              
              {/* Author and Meta Info */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium text-foreground">{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>
              
              {/* Share Button */}
              <div className="flex items-center gap-4 mb-8">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Article
                </Button>
                <Button variant="outline" size="sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Save for Later
                </Button>
              </div>
            </div>
            
            {/* Featured Image */}
            <div className="mb-12">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div 
                  className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-p:text-muted-foreground prose-p:leading-relaxed prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:my-1"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Badge variant="outline" className="mb-3">Technical Analysis</Badge>
                  <h3 className="font-semibold mb-2">Advanced Chart Patterns</h3>
                  <p className="text-sm text-muted-foreground mb-4">Learn about complex chart patterns that can give you an edge in trading.</p>
                  <Button variant="outline" size="sm">Read More</Button>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Badge variant="outline" className="mb-3">Trading Psychology</Badge>
                  <h3 className="font-semibold mb-2">Overcoming Fear and Greed</h3>
                  <p className="text-sm text-muted-foreground mb-4">Master your emotions and become a more disciplined trader.</p>
                  <Button variant="outline" size="sm">Read More</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPost;