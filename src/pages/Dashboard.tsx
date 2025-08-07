import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Target, 
  Calendar,
  BookOpen,
  Calculator,
  Eye,
  Zap,
  Users,
  MessageCircle,
  HelpCircle,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { SubscriptionStatus } from "@/components/subscription/SubscriptionStatus";
import { SubscriptionDebug } from "@/components/subscription/SubscriptionDebug";
import { usePerformanceData } from "@/hooks/usePerformanceData";
import { useRealtimeTrades } from "@/hooks/useRealtimeTrades";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import Navbar from "@/components/layout/Navbar";

export default function Dashboard() {
  const { trades } = useRealtimeTrades();
  const { preferences } = useUserPreferences();
  const [performancePeriod, setPerformancePeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const { performanceData, summary } = usePerformanceData(performancePeriod);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: preferences?.currency || 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Enhanced P&L calculation with error handling
  const calculatePnL = (trade: any): number => {
    try {
      if (!trade?.exit_price || !trade?.entry_price || !trade?.quantity) return 0;
      const multiplier = trade.trade_type === 'LONG' ? 1 : -1;
      return (trade.exit_price - trade.entry_price) * trade.quantity * multiplier;
    } catch (error) {
      console.error('Error calculating P&L:', error);
      return 0;
    }
  };

  // Memoized calculations for better performance
  const dashboardData = useMemo(() => {
    const closedTrades = trades.filter(t => t.status === 'CLOSED');
    const openTrades = trades.filter(t => t.status === 'OPEN');
    const totalPnL = closedTrades.reduce((sum, trade) => sum + calculatePnL(trade), 0);
    const winRate = closedTrades.length > 0 ? (closedTrades.filter(t => calculatePnL(t) > 0).length / closedTrades.length) * 100 : 0;

    // Calculate monthly P&L with better date handling
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyPnL = closedTrades.filter(t => {
      try {
        if (!t.exit_date) return false;
        const exitDate = new Date(t.exit_date);
        return exitDate.getMonth() === currentMonth && exitDate.getFullYear() === currentYear;
      } catch (error) {
        console.error('Error parsing exit date:', error);
        return false;
      }
    }).reduce((sum, trade) => sum + calculatePnL(trade), 0);

    // Calculate portfolio risk with error handling
    const portfolioRisk = openTrades.reduce((sum, trade) => {
      try {
        if (!trade?.stop_loss || !trade?.entry_price || !trade?.quantity) return sum;
        const riskPerShare = Math.abs(trade.entry_price - trade.stop_loss);
        const multiplier = trade.trade_type === 'LONG' ? 1 : -1;
        return sum + (riskPerShare * trade.quantity * multiplier);
      } catch (error) {
        console.error('Error calculating portfolio risk:', error);
        return sum;
      }
    }, 0);

    return {
      closedTrades,
      openTrades,
      totalPnL,
      winRate,
      monthlyPnL,
      portfolioRisk
    };
  }, [trades]);

  const { closedTrades, openTrades, totalPnL, winRate, monthlyPnL, portfolioRisk } = dashboardData;

  const quickStats = [
    {
      title: "Total P&L",
      value: formatCurrency(totalPnL),
      change: `${totalPnL >= 0 ? '+' : ''}${((totalPnL / 100000) * 100).toFixed(1)}%`,
      changeType: totalPnL >= 0 ? "positive" as const : "negative" as const,
      icon: DollarSign,
    },
    {
      title: "Win Rate",
      value: `${winRate.toFixed(1)}%`,
      change: `${winRate >= 50 ? '+' : ''}${(winRate - 50).toFixed(1)}%`,
      changeType: winRate >= 50 ? "positive" as const : "negative" as const,
      icon: Target,
    },
    {
      title: "Open Positions",
      value: openTrades.length.toString(),
      change: `${openTrades.length > 0 ? '+' : ''}${openTrades.length}`,
      changeType: "positive" as const,
      icon: Activity,
    },
    {
      title: "This Month",
      value: formatCurrency(monthlyPnL),
      change: `${monthlyPnL >= 0 ? '+' : ''}${((monthlyPnL / 100000) * 100).toFixed(1)}%`,
      changeType: monthlyPnL >= 0 ? "positive" as const : "negative" as const,
      icon: Calendar,
    },
  ];

  const enrolledCourses = [
    {
      title: "Advanced Technical Analysis",
      instructor: "Dr. Sarah Johnson",
      progress: 75,
      duration: "8 weeks",
      price: "₹4,999",
      rating: 4.8,
    },
    {
      title: "Risk Management Mastery",
      instructor: "Prof. Michael Chen",
      progress: 45,
      duration: "6 weeks",
      price: "₹3,999",
      rating: 4.9,
    },
    {
      title: "Algorithmic Trading",
      instructor: "Alex Rodriguez",
      progress: 90,
      duration: "12 weeks",
      price: "₹6,999",
      rating: 4.7,
    },
  ];

  const recentActivity = trades.slice(0, 5).map(trade => ({
    id: trade.id,
    type: 'trade',
    title: `${trade.symbol} ${trade.trade_type}`,
    description: `${trade.quantity} shares @ ${formatCurrency(trade.entry_price)}`,
    time: new Date(trade.created_at).toLocaleDateString(),
    status: trade.status,
    pnl: trade.status === 'CLOSED' ? calculatePnL(trade) : null,
  }));

  const quickActions = [
    {
      title: "Add New Trade",
      description: "Record your latest trade",
      icon: Plus,
      href: "/trading-journal",
      color: "bg-blue-500",
    },
    {
      title: "View Analytics",
      description: "Analyze your performance",
      icon: BarChart3,
      href: "/trading-journal/analytics",
      color: "bg-green-500",
    },
    {
      title: "Use Calculators",
      description: "Calculate position sizing",
      icon: Calculator,
      href: "/calculators",
      color: "bg-purple-500",
    },
    {
      title: "Browse Courses",
      description: "Learn new strategies",
      icon: BookOpen,
      href: "/courses",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <p className="text-primary mt-2">Welcome back! Here's your trading overview.</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-background-pure border border-border-light" aria-label="Dashboard sections">
            <TabsTrigger 
              value="overview" 
              className="text-primary data-[state=active]:bg-primary data-[state=active]:text-background-soft hover:bg-primary/10 transition-colors"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="performance" 
              className="text-primary data-[state=active]:bg-primary data-[state=active]:text-background-soft hover:bg-primary/10 transition-colors"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger 
              value="courses" 
              className="text-primary data-[state=active]:bg-primary data-[state=active]:text-background-soft hover:bg-primary/10 transition-colors"
            >
              Courses
            </TabsTrigger>
            <TabsTrigger 
              value="tools" 
              className="text-primary data-[state=active]:bg-primary data-[state=active]:text-background-soft hover:bg-primary/10 transition-colors"
            >
              Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <SubscriptionStatus />
            <SubscriptionDebug />

            {/* Performance Chart */}
            <Card className="bg-background-pure border border-border-light">
              <CardHeader>
                <CardTitle className="text-primary">Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <PerformanceChart data={performanceData} period={performancePeriod} />
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStats.map((stat, index) => (
                <Card key={index} className="bg-background-pure border border-border-light">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-primary">{stat.title}</p>
                        <p className="text-2xl font-bold text-primary">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.changeType === 'positive' ? 'bg-success/10' : 'bg-error/10'}`}>
                        <stat.icon className={`w-6 h-6 ${stat.changeType === 'positive' ? 'text-success' : 'text-error'}`} />
                      </div>
                    </div>
                    <div className="flex items-center mt-2">
                      {stat.changeType === 'positive' ? (
                        <ArrowUpRight className="w-4 h-4 text-success mr-1" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-error mr-1" />
                      )}
                      <span className={`text-sm ${stat.changeType === 'positive' ? 'text-success' : 'text-error'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="bg-background-pure border border-border-light">
              <CardHeader>
                <CardTitle className="text-primary">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <Link key={index} to={action.href}>
                      <div className="p-4 rounded-lg border border-border-light hover:border-primary transition-colors bg-background-pure">
                        <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-primary mb-1">{action.title}</h3>
                        <p className="text-sm text-primary">{action.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-background-pure border border-border-light">
              <CardHeader>
                <CardTitle className="text-primary">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 rounded-lg border border-border-light bg-background-pure">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Activity className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-primary">{activity.title}</p>
                          <p className="text-sm text-primary">{activity.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-primary">{activity.time}</p>
                        {activity.pnl !== null && (
                          <p className={`text-sm font-medium ${activity.pnl >= 0 ? 'text-success' : 'text-error'}`}>
                            {activity.pnl >= 0 ? '+' : ''}{formatCurrency(activity.pnl)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card className="bg-background-pure border border-border-light">
              <CardHeader>
                <CardTitle className="text-primary">Detailed Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 rounded-lg border border-border-light bg-background-pure">
                      <h3 className="text-lg font-semibold text-primary">Total Trades</h3>
                      <p className="text-3xl font-bold text-primary">{trades.length}</p>
                    </div>
                    <div className="text-center p-4 rounded-lg border border-border-light bg-background-pure">
                      <h3 className="text-lg font-semibold text-primary">Win Rate</h3>
                      <p className="text-3xl font-bold text-success">{winRate.toFixed(1)}%</p>
                    </div>
                    <div className="text-center p-4 rounded-lg border border-border-light bg-background-pure">
                      <h3 className="text-lg font-semibold text-primary">Avg Return</h3>
                      <p className="text-3xl font-bold text-primary">
                        {closedTrades.length > 0 ? `${(totalPnL / closedTrades.length).toFixed(2)}%` : '0%'}
                      </p>
                    </div>
                  </div>

                  {/* Risk Analysis */}
                  <div className="p-4 rounded-lg border border-border-light bg-background-pure">
                    <h3 className="text-lg font-semibold text-primary mb-4">Risk Analysis</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm text-primary mb-1">
                          <span>Portfolio Risk</span>
                          <span>{formatCurrency(portfolioRisk)}</span>
                        </div>
                        <Progress value={(portfolioRisk / 100000) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <Card className="bg-background-pure border border-border-light">
              <CardHeader>
                <CardTitle className="text-primary">Enrolled Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {enrolledCourses.map((course, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border-light bg-background-pure">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-primary">{course.title}</h3>
                        <Badge className="bg-success text-background-soft">Enrolled</Badge>
                      </div>
                      <p className="text-sm text-primary mb-2">{course.instructor} • {course.duration}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <div className="flex justify-between text-sm text-primary mb-1">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-primary">{course.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <Card className="bg-background-pure border border-border-light">
              <CardHeader>
                <CardTitle className="text-primary">Trading Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Link to="/calculators">
                    <div className="p-4 rounded-lg border border-border-light hover:border-primary transition-colors bg-background-pure">
                      <Calculator className="w-8 h-8 text-primary mb-2" />
                      <h3 className="font-semibold text-primary">Calculators</h3>
                      <p className="text-sm text-primary">Position sizing, risk management</p>
                    </div>
                  </Link>
                  <Link to="/trading-journal">
                    <div className="p-4 rounded-lg border border-border-light hover:border-primary transition-colors bg-background-pure">
                      <BarChart3 className="w-8 h-8 text-primary mb-2" />
                      <h3 className="font-semibold text-primary">Trading Journal</h3>
                      <p className="text-sm text-primary">Track your trades and performance</p>
                    </div>
                  </Link>
                  <Link to="/courses">
                    <div className="p-4 rounded-lg border border-border-light hover:border-primary transition-colors bg-background-pure">
                      <BookOpen className="w-8 h-8 text-primary mb-2" />
                      <h3 className="font-semibold text-primary">Courses</h3>
                      <p className="text-sm text-primary">Learn new strategies</p>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}