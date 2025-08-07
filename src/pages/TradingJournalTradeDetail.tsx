import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, TrendingUp, Shield, Target, AlertCircle, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTrades, type Trade } from "@/hooks/useTrades";
import { useJournalSettings } from "@/hooks/useJournalSettings";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";

export default function TradingJournalTradeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trades, updateTrade, deleteTrade } = useTrades();
  const { settings } = useJournalSettings();
  const [trade, setTrade] = useState<Trade | null>(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [exitPrice, setExitPrice] = useState("");
  const [exitReason, setExitReason] = useState("");
  const [showCloseForm, setShowCloseForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    if (id && trades.length > 0) {
      const foundTrade = trades.find(t => t.id === id);
      if (foundTrade) {
        setTrade(foundTrade);
        setCurrentPrice(foundTrade.entry_price);
        setEditData({
          symbol: foundTrade.symbol,
          entry_price: foundTrade.entry_price,
          quantity: foundTrade.quantity,
          stop_loss: foundTrade.stop_loss || '',
          take_profit: foundTrade.take_profit || '',
          setup_type: foundTrade.setup_type || '',
          entry_reason: foundTrade.entry_reason || ''
        });
      }
    }
  }, [id, trades]);

  // Enhanced currency formatting with error handling
  const formatCurrency = (amount: number): string => {
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return 'Invalid Amount';
    }
  };

  // Enhanced date formatting with error handling
  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  // Memoized calculations for better performance
  const tradeCalculations = useMemo(() => {
    if (!trade) return {};

    try {
      const investment = trade.entry_price * trade.quantity;
      const multiplier = trade.trade_type === 'LONG' ? 1 : -1;
      const unrealizedPnL = (currentPrice - trade.entry_price) * trade.quantity * multiplier;
      const pnlPercentage = investment > 0 ? (unrealizedPnL / investment) * 100 : 0;

      // Risk calculations
      const riskAmount = trade.stop_loss ? Math.abs((trade.entry_price - trade.stop_loss) * trade.quantity * multiplier) : 0;
      const accountCapital = settings?.account_capital || 100000;
      const riskPercentage = (riskAmount / accountCapital) * 100;

      // R:R Ratio calculation
      let rrRatio = 0;
      if (trade.stop_loss && trade.take_profit) {
        const risk = Math.abs(trade.entry_price - trade.stop_loss);
        const reward = Math.abs(trade.take_profit - trade.entry_price);
        rrRatio = reward / risk;
      }

      return {
        investment,
        unrealizedPnL,
        pnlPercentage,
        riskAmount,
        riskPercentage,
        rrRatio
      };
    } catch (error) {
      console.error('Error calculating trade metrics:', error);
      return {
        investment: 0,
        unrealizedPnL: 0,
        pnlPercentage: 0,
        riskAmount: 0,
        riskPercentage: 0,
        rrRatio: 0
      };
    }
  }, [trade, currentPrice, settings]);

  const { investment, unrealizedPnL, pnlPercentage, riskAmount, riskPercentage, rrRatio } = tradeCalculations;

  const handleCloseTrade = async () => {
    if (!exitPrice || parseFloat(exitPrice) <= 0) {
      toast.error("Please enter a valid exit price");
      return;
    }

    if (!trade) return;

    try {
      await updateTrade(trade.id, {
        exit_price: parseFloat(exitPrice),
        exit_reason: exitReason,
        exit_date: new Date().toISOString(),
        status: 'CLOSED'
      });
      setShowCloseForm(false);
      navigate('/trading-journal');
    } catch (error) {
      console.error('Error closing trade:', error);
    }
  };

  const handleDeleteTrade = async () => {
    if (!trade) return;
    
    if (confirm("Are you sure you want to delete this trade? This action cannot be undone.")) {
      try {
        await deleteTrade(trade.id);
        navigate('/trading-journal');
      } catch (error) {
        console.error('Error deleting trade:', error);
      }
    }
  };

  const handleEditTrade = async () => {
    if (!trade) return;

    // Enhanced form validation
    try {
      if (!editData.symbol || editData.symbol.trim() === '') {
        toast.error("Symbol is required");
        return;
      }

      if (!editData.entry_price || editData.entry_price <= 0) {
        toast.error("Entry price must be greater than 0");
        return;
      }

      if (!editData.quantity || editData.quantity <= 0) {
        toast.error("Quantity must be greater than 0");
        return;
      }

      await updateTrade(trade.id, editData);
      setEditMode(false);
      toast.success("Trade updated successfully!");
    } catch (error) {
      console.error('Error updating trade:', error);
      toast.error("Failed to update trade");
    }
  };

  if (!trade) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/trading-journal">
              <Button variant="ghost" size="sm" className="text-primary hover:bg-background-ultra">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Journal
              </Button>
            </Link>
            <p className="text-primary">Trade not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link to="/trading-journal">
              <Button variant="ghost" size="sm" className="text-primary hover:bg-background-ultra">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Journal
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-primary">Trade #{trade.id}</h1>
              <p className="text-primary">Trade details and analysis</p>
            </div>
          </div>

          <div className="flex gap-2">
            {editMode ? (
              <>
                <Button variant="outline" onClick={() => setEditMode(false)} className="border-border-light text-primary hover:bg-background-ultra">
                  Cancel
                </Button>
                <Button onClick={handleEditTrade} className="bg-primary text-background-soft hover:bg-primary/90">
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setEditMode(true)} className="border-border-light text-primary hover:bg-background-ultra">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Trade
                </Button>
                <Button variant="destructive" onClick={handleDeleteTrade}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Trade Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {editMode ? (
                  <Input
                    value={editData.symbol}
                    onChange={(e) => setEditData({...editData, symbol: e.target.value})}
                    className="w-32 bg-background-pure border-border-light text-primary placeholder:text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                    aria-describedby="symbol-help"
                  />
                ) : (
                  <span>{trade.symbol}</span>
                )}
                <Badge variant={trade.trade_type === 'LONG' ? 'long' : 'short'}>
                  {trade.trade_type}
                </Badge>
                <Badge variant={
                  trade.status === 'OPEN' ? 'default' : 
                  trade.status === 'CLOSED' ? 'secondary' : 'destructive'
                }>
                  {trade.status}
                </Badge>
              </div>
              <TrendingUp className="w-6 h-6 text-info" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-primary">Entry Price</p>
                {editMode ? (
                  <Input
                    type="number"
                    step="0.01"
                    value={editData.entry_price}
                    onChange={(e) => setEditData({...editData, entry_price: parseFloat(e.target.value)})}
                    className="bg-background-pure border-border-light text-primary placeholder:text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                    aria-describedby="entry-price-help"
                  />
                ) : (
                  <p className="text-xl font-bold">{formatCurrency(trade.entry_price)}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-primary">Quantity</p>
                {editMode ? (
                  <Input
                    type="number"
                    value={editData.quantity}
                    onChange={(e) => setEditData({...editData, quantity: parseInt(e.target.value)})}
                    className="bg-background-pure border-border-light text-primary placeholder:text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                    aria-describedby="quantity-help"
                  />
                ) : (
                  <p className="text-xl font-bold">{trade.quantity} shares</p>
                )}
              </div>
              <div>
                <p className="text-sm text-primary">Investment</p>
                <p className="text-xl font-bold">{formatCurrency(investment)}</p>
              </div>
              <div>
                <p className="text-sm text-primary">Entry Date</p>
                <p className="text-xl font-bold">{formatDate(trade.entry_date)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Management */}
        {(trade.stop_loss || trade.take_profit || editMode) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Risk Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-primary">Stop Loss</p>
                  {editMode ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={editData.stop_loss}
                      onChange={(e) => setEditData({...editData, stop_loss: parseFloat(e.target.value)})}
                      placeholder="Enter stop loss"
                      className="bg-background-pure border-border-light text-primary placeholder:text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                      aria-describedby="stop-loss-help"
                    />
                  ) : trade.stop_loss ? (
                    <p className="text-lg font-bold text-error">{formatCurrency(trade.stop_loss)}</p>
                  ) : (
                    <p className="text-sm text-primary">Not set</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-primary">Take Profit</p>
                  {editMode ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={editData.take_profit}
                      onChange={(e) => setEditData({...editData, take_profit: parseFloat(e.target.value)})}
                      placeholder="Enter take profit"
                      className="bg-background-pure border-border-light text-primary placeholder:text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                      aria-describedby="take-profit-help"
                    />
                  ) : trade.take_profit ? (
                    <p className="text-lg font-bold text-success">{formatCurrency(trade.take_profit)}</p>
                  ) : (
                    <p className="text-sm text-primary">Not set</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-primary">Risk Amount</p>
                  <p className="text-lg font-bold text-warning">
                    {formatCurrency(riskAmount)} ({riskPercentage.toFixed(2)}%)
                  </p>
                </div>
                {trade.stop_loss && trade.take_profit && (
                  <div>
                    <p className="text-sm text-primary">R:R Ratio</p>
                    <p className="text-lg font-bold text-luxury-gold">1:{rrRatio.toFixed(2)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Status (for open trades) */}
        {trade.status === 'OPEN' && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Current Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-primary">Current Price</p>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={currentPrice}
                      onChange={(e) => setCurrentPrice(parseFloat(e.target.value) || 0)}
                      className="w-32 bg-background-pure border-border-light text-primary placeholder:text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                      aria-describedby="current-price-help"
                    />
                    <Button size="sm" variant="outline" className="border-border-light text-primary hover:bg-background-ultra">Update</Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-primary">Unrealized P&L</p>
                  <p className={`text-xl font-bold ${unrealizedPnL >= 0 ? 'text-success' : 'text-error'}`}>
                    {formatCurrency(unrealizedPnL)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-primary">P&L Percentage</p>
                  <p className={`text-xl font-bold ${pnlPercentage >= 0 ? 'text-success' : 'text-error'}`}>
                    {pnlPercentage >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Setup Details */}
        {(trade.setup_type || trade.entry_reason || editMode) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Setup Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-primary">Setup Type</p>
                {editMode ? (
                  <Input
                    value={editData.setup_type}
                    onChange={(e) => setEditData({...editData, setup_type: e.target.value})}
                    placeholder="Enter setup type"
                    className="bg-background-pure border-border-light text-primary placeholder:text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                    aria-describedby="setup-type-help"
                  />
                ) : trade.setup_type ? (
                  <Badge variant="outline" className="mt-1">{trade.setup_type}</Badge>
                ) : (
                  <p className="text-sm text-primary">Not specified</p>
                )}
              </div>
              <div>
                <p className="text-sm text-primary">Entry Reason</p>
                {editMode ? (
                  <Textarea
                    value={editData.entry_reason}
                    onChange={(e) => setEditData({...editData, entry_reason: e.target.value})}
                    placeholder="Enter entry reason"
                    rows={3}
                    className="bg-background-pure border-border-light text-primary placeholder:text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                    aria-describedby="entry-reason-help"
                  />
                ) : trade.entry_reason ? (
                  <p className="text-sm mt-1 p-3 bg-muted rounded-md">{trade.entry_reason}</p>
                ) : (
                  <p className="text-sm text-primary">Not specified</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Screenshots */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Screenshots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-8 text-center">
              <p className="text-primary">Image upload feature coming soon</p>
              <p className="text-sm text-primary">You'll be able to upload trade screenshots here</p>
            </div>
          </CardContent>
        </Card>

        {/* Close Position Section (for open trades) */}
        {trade.status === 'OPEN' && (
          <Card>
            <CardHeader>
              <CardTitle>Close Position</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showCloseForm ? (
                <Button onClick={() => setShowCloseForm(true)} className="w-full bg-primary text-background-soft hover:bg-primary/90">
                  Close This Position
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="exitPrice">Exit Price *</Label>
                      <Input
                        id="exitPrice"
                        type="number"
                        step="0.01"
                        value={exitPrice}
                        onChange={(e) => setExitPrice(e.target.value)}
                        placeholder={currentPrice.toString()}
                        required
                        className="bg-background-pure border-border-light text-primary placeholder:text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                        aria-describedby="exit-price-help"
                      />
                    </div>
                    <div>
                      <Label htmlFor="exitDate">Exit Date</Label>
                      <Input
                        id="exitDate"
                        type="datetime-local"
                        value={new Date().toISOString().slice(0, 16)}
                        disabled
                        className="bg-background-pure border-border-light text-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="exitReason">Exit Reason</Label>
                    <Textarea
                      id="exitReason"
                      value={exitReason}
                      onChange={(e) => setExitReason(e.target.value)}
                      placeholder="Describe why you're closing this position..."
                      rows={3}
                      className="bg-background-pure border-border-light text-primary placeholder:text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                      aria-describedby="exit-reason-help"
                    />
                  </div>

                  {exitPrice && (
                    <Alert className="border-info bg-info/10">
                      <AlertCircle className="h-4 w-4 text-info" />
                      <AlertDescription className="text-primary">
                        <strong className="text-info">Projected P&L:</strong> {
                          (() => {
                            try {
                              const multiplier = trade.trade_type === 'LONG' ? 1 : -1;
                              const pnl = (parseFloat(exitPrice) - trade.entry_price) * trade.quantity * multiplier;
                              const pnlPercentage = (pnl / investment) * 100;
                              return (
                                <span className={pnl >= 0 ? 'text-success' : 'text-error'}>
                                  {formatCurrency(pnl)} ({pnlPercentage.toFixed(2)}%)
                                </span>
                              );
                            } catch (error) {
                              console.error('Error calculating projected P&L:', error);
                              return <span className="text-error">Error calculating P&L</span>;
                            }
                          })()
                        }
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowCloseForm(false)} className="border-border-light text-primary hover:bg-background-ultra">
                      Cancel
                    </Button>
                    <Button onClick={handleCloseTrade} className="bg-primary text-background-soft hover:bg-primary/90">
                      Confirm Close Position
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}