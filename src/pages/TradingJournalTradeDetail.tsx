import { useState, useEffect } from "react";
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

  const calculateInvestment = () => {
    if (!trade) return 0;
    return trade.entry_price * trade.quantity;
  };

  const calculateUnrealizedPnL = () => {
    if (!trade) return 0;
    const multiplier = trade.trade_type === 'LONG' ? 1 : -1;
    return (currentPrice - trade.entry_price) * trade.quantity * multiplier;
  };

  const calculateRisk = () => {
    if (!trade || !trade.stop_loss) return 0;
    const multiplier = trade.trade_type === 'LONG' ? 1 : -1;
    return Math.abs((trade.entry_price - trade.stop_loss) * trade.quantity * multiplier);
  };

  const calculateRiskPercentage = () => {
    const accountCapital = settings?.account_capital || 100000;
    const riskAmount = calculateRisk();
    return (riskAmount / accountCapital) * 100;
  };

  const calculateRRRatio = () => {
    if (!trade || !trade.stop_loss || !trade.take_profit) return 0;
    const risk = Math.abs(trade.entry_price - trade.stop_loss);
    const reward = Math.abs(trade.take_profit - trade.entry_price);
    return reward / risk;
  };

  const calculatePnLPercentage = () => {
    const unrealizedPnL = calculateUnrealizedPnL();
    const investment = calculateInvestment();
    return investment > 0 ? (unrealizedPnL / investment) * 100 : 0;
  };

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

    try {
      await updateTrade(trade.id, editData);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating trade:', error);
    }
  };

  if (!trade) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/trading-journal">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Journal
              </Button>
            </Link>
            <p className="text-muted-foreground">Trade not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link to="/trading-journal">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Journal
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Trade #{trade.id}</h1>
              <p className="text-muted-foreground">Trade details and analysis</p>
            </div>
          </div>

          <div className="flex gap-2">
            {editMode ? (
              <>
                <Button variant="outline" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditTrade}>
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setEditMode(true)}>
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
                    className="w-32"
                  />
                ) : (
                  <span>{trade.symbol}</span>
                )}
                <Badge variant={trade.trade_type === 'LONG' ? 'default' : 'secondary'}>
                  {trade.trade_type}
                </Badge>
                <Badge variant={
                  trade.status === 'OPEN' ? 'default' : 
                  trade.status === 'CLOSED' ? 'secondary' : 'destructive'
                }>
                  {trade.status}
                </Badge>
              </div>
              <TrendingUp className="w-6 h-6 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Entry Price</p>
                {editMode ? (
                  <Input
                    type="number"
                    step="0.01"
                    value={editData.entry_price}
                    onChange={(e) => setEditData({...editData, entry_price: parseFloat(e.target.value)})}
                  />
                ) : (
                  <p className="text-xl font-bold">{formatCurrency(trade.entry_price)}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Quantity</p>
                {editMode ? (
                  <Input
                    type="number"
                    value={editData.quantity}
                    onChange={(e) => setEditData({...editData, quantity: parseInt(e.target.value)})}
                  />
                ) : (
                  <p className="text-xl font-bold">{trade.quantity} shares</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Investment</p>
                <p className="text-xl font-bold">{formatCurrency(calculateInvestment())}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Entry Date</p>
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
                  <p className="text-sm text-muted-foreground">Stop Loss</p>
                  {editMode ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={editData.stop_loss}
                      onChange={(e) => setEditData({...editData, stop_loss: parseFloat(e.target.value)})}
                      placeholder="Enter stop loss"
                    />
                  ) : trade.stop_loss ? (
                    <p className="text-lg font-bold text-red-500">{formatCurrency(trade.stop_loss)}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not set</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Take Profit</p>
                  {editMode ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={editData.take_profit}
                      onChange={(e) => setEditData({...editData, take_profit: parseFloat(e.target.value)})}
                      placeholder="Enter take profit"
                    />
                  ) : trade.take_profit ? (
                    <p className="text-lg font-bold text-green-500">{formatCurrency(trade.take_profit)}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not set</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Risk Amount</p>
                  <p className="text-lg font-bold text-orange-500">
                    {formatCurrency(calculateRisk())} ({calculateRiskPercentage().toFixed(2)}%)
                  </p>
                </div>
                {trade.stop_loss && trade.take_profit && (
                  <div>
                    <p className="text-sm text-muted-foreground">R:R Ratio</p>
                    <p className="text-lg font-bold text-purple-500">1:{calculateRRRatio().toFixed(2)}</p>
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
                  <p className="text-sm text-muted-foreground">Current Price</p>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={currentPrice}
                      onChange={(e) => setCurrentPrice(parseFloat(e.target.value) || 0)}
                      className="w-32"
                    />
                    <Button size="sm" variant="outline">Update</Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unrealized P&L</p>
                  <p className={`text-xl font-bold ${calculateUnrealizedPnL() >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatCurrency(calculateUnrealizedPnL())}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">P&L Percentage</p>
                  <p className={`text-xl font-bold ${calculatePnLPercentage() >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {calculatePnLPercentage() >= 0 ? '+' : ''}{calculatePnLPercentage().toFixed(2)}%
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
                <p className="text-sm text-muted-foreground">Setup Type</p>
                {editMode ? (
                  <Input
                    value={editData.setup_type}
                    onChange={(e) => setEditData({...editData, setup_type: e.target.value})}
                    placeholder="Enter setup type"
                  />
                ) : trade.setup_type ? (
                  <Badge variant="outline" className="mt-1">{trade.setup_type}</Badge>
                ) : (
                  <p className="text-sm text-muted-foreground">Not specified</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Entry Reason</p>
                {editMode ? (
                  <Textarea
                    value={editData.entry_reason}
                    onChange={(e) => setEditData({...editData, entry_reason: e.target.value})}
                    placeholder="Enter entry reason"
                    rows={3}
                  />
                ) : trade.entry_reason ? (
                  <p className="text-sm mt-1 p-3 bg-muted rounded-md">{trade.entry_reason}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Not specified</p>
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
              <p className="text-muted-foreground">Image upload feature coming soon</p>
              <p className="text-sm text-muted-foreground">You'll be able to upload trade screenshots here</p>
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
                <Button onClick={() => setShowCloseForm(true)} className="w-full bg-primary hover:bg-primary/90">
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
                      />
                    </div>
                    <div>
                      <Label htmlFor="exitDate">Exit Date</Label>
                      <Input
                        id="exitDate"
                        type="datetime-local"
                        value={new Date().toISOString().slice(0, 16)}
                        disabled
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
                    />
                  </div>

                  {exitPrice && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Projected P&L:</strong> {
                          (() => {
                            const multiplier = trade.trade_type === 'LONG' ? 1 : -1;
                            const pnl = (parseFloat(exitPrice) - trade.entry_price) * trade.quantity * multiplier;
                            return (
                              <span className={pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                                {formatCurrency(pnl)} ({((pnl / calculateInvestment()) * 100).toFixed(2)}%)
                              </span>
                            );
                          })()
                        }
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowCloseForm(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCloseTrade} className="bg-primary hover:bg-primary/90">
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