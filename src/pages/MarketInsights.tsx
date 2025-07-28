import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Calendar,
  Clock,
  Eye,
  Share2,
  Bookmark,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

const MarketInsights = () => {
  const insights = [
    {
      id: 1,
      title: "NIFTY 50 Technical Analysis: Bullish Momentum Continues",
      excerpt: "The NIFTY 50 index shows strong bullish momentum with key support at 18,200. RSI indicates overbought conditions but momentum remains strong.",
      category: "Technical Analysis",
      author: "XenAlgo Team",
      date: "2024-01-15",
      readTime: "5 min read",
      views: "2.3k",
      image: "📈",
      tags: ["NIFTY 50", "Technical Analysis", "Bullish"],
      featured: true
    },
    {
      id: 2,
      title: "Bank NIFTY Option Strategy: Iron Condor Setup",
      excerpt: "With Bank NIFTY trading sideways, an Iron Condor strategy could be profitable. Here's our recommended strike selection and risk management.",
      category: "Options Strategy",
      author: "Options Expert",
      date: "2024-01-14",
      readTime: "8 min read",
      views: "1.8k",
      image: "🎯",
      tags: ["Bank NIFTY", "Iron Condor", "Options"],
      featured: false
    },
    {
      id: 3,
      title: "Market Sentiment Analysis: Fear & Greed Index",
      excerpt: "Current market sentiment shows moderate greed levels. Historical data suggests this could lead to short-term volatility in the coming week.",
      category: "Market Sentiment",
      author: "Sentiment Analyst",
      date: "2024-01-13",
      readTime: "4 min read",
      views: "1.5k",
      image: "😐",
      tags: ["Sentiment", "Fear & Greed", "Volatility"],
      featured: false
    },
    {
      id: 4,
      title: "Sector Rotation: IT Stocks Show Strength",
      excerpt: "IT sector stocks are showing relative strength compared to other sectors. TCS and Infosys lead the pack with strong technical setups.",
      category: "Sector Analysis",
      author: "Sector Analyst",
      date: "2024-01-12",
      readTime: "6 min read",
      views: "1.2k",
      image: "💻",
      tags: ["IT Sector", "TCS", "Infosys", "Sector Rotation"],
      featured: false
    },
    {
      id: 5,
      title: "Weekly Options Expiry: Key Levels to Watch",
      excerpt: "This week's options expiry could see increased volatility. Key levels for NIFTY and Bank NIFTY options traders to monitor.",
      category: "Options Trading",
      author: "Options Trader",
      date: "2024-01-11",
      readTime: "7 min read",
      views: "2.1k",
      image: "📊",
      tags: ["Options Expiry", "Volatility", "Key Levels"],
      featured: false
    },
    {
      id: 6,
      title: "Global Market Correlation: Impact on Indian Markets",
      excerpt: "US market movements are increasingly correlated with Indian markets. Understanding this relationship is crucial for portfolio management.",
      category: "Global Markets",
      author: "Global Analyst",
      date: "2024-01-10",
      readTime: "9 min read",
      views: "1.7k",
      image: "🌍",
      tags: ["Global Markets", "Correlation", "US Markets"],
      featured: false
    }
  ];

  const categories = [
    { name: "All", count: insights.length },
    { name: "Technical Analysis", count: 1 },
    { name: "Options Strategy", count: 1 },
    { name: "Market Sentiment", count: 1 },
    { name: "Sector Analysis", count: 1 },
    { name: "Options Trading", count: 1 },
    { name: "Global Markets", count: 1 }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      "Technical Analysis": "bg-blue-100 text-blue-800",
      "Options Strategy": "bg-purple-100 text-purple-800",
      "Market Sentiment": "bg-yellow-100 text-yellow-800",
      "Sector Analysis": "bg-green-100 text-green-800",
      "Options Trading": "bg-orange-100 text-orange-800",
      "Global Markets": "bg-indigo-100 text-indigo-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Market Insights</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Stay ahead with expert analysis, technical insights, and market strategies from our team of trading professionals.
          </p>
        </div>

        {/* Categories Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge 
                key={category.name}
                variant="secondary" 
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {category.name} ({category.count})
              </Badge>
            ))}
          </div>
        </div>

        {/* Featured Article */}
        {insights.filter(insight => insight.featured).map((insight) => (
          <Card key={insight.id} className="mb-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Badge className={getCategoryColor(insight.category)}>
                  {insight.category}
                </Badge>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {insight.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {insight.views}
                  </span>
                </div>
              </div>
              <CardTitle className="text-2xl mb-2">{insight.title}</CardTitle>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                {insight.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    By {insight.author} • {formatDate(insight.date)}
                  </span>
                  <div className="flex gap-2">
                    {insight.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button>
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.filter(insight => !insight.featured).map((insight) => (
            <Card key={insight.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <Badge className={getCategoryColor(insight.category)}>
                    {insight.category}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {insight.readTime}
                  </div>
                </div>
                <div className="text-4xl mb-3">{insight.image}</div>
                <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                  {insight.title}
                </CardTitle>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {insight.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{insight.author}</span>
                    <span>•</span>
                    <span>{formatDate(insight.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <Card className="mt-12 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated with Market Insights</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Get the latest market analysis, trading strategies, and expert insights delivered to your inbox every week.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button className="bg-primary hover:bg-primary/90">
                Subscribe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketInsights; 