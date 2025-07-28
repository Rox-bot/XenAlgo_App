import { useState } from "react";
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

  const calculatePnL = (trade: any) => {
    if (!trade.exit_price || !trade.entry_price || !trade.quantity) return 0;
    const multiplier = trade.trade_type === 'LONG' ? 1 : -1;
    return (trade.exit_price - trade.entry_price) * trade.quantity * multiplier;
  };

  const closedTrades = trades.filter(t => t.status === 'CLOSED');
  const openTrades = trades.filter(t => t.status === 'OPEN');
  const totalPnL = closedTrades.reduce((sum, trade) => sum + calculatePnL(trade), 0);
  const winRate = closedTrades.length > 0 ? (closedTrades.filter(t => calculatePnL(t) > 0).length / closedTrades.length) * 100 : 0;

  // Calculate monthly P&L
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyPnL = closedTrades.filter(t => {
    if (!t.exit_date) return false;
    const exitDate = new Date(t.exit_date);
    return exitDate.getMonth() === currentMonth && exitDate.getFullYear() === currentYear;
  }).reduce((sum, trade) => sum + calculatePnL(trade), 0);

  // Calculate portfolio risk
  const portfolioRisk = openTrades.reduce((sum, trade) => {
    if (!trade.stop_loss || !trade.entry_price || !trade.quantity) return sum;
    const riskPerShare = Math.abs(trade.entry_price - trade.stop_loss);
    const multiplier = trade.trade_type === 'LONG' ? 1 : -1;
    return sum + (riskPerShare * trade.quantity * multiplier);
  }, 0);

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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Here's your trading overview.</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <SubscriptionStatus />
            <SubscriptionDebug />

            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Performance Overview</CardTitle>
                  <div className="flex gap-2">
                    {(['7d', '30d', '90d', '1y'] as const).map((period) => (
                      <Button
                        key={period}
                        variant={performancePeriod === period ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPerformancePeriod(period)}
                      >
                        {period.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <PerformanceChart data={performanceData} period={performancePeriod} />
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickStats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {stat.changeType === "positive" ? (
                            <ArrowUpRight className="w-4 h-4 text-green-500" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-500" />
                          )}
                          <span className={`text-sm ${stat.changeType === "positive" ? "text-green-500" : "text-red-500"}`}>
                            {stat.change}
                          </span>
                        </div>
                      </div>
                      <div className={`p-3 rounded-full ${stat.changeType === "positive" ? "bg-green-100" : "bg-red-100"}`}>
                        <stat.icon className={`w-6 h-6 ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No recent activity</p>
                    ) : (
                      recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                              <Activity className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="font-medium">{activity.title}</p>
                              <p className="text-sm text-muted-foreground">{activity.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">{activity.time}</p>
                            {activity.pnl !== null && (
                              <p className={`text-sm font-medium ${activity.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {formatCurrency(activity.pnl)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {quickActions.map((action, index) => (
                      <Link key={index} to={action.href}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${action.color}`}>
                                <action.icon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="font-medium">{action.title}</p>
                                <p className="text-sm text-muted-foreground">{action.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-500">{formatCurrency(summary.totalPnL)}</p>
                    <p className="text-sm text-muted-foreground">Total P&L</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{summary.totalTrades}</p>
                    <p className="text-sm text-muted-foreground">Total Trades</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{summary.winRate.toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">Win Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <Badge variant="secondary">{course.duration}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{course.rating}</span>
                        </div>
                        <span className="font-medium">{course.price}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Calculators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Financial calculators for position sizing, risk management, and more.</p>
                  <Link to="/calculators">
                    <Button className="w-full">View Calculators</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Screeners
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Stock screeners to find trading opportunities based on your criteria.</p>
                  <Link to="/screeners">
                    <Button className="w-full">View Screeners</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Indicators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Technical indicators and analysis tools for market research.</p>
                  <Link to="/indicators">
                    <Button className="w-full">View Indicators</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}