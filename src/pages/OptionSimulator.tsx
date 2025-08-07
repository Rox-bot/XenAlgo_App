import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle, 
  Plus, 
  Trash2,
  Play,
  Save,
  Download
} from 'lucide-react';
import { 
  OptionStrategy, 
  OptionLeg, 
  STRATEGY_TEMPLATES, 
  calculateStrategyPayout, 
  calculateStrategyRisk,
  validateStrategy 
} from '@/lib/optionStrategies';
import { generateOptionChain } from '@/lib/optionPricing';
import Navbar from '@/components/layout/Navbar';

export default function OptionSimulator() {
  const { toast } = useToast();
  const [currentSpot, setCurrentSpot] = useState(18000); // NIFTY example
  const [volatility, setVolatility] = useState(0.25);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [strategy, setStrategy] = useState<OptionStrategy>({
    id: '',
    name: '',
    description: '',
    category: 'INCOME',
    legs: [],
    maxProfit: 0,
    maxLoss: 0,
    breakEvenPoints: [],
    riskProfile: 'MEDIUM',
    marginRequired: 0
  });

  // Generate option chain for current spot
  const optionChain = useMemo(() => {
    try {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 30); // 30 days from now
      
      const strikes = [];
      for (let i = -10; i <= 10; i++) {
        strikes.push(currentSpot + i * 100);
      }
      
      return generateOptionChain(currentSpot, expiry, strikes, volatility);
    } catch (error) {
      console.error('Error generating option chain:', error);
      toast({
        title: "Error",
        description: "Failed to generate option chain.",
        variant: "destructive",
      });
      return [];
    }
  }, [currentSpot, volatility, toast]);

  // Calculate strategy P&L
  const strategyAnalysis = useMemo(() => {
    try {
      if (strategy.legs.length === 0) return null;
      
      const spotPrices = [];
      const minStrike = Math.min(...strategy.legs.map(leg => leg.strike));
      const maxStrike = Math.max(...strategy.legs.map(leg => leg.strike));
      const range = maxStrike - minStrike;
      
      for (let i = minStrike - range; i <= maxStrike + range; i += range / 50) {
        spotPrices.push(i);
      }
      
      const payouts = calculateStrategyPayout(strategy, spotPrices, currentSpot, volatility);
      const riskMetrics = calculateStrategyRisk(strategy);
      
      return {
        payouts,
        riskMetrics,
        chartData: payouts.map(p => ({
          spotPrice: p.spotPrice,
          pnl: p.netPnl,
          profit: p.profit,
          loss: p.loss
        }))
      };
    } catch (error) {
      console.error('Error calculating strategy analysis:', error);
      toast({
        title: "Calculation Error",
        description: "Failed to calculate strategy analysis.",
        variant: "destructive",
      });
      return null;
    }
  }, [strategy, currentSpot, volatility, toast]);

  // Memoized template selection handler
  const handleTemplateSelect = useCallback((templateKey: string) => {
    try {
      const template = STRATEGY_TEMPLATES[templateKey as keyof typeof STRATEGY_TEMPLATES];
      if (!template) {
        toast({
          title: "Template Not Found",
          description: "Selected template could not be loaded.",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedTemplate(templateKey);
      setStrategy(prev => ({
        ...prev,
        name: template.name,
        description: template.description,
        category: template.category,
        legs: template.legs.map((leg, index) => ({
          id: `leg-${index}`,
          symbol: 'NIFTY',
          strike: currentSpot + (index - 1) * 100,
          expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          type: leg.type as 'CALL' | 'PUT',
          action: leg.action as 'BUY' | 'SELL',
          quantity: leg.type === 'CALL' && leg.action === 'SELL' && index === 1 ? 2 : 1
        })),
        maxProfit: 0,
        maxLoss: 0,
        breakEvenPoints: [],
        riskProfile: template.riskProfile,
        marginRequired: 0
      }));
      
      toast({
        title: "Template Loaded",
        description: `${template.name} strategy loaded successfully.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error selecting template:', error);
      toast({
        title: "Error",
        description: "Failed to load template.",
        variant: "destructive",
      });
    }
  }, [currentSpot, toast]);

  // Memoized leg addition handler
  const addLeg = useCallback(() => {
    try {
      const newLeg: OptionLeg = {
        id: `leg-${Date.now()}`,
        symbol: 'NIFTY',
        type: 'CALL',
        action: 'BUY',
        strike: currentSpot,
        expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        quantity: 1
      };
      
      setStrategy(prev => ({
        ...prev,
        legs: [...prev.legs, newLeg]
      }));
      
      toast({
        title: "Leg Added",
        description: "New option leg added to strategy.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error adding leg:', error);
      toast({
        title: "Error",
        description: "Failed to add option leg.",
        variant: "destructive",
      });
    }
  }, [currentSpot, toast]);

  // Memoized leg update handler
  const updateLeg = useCallback((legId: string, updates: Partial<OptionLeg>) => {
    try {
      setStrategy(prev => ({
        ...prev,
        legs: prev.legs.map(leg => 
          leg.id === legId ? { ...leg, ...updates } : leg
        )
      }));
    } catch (error) {
      console.error('Error updating leg:', error);
      toast({
        title: "Error",
        description: "Failed to update option leg.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Memoized leg removal handler
  const removeLeg = useCallback((legId: string) => {
    try {
      setStrategy(prev => ({
        ...prev,
        legs: prev.legs.filter(leg => leg.id !== legId)
      }));
      
      toast({
        title: "Leg Removed",
        description: "Option leg removed from strategy.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error removing leg:', error);
      toast({
        title: "Error",
        description: "Failed to remove option leg.",
        variant: "destructive",
      });
    }
  }, [toast]);

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

  // Memoized strategy validation handler
  const handleStrategyValidation = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Simulate validation delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const validation = validateStrategy(strategy);
      
      if (validation.isValid) {
        toast({
          title: "Strategy Valid",
          description: "Strategy validation passed successfully.",
          variant: "default",
        });
      } else {
        toast({
          title: "Strategy Invalid",
          description: validation.errors.join(', '),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error validating strategy:', error);
      toast({
        title: "Validation Error",
        description: "Failed to validate strategy.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [strategy, toast]);

  return (
    <div className="min-h-screen bg-background-soft">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Option Strategy Simulator</h1>
          <p className="text-primary mt-2">Build and analyze option strategies with real-time P&L visualization</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Strategy Builder */}
          <div className="lg:col-span-2 space-y-6">
            {/* Market Parameters */}
            <Card className="bg-background-pure border border-border-light">
              <CardHeader>
                <CardTitle className="text-primary">Market Parameters</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="spot-price" className="text-primary">Current Spot Price</Label>
                  <Input
                    id="spot-price"
                    type="number"
                    value={currentSpot}
                    onChange={(e) => setCurrentSpot(Number(e.target.value))}
                    className="bg-background-pure border-border-light text-primary focus:border-primary"
                    aria-describedby="spot-price-help"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="volatility" className="text-primary">Volatility (%)</Label>
                  <Input
                    id="volatility"
                    type="number"
                    value={volatility * 100}
                    onChange={(e) => setVolatility(Number(e.target.value) / 100)}
                    className="bg-background-pure border-border-light text-primary focus:border-primary"
                    aria-describedby="volatility-help"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Strategy Templates */}
            <Card className="bg-background-pure border border-border-light">
              <CardHeader>
                <CardTitle className="text-primary">Strategy Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(STRATEGY_TEMPLATES).map(([key, template]) => (
                    <div
                      key={key}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedTemplate === key
                          ? 'border-primary bg-primary/10'
                          : 'border-border-light hover:border-primary/50 bg-background-ultra'
                      }`}
                      onClick={() => handleTemplateSelect(key)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Select ${template.name} strategy template`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleTemplateSelect(key);
                        }
                      }}
                    >
                      <div className="font-semibold text-primary mb-2">{template.name}</div>
                      <div className="text-sm text-primary mb-2">{template.description}</div>
                      <Badge variant="outline" className="bg-background-pure border-primary text-primary">
                        {template.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Strategy Legs */}
            <Card className="bg-background-pure border border-border-light">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-primary">Strategy Legs</CardTitle>
                  <Button
                    onClick={addLeg}
                    className="bg-primary text-background-soft hover:bg-primary-light"
                    aria-label="Add option leg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Leg
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {strategy.legs.length === 0 ? (
                  <div className="text-center py-8 text-primary">
                    <Target className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <p>No legs added yet. Add option legs to build your strategy.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {strategy.legs.map((leg, index) => (
                      <div key={leg.id} className="p-4 border border-border-light rounded-lg bg-background-ultra">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-primary">Leg {index + 1}</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeLeg(leg.id)}
                            className="bg-background-pure border-error text-error hover:bg-background-ultra"
                            aria-label={`Remove leg ${index + 1}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label className="text-primary">Type</Label>
                            <Select
                              value={leg.type}
                              onValueChange={(value) => updateLeg(leg.id, { type: value as 'CALL' | 'PUT' })}
                            >
                              <SelectTrigger className="bg-background-pure border-border-light text-primary">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-background-pure border border-border-light">
                                <SelectItem value="CALL" className="text-primary hover:bg-background-ultra">Call</SelectItem>
                                <SelectItem value="PUT" className="text-primary hover:bg-background-ultra">Put</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-primary">Action</Label>
                            <Select
                              value={leg.action}
                              onValueChange={(value) => updateLeg(leg.id, { action: value as 'BUY' | 'SELL' })}
                            >
                              <SelectTrigger className="bg-background-pure border-border-light text-primary">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-background-pure border border-border-light">
                                <SelectItem value="BUY" className="text-primary hover:bg-background-ultra">Buy</SelectItem>
                                <SelectItem value="SELL" className="text-primary hover:bg-background-ultra">Sell</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-primary">Strike</Label>
                            <Input
                              type="number"
                              value={leg.strike}
                              onChange={(e) => updateLeg(leg.id, { strike: Number(e.target.value) })}
                              className="bg-background-pure border-border-light text-primary focus:border-primary"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-primary">Quantity</Label>
                            <Input
                              type="number"
                              value={leg.quantity}
                              onChange={(e) => updateLeg(leg.id, { quantity: Number(e.target.value) })}
                              className="bg-background-pure border-border-light text-primary focus:border-primary"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Strategy Analysis */}
          <div className="lg:col-span-1 space-y-6">
            {/* Risk Metrics */}
            <Card className="bg-background-pure border border-border-light">
              <CardHeader>
                <CardTitle className="text-primary">Risk Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-success/10 rounded-lg border border-success/20">
                  <div className="text-2xl font-bold text-success">
                    {strategyAnalysis ? formatCurrency(strategyAnalysis.riskMetrics.maxProfit) : '₹0'}
                  </div>
                  <p className="text-sm text-primary">Max Profit</p>
                </div>
                <div className="text-center p-4 bg-error/10 rounded-lg border border-error/20">
                  <div className="text-2xl font-bold text-error">
                    {strategyAnalysis ? formatCurrency(strategyAnalysis.riskMetrics.maxLoss) : '₹0'}
                  </div>
                  <p className="text-sm text-primary">Max Loss</p>
                </div>
                <div className="text-center p-4 bg-info/10 rounded-lg border border-info/20">
                  <div className="text-2xl font-bold text-info">
                    {strategyAnalysis ? `${(strategyAnalysis.riskMetrics.probabilityOfProfit * 100).toFixed(1)}%` : '0%'}
                  </div>
                  <p className="text-sm text-primary">Probability of Profit</p>
                </div>
                <div className="text-center p-4 bg-warning/10 rounded-lg border border-warning/20">
                  <div className="text-lg font-bold text-primary">
                    {strategyAnalysis?.riskMetrics.breakEvenPoints?.length || 0}
                  </div>
                  <p className="text-sm text-primary">Break-even Points</p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="bg-background-pure border border-border-light">
              <CardHeader>
                <CardTitle className="text-primary">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleStrategyValidation}
                  disabled={isLoading || strategy.legs.length === 0}
                  className="w-full bg-primary text-background-soft hover:bg-primary-light"
                  aria-label="Validate strategy"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Validate Strategy
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-background-pure border-primary text-primary hover:bg-background-ultra"
                  aria-label="Save strategy"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Strategy
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-background-pure border-primary text-primary hover:bg-background-ultra"
                  aria-label="Download analysis"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* P&L Chart */}
        {strategyAnalysis && (
          <Card className="mt-8 bg-background-pure border border-border-light">
            <CardHeader>
              <CardTitle className="text-primary">P&L Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={strategyAnalysis.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="spotPrice" 
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
                    <Line
                      type="monotone"
                      dataKey="pnl"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Option Chain */}
        <Card className="mt-8 bg-background-pure border border-border-light">
          <CardHeader>
            <CardTitle className="text-primary">Option Chain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-light">
                    <th className="text-left p-2 text-primary">Strike</th>
                    <th className="text-left p-2 text-primary">Call Bid</th>
                    <th className="text-left p-2 text-primary">Call Ask</th>
                    <th className="text-left p-2 text-primary">Put Bid</th>
                    <th className="text-left p-2 text-primary">Put Ask</th>
                  </tr>
                </thead>
                                 <tbody>
                   {optionChain.slice(0, 10).map((option) => (
                     <tr key={option.strike} className="border-b border-border-light hover:bg-background-ultra">
                       <td className="p-2 text-primary">{option.strike}</td>
                       <td className="p-2 text-primary">{option.callPrice.toFixed(2)}</td>
                       <td className="p-2 text-primary">{option.callPrice.toFixed(2)}</td>
                       <td className="p-2 text-primary">{option.putPrice.toFixed(2)}</td>
                       <td className="p-2 text-primary">{option.putPrice.toFixed(2)}</td>
                     </tr>
                   ))}
                 </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 