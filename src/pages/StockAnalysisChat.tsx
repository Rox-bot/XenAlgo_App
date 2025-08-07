import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Send, TrendingUp, TrendingDown, DollarSign, BarChart3, News, FileText, Clock, TrendingUp as TrendingUpIcon } from 'lucide-react';
import { stockAnalysisService, type StockData, type NewsItem, type AnalysisResponse } from '@/lib/stockAnalysis';
import { useAuth } from '@/contexts/AuthContext';



interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  stockData?: StockData;
  analysis?: AnalysisResponse;
  newsData?: NewsItem[];
}

export default function StockAnalysisChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularStocks, setPopularStocks] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [recent, popular] = await Promise.all([
          stockAnalysisService.getRecentSearches(),
          stockAnalysisService.getPopularStocks(),
        ]);
        setRecentSearches(recent);
        setPopularStocks(popular);
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const data = await stockAnalysisService.analyzeStock(inputValue);
      
      // Save search to recent searches
      if (user) {
        await stockAnalysisService.saveSearch(data.symbol);
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.analysis.summary,
        timestamp: new Date(),
        stockData: data.stockData,
        analysis: data.analysis,
        newsData: data.newsData,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setSelectedStock(data.stockData);
      
      // Update recent searches
      setRecentSearches(prev => [data.symbol, ...prev.filter(s => s !== data.symbol)].slice(0, 10));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error while analyzing the stock. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickSearch = (symbol: string) => {
    setInputValue(`Analyze ${symbol}`);
    // Trigger the search after a short delay to allow the input to update
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  return (
    <div className="container mx-auto p-4 h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
        {/* Chat Interface - Left Pane */}
        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Stock Analysis Chat
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 mb-4">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Ask me about any stock to get real-time analysis and insights!</p>
                    <p className="text-sm mt-2">Try: "Analyze AAPL" or "What's the outlook for TSLA?"</p>
                    
                    {/* Quick Search Suggestions */}
                    {(recentSearches.length > 0 || popularStocks.length > 0) && (
                      <div className="mt-6 space-y-4">
                        {recentSearches.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Recent Searches
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {recentSearches.slice(0, 5).map((symbol) => (
                                <Button
                                  key={symbol}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleQuickSearch(symbol)}
                                  className="text-xs"
                                >
                                  {symbol}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {popularStocks.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                              <TrendingUpIcon className="h-4 w-4" />
                              Popular Stocks
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {popularStocks.slice(0, 8).map((symbol) => (
                                <Button
                                  key={symbol}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleQuickSearch(symbol)}
                                  className="text-xs"
                                >
                                  {symbol}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      {message.stockData && (
                        <div className="mt-2 p-2 bg-background rounded border">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">{message.stockData.symbol}</span>
                                                         <Badge variant={message.stockData.change >= 0 ? 'default' : 'destructive'}>
                               {message.stockData.change >= 0 ? (
                                 <TrendingUp className="h-3 w-3 mr-1" />
                               ) : (
                                 <TrendingDown className="h-3 w-3 mr-1" />
                               )}
                               {stockAnalysisService.formatCurrency(message.stockData.price)}
                             </Badge>
                          </div>
                                                     <div className="text-xs text-muted-foreground">
                             {message.stockData.change >= 0 ? '+' : ''}{stockAnalysisService.formatCurrency(message.stockData.change)} ({message.stockData.changePercent.toFixed(2)}%)
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Analyzing stock data...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {error && (
              <Alert className="mb-4" variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about any stock (e.g., 'Analyze AAPL')"
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stock Details - Right Pane */}
        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Stock Details
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            {selectedStock ? (
              <Tabs defaultValue="overview" className="h-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  <TabsTrigger value="news">News</TabsTrigger>
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="h-full">
                  <ScrollArea className="h-full">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                                                 <div className="text-center p-4 bg-muted rounded-lg">
                           <div className="text-2xl font-bold">{stockAnalysisService.formatCurrency(selectedStock.price)}</div>
                           <div className={`text-sm ${selectedStock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                             {selectedStock.change >= 0 ? '+' : ''}{stockAnalysisService.formatCurrency(selectedStock.change)} ({selectedStock.changePercent.toFixed(2)}%)
                           </div>
                         </div>
                         <div className="text-center p-4 bg-muted rounded-lg">
                           <div className="text-lg font-semibold">{selectedStock.symbol}</div>
                           <div className="text-sm text-muted-foreground">Market Cap</div>
                           <div className="text-lg">{stockAnalysisService.formatMarketCap(selectedStock.marketCap)}</div>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="text-sm text-muted-foreground">P/E Ratio</div>
                          <div className="text-lg font-semibold">{selectedStock.peRatio.toFixed(2)}</div>
                        </div>
                                                 <div className="p-3 bg-muted rounded-lg">
                           <div className="text-sm text-muted-foreground">EPS</div>
                           <div className="text-lg font-semibold">{stockAnalysisService.formatCurrency(selectedStock.eps)}</div>
                         </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="text-sm text-muted-foreground">ROE</div>
                          <div className="text-lg font-semibold">{selectedStock.roe.toFixed(2)}%</div>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="text-sm text-muted-foreground">Dividend Yield</div>
                          <div className="text-lg font-semibold">{selectedStock.dividendYield.toFixed(2)}%</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold">Trading Range</h4>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                                                     <div>
                             <div className="text-muted-foreground">Open</div>
                             <div>{stockAnalysisService.formatCurrency(selectedStock.open)}</div>
                           </div>
                           <div>
                             <div className="text-muted-foreground">High</div>
                             <div>{stockAnalysisService.formatCurrency(selectedStock.high)}</div>
                           </div>
                           <div>
                             <div className="text-muted-foreground">Low</div>
                             <div>{stockAnalysisService.formatCurrency(selectedStock.low)}</div>
                           </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="analysis" className="h-full">
                  <ScrollArea className="h-full">
                    {messages.find(m => m.analysis)?.analysis && (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Summary</h4>
                          <p className="text-sm">{messages.find(m => m.analysis)?.analysis?.summary}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Key Insights</h4>
                          <ul className="space-y-1">
                            {messages.find(m => m.analysis)?.analysis?.insights.map((insight, index) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                                {insight}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Risk Factors</h4>
                          <ul className="space-y-1">
                            {messages.find(m => m.analysis)?.analysis?.riskFactors.map((risk, index) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <div className="w-1 h-1 bg-destructive rounded-full mt-2 flex-shrink-0" />
                                {risk}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Recommendations</h4>
                          <ul className="space-y-1">
                            {messages.find(m => m.analysis)?.analysis?.recommendations.map((rec, index) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Data Sources</h4>
                          <div className="flex flex-wrap gap-1">
                            {messages.find(m => m.analysis)?.analysis?.dataSources.map((source, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {source}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="news" className="h-full">
                  <ScrollArea className="h-full">
                    {messages.find(m => m.newsData)?.newsData && messages.find(m => m.newsData)?.newsData!.length > 0 ? (
                      <div className="space-y-4">
                        {messages.find(m => m.newsData)?.newsData!.map((news, index) => (
                          <div key={index} className="p-3 bg-muted rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-sm line-clamp-2">{news.title}</h4>
                              <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
                                {news.source}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-3">
                              {news.description}
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{new Date(news.publishedAt).toLocaleDateString()}</span>
                              <a
                                href={news.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                Read more
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        <News className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No recent news available</p>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="metrics" className="h-full">
                  <ScrollArea className="h-full">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                                                 <div className="p-4 bg-muted rounded-lg">
                           <div className="text-sm text-muted-foreground">Volume</div>
                           <div className="text-lg font-semibold">{stockAnalysisService.formatNumber(selectedStock.volume)}</div>
                         </div>
                         <div className="p-4 bg-muted rounded-lg">
                           <div className="text-sm text-muted-foreground">Previous Close</div>
                           <div className="text-lg font-semibold">{stockAnalysisService.formatCurrency(selectedStock.previousClose)}</div>
                         </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold">Valuation Metrics</h4>
                        <div className="grid grid-cols-1 gap-2">
                                                     <div className="flex justify-between p-2 bg-muted rounded">
                             <span className="text-sm">Market Cap</span>
                             <span className="font-semibold">{stockAnalysisService.formatMarketCap(selectedStock.marketCap)}</span>
                           </div>
                          <div className="flex justify-between p-2 bg-muted rounded">
                            <span className="text-sm">P/E Ratio</span>
                            <span className="font-semibold">{selectedStock.peRatio.toFixed(2)}</span>
                          </div>
                                                     <div className="flex justify-between p-2 bg-muted rounded">
                             <span className="text-sm">EPS</span>
                             <span className="font-semibold">{stockAnalysisService.formatCurrency(selectedStock.eps)}</span>
                           </div>
                          <div className="flex justify-between p-2 bg-muted rounded">
                            <span className="text-sm">ROE</span>
                            <span className="font-semibold">{selectedStock.roe.toFixed(2)}%</span>
                          </div>
                          <div className="flex justify-between p-2 bg-muted rounded">
                            <span className="text-sm">Dividend Yield</span>
                            <span className="font-semibold">{selectedStock.dividendYield.toFixed(2)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a stock from the chat to view detailed information</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 