import React, { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Share2, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const BlogPost = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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
        
        <ul>
          <li><strong>Position Sizing:</strong> Reduce position sizes to manage increased risk</li>
          <li><strong>Stop Losses:</strong> Use tighter stop losses to limit potential losses</li>
          <li><strong>Diversification:</strong> Spread risk across multiple asset classes</li>
          <li><strong>Patience:</strong> Wait for clear setups rather than forcing trades</li>
        </ul>
        
        <h3>Conclusion</h3>
        <p>While volatility can be challenging, it also presents opportunities for skilled traders. The key is to adapt your strategies and maintain discipline in your approach.</p>
      `
    }
  };

  // Memoized blog post data
  const currentPost = blogPosts[slug as keyof typeof blogPosts];

  // Memoized share handler
  const handleShare = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Simulate share operation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (navigator.share) {
        await navigator.share({
          title: currentPost?.title || 'Blog Post',
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Blog post link copied to clipboard!",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error sharing blog post:', error);
      toast({
        title: "Share Error",
        description: "Failed to share blog post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPost, toast]);

  // Memoized back to blogs handler
  const handleBackToBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Simulate navigation delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      toast({
        title: "Navigating",
        description: "Taking you back to all blogs...",
        variant: "default",
      });
    } catch (error) {
      console.error('Error navigating back:', error);
      toast({
        title: "Navigation Error",
        description: "Failed to navigate back to blogs.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  if (!currentPost) {
    return (
      <div className="min-h-screen bg-background-soft">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-4">Blog Post Not Found</h1>
            <p className="text-primary mb-8">The blog post you're looking for doesn't exist.</p>
            <Link to="/market-insights">
              <Button className="bg-primary text-background-soft hover:bg-primary-light">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blogs
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-soft">
      <Navbar />
      
      <article className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/market-insights">
              <Button 
                variant="outline" 
                className="bg-background-pure border-primary text-primary hover:bg-background-ultra"
                onClick={handleBackToBlogs}
                disabled={isLoading}
                aria-label="Back to all blogs"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blogs
              </Button>
            </Link>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Badge variant="outline" className="bg-background-pure border-primary text-primary mb-4">
              {currentPost.category}
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              {currentPost.title}
            </h1>
            
            <p className="text-xl text-primary mb-8">
              {currentPost.excerpt}
            </p>
            
            <div className="flex items-center gap-6 text-sm text-primary mb-8">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{currentPost.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{currentPost.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{currentPost.readTime}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                onClick={handleShare}
                disabled={isLoading}
                variant="outline"
                className="bg-background-pure border-primary text-primary hover:bg-background-ultra"
                aria-label="Share this blog post"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Sharing...
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </>
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="max-w-4xl mx-auto mb-12">
          <img
            src={currentPost.image}
            alt={currentPost.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div 
            className="prose prose-lg max-w-none prose-headings:text-primary prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-p:text-primary prose-p:leading-relaxed prose-ul:text-primary prose-ol:text-primary prose-li:my-1"
            dangerouslySetInnerHTML={{ __html: currentPost.content }}
          />
        </div>
      </article>

      {/* Related Posts */}
      <section className="py-16 bg-background-ultra">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">Related Articles</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-background-pure border border-border-light hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <Badge variant="outline" className="bg-background-pure border-primary text-primary">
                    Technical Analysis
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">
                  Advanced Chart Patterns
                </h3>
                <p className="text-sm text-primary mb-4">Learn about complex chart patterns that can give you an edge in trading.</p>
                <Link to="/blog/advanced-chart-patterns">
                  <Button variant="outline" className="bg-background-pure border-primary text-primary hover:bg-background-ultra">
                    Read More
                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="bg-background-pure border border-border-light hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <Badge variant="outline" className="bg-background-pure border-primary text-primary">
                    Psychology
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">
                  Trading Psychology Mastery
                </h3>
                <p className="text-sm text-primary mb-4">Master your emotions and become a more disciplined trader.</p>
                <Link to="/blog/trading-psychology">
                  <Button variant="outline" className="bg-background-pure border-primary text-primary hover:bg-background-ultra">
                    Read More
                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPost;