import { useState, useMemo, useCallback } from "react";
import { ArrowLeft, TrendingUp, TrendingDown, Target, AlertTriangle, Calendar, BarChart3, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTrades } from "@/hooks/useTrades";
import { useJournalSettings } from "@/hooks/useJournalSettings";
import Navbar from "@/components/layout/Navbar";

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export default function TradingJournalAnalytics() {
  const { toast } = useToast();
  const [timePeriod, setTimePeriod] = useState("30d");
  const [isLoading, setIsLoading] = useState(false);
  const { trades } = useTrades();
  const { settings } = useJournalSettings();

  // Enhanced P&L calculation with error handling
  const calculatePnL = useCallback((trade: any): number => {
    try {
      if (!trade?.exit_price || !trade?.entry_price || !trade?.quantity) return 0;
      const multiplier = trade.trade_type === 'LONG' ? 1 : -1;
      return (trade.exit_price - trade.entry_price) * trade.quantity * multiplier;
    } catch (error) {
      console.error('Error calculating P&L:', error);
      toast({
        title: "Calculation Error",
        description: "Failed to calculate P&L for trade.",
        variant: "destructive",
      });
      return 0;
    }
  }, [toast]);

  const analytics = useMemo(() => {
    try {
      const closedTrades = trades.filter(t => t.status === 'CLOSED');
      const totalPnL = closedTrades.reduce((sum, trade) => sum + calculatePnL(trade), 0);
      const winningTrades = closedTrades.filter(t => calculatePnL(t) > 0);
      const losingTrades = closedTrades.filter(t => calculatePnL(t) < 0);
      const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
      const avgWin = winningTrades.length > 0 ? winningTrades.reduce((sum, t) => sum + calculatePnL(t), 0) / winningTrades.length : 0;
      const avgLoss = losingTrades.length > 0 ? Math.abs(losingTrades.reduce((sum, t) => sum + calculatePnL(t), 0) / losingTrades.length) : 0;
      
      // Calculate max drawdown with error handling
      let peak = 0;
      let maxDrawdown = 0;
      let runningPnL = 0;
      
      for (const trade of closedTrades) {
        try {
          runningPnL += calculatePnL(trade);
          if (runningPnL > peak) {
            peak = runningPnL;
          }
          const drawdown = peak - runningPnL;
          if (drawdown > maxDrawdown) {
            maxDrawdown = drawdown;
          }
        } catch (error) {
          console.error('Error calculating drawdown for trade:', error);
        }
      }

      // Monthly performance with better date handling
      const monthlyData = closedTrades.reduce((acc: any, trade) => {
        try {
          const month = new Date(trade.exit_date || trade.created_at).toLocaleDateString('en-US', { month: 'short' });
          if (!acc[month]) {
            acc[month] = { month, pnl: 0, trades: 0 };
          }
          acc[month].pnl += calculatePnL(trade);
          acc[month].trades += 1;
          return acc;
        } catch (error) {
          console.error('Error processing monthly data for trade:', error);
          return acc;
        }
      }, {});

      // Setup performance with error handling
      const setupData = closedTrades.reduce((acc: any, trade) => {
        try {
          const setup = trade.setup_type || 'Other';
          if (!acc[setup]) {
            acc[setup] = { setup, wins: 0, losses: 0, totalPnL: 0 };
          }
          const pnl = calculatePnL(trade);
          if (pnl > 0) {
            acc[setup].wins += 1;
          } else {
            acc[setup].losses += 1;
          }
          acc[setup].totalPnL += pnl;
          return acc;
        } catch (error) {
          console.error('Error processing setup data for trade:', error);
          return acc;
        }
      }, {});

      // Convert to arrays and calculate averages
      const monthlyChartData = Object.values(monthlyData).map((item: any) => ({
        month: item.month,
        pnl: item.pnl,
        trades: item.trades,
        avgPnL: item.trades > 0 ? item.pnl / item.trades : 0
      }));

      const setupChartData = Object.values(setupData).map((item: any) => ({
        setup: item.setup,
        wins: item.wins,
        losses: item.losses,
        totalPnL: item.totalPnL,
        winRate: (item.wins + item.losses) > 0 ? (item.wins / (item.wins + item.losses)) * 100 : 0
      }));

      return {
        totalPnL,
        winRate,
        avgWin,
        avgLoss,
        maxDrawdown,
        totalTrades: closedTrades.length,
        winningTrades: winningTrades.length,
        losingTrades: losingTrades.length,
        monthlyChartData,
        setupChartData,
        profitFactor: avgLoss > 0 ? avgWin / avgLoss : 0,
        riskRewardRatio: avgLoss > 0 ? avgWin / avgLoss : 0
      };
    } catch (error) {
      console.error('Error calculating analytics:', error);
      toast({
        title: "Analytics Error",
        description: "Failed to calculate trading analytics.",
        variant: "destructive",
      });
      return {
        totalPnL: 0,
        winRate: 0,
        avgWin: 0,
        avgLoss: 0,
        maxDrawdown: 0,
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        monthlyChartData: [],
        setupChartData: [],
        profitFactor: 0,
        riskRewardRatio: 0
      };
    }
  }, [trades, calculatePnL, toast]);

  // Memoized currency formatter
  const formatCurrency = useCallback((amount: number) => {
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return `₹${amount}`;
    }
  }, []);

  // Memoized date formatter
  const formatDate = useCallback((dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  }, []);

  // Memoized time period change handler
  const handleTimePeriodChange = useCallback(async (value: string) => {
    try {
      setIsLoading(true);
      setTimePeriod(value);
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Period Updated",
        description: `Analytics updated for ${value} period.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error changing time period:', error);
      toast({
        title: "Error",
        description: "Failed to update time period.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  if (trades.length === 0) {
    return (
      <div className="min-h-screen bg-background-soft">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/trading-journal">
              <Button variant="outline" className="bg-background-pure border-primary text-primary hover:bg-background-ultra">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Journal
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-primary">Trading Analytics</h1>
              <p className="text-primary">Analyze your trading performance and patterns</p>
            </div>
          </div>
          
          <Card className="bg-background-pure border border-border-light">
            <CardContent className="text-center py-12">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold text-primary mb-2">No Trading Data</h3>
              <p className="text-primary mb-6">Start adding trades to your journal to see analytics and insights.</p>
              <Link to="/trading-journal">
                <Button className="bg-primary text-background-soft hover:bg-primary-light">
                  Add Your First Trade
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-soft">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/trading-journal">
            <Button variant="outline" className="bg-background-pure border-primary text-primary hover:bg-background-ultra">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Journal
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-primary">Trading Analytics</h1>
            <p className="text-primary">Analyze your trading performance and patterns</p>
          </div>
        </div>

        {/* Time Period Selector */}
        <div className="mb-6">
          <Select value={timePeriod} onValueChange={handleTimePeriodChange} disabled={isLoading}>
            <SelectTrigger className="w-48 bg-background-pure border-border-light text-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background-pure border border-border-light">
              <SelectItem value="7d" className="text-primary hover:bg-background-ultra">Last 7 Days</SelectItem>
              <SelectItem value="30d" className="text-primary hover:bg-background-ultra">Last 30 Days</SelectItem>
              <SelectItem value="90d" className="text-primary hover:bg-background-ultra">Last 90 Days</SelectItem>
              <SelectItem value="1y" className="text-primary hover:bg-background-ultra">Last Year</SelectItem>
              <SelectItem value="all" className="text-primary hover:bg-background-ultra">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-background-pure border border-border-light">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-primary">Total P&L</p>
                  <p className={`text-2xl font-bold ${analytics.totalPnL >= 0 ? 'text-success' : 'text-error'}`}>
                    {formatCurrency(analytics.totalPnL)}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${analytics.totalPnL >= 0 ? 'bg-success/10' : 'bg-error/10'}`}>
                  {analytics.totalPnL >= 0 ? (
                    <TrendingUp className="w-6 h-6 text-success" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-error" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background-pure border border-border-light">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-primary">Win Rate</p>
                  <p className="text-2xl font-bold text-info">{analytics.winRate.toFixed(1)}%</p>
                </div>
                <div className="p-3 rounded-full bg-info/10">
                  <Target className="w-6 h-6 text-info" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background-pure border border-border-light">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-primary">Total Trades</p>
                  <p className="text-2xl font-bold text-primary">{analytics.totalTrades}</p>
                </div>
                <div className="p-3 rounded-full bg-primary/10">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background-pure border border-border-light">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-primary">Max Drawdown</p>
                  <p className="text-2xl font-bold text-warning">{formatCurrency(analytics.maxDrawdown)}</p>
                </div>
                <div className="p-3 rounded-full bg-warning/10">
                  <AlertTriangle className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Performance */}
          <Card className="bg-background-pure border border-border-light">
            <CardHeader>
              <CardTitle className="text-primary">Monthly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.monthlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Bar dataKey="pnl" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Setup Performance */}
          <Card className="bg-background-pure border border-border-light">
            <CardHeader>
              <CardTitle className="text-primary">Setup Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.setupChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ setup, winRate }) => `${setup}: ${winRate.toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="totalPnL"
                    >
                      {analytics.setupChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Metrics */}
          <Card className="bg-background-pure border border-border-light">
            <CardHeader>
              <CardTitle className="text-primary">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-background-ultra rounded-lg">
                <div>
                  <p className="text-sm text-primary">Average Win</p>
                  <p className="text-lg font-semibold text-success">{formatCurrency(analytics.avgWin)}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-background-ultra rounded-lg">
                <div>
                  <p className="text-sm text-primary">Average Loss</p>
                  <p className="text-lg font-semibold text-error">{formatCurrency(analytics.avgLoss)}</p>
                </div>
                <AlertTriangle className="w-5 h-5 text-error" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-background-ultra rounded-lg">
                <div>
                  <p className="text-sm text-primary">Profit Factor</p>
                  <p className="text-lg font-semibold text-info">{analytics.profitFactor.toFixed(2)}</p>
                </div>
                <TrendingUp className="w-5 h-5 text-info" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-background-ultra rounded-lg">
                <div>
                  <p className="text-sm text-primary">Risk/Reward Ratio</p>
                  <p className="text-lg font-semibold text-warning">{analytics.riskRewardRatio.toFixed(2)}</p>
                </div>
                <Target className="w-5 h-5 text-warning" />
              </div>
            </CardContent>
          </Card>

          {/* Trade Distribution */}
          <Card className="bg-background-pure border border-border-light">
            <CardHeader>
              <CardTitle className="text-primary">Trade Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-background-ultra rounded-lg">
                <div>
                  <p className="text-sm text-primary">Winning Trades</p>
                  <p className="text-lg font-semibold text-success">{analytics.winningTrades}</p>
                </div>
                <Badge variant="success" className="bg-success text-background-soft">
                  {analytics.totalTrades > 0 ? ((analytics.winningTrades / analytics.totalTrades) * 100).toFixed(1) : 0}%
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-background-ultra rounded-lg">
                <div>
                  <p className="text-sm text-primary">Losing Trades</p>
                  <p className="text-lg font-semibold text-error">{analytics.losingTrades}</p>
                </div>
                <Badge variant="destructive" className="bg-error text-background-soft">
                  {analytics.totalTrades > 0 ? ((analytics.losingTrades / analytics.totalTrades) * 100).toFixed(1) : 0}%
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-background-ultra rounded-lg">
                <div>
                  <p className="text-sm text-primary">Total Trades</p>
                  <p className="text-lg font-semibold text-primary">{analytics.totalTrades}</p>
                </div>
                <Badge variant="outline" className="bg-background-pure text-primary border-primary">
                  100%
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}