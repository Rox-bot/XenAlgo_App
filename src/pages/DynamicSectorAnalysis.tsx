import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  TrendingUp,
  BarChart3,
  Target,
  Loader2,
  RefreshCw,
  Award,
  TrendingDown,
  Activity,
  Zap,
  Crown,
  Star,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { getTopSectorStocks, type DynamicSectorResult, type SectorPerformance } from '@/lib/dynamicSectorAnalysis';
import { generateBlogPost, type BlogPost, type BlogGenerationRequest } from '@/lib/aiBlogGenerator';
import { getStockData } from '@/lib/trendingStocks';
import { toast } from 'sonner';

export default function DynamicSectorAnalysis() {
  const [sectorData, setSectorData] = useState<DynamicSectorResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [generatedBlogs, setGeneratedBlogs] = useState<BlogPost[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('sectors');
  const [error, setError] = useState<string | null>(null);

  // Load sector analysis on component mount
  useEffect(() => {
    loadSectorAnalysis();
  }, []);

  const loadSectorAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTopSectorStocks();
      setSectorData(data);
      toast.success(`Analyzed ${data.totalSectors} sectors with ${data.totalStocks} stocks`);
    } catch (error) {
      console.error('Error loading sector analysis:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load sector analysis';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStockSelect = async (stock: any) => {
    try {
      const stockData = await getStockData(stock.symbol);
      setSelectedStock(stockData);
      toast.success(`Selected ${stock.symbol} for blog generation`);
    } catch (error) {
      console.error('Error loading stock data:', error);
      toast.error('Failed to load stock data');
    }
  };

  const handleGenerateBlog = async () => {
    if (!selectedStock) {
      toast.error('Please select a stock first');
      return;
    }

    setIsGenerating(true);
    try {
      const blogRequest: BlogGenerationRequest = {
        stockSymbol: selectedStock.symbol,
        stockData: selectedStock,
        newsData: [],
        style: 'professional',
      };

      const blog = await generateBlogPost(blogRequest);
      setGeneratedBlogs(prev => [blog, ...prev]);
      toast.success('Blog generated successfully!');
    } catch (error) {
      console.error('Error generating blog:', error);
      toast.error('Failed to generate blog');
    } finally {
      setIsGenerating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1e12) return `₹${(amount / 1e12).toFixed(2)}T`;
    if (amount >= 1e9) return `₹${(amount / 1e9).toFixed(2)}B`;
    if (amount >= 1e6) return `₹${(amount / 1e6).toFixed(2)}M`;
    return `₹${amount.toFixed(2)}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toString();
  };

  const getPerformanceIcon = (changePercent: number) => {
    if (changePercent > 2) return <ArrowUp className="w-4 h-4 text-green-500" />;
    if (changePercent < -2) return <ArrowDown className="w-4 h-4 text-red-500" />;
    return <Activity className="w-4 h-4 text-yellow-500" />;
  };

  const getSectorIcon = (sector: string) => {
    switch (sector.toLowerCase()) {
      case 'technology': return <Zap className="w-4 h-4" />;
      case 'banking': return <BarChart3 className="w-4 h-4" />;
      case 'oil & gas': return <TrendingUp className="w-4 h-4" />;
      case 'pharmaceuticals': return <Target className="w-4 h-4" />;
      case 'automobiles': return <Activity className="w-4 h-4" />;
      case 'consumer goods': return <Star className="w-4 h-4" />;
      case 'metals & mining': return <Crown className="w-4 h-4" />;
      case 'power & energy': return <Zap className="w-4 h-4" />;
      default: return <TrendingUp className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-cool mb-2">Dynamic Sector Analysis</h1>
          <p className="text-text-muted">AI-powered analysis of top performing sectors and their leading stocks</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <Target className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sectors" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Sector Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="stocks" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Top Stocks</span>
            </TabsTrigger>
            <TabsTrigger value="blogs" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Generated Blogs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sectors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="w-5 h-5" />
                  <span>Top Performing Sectors</span>
                </CardTitle>
                <CardDescription>
                  Sectors ranked by performance score (volatility + volume + market cap)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <Button
                    onClick={loadSectorAnalysis}
                    disabled={isLoading}
                    className="flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    <span>Refresh Analysis</span>
                  </Button>
                  {sectorData && (
                    <Badge variant="outline">
                      {sectorData.totalSectors} sectors analyzed
                    </Badge>
                  )}
                </div>

                {sectorData && (
                  <div className="space-y-4">
                    {sectorData.topSectors.map((sector, index) => (
                      <Card key={sector.sector} className="border-l-4 border-l-primary">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                                {getSectorIcon(sector.sector)}
                              </div>
                              <div>
                                <h3 className="text-xl font-semibold text-text-cool">
                                  #{index + 1} {sector.sector}
                                </h3>
                                <p className="text-sm text-text-muted">
                                  {sector.stockCount} stocks analyzed
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">
                                {sector.performanceScore.toFixed(2)}
                              </div>
                              <div className="text-sm text-text-muted">Performance Score</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="text-center p-3 bg-background-pure rounded-lg">
                              <div className="text-lg font-semibold text-text-cool">
                                {sector.avgChangePercent.toFixed(2)}%
                              </div>
                              <div className="text-sm text-text-muted">Avg Change</div>
                            </div>
                            <div className="text-center p-3 bg-background-pure rounded-lg">
                              <div className="text-lg font-semibold text-text-cool">
                                {formatNumber(sector.avgVolume)}
                              </div>
                              <div className="text-sm text-text-muted">Avg Volume</div>
                            </div>
                            <div className="text-center p-3 bg-background-pure rounded-lg">
                              <div className="text-lg font-semibold text-text-cool">
                                {formatCurrency(sector.totalMarketCap)}
                              </div>
                              <div className="text-sm text-text-muted">Total Market Cap</div>
                            </div>
                          </div>

                          <Separator className="my-4" />

                          <div>
                            <h4 className="font-semibold text-text-cool mb-3">Top 3 Stocks</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {sector.topStocks.map((stock) => (
                                <div
                                  key={stock.symbol}
                                  className="p-3 bg-background-pure rounded-lg cursor-pointer hover:bg-background-pure/80 transition-colors"
                                  onClick={() => handleStockSelect(stock)}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-text-cool">{stock.symbol}</span>
                                    {getPerformanceIcon(stock.changePercent)}
                                  </div>
                                  <div className="text-sm text-text-muted">
                                    {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                  </div>
                                  <div className="text-xs text-text-muted">
                                    ₹{stock.price.toFixed(2)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stocks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Top Stocks by Sector</span>
                </CardTitle>
                <CardDescription>
                  Best performing stocks from the top 3 sectors
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sectorData && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sectorData.topStocks.map((stock) => (
                      <Card
                        key={stock.symbol}
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          selectedStock?.symbol === stock.symbol ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => handleStockSelect(stock)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-lg text-text-cool">{stock.symbol}</h3>
                              <p className="text-sm text-text-muted">{stock.companyName}</p>
                            </div>
                            <Badge
                              variant={stock.changePercent >= 0 ? 'default' : 'destructive'}
                              className="flex items-center space-x-1"
                            >
                              {getPerformanceIcon(stock.changePercent)}
                              <span>{stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-text-muted">Price:</span>
                              <span className="text-text-cool">₹{stock.price.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-muted">Volume:</span>
                              <span className="text-text-cool">{formatNumber(stock.volume)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-muted">Market Cap:</span>
                              <span className="text-text-cool">{formatCurrency(stock.marketCap)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-muted">Sector:</span>
                              <span className="text-text-cool">{stock.sector}</span>
                            </div>
                          </div>

                          {selectedStock?.symbol === stock.symbol && (
                            <Button
                              size="sm"
                              className="w-full mt-3"
                              onClick={handleGenerateBlog}
                              disabled={isGenerating}
                            >
                              {isGenerating ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              ) : (
                                <Target className="w-4 h-4 mr-2" />
                              )}
                              Generate Blog
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blogs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Generated Blogs</span>
                </CardTitle>
                <CardDescription>
                  AI-generated blog posts based on sector analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedBlogs.length === 0 ? (
                  <div className="text-center py-8 text-text-muted">
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No blogs generated yet. Select a stock and generate your first blog!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {generatedBlogs.map((blog, index) => (
                      <Card key={index} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-text-cool">{blog.title}</h3>
                              <p className="text-sm text-text-muted">
                                Generated for {blog.symbol} on {new Date(blog.generatedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="secondary">{blog.style}</Badge>
                          </div>
                          <div className="prose prose-sm max-w-none">
                            <div className="text-text-cool whitespace-pre-wrap">
                              {blog.content.substring(0, 300)}...
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 