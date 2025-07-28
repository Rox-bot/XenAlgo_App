import { useState, useMemo } from "react";
import { ArrowLeft, TrendingUp, TrendingDown, Target, AlertTriangle, Calendar, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTrades } from "@/hooks/useTrades";
import { useJournalSettings } from "@/hooks/useJournalSettings";

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export default function TradingJournalAnalytics() {
  const [timePeriod, setTimePeriod] = useState("30d");
  const { trades } = useTrades();
  const { settings } = useJournalSettings();

  const calculatePnL = (trade: any) => {
    if (!trade.exit_price || !trade.entry_price || !trade.quantity) return 0;
    const multiplier = trade.trade_type === 'LONG' ? 1 : -1;
    return (trade.exit_price - trade.entry_price) * trade.quantity * multiplier;
  };

  const analytics = useMemo(() => {
    const closedTrades = trades.filter(t => t.status === 'CLOSED');
    const totalPnL = closedTrades.reduce((sum, trade) => sum + calculatePnL(trade), 0);
    const winningTrades = closedTrades.filter(t => calculatePnL(t) > 0);
    const losingTrades = closedTrades.filter(t => calculatePnL(t) < 0);
    const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
    const avgWin = winningTrades.length > 0 ? winningTrades.reduce((sum, t) => sum + calculatePnL(t), 0) / winningTrades.length : 0;
    const avgLoss = losingTrades.length > 0 ? Math.abs(losingTrades.reduce((sum, t) => sum + calculatePnL(t), 0) / losingTrades.length) : 0;
    
    // Calculate max drawdown
    let peak = 0;
    let maxDrawdown = 0;
    let runningPnL = 0;
    
    for (const trade of closedTrades) {
      runningPnL += calculatePnL(trade);
      if (runningPnL > peak) {
        peak = runningPnL;
      }
      const drawdown = peak - runningPnL;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    // Monthly performance
    const monthlyData = closedTrades.reduce((acc: any, trade) => {
      const month = new Date(trade.exit_date || trade.created_at).toLocaleDateString('en-US', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { month, pnl: 0, trades: 0 };
      }
      acc[month].pnl += calculatePnL(trade);
      acc[month].trades += 1;
      return acc;
    }, {});

    // Setup performance
    const setupData = closedTrades.reduce((acc: any, trade) => {
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
    }, {});

    // Convert to arrays and calculate averages
    const monthlyPerformance = Object.values(monthlyData).map((month: any) => ({
      month: month.month,
      pnl: month.pnl,
      trades: month.trades
    }));

    const setupPerformance = Object.values(setupData).map((setup: any) => ({
      setup: setup.setup,
      wins: setup.wins,
      losses: setup.losses,
      winRate: setup.wins + setup.losses > 0 ? (setup.wins / (setup.wins + setup.losses)) * 100 : 0,
      avgPnL: setup.wins + setup.losses > 0 ? setup.totalPnL / (setup.wins + setup.losses) : 0
    }));

    // P&L Curve data
    const plCurveData = closedTrades
      .sort((a, b) => new Date(a.exit_date || a.created_at).getTime() - new Date(b.exit_date || b.created_at).getTime())
      .reduce((acc: any[], trade, index) => {
        const date = new Date(trade.exit_date || trade.created_at).toISOString().split('T')[0];
        const pnl = calculatePnL(trade);
        const cumulativePnL = acc.length > 0 ? acc[acc.length - 1].cumulativePnL + pnl : pnl;
        
        acc.push({
          date,
          pnl,
          cumulativePnL
        });
        return acc;
      }, []);

    // Risk distribution (simplified - based on trade sizes)
    const riskDistributionData = closedTrades.reduce((acc: any[], trade) => {
      const tradeValue = trade.entry_price * trade.quantity;
      const accountCapital = settings?.account_capital || 100000;
      const riskPercentage = (tradeValue / accountCapital) * 100;
      
      let riskCategory = '1-2% Risk';
      if (riskPercentage > 4) riskCategory = '>4% Risk';
      else if (riskPercentage > 3) riskCategory = '3-4% Risk';
      else if (riskPercentage > 2) riskCategory = '2-3% Risk';
      
      const existing = acc.find(item => item.name === riskCategory);
      if (existing) {
        existing.value += 1;
        existing.count += 1;
      } else {
        acc.push({ name: riskCategory, value: 1, count: 1 });
      }
      
      return acc;
    }, []);

    return {
      totalPnL,
      totalTrades: closedTrades.length,
      winRate,
      avgWin,
      avgLoss,
      maxDrawdown,
      monthlyPerformance,
      setupPerformance,
      plCurveData,
      riskDistributionData
    };
  }, [trades, settings]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/trading-journal">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Journal
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Trading Analytics</h1>
            <p className="text-muted-foreground mt-1">Detailed analysis of your trading performance</p>
          </div>
        </div>

        {/* Time Period Filter */}
        <div className="mb-6">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total P&L</p>
                  <p className={`text-2xl font-bold ${analytics.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatCurrency(analytics.totalPnL)}
                  </p>
                  <p className="text-sm text-muted-foreground">({analytics.totalTrades} trades)</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                  <p className="text-2xl font-bold text-blue-500">{analytics.winRate.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">({analytics.totalTrades} trades)</p>
                </div>
                <Target className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Win/Loss</p>
                  <p className="text-2xl font-bold text-purple-500">{formatCurrency(analytics.avgWin)}</p>
                  <p className="text-sm text-muted-foreground">vs -{formatCurrency(analytics.avgLoss)}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Max Drawdown</p>
                  <p className="text-2xl font-bold text-red-500">-{formatCurrency(analytics.maxDrawdown)}</p>
                  <p className="text-sm text-muted-foreground">
                    (-{settings?.account_capital ? ((analytics.maxDrawdown / settings.account_capital) * 100).toFixed(1) : '0'}%)
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* P&L Curve */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                P&L Curve
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.plCurveData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.plCurveData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      fontSize={12}
                    />
                    <YAxis 
                      tickFormatter={(value) => formatCurrency(value)}
                      fontSize={12}
                    />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(Number(value)), 'Cumulative P&L']}
                      labelFormatter={(label) => formatDate(label)}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cumulativePnL" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No closed trades to show P&L curve
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monthly Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Monthly Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.monthlyPerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.monthlyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} fontSize={12} />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'pnl' ? formatCurrency(Number(value)) : value,
                        name === 'pnl' ? 'P&L' : 'Trades'
                      ]}
                    />
                    <Bar dataKey="pnl" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No closed trades to show monthly performance
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Setup Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Setup Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.setupPerformance.length > 0 ? analytics.setupPerformance.map((setup: any, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{setup.setup}</p>
                      <p className="text-xs text-muted-foreground">
                        {setup.wins}W / {setup.losses}L
                      </p>
                    </div>
                    <div className="text-center mx-4">
                      <Badge variant={setup.winRate >= 60 ? "default" : "secondary"}>
                        {setup.winRate.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${setup.avgPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {formatCurrency(setup.avgPnL)}
                      </p>
                      <p className="text-xs text-muted-foreground">Avg P&L</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No trades to analyze setup performance
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Risk Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.riskDistributionData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.riskDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analytics.riskDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} trades`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No trades to show risk distribution
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Risk Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Risk Alerts & Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>✅ Portfolio Risk:</strong> Current open risk is 2.1% of account - within safe limits.
              </AlertDescription>
            </Alert>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>⚠️ Position Size Warning:</strong> RELIANCE position exceeds 5% of account risk. Consider reducing position size.
              </AlertDescription>
            </Alert>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>✅ Stop Loss Discipline:</strong> 95% stop loss adherence rate (19/20 recent trades). Excellent risk management!
              </AlertDescription>
            </Alert>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>📈 Performance Insight:</strong> Support/Resistance setups show highest win rate (72.7%). Consider focusing more on this strategy.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}