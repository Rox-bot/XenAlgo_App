import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

// Mock data for demonstration
const generateStockData = (symbol: string, days: number = 100) => {
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

const ChartingPlatform = () => {
  const [selectedStock, setSelectedStock] = useState('RELIANCE');
  const [timeframe, setTimeframe] = useState('1d');
  const [chartData, setChartData] = useState<any[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showIndicators, setShowIndicators] = useState(false);
  const [activeIndicators, setActiveIndicators] = useState<string[]>([]);
  const [drawingTool, setDrawingTool] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Generate chart data when stock or timeframe changes
  useEffect(() => {
    const data = generateStockData(selectedStock, 100);
    setChartData(data);
  }, [selectedStock, timeframe]);

  const currentStock = useMemo(() => {
    return popularStocks.find(stock => stock.symbol === selectedStock) || popularStocks[0];
  }, [selectedStock]);

  const filteredStocks = useMemo(() => {
    return popularStocks.filter(stock => 
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleIndicatorToggle = (indicator: string) => {
    setActiveIndicators(prev => 
      prev.includes(indicator) 
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    );
  };

  const handleDrawingToolSelect = (tool: string) => {
    setDrawingTool(drawingTool === tool ? null : tool);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Charting Platform</h1>
              <p className="text-muted-foreground">Advanced technical analysis with interactive charts</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4 mr-2" />
                Save Chart
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stock Search and Info */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Search Stock</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search stocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Timeframe</Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeframes.map(tf => (
                    <SelectItem key={tf.value} value={tf.value}>
                      {tf.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Current Stock</Label>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-semibold">{currentStock.symbol}</div>
                  <div className="text-sm text-muted-foreground">{currentStock.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">₹{currentStock.price.toLocaleString()}</div>
                  <div className={`text-sm ${currentStock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {currentStock.change >= 0 ? '+' : ''}{currentStock.change.toFixed(2)} ({currentStock.changePercent.toFixed(2)}%)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Stock List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Watchlist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {filteredStocks.map(stock => (
                  <div
                    key={stock.symbol}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedStock === stock.symbol 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedStock(stock.symbol)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{stock.symbol}</div>
                        <div className="text-sm text-muted-foreground">{stock.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{stock.price.toLocaleString()}</div>
                        <div className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Chart */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {currentStock.symbol} - {currentStock.name}
                    <Badge variant="outline">{timeframe.toUpperCase()}</Badge>
                  </CardTitle>
                  
                  <div className="flex items-center gap-2">
                    {/* Drawing Tools */}
                    <div className="flex items-center gap-1 border rounded-lg p-1">
                      <Button
                        variant={drawingTool === 'trendline' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => handleDrawingToolSelect('trendline')}
                      >
                        <TrendingUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={drawingTool === 'horizontal' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => handleDrawingToolSelect('horizontal')}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={drawingTool === 'fibonacci' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => handleDrawingToolSelect('fibonacci')}
                      >
                        <Triangle className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Chart Controls */}
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <YAxis 
                        domain={['dataMin - 5', 'dataMax + 5']}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background border rounded-lg p-3 shadow-lg">
                                <div className="font-semibold">{label}</div>
                                <div className="space-y-1 text-sm">
                                  <div>Open: ₹{data.open?.toFixed(2)}</div>
                                  <div>High: ₹{data.high?.toFixed(2)}</div>
                                  <div>Low: ₹{data.low?.toFixed(2)}</div>
                                  <div>Close: ₹{data.close?.toFixed(2)}</div>
                                  <div>Volume: {data.volume?.toLocaleString()}</div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="close"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Technical Analysis Tools */}
        <div className="mt-6">
          <Tabs defaultValue="indicators" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="indicators">Technical Indicators</TabsTrigger>
              <TabsTrigger value="patterns">Chart Patterns</TabsTrigger>
              <TabsTrigger value="screener">Stock Screener</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="indicators" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Indicators</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {indicators.map(indicator => (
                      <div
                        key={indicator.name}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          activeIndicators.includes(indicator.name)
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleIndicatorToggle(indicator.name)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{indicator.name}</div>
                            <div className="text-sm text-muted-foreground">{indicator.description}</div>
                          </div>
                          <div className={`w-4 h-4 rounded border ${
                            activeIndicators.includes(indicator.name)
                              ? 'bg-primary border-primary'
                              : 'border-border'
                          }`}>
                            {activeIndicators.includes(indicator.name) && (
                              <div className="w-full h-full bg-primary rounded" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="patterns" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Chart Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      'Double Top', 'Double Bottom', 'Head and Shoulders', 
                      'Inverse Head and Shoulders', 'Triangle', 'Flag', 
                      'Pennant', 'Cup and Handle', 'Wedge'
                    ].map(pattern => (
                      <div key={pattern} className="p-4 border rounded-lg">
                        <div className="font-semibold">{pattern}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Pattern detection and analysis
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="screener" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Stock Screener</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Price Range</Label>
                      <div className="flex gap-2">
                        <Input placeholder="Min" />
                        <Input placeholder="Max" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Market Cap</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select market cap" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="large">Large Cap (&gt;20,000 Cr)</SelectItem>
                          <SelectItem value="mid">Mid Cap (5,000-20,000 Cr)</SelectItem>
                          <SelectItem value="small">Small Cap (&lt;5,000 Cr)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Technical Criteria</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select criteria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rsi-oversold">RSI Oversold</SelectItem>
                          <SelectItem value="rsi-overbought">RSI Overbought</SelectItem>
                          <SelectItem value="macd-bullish">MACD Bullish</SelectItem>
                          <SelectItem value="macd-bearish">MACD Bearish</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="mt-4">Run Screener</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Price Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Input placeholder="Stock Symbol" className="w-32" />
                      <Select>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="above">Above</SelectItem>
                          <SelectItem value="below">Below</SelectItem>
                          <SelectItem value="crosses">Crosses</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input placeholder="Price" className="w-24" />
                      <Button size="sm">Add Alert</Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Active Alerts</div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-semibold">RELIANCE</div>
                            <div className="text-sm text-muted-foreground">Above ₹2,500</div>
                          </div>
                          <Button variant="outline" size="sm">Remove</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ChartingPlatform; 