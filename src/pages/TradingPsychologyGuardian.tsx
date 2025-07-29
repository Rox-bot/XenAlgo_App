import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Activity,
  BarChart3,
  Lightbulb,
  Shield,
  Zap
} from 'lucide-react';
import { tradingPsychologyApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Trade {
  id: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  quantity: number;
  entry_price: number;
  exit_price?: number;
  entry_date: string;
  exit_date?: string;
  pnl?: number;
  emotion_before?: string;
  emotion_after?: string;
  reasoning?: string;
}

interface BehavioralAnalysis {
  user_id: string;
  risk_score: number;
  behavioral_patterns: string[];
  emotional_trends: Record<string, number>;
  performance_correlation: Record<string, number>;
  recommendations: string[];
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence_score: number;
}

const TradingPsychologyGuardian = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<BehavioralAnalysis | null>(null);
  const [apiHealth, setApiHealth] = useState<boolean | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [userProfile, setUserProfile] = useState({
    risk_tolerance: 5,
    trading_experience: 'INTERMEDIATE',
    capital_amount: 100000,
    goals: ['GROWTH']
  });
  const { toast } = useToast();

  // Check API health on component mount
  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      const health = await tradingPsychologyApi.health();
      setApiHealth(true);
      console.log('API Health:', health);
    } catch (error) {
      setApiHealth(false);
      console.error('API Health Check Failed:', error);
      toast({
        title: "API Connection Error",
        description: "Unable to connect to Trading Psychology API",
        variant: "destructive",
      });
    }
  };

  const addTrade = () => {
    const newTrade: Trade = {
      id: Date.now().toString(),
      symbol: '',
      action: 'BUY',
      quantity: 0,
      entry_price: 0,
      entry_date: new Date().toISOString().split('T')[0],
      emotion_before: '',
      reasoning: ''
    };
    setTrades([...trades, newTrade]);
  };

  const updateTrade = (id: string, field: keyof Trade, value: any) => {
    setTrades(trades.map(trade => 
      trade.id === id ? { ...trade, [field]: value } : trade
    ));
  };

  const removeTrade = (id: string) => {
    setTrades(trades.filter(trade => trade.id !== id));
  };

  const analyzeBehavior = async () => {
    if (trades.length === 0) {
      toast({
        title: "No Trades",
        description: "Please add at least one trade to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = {
        user_id: 'user-123',
        trades: trades,
        risk_tolerance: userProfile.risk_tolerance,
        trading_experience: userProfile.trading_experience,
        capital_amount: userProfile.capital_amount,
        goals: userProfile.goals
      };

      const result = await tradingPsychologyApi.analyzeBehavior(data);
      setAnalysis(result);
      
      toast({
        title: "Analysis Complete",
        description: "Trading psychology analysis has been completed",
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze trading behavior",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const predictBehavior = async () => {
    if (trades.length === 0) {
      toast({
        title: "No Trades",
        description: "Please add at least one trade to predict behavior",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = {
        user_id: 'user-123',
        trades: trades,
        risk_tolerance: userProfile.risk_tolerance,
        trading_experience: userProfile.trading_experience,
        capital_amount: userProfile.capital_amount,
        goals: userProfile.goals
      };

      const result = await tradingPsychologyApi.predictBehavior(data);
      
      toast({
        title: "Prediction Complete",
        description: "Future behavior prediction has been completed",
      });
    } catch (error) {
      console.error('Prediction failed:', error);
      toast({
        title: "Prediction Failed",
        description: "Unable to predict future behavior",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Trading Psychology Guardian</h1>
          </div>
          <p className="text-muted-foreground">
            AI-powered analysis of your trading psychology and behavioral patterns
          </p>
        </div>

        {/* API Status */}
        <Alert className="mb-6">
          <Activity className="h-4 w-4" />
          <AlertDescription>
            API Status: {apiHealth === null ? 'Checking...' : 
              apiHealth ? 'Connected' : 'Disconnected'}
            {apiHealth && (
              <Badge variant="secondary" className="ml-2">
                <CheckCircle className="h-3 w-3 mr-1" />
                Live
              </Badge>
            )}
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="trades" className="space-y-6">
          <TabsList>
            <TabsTrigger value="trades">Trade History</TabsTrigger>
            <TabsTrigger value="profile">User Profile</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Trade History Tab */}
          <TabsContent value="trades" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Trade History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trades.map((trade, index) => (
                    <div key={trade.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Trade #{index + 1}</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeTrade(trade.id)}
                        >
                          Remove
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <Label>Symbol</Label>
                          <Input
                            value={trade.symbol}
                            onChange={(e) => updateTrade(trade.id, 'symbol', e.target.value)}
                            placeholder="AAPL"
                          />
                        </div>
                        
                        <div>
                          <Label>Action</Label>
                          <Select
                            value={trade.action}
                            onValueChange={(value) => updateTrade(trade.id, 'action', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BUY">Buy</SelectItem>
                              <SelectItem value="SELL">Sell</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            value={trade.quantity}
                            onChange={(e) => updateTrade(trade.id, 'quantity', parseInt(e.target.value))}
                          />
                        </div>
                        
                        <div>
                          <Label>Entry Price</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={trade.entry_price}
                            onChange={(e) => updateTrade(trade.id, 'entry_price', parseFloat(e.target.value))}
                          />
                        </div>
                        
                        <div>
                          <Label>Entry Date</Label>
                          <Input
                            type="date"
                            value={trade.entry_date}
                            onChange={(e) => updateTrade(trade.id, 'entry_date', e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label>Emotion Before Trade</Label>
                          <Select
                            value={trade.emotion_before || ''}
                            onValueChange={(value) => updateTrade(trade.id, 'emotion_before', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select emotion" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="CONFIDENT">Confident</SelectItem>
                              <SelectItem value="NERVOUS">Nervous</SelectItem>
                              <SelectItem value="EXCITED">Excited</SelectItem>
                              <SelectItem value="FEARFUL">Fearful</SelectItem>
                              <SelectItem value="CALM">Calm</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label>Reasoning</Label>
                        <Textarea
                          value={trade.reasoning || ''}
                          onChange={(e) => updateTrade(trade.id, 'reasoning', e.target.value)}
                          placeholder="Why did you make this trade?"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Button onClick={addTrade} className="w-full">
                    <Zap className="h-4 w-4 mr-2" />
                    Add Trade
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  User Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Risk Tolerance (1-10)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={userProfile.risk_tolerance}
                      onChange={(e) => setUserProfile({
                        ...userProfile,
                        risk_tolerance: parseInt(e.target.value)
                      })}
                    />
                  </div>
                  
                  <div>
                    <Label>Trading Experience</Label>
                    <Select
                      value={userProfile.trading_experience}
                      onValueChange={(value) => setUserProfile({
                        ...userProfile,
                        trading_experience: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BEGINNER">Beginner</SelectItem>
                        <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                        <SelectItem value="ADVANCED">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Capital Amount</Label>
                    <Input
                      type="number"
                      value={userProfile.capital_amount}
                      onChange={(e) => setUserProfile({
                        ...userProfile,
                        capital_amount: parseFloat(e.target.value)
                      })}
                    />
                  </div>
                  
                  <div>
                    <Label>Trading Goals</Label>
                    <Select
                      value={userProfile.goals[0]}
                      onValueChange={(value) => setUserProfile({
                        ...userProfile,
                        goals: [value]
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INCOME">Income</SelectItem>
                        <SelectItem value="GROWTH">Growth</SelectItem>
                        <SelectItem value="PRESERVATION">Capital Preservation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Behavioral Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button 
                    onClick={analyzeBehavior} 
                    disabled={isLoading || trades.length === 0}
                    className="flex-1"
                  >
                    {isLoading ? 'Analyzing...' : 'Analyze Behavior'}
                  </Button>
                  <Button 
                    onClick={predictBehavior} 
                    disabled={isLoading || trades.length === 0}
                    variant="outline"
                    className="flex-1"
                  >
                    {isLoading ? 'Predicting...' : 'Predict Behavior'}
                  </Button>
                </div>

                {analysis && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Risk Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {analysis.risk_score.toFixed(1)}/10
                          </div>
                          <Progress value={analysis.risk_score * 10} className="mt-2" />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Risk Level</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Badge className={getRiskLevelColor(analysis.risk_level)}>
                            {analysis.risk_level}
                          </Badge>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Confidence</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {(analysis.confidence_score * 100).toFixed(0)}%
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Lightbulb className="h-5 w-5" />
                          Behavioral Patterns
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {analysis.behavioral_patterns.map((pattern, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-primary" />
                              <span>{pattern}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {analysis.recommendations.map((rec, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                              <span>{rec}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Trading Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      This feature will provide detailed insights into your trading psychology
                      and behavioral patterns based on your trade history.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Emotional Trends</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Analysis of emotional patterns before and after trades
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Performance Correlation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Correlation between emotions and trading performance
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TradingPsychologyGuardian; 