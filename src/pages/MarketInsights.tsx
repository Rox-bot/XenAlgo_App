import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Search,
  Filter,
  Star,
  Users,
  Clock,
  Play,
  BookOpen,
  Brain,
  Target,
  TrendingUp,
  BarChart3,
  Zap,
  Crown,
  Award,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Heart,
  Share2,
  Download,
  Eye,
  MessageSquare,
  Video,
  FileText,
  Calculator,
  ChartBar,
  Settings,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Watch,
  Headphones,
  Camera,
  Mic,
  Code,
  Database,
  Cloud,
  Wifi,
  Bluetooth,
  Satellite,
  Radar,
  Telescope,
  Microscope,
  Heart as HeartIcon,
  Brain as BrainIcon,
  Eye as EyeIcon,
  Calendar,
  User
} from 'lucide-react';

// Static blog posts data
const staticBlogPosts = {
  "mastering-candlestick-trading": {
    id: "static-1",
    title: "Mastering the Art of Candlestick Trading",
    summary: "Welcome to my blog post where we dive into the world of candlestick trading! Whether you're new to the stock market or a seasoned investor, understanding the nuances of candlestick patterns can significantly enhance your trading decisions.",
    author: "Sarthak Mathur",
    published_at: "2024-12-15T00:00:00Z",
    category: "Technical Analysis",
    estimated_read_time: "8 min read",
    difficulty_level: "Intermediate",
    keywords: ["candlestick", "trading", "patterns", "technical analysis"],
    status: "published",
    slug: "mastering-candlestick-trading",
    meta_description: "Learn the fundamentals of candlestick trading patterns and how to use them in your trading strategy.",
    featured_image_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
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
    id: "static-2",
    title: "Understanding Market Volatility in 2024",
    summary: "Explore the key factors driving market volatility and how traders can adapt their strategies accordingly.",
    author: "Sarthak Mathur",
    published_at: "2024-12-12T00:00:00Z",
    category: "Market Insights",
    estimated_read_time: "6 min read",
    difficulty_level: "Beginner",
    keywords: ["volatility", "market", "trading", "2024"],
    status: "published",
    slug: "market-volatility-2024",
    meta_description: "Explore the key factors driving market volatility in 2024 and how traders can adapt their strategies.",
    featured_image_url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=400&fit=crop",
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
    id: "static-3",
    title: "Risk Management Strategies for Day Traders",
    summary: "Learn essential risk management techniques that can protect your capital and improve your trading performance.",
    author: "Sarthak Mathur",
    published_at: "2024-12-10T00:00:00Z",
    category: "Risk Management",
    estimated_read_time: "10 min read",
    difficulty_level: "Advanced",
    keywords: ["risk management", "day trading", "capital protection", "trading strategies"],
    status: "published",
    slug: "risk-management-day-trading",
    meta_description: "Learn essential risk management techniques for day traders to protect capital and improve performance.",
    featured_image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
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

interface Blog {
  id: string;
  title: string;
  summary?: string;
  content?: string;
  author?: string;
  published_at: string;
  category?: string;
  estimated_read_time?: string;
  difficulty_level?: string;
  keywords?: string[];
  status?: string;
  slug?: string;
  meta_description?: string;
  featured_image_url?: string;
  marketing_included?: boolean;
  topic?: string;
}

const MarketInsights = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const { toast } = useToast();

  // Combine AI blogs and static blogs
  const allBlogs = useMemo(() => {
    try {
      const staticBlogsArray = Object.values(staticBlogPosts).map(blog => ({
        ...blog,
        isStatic: true
      }));
      
      const aiBlogsArray = blogs.map(blog => ({
        ...blog,
        isStatic: false
      }));
      
      return [...staticBlogsArray, ...aiBlogsArray];
    } catch (error) {
      console.error('Error combining blogs:', error);
      return [];
    }
  }, [blogs]);

  // Memoized filtered blogs
  const filteredBlogs = useMemo(() => {
    try {
      return allBlogs.filter(blog => {
        const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             (blog.summary && blog.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
                             (blog.author && blog.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
                             (blog.category && blog.category.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
        
        const matchesDifficulty = selectedDifficulty === 'All' || blog.difficulty_level === selectedDifficulty;
        
        return matchesSearch && matchesCategory && matchesDifficulty;
      });
    } catch (error) {
      console.error('Error filtering blogs:', error);
      toast({
        title: "Error",
        description: "Failed to filter blogs. Please try again.",
        variant: "destructive",
      });
      return [];
    }
  }, [allBlogs, searchQuery, selectedCategory, selectedDifficulty, toast]);

  // Load AI blogs from Supabase
  const loadBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        console.warn('Supabase credentials not found, using static blogs only');
        setBlogs([]);
        return;
      }

      const response = await fetch(`${supabaseUrl}/rest/v1/blogs?status=eq.published&order=published_at.desc`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBlogs((data as unknown as Blog[]) || []);
    } catch (error) {
      console.error('Error loading blogs:', error);
      setError('Failed to load blogs. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load blogs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  // Memoized event handlers
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setSearchQuery(e.target.value);
    } catch (error) {
      console.error('Error updating search:', error);
      toast({
        title: "Error",
        description: "Failed to update search. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleCategoryChange = useCallback((value: string) => {
    try {
      setSelectedCategory(value);
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleDifficultyChange = useCallback((value: string) => {
    try {
      setSelectedDifficulty(value);
    } catch (error) {
      console.error('Error updating difficulty:', error);
      toast({
        title: "Error",
        description: "Failed to update difficulty. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleBlogClick = useCallback((blog: Blog) => {
    try {
      if (blog.slug) {
        window.open(`/blog/${blog.slug}`, '_blank');
      }
    } catch (error) {
      console.error('Error opening blog:', error);
      toast({
        title: "Error",
        description: "Failed to open blog. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const extractTextFromHTML = useCallback((html: string) => {
    try {
      return html.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
    } catch (error) {
      console.error('Error extracting text from HTML:', error);
      return '';
    }
  }, []);

  const formatDate = useCallback((dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  }, []);

  const getDifficultyColor = useCallback((difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-success/10 text-success border-success/20';
      case 'intermediate':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'advanced':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-info/10 text-info border-info/20';
    }
  }, []);

  // Get unique categories from all blogs
  const categories = useMemo(() => {
    try {
      const allCategories = allBlogs.map(blog => blog.category).filter(Boolean) as string[];
      const uniqueCategories = [...new Set(allCategories)];
      return ['All', ...uniqueCategories];
    } catch (error) {
      console.error('Error getting categories:', error);
      return ['All'];
    }
  }, [allBlogs]);

  // Get unique difficulty levels
  const difficultyLevels = useMemo(() => {
    try {
      const allDifficulties = allBlogs.map(blog => blog.difficulty_level).filter(Boolean) as string[];
      const uniqueDifficulties = [...new Set(allDifficulties)];
      return ['All', ...uniqueDifficulties];
    } catch (error) {
      console.error('Error getting difficulty levels:', error);
      return ['All'];
    }
  }, [allBlogs]);

  return (
    <div className="min-h-screen bg-background-soft">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-background-ultra to-background-soft">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-deep to-luxury-gold bg-clip-text text-transparent">
                Market Insights & Trading Education
              </span>
            </h1>
            <p className="text-xl text-primary max-w-3xl mx-auto">
              Discover AI-generated insights and expert trading articles. From technical analysis to risk management, 
              find everything you need to enhance your trading knowledge.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-4 h-4" />
              <Input
                placeholder="Search articles, topics, or authors..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 bg-background-pure border border-border-light focus:border-primary focus:ring-2 focus:ring-primary/20 text-primary placeholder:text-text-cool"
                aria-describedby="search-description"
              />
              <div id="search-description" className="sr-only">
                Search for articles by title, content, author, or category
              </div>
        </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-48 bg-background-pure border-border-light text-primary">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-background-pure border border-border-light">
            {categories.map((category) => (
                    <SelectItem key={category} value={category} className="text-primary hover:bg-background-ultra">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedDifficulty} onValueChange={handleDifficultyChange}>
                <SelectTrigger className="w-48 bg-background-pure border-border-light text-primary">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent className="bg-background-pure border border-border-light">
                  {difficultyLevels.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty} className="text-primary hover:bg-background-ultra">
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-center mb-8">
            <p className="text-primary">
              Showing {filteredBlogs.length} of {allBlogs.length} articles
            </p>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-primary">Loading articles...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-primary mb-2">Error Loading Articles</h3>
              <p className="text-primary mb-4">{error}</p>
              <Button onClick={loadBlogs} className="bg-primary text-background-soft hover:bg-primary-light">
                Try Again
              </Button>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-primary mb-2">No articles found</h3>
              <p className="text-primary">Try adjusting your search terms or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog) => (
                <Card key={blog.id} className="hover:shadow-lg transition-shadow duration-300 bg-background-pure border border-border-light">
            <CardHeader>
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary" className="mb-2 bg-info/10 text-info border-info/20">
                        {blog.category}
                </Badge>
                      <Badge variant="outline" className={getDifficultyColor(blog.difficulty_level || 'Beginner')}>
                        {blog.difficulty_level || 'Beginner'}
                      </Badge>
                    </div>
                    
                    <CardTitle className="text-lg font-semibold text-primary line-clamp-2 mb-2">
                      {blog.title}
                    </CardTitle>
                    
                    <p className="text-sm text-primary mb-3 line-clamp-3">
                      {blog.summary || (blog.content && extractTextFromHTML(blog.content))}
                    </p>
                    
                    {/* Keywords */}
                    {blog.keywords && blog.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {blog.keywords.slice(0, 3).map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-background-ultra text-primary border-border-light">
                            {keyword}
                      </Badge>
                    ))}
                  </div>
                    )}

                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-xs text-primary">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{blog.author || 'XenAlgo Team'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(blog.published_at)}</span>
                </div>
              </div>
                    
                    <div className="flex items-center gap-4 text-xs text-primary mt-2">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{blog.estimated_read_time || '5 min read'}</span>
                  </div>
                      {blog.isStatic && (
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          <span>Featured</span>
                </div>
                      )}
                  </div>
                  </CardHeader>

                  <CardContent>
                    <Button 
                      className="w-full bg-primary text-background-soft hover:bg-primary-light"
                      onClick={() => handleBlogClick(blog)}
                      aria-label={`Read ${blog.title}`}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Read Article
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
            </Card>
          ))}
            </div>
          )}
      </div>
      </section>
    </div>
  );
};

export default MarketInsights; 