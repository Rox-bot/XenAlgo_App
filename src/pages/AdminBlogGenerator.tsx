import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  TrendingUp,
  FileText,
  Settings,
  Play,
  Download,
  Share2,
  CheckCircle,
  AlertCircle,
  Loader2,
  BarChart3,
  Newspaper,
  Target,
  RefreshCw,
  Award,
  TrendingDown,
  Activity,
  Zap,
  Crown,
  Star,
  ArrowUp,
  ArrowDown,
  BookOpen,
  GraduationCap,
  Brain,
  Shield,
  Calendar
} from 'lucide-react';
import { getTrendingStocks, getStockData } from '@/lib/trendingStocks';
import type { TrendingStockReal, StockData } from '@/lib/realStockAPIs';
import { generateBlogPost, generateMultipleBlogPosts, type BlogPost, type BlogGenerationRequest } from '@/lib/aiBlogGenerator';
import { getAPIStatus, SETUP_INSTRUCTIONS } from '@/lib/apiConfig';
import { toast } from 'sonner';

export default function AdminBlogGenerator() {
  const [trendingStocks, setTrendingStocks] = useState<TrendingStockReal[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [generatedBlogs, setGeneratedBlogs] = useState<BlogPost[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingStocks, setIsLoadingStocks] = useState(false);
  const [activeTab, setActiveTab] = useState('trending');
  const [apiStatus, setApiStatus] = useState<any>({});
  const [blogStyle, setBlogStyle] = useState('professional');
  const [error, setError] = useState<string | null>(null);

  // Trading Education Blog Generator State
  const [tradingTopics, setTradingTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [includeMarketing, setIncludeMarketing] = useState(true);
  const [generatedTradingBlog, setGeneratedTradingBlog] = useState<any>(null);
  const [isGeneratingTrading, setIsGeneratingTrading] = useState(false);

  // Load trending stocks on component mount
  useEffect(() => {
    loadTrendingStocks();
    loadAPIStatus();
    loadTradingTopics();
  }, []);

  const loadAPIStatus = async () => {
    try {
      const status = await getAPIStatus();
      setApiStatus(status);
    } catch (error) {
      console.error('Error loading API status:', error);
      setError('Failed to load API status');
    }
  };

  const loadTrendingStocks = async () => {
    setIsLoadingStocks(true);
    setError(null);
    try {
      const stocks = await getTrendingStocks();
      setTrendingStocks(stocks);
      toast.success(`Loaded ${stocks.length} trending stocks`);
    } catch (error) {
      console.error('Error loading trending stocks:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load trending stocks';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoadingStocks(false);
    }
  };

  const loadTradingTopics = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_PROXY_URL}/trading-education/topics`);
      const data = await response.json();
      setTradingTopics(data.topics);
      toast.success(`Loaded ${data.total_topics} trading education topics`);
    } catch (error) {
      console.error('Error loading trading topics:', error);
      toast.error('Failed to load trading topics');
    }
  };

  const handleStockSelect = async (symbol: string) => {
    setError(null);
    try {
      const stockData = await getStockData(symbol);
      setSelectedStock(stockData);
      toast.success(`Selected ${symbol}`);
    } catch (error) {
      console.error('Error loading stock data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load stock data';
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  const handleGenerateBlog = async () => {
    if (!selectedStock) {
      toast.error('Please select a stock first');
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const blogRequest: BlogGenerationRequest = {
        stockSymbol: selectedStock.symbol,
        stockData: selectedStock,
        newsData: [], // You can add news data here if available
        style: blogStyle,
      };

      const blog = await generateBlogPost(blogRequest);
      setGeneratedBlogs(prev => [blog, ...prev]);
      toast.success('Blog generated successfully!');
    } catch (error) {
      console.error('Error generating blog:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate blog';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateDailyBlogs = async () => {
    if (trendingStocks.length === 0) {
      toast.error('No trending stocks available');
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      // Get detailed data for top 3 stocks
      const topStocksData = await Promise.all(
        trendingStocks.slice(0, 3).map(async (stock) => {
          try {
            return await getStockData(stock.symbol);
          } catch (error) {
            console.error(`Error getting data for ${stock.symbol}:`, error);
            return stock;
          }
        })
      );

      const blogRequests: BlogGenerationRequest[] = topStocksData.map(stock => ({
        stockSymbol: stock.symbol,
        stockData: stock,
        newsData: [], // You can add news data here if available
        style: blogStyle,
      }));

      const blogs = await generateMultipleBlogPosts(blogRequests);
      setGeneratedBlogs(prev => [...blogs, ...prev]);
      toast.success(`Generated ${blogs.length} daily blogs!`);
    } catch (error) {
      console.error('Error generating daily blogs:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate daily blogs';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateTradingEducationBlog = async () => {
    if (!selectedTopic) {
      toast.error('Please select a topic first');
      return;
    }

    setIsGeneratingTrading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_PROXY_URL}/trading-education/generate-blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: selectedTopic,
          include_marketing: includeMarketing,
          style: 'professional'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blogData = await response.json();
      setGeneratedTradingBlog(blogData);
      toast.success('Trading education blog generated successfully!');
    } catch (error) {
      console.error('Error generating trading education blog:', error);
      toast.error('Failed to generate trading education blog');
    } finally {
      setIsGeneratingTrading(false);
    }
  };

  const handleGenerateDailyTradingEducationBlog = async () => {
    setIsGeneratingTrading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_PROXY_URL}/trading-education/generate-daily`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const dailyBlogData = await response.json();
      setGeneratedTradingBlog(dailyBlogData.daily_blog);
      toast.success(`Daily blog generated for: ${dailyBlogData.topic}`);
    } catch (error) {
      console.error('Error generating daily blog:', error);
      toast.error('Failed to generate daily blog');
    } finally {
      setIsGeneratingTrading(false);
    }
  };

  const handlePublishBlog = async (blog: BlogPost) => {
    try {
      // Here you would typically save to a database or CMS
      console.log('Publishing blog:', blog);
      toast.success('Blog published successfully!');
    } catch (error) {
      console.error('Error publishing blog:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to publish blog';
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  const handleDownloadBlog = (blog: BlogPost) => {
    const content = `# ${blog.title}\n\n${blog.content}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${blog.symbol}-blog-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Blog downloaded successfully!');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-cool mb-2">AI Blog Generator</h1>
          <p className="text-text-muted">Generate professional stock analysis blogs using AI</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trending" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Trending Stocks</span>
            </TabsTrigger>
            <TabsTrigger value="generator" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Blog Generator</span>
            </TabsTrigger>
            <TabsTrigger value="blogs" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Generated Blogs</span>
            </TabsTrigger>
            <TabsTrigger value="trading-education" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Trading Education</span>
            </TabsTrigger>
            <TabsTrigger value="setup" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>API Setup</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Trending Stocks</span>
                </CardTitle>
                <CardDescription>
                  Select a stock to generate a blog post about
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <Button
                    onClick={loadTrendingStocks}
                    disabled={isLoadingStocks}
                    className="flex items-center space-x-2"
                  >
                    {isLoadingStocks ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <TrendingUp className="w-4 h-4" />
                    )}
                    <span>Refresh Stocks</span>
                  </Button>
                  <Badge variant="outline">
                    {trendingStocks.length} stocks loaded
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trendingStocks.map((stock) => (
                    <Card
                      key={stock.symbol}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedStock?.symbol === stock.symbol ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => handleStockSelect(stock.symbol)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{stock.symbol}</h3>
                          <Badge
                            variant={stock.changePercent >= 0 ? 'default' : 'destructive'}
                          >
                            {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>Price: {formatCurrency(stock.price)}</p>
                          <p>Volume: {formatNumber(stock.volume)}</p>
                          <p>Market Cap: {formatCurrency(stock.marketCap)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Blog Generator</span>
                </CardTitle>
                <CardDescription>
                  Generate AI-powered blog posts about selected stocks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedStock && (
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <h3 className="font-semibold mb-2">Selected Stock: {selectedStock.symbol}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Price:</span>
                        <p className="font-medium">{formatCurrency(selectedStock.price)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Change:</span>
                        <p className={`font-medium ${selectedStock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Volume:</span>
                        <p className="font-medium">{formatNumber(selectedStock.volume)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Market Cap:</span>
                        <p className="font-medium">{formatCurrency(selectedStock.marketCap)}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="blog-style">Blog Style</Label>
                    <Select value={blogStyle} onValueChange={setBlogStyle}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blog style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="educational">Educational</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      onClick={handleGenerateBlog}
                      disabled={!selectedStock || isGenerating}
                      className="flex items-center space-x-2"
                    >
                      {isGenerating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                      <span>Generate Single Blog</span>
                    </Button>

                    <Button
                      onClick={handleGenerateDailyBlogs}
                      disabled={trendingStocks.length === 0 || isGenerating}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      {isGenerating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Target className="w-4 h-4" />
                      )}
                      <span>Generate Daily Blogs</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blogs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Generated Blogs</span>
                </CardTitle>
                <CardDescription>
                  View and manage your generated blog posts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedBlogs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No blogs generated yet</p>
                    <p className="text-sm">Generate your first blog to see it here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {generatedBlogs.map((blog, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{blog.title}</h3>
                            <p className="text-sm text-gray-600">
                              {blog.symbol} • {new Date(blog.generatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadBlog(blog)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handlePublishBlog(blog)}
                            >
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <ScrollArea className="h-32">
                          <div className="prose prose-sm max-w-none">
                            <p className="text-gray-700">{blog.content.substring(0, 300)}...</p>
                          </div>
                        </ScrollArea>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {blog.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trading-education" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Trading Education Blog Generator
                </CardTitle>
                <CardDescription>
                  Generate educational blogs about trading indicators, strategies, and concepts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Topic Selection */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Select Topic</label>
                    <select
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      className="w-full mt-1 p-2 border rounded-md"
                    >
                      <option value="">Choose a topic...</option>
                      {tradingTopics.map((topic, index) => (
                        <option key={index} value={topic}>
                          {topic}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="includeMarketing"
                      checked={includeMarketing}
                      onChange={(e) => setIncludeMarketing(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="includeMarketing" className="text-sm">
                      Include marketing content (XenAlgo promotions)
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button 
                    onClick={handleGenerateTradingEducationBlog}
                    disabled={!selectedTopic || isGeneratingTrading}
                    className="flex-1"
                  >
                    {isGeneratingTrading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Generate Blog
                      </>
                    )}
                  </Button>

                  <Button 
                    onClick={handleGenerateDailyTradingEducationBlog}
                    disabled={isGeneratingTrading}
                    variant="outline"
                  >
                    {isGeneratingTrading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4 mr-2" />
                        Generate Daily Blog
                      </>
                    )}
                  </Button>
                </div>

                {/* Generated Blog Display */}
                {generatedTradingBlog && (
                  <div className="mt-6 p-4 border rounded-lg bg-muted/50">
                    <h3 className="font-semibold mb-2">Generated Blog</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Topic:</strong> {generatedTradingBlog.topic}</p>
                      <p><strong>Generated:</strong> {new Date(generatedTradingBlog.generated_at).toLocaleString()}</p>
                      <p><strong>Marketing:</strong> {generatedTradingBlog.marketing_included ? 'Included' : 'Excluded'}</p>
                    </div>
                    
                    {generatedTradingBlog.blog_data && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">{generatedTradingBlog.blog_data.title}</h4>
                        <div className="prose prose-sm max-w-none">
                          <div dangerouslySetInnerHTML={{ __html: generatedTradingBlog.blog_data.content }} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="setup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>API Setup</span>
                </CardTitle>
                <CardDescription>
                  Configure your API connections and check status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">API Status</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant={apiStatus.proxyService ? 'default' : 'secondary'}>
                          {apiStatus.proxyService ? '✅' : '❌'}
                        </Badge>
                        <span>Proxy Service</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={apiStatus.yahooFinance ? 'default' : 'secondary'}>
                          {apiStatus.yahooFinance ? '✅' : '❌'}
                        </Badge>
                        <span>Yahoo Finance</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={apiStatus.alphaVantage ? 'default' : 'secondary'}>
                          {apiStatus.alphaVantage ? '✅' : '❌'}
                        </Badge>
                        <span>Alpha Vantage</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={apiStatus.newsAPI ? 'default' : 'secondary'}>
                          {apiStatus.newsAPI ? '✅' : '❌'}
                        </Badge>
                        <span>News API</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={apiStatus.openAI ? 'default' : 'secondary'}>
                          {apiStatus.openAI ? '✅' : '❌'}
                        </Badge>
                        <span>OpenAI</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={apiStatus.reddit ? 'default' : 'secondary'}>
                          {apiStatus.reddit ? '✅' : '❌'}
                        </Badge>
                        <span>Reddit</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Setup Instructions</h4>
                      <div className="text-sm text-gray-600 space-y-2">
                        <p>1. Deploy the API Proxy Service to Railway</p>
                        <p>2. Add your API keys to the proxy service</p>
                        <p>3. Update your frontend .env file</p>
                        <p>4. Restart your development server</p>
                      </div>
                    </div>

                    <Button
                      onClick={loadAPIStatus}
                      className="flex items-center space-x-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Refresh API Status</span>
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Environment Variables</h4>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
{`# Add to your .env file:
VITE_API_PROXY_URL=https://your-proxy-service.railway.app

# Optional fallback keys:
VITE_ALPHA_VANTAGE_API_KEY=your_key_here
VITE_NEWS_API_KEY=your_key_here
VITE_OPENAI_API_KEY=your_key_here`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 