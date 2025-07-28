import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, User, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Blogs = () => {
  const categories = ['All', 'Trading', 'Technical Analysis', 'Market Insights', 'Education'];
  
  const featuredPost = {
    title: "Mastering the Art of Candlestick Trading",
    excerpt: "Welcome to my blog post where we dive into the world of candlestick trading! Whether you're new to the stock market or a seasoned investor, understanding the nuances of candlestick patterns can significantly enhance your trading decisions.",
    author: "Sarthak Mathur",
    date: "Dec 15, 2024",
    category: "Technical Analysis",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop"
  };

  const blogPosts = [
    {
      title: "Understanding Market Volatility in 2024",
      excerpt: "Explore the key factors driving market volatility and how traders can adapt their strategies accordingly.",
      author: "Sarthak Mathur",
      date: "Dec 12, 2024",
      category: "Market Insights",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=250&fit=crop",
      slug: "market-volatility-2024"
    },
    {
      title: "Risk Management Strategies for Day Traders",
      excerpt: "Learn essential risk management techniques that can protect your capital and improve your trading performance.",
      author: "Sarthak Mathur",
      date: "Dec 10, 2024",
      category: "Trading",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      slug: "risk-management-day-trading"
    },
    {
      title: "The Psychology of Trading: Overcoming Emotional Biases",
      excerpt: "Discover how emotional biases affect trading decisions and learn techniques to maintain objectivity.",
      author: "Sarthak Mathur",
      date: "Dec 8, 2024",
      category: "Education",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=250&fit=crop",
      slug: "trading-psychology-biases"
    },
    {
      title: "Technical Indicators Every Trader Should Know",
      excerpt: "A comprehensive guide to the most important technical indicators and how to use them effectively.",
      author: "Sarthak Mathur",
      date: "Dec 5, 2024",
      category: "Technical Analysis",
      readTime: "12 min read",
      image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=400&h=250&fit=crop",
      slug: "technical-indicators-guide"
    },
    {
      title: "Cryptocurrency Market Analysis: What to Expect",
      excerpt: "An in-depth analysis of the current cryptocurrency market trends and future predictions.",
      author: "Sarthak Mathur",
      date: "Dec 3, 2024",
      category: "Market Insights",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1518544866506-7cc81b4d1ad4?w=400&h=250&fit=crop",
      slug: "cryptocurrency-market-analysis"
    },
    {
      title: "Building a Diversified Investment Portfolio",
      excerpt: "Learn the principles of portfolio diversification and how to build a balanced investment strategy.",
      author: "Sarthak Mathur",
      date: "Dec 1, 2024",
      category: "Education",
      readTime: "11 min read",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
      slug: "diversified-investment-portfolio"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-primary-foreground">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Trading Insights & Education
            </h1>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Stay updated with the latest market trends, trading strategies, and educational content
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search articles..." 
                className="pl-10 bg-background/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === 'All' ? 'default' : 'outline'}
                size="sm"
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Article</h2>
            <p className="text-muted-foreground">Our latest and most popular content</p>
          </div>
          
          <Card className="max-w-6xl mx-auto overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {featuredPost.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {featuredPost.date}
                  </div>
                  <span>{featuredPost.readTime}</span>
                </div>
                
                <h3 className="text-2xl font-bold mb-4">{featuredPost.title}</h3>
                <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="h-8 w-8 text-muted-foreground" />
                    <span className="font-medium">{featuredPost.author}</span>
                  </div>
                  <Button asChild>
                    <Link to="/blog/mastering-candlestick-trading">
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Latest Articles</h2>
            <p className="text-muted-foreground">Discover our latest insights and analysis</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2 text-sm text-muted-foreground">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-sm">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{post.author}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{post.readTime}</span>
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link to={`/blog/${post.slug}`}>
                      Read More
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Subscribe to our newsletter for the latest trading insights
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              placeholder="Enter your email" 
              className="flex-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
            />
            <Button variant="secondary">Subscribe</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blogs;