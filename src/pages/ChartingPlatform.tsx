import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Settings,
  Bookmark,
  Share2,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Download,
  Filter,
  Eye,
  EyeOff,
  Plus,
  Minus,
  Move,
  MousePointer,
  Type,
  Square,
  Circle,
  Triangle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import Navbar from '@/components/layout/Navbar';

// Enhanced stock data generation with error handling
const generateStockData = (symbol: string, days: number = 100) => {
  try {
    const data = [];
    let price = 100 + Math.random() * 50;
    const volatility = 0.02;
    
    for (let i = 0; i < days; i++) {
      const change = (Math.random() - 0.5) * volatility * price;
      price += change;
      const volume = Math.floor(Math.random() * 1000000) + 100000;
      
      data.push({
        date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        open: price - Math.random() * 2,
        high: price + Math.random() * 3,
        low: price - Math.random() * 3,
        close: price,
        volume: volume,
        change: change,
        changePercent: (change / (price - change)) * 100
      });
    }
    
    return data;
  } catch (error) {
    console.error('Error generating stock data:', error);
    return [];
  }
};

const popularStocks = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2456.30, change: 23.45, changePercent: 0.96 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3789.45, change: -12.30, changePercent: -0.32 },
  { symbol: 'HDFC', name: 'HDFC Bank', price: 1678.20, change: 15.60, changePercent: 0.94 },
  { symbol: 'INFY', name: 'Infosys', price: 1567.90, change: -8.45, changePercent: -0.54 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 987.65, change: 18.20, changePercent: 1.88 },
  { symbol: 'ITC', name: 'ITC Limited', price: 432.10, change: 5.20, changePercent: 1.22 }
];

const timeframes = [
  { value: '1m', label: '1 Minute' },
  { value: '5m', label: '5 Minutes' },
  { value: '15m', label: '15 Minutes' },
  { value: '1h', label: '1 Hour' },
  { value: '1d', label: '1 Day' },
  { value: '1w', label: '1 Week' },
  { value: '1M', label: '1 Month' }
];

const indicators = [
  { name: 'RSI', description: 'Relative Strength Index' },
  { name: 'MACD', description: 'Moving Average Convergence Divergence' },
  { name: 'Bollinger Bands', description: 'Bollinger Bands' },
  { name: 'Moving Averages', description: 'Simple & Exponential Moving Averages' },
  { name: 'Stochastic', description: 'Stochastic Oscillator' },
  { name: 'Williams %R', description: 'Williams %R' },
  { name: 'CCI', description: 'Commodity Channel Index' },
  { name: 'ADX', description: 'Average Directional Index' }
];

const drawingTools = [
  { name: 'Trend Line', icon: TrendingUp, description: 'Draw trend lines' },
  { name: 'Fibonacci', icon: BarChart3, description: 'Fibonacci retracements' },
  { name: 'Rectangle', icon: Square, description: 'Draw rectangles' },
  { name: 'Ellipse', icon: Circle, description: 'Draw ellipses' },
  { name: 'Triangle', icon: Triangle, description: 'Draw triangles' },
  { name: 'Text', icon: Type, description: 'Add text annotations' }
];

const ChartingPlatform = () => {
  const { toast } = useToast();
  const [selectedStock, setSelectedStock] = useState('RELIANCE');
  const [timeframe, setTimeframe] = useState('1d');
  const [chartData, setChartData] = useState<any[]>([]);
  const [activeIndicators, setActiveIndicators] = useState<string[]>([]);
  const [selectedDrawingTool, setSelectedDrawingTool] = useState<string>('');
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Memoized current stock data
  const currentStock = useMemo(() => {
    try {
      return popularStocks.find(stock => stock.symbol === selectedStock) || popularStocks[0];
    } catch (error) {
      console.error('Error finding current stock:', error);
      return popularStocks[0];
    }
  }, [selectedStock]);

  // Memoized filtered stocks
  const filteredStocks = useMemo(() => {
    try {
      if (!searchQuery) return popularStocks;
      return popularStocks.filter(stock => 
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } catch (error) {
      console.error('Error filtering stocks:', error);
      return popularStocks;
    }
  }, [searchQuery]);

  // Memoized chart data generator
  const generateChartData = useCallback(async (symbol: string, tf: string) => {
    try {
      setIsChartLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const data = generateStockData(symbol, 100);
      setChartData(data);
      
      toast({
        title: "Chart Updated",
        description: `Chart data loaded for ${symbol}`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error generating chart data:', error);
      toast({
        title: "Chart Error",
        description: "Failed to load chart data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChartLoading(false);
    }
  }, [toast]);

  // Memoized indicator toggle handler
  const handleIndicatorToggle = useCallback((indicator: string) => {
    try {
      setActiveIndicators(prev => {
        if (prev.includes(indicator)) {
          return prev.filter(i => i !== indicator);
        } else {
          return [...prev, indicator];
        }
      });
      
      toast({
        title: "Indicator Updated",
        description: `${indicator} ${activeIndicators.includes(indicator) ? 'removed' : 'added'}`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error toggling indicator:', error);
      toast({
        title: "Error",
        description: "Failed to update indicator.",
        variant: "destructive",
      });
    }
  }, [activeIndicators, toast]);

  // Memoized drawing tool selector
  const handleDrawingToolSelect = useCallback((tool: string) => {
    try {
      setSelectedDrawingTool(prev => prev === tool ? '' : tool);
      
      if (tool) {
        toast({
          title: "Drawing Tool Selected",
          description: `${tool} tool activated`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error selecting drawing tool:', error);
      toast({
        title: "Error",
        description: "Failed to select drawing tool.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Memoized stock selector
  const handleStockSelect = useCallback(async (symbol: string) => {
    try {
      setSelectedStock(symbol);
      await generateChartData(symbol, timeframe);
    } catch (error) {
      console.error('Error selecting stock:', error);
      toast({
        title: "Error",
        description: "Failed to select stock.",
        variant: "destructive",
      });
    }
  }, [generateChartData, timeframe, toast]);

  // Memoized timeframe changer
  const handleTimeframeChange = useCallback(async (value: string) => {
    try {
      setTimeframe(value);
      await generateChartData(selectedStock, value);
    } catch (error) {
      console.error('Error changing timeframe:', error);
      toast({
        title: "Error",
        description: "Failed to change timeframe.",
        variant: "destructive",
      });
    }
  }, [generateChartData, selectedStock, toast]);

  // Memoized fullscreen toggle
  const handleFullscreenToggle = useCallback(() => {
    try {
      setIsFullscreen(prev => !prev);
      toast({
        title: "View Updated",
        description: `Chart ${isFullscreen ? 'minimized' : 'maximized'}`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
      toast({
        title: "Error",
        description: "Failed to toggle view.",
        variant: "destructive",
      });
    }
  }, [isFullscreen, toast]);

  // Load initial chart data
  useEffect(() => {
    generateChartData(selectedStock, timeframe);
  }, [generateChartData, selectedStock, timeframe]);

  return (
    <div className="min-h-screen bg-background-soft">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stock Search */}
            <Card className="bg-background-pure border border-border-light">
              <CardHeader>
                <CardTitle className="text-primary">Stock Search</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                  <Input
                    placeholder="Search stocks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background-pure border-border-light text-primary placeholder:text-primary focus:border-primary"
                    aria-label="Search stocks"
                  />
                </div>
                
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredStocks.map((stock) => (
                    <div
                      key={stock.symbol}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedStock === stock.symbol
                          ? 'bg-primary/10 border border-primary'
                          : 'bg-background-ultra border border-border-light hover:bg-background-pure'
                      }`}
                      onClick={() => handleStockSelect(stock.symbol)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Select ${stock.name} stock`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleStockSelect(stock.symbol);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-primary">{stock.symbol}</div>
                          <div className="text-sm text-primary">{stock.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-primary">₹{stock.price.toFixed(2)}</div>
                          <div className={`text-sm ${stock.change >= 0 ? 'text-success' : 'text-error'}`}>
                            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Timeframe Selector */}
            <Card className="bg-background-pure border border-border-light">
              <CardHeader>
                <CardTitle className="text-primary">Timeframe</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={timeframe} onValueChange={handleTimeframeChange}>
                  <SelectTrigger className="bg-background-pure border-border-light text-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background-pure border border-border-light">
                    {timeframes.map((tf) => (
                      <SelectItem key={tf.value} value={tf.value} className="text-primary hover:bg-background-ultra">
                        {tf.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Indicators */}
            <Card className="bg-background-pure border border-border-light">
              <CardHeader>
                <CardTitle className="text-primary">Indicators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {indicators.map((indicator) => (
                  <div
                    key={indicator.name}
                    className={`p-2 rounded cursor-pointer transition-colors ${
                      activeIndicators.includes(indicator.name)
                        ? 'bg-primary/10 border border-primary'
                        : 'bg-background-ultra border border-border-light hover:bg-background-pure'
                    }`}
                    onClick={() => handleIndicatorToggle(indicator.name)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Toggle ${indicator.name} indicator`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleIndicatorToggle(indicator.name);
                      }
                    }}
                  >
                    <div className="text-sm font-medium text-primary">{indicator.name}</div>
                    <div className="text-xs text-primary">{indicator.description}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Drawing Tools */}
            <Card className="bg-background-pure border border-border-light">
              <CardHeader>
                <CardTitle className="text-primary">Drawing Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {drawingTools.map((tool) => (
                  <div
                    key={tool.name}
                    className={`p-2 rounded cursor-pointer transition-colors ${
                      selectedDrawingTool === tool.name
                        ? 'bg-primary/10 border border-primary'
                        : 'bg-background-ultra border border-border-light hover:bg-background-pure'
                    }`}
                    onClick={() => handleDrawingToolSelect(tool.name)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${tool.name} drawing tool`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleDrawingToolSelect(tool.name);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <tool.icon className="w-4 h-4 text-primary" />
                      <div>
                        <div className="text-sm font-medium text-primary">{tool.name}</div>
                        <div className="text-xs text-primary">{tool.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Chart Area */}
          <div className="lg:col-span-3">
            <Card className="bg-background-pure border border-border-light">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-primary">{currentStock.name}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-primary">
                      <span>₹{currentStock.price.toFixed(2)}</span>
                      <span className={`${currentStock.change >= 0 ? 'text-success' : 'text-error'}`}>
                        {currentStock.change >= 0 ? '+' : ''}{currentStock.change.toFixed(2)} ({currentStock.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleFullscreenToggle}
                      className="bg-background-pure border-primary text-primary hover:bg-background-ultra"
                      aria-label="Toggle fullscreen view"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-background-pure border-primary text-primary hover:bg-background-ultra"
                      aria-label="Download chart"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-background-pure border-primary text-primary hover:bg-background-ultra"
                      aria-label="Share chart"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isChartLoading ? (
                  <div className="h-96 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-primary">Loading chart data...</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#6B7280"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="#6B7280"
                          fontSize={12}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#F9FAFB'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="close"
                          stroke="#3B82F6"
                          fill="#3B82F6"
                          fillOpacity={0.1}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartingPlatform; 