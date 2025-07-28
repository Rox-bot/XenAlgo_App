import { useState, useEffect } from "react";
import { Plus, Settings, Download, Filter, TrendingUp, TrendingDown, DollarSign, BarChart3, AlertCircle, Tag, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { AddTradeModal } from "@/components/trading-journal/AddTradeModal";
import { CategoryManager } from "@/components/trading-journal/CategoryManager";
import { UpgradeModal } from "@/components/subscription/UpgradeModal";
import { Link, useNavigate } from "react-router-dom";
import { useRealtimeTrades } from "@/hooks/useRealtimeTrades";
import { useTrades } from "@/hooks/useTrades";
import { useJournalSettings } from "@/hooks/useJournalSettings";
import { useAuth } from "@/contexts/AuthContext";
import { useMobile } from "@/hooks/useMobile";
import { useSubscription } from "@/contexts/SubscriptionContext";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function TradingJournal() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isMobile } = useMobile();
  const { trades, loading, refetch } = useRealtimeTrades();
  const { addTrade } = useTrades();
  const { settings } = useJournalSettings();
  const { 
    subscription, 
    canAddTrade, 
    canCreateCategory, 
    currentUsage, 
    getLimit, 
    isUnlimited,
    hasFeature,
    refetch: refetchSubscription
  } = useSubscription();
  const [statusFilter, setStatusFilter] = useState("all");
  const [symbolFilter, setSymbolFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const filteredTrades = trades.filter(trade => {
    const statusMatch = statusFilter === "all" || trade.status?.toLowerCase() === statusFilter;
    const symbolMatch = !symbolFilter || trade.symbol.toLowerCase().includes(symbolFilter.toLowerCase());
    const categoryMatch = !categoryFilter || trade.category_id === categoryFilter;
    return statusMatch && symbolMatch && categoryMatch;
  });

  const calculatePnL = (trade: any) => {
    if (!trade.exit_price || !trade.entry_price || !trade.quantity) return 0;
    const multiplier = trade.trade_type === 'LONG' ? 1 : -1;
    return (trade.exit_price - trade.entry_price) * trade.quantity * multiplier;
  };

  const closedTrades = trades.filter(t => t.status === 'CLOSED');
  const openTrades = trades.filter(t => t.status === 'OPEN');
  const totalPnL = closedTrades.reduce((sum, trade) => sum + calculatePnL(trade), 0);
  const winRate = closedTrades.length > 0 ? (closedTrades.filter(t => calculatePnL(t) > 0).length / closedTrades.length) * 100 : 0;
  
  // Calculate monthly P&L (current month)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyPnL = closedTrades.filter(t => {
    if (!t.exit_date) return false;
    const exitDate = new Date(t.exit_date);
    return exitDate.getMonth() === currentMonth && exitDate.getFullYear() === currentYear;
  }).reduce((sum, trade) => sum + calculatePnL(trade), 0);

  // Calculate portfolio risk (simplified - sum of open position risks)
  const portfolioRisk = openTrades.reduce((sum, trade) => {
    if (!trade.stop_loss || !trade.entry_price || !trade.quantity) return sum;
    const riskPerShare = Math.abs(trade.entry_price - trade.stop_loss);
    const multiplier = trade.trade_type === 'LONG' ? 1 : -1;
    return sum + (riskPerShare * trade.quantity * multiplier);
  }, 0);

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
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddTrade = () => {
    if (!canAddTrade(currentUsage.monthlyTrades)) {
      setShowUpgradeModal(true);
      return;
    }
    setShowAddModal(true);
  };

  const handleCreateCategory = () => {
    if (!hasFeature('tradeCategories')) {
      setShowUpgradeModal(true);
      return;
    }
    if (!canCreateCategory(currentUsage.categories)) {
      setShowUpgradeModal(true);
      return;
    }
  };

  const handleTradeSubmit = async (tradeData: any) => {
    try {
      await addTrade(tradeData);
      setShowAddModal(false);
      // Refresh subscription usage to update the count
      await refetchSubscription();
    } catch (error) {
      console.error('Error adding trade:', error);
      // Error is already handled by the addTrade function
    }
  };

  // Table columns configuration
  const columns = [
    {
      key: 'symbol',
      label: 'Symbol',
      render: (value: string) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'trade_type',
      label: 'Type',
      render: (value: string) => (
        <Badge variant={value === 'LONG' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'entry_price',
      label: 'Entry Price',
      render: (value: number) => formatCurrency(value),
    },
    {
      key: 'quantity',
      label: 'Quantity',
      render: (value: number) => value.toString(),
    },
    {
      key: 'pnl',
      label: 'P&L',
      render: (value: number, row: any) => {
        const pnl = calculatePnL(row);
        return row.status === 'CLOSED' ? (
          <span className={pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
            {formatCurrency(pnl)}
          </span>
        ) : (
          <span className="text-blue-500">Unrealized</span>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge variant={
          value === 'OPEN' ? 'default' : 
          value === 'CLOSED' ? 'secondary' : 'destructive'
        }>
          {value}
        </Badge>
      ),
    },
    {
      key: 'setup_type',
      label: 'Setup',
      render: (value: string) => value || '-',
    },
    {
      key: 'entry_date',
      label: 'Date',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, row: any) => (
        <div className="flex gap-2">
          <Link to={`/trading-journal/trade/${row.id}`}>
            <Button size="sm" variant="outline">View</Button>
          </Link>
          <Button size="sm" variant="outline">Edit</Button>
        </div>
      ),
      mobile: false, // Hide actions on mobile
    },
  ];

  // Mobile card renderer
  const mobileCard = (trade: any) => (
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{trade.symbol}</h3>
          <p className="text-sm text-muted-foreground">
            {trade.trade_type} • {trade.status}
          </p>
        </div>
        <Badge variant={trade.status === 'OPEN' ? 'default' : 'secondary'}>
          {trade.status}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Entry Price</p>
          <p className="font-medium">{formatCurrency(trade.entry_price)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Quantity</p>
          <p className="font-medium">{trade.quantity}</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-2 border-t">
        <div>
          <p className="text-sm text-muted-foreground">P&L</p>
          {trade.status === 'CLOSED' ? (
            <p className={`font-medium ${calculatePnL(trade) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(calculatePnL(trade))}
            </p>
          ) : (
            <p className="text-blue-500 font-medium">Unrealized</p>
          )}
        </div>
        <div className="flex gap-2">
          <Link to={`/trading-journal/trade/${trade.id}`}>
            <Button size="sm" variant="outline">View</Button>
          </Link>
          <Button size="sm" variant="outline">Edit</Button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <LoadingSpinner size="lg" text="Loading your trades..." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Trading Journal</h1>
            <p className="text-muted-foreground mt-1">Track and analyze your trading performance</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddTrade} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add New Trade
            </Button>
            <Link to="/trading-journal/settings">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Subscription Status */}
        {subscription && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Crown className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{subscription.tier.toUpperCase()} Plan</p>
                    <p className="text-sm text-muted-foreground">
                      {isUnlimited('monthlyTrades') ? 'Unlimited' : `${currentUsage.monthlyTrades}/${getLimit('monthlyTrades')}`} trades this month
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowUpgradeModal(true)}>
                  Upgrade
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total P&L</p>
                  <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatCurrency(totalPnL)}
                  </p>
                </div>
                <DollarSign className={`w-8 h-8 ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Open Positions</p>
                  <p className="text-2xl font-bold text-foreground">{openTrades.length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                  <p className="text-2xl font-bold text-foreground">{winRate.toFixed(1)}%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Portfolio Risk</p>
                  <p className="text-2xl font-bold text-orange-500">{formatCurrency(portfolioRisk)}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-4'}`}>
          {/* Category Sidebar */}
          {!isMobile && hasFeature('tradeCategories') && (
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CategoryManager
                    selectedCategory={categoryFilter}
                    onCategorySelect={setCategoryFilter}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <div className={`space-y-6 ${isMobile ? '' : 'lg:col-span-3'}`}>
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters & Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Trades</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    placeholder="Search symbol..."
                    value={symbolFilter}
                    onChange={(e) => setSymbolFilter(e.target.value)}
                    className="w-full sm:w-[200px]"
                  />
                  
                  <Link to="/trading-journal/analytics">
                    <Button variant="outline" className="w-full sm:w-auto">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Trades Table */}
            <Card>
              <CardHeader>
                <CardTitle>Your Trades ({filteredTrades.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredTrades.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No trades found. Add your first trade to get started!</p>
                  </div>
                ) : (
                  <ResponsiveTable
                    data={filteredTrades}
                    columns={columns}
                    mobileCard={mobileCard}
                    onRowClick={(trade) => navigate(`/trading-journal/trade/${trade.id}`)}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Trade Modal */}
        <AddTradeModal 
          open={showAddModal} 
          onOpenChange={setShowAddModal}
          onAddTrade={handleTradeSubmit}
          accountCapital={settings?.account_capital || 100000}
        />

        {/* Upgrade Modal */}
        <UpgradeModal
          open={showUpgradeModal}
          onOpenChange={setShowUpgradeModal}
          feature="unlimited trades and advanced features"
        />
      </div>
    </div>
  );
}