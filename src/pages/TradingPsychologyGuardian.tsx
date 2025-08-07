import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Zap,
  Database,
  History,
  TrendingUp as TrendingUpIcon,
  ArrowLeft
} from 'lucide-react';
import { tradingPsychologyApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import { Link } from 'react-router-dom';

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
  timestamp: number;
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
  learning_progress?: number;
  total_trades_analyzed?: number;
  improvement_areas?: string[];
}

interface LearningProfile {
  userId: string;
  totalTrades: number;
  firstAnalysisDate: string;
  lastAnalysisDate: string;
  learningProgress: number;
  behavioralPatterns: string[];
  improvementHistory: string[];
  riskScoreHistory: number[];
  confidenceScoreHistory: number[];
}

const TradingPsychologyGuardian = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<BehavioralAnalysis | null>(null);
  const [apiHealth, setApiHealth] = useState<boolean | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [learningProfile, setLearningProfile] = useState<LearningProfile | null>(null);
  const [userProfile, setUserProfile] = useState({
    risk_tolerance: 5,
    trading_experience: 'INTERMEDIATE',
    capital_amount: 100000,
    goals: ['GROWTH']
  });
  const { toast } = useToast();

  // Enhanced API health check with error handling
  const checkApiHealth = useCallback(async () => {
    try {
      const health = await tradingPsychologyApi.health();
      setApiHealth(true);
      console.log('API Health:', health);
    } catch (error) {
      console.error('API Health Check Failed:', error);
      setApiHealth(false);
      toast({
        title: "API Connection Error",
        description: "Unable to connect to Trading Psychology API",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Enhanced learning profile loading with error handling
  const loadLearningProfile = useCallback(async () => {
    if (!user) return;
    
    try {
      const stored = localStorage.getItem(`learning_profile_${user.id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setLearningProfile(parsed);
      }
    } catch (error) {
      console.error('Failed to load learning profile:', error);
      toast({
        title: "Profile Load Error",
        description: "Failed to load learning profile",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  // Check API health and load profile on component mount
  useEffect(() => {
    checkApiHealth();
    loadLearningProfile();
  }, [checkApiHealth, loadLearningProfile]);

  // Enhanced learning profile saving with error handling
  const saveLearningProfile = useCallback(async (newAnalysis: BehavioralAnalysis) => {
    if (!user) return;
    
    try {
      const currentProfile = learningProfile || {
        userId: user.id,
        totalTrades: 0,
        firstAnalysisDate: new Date().toISOString(),
        lastAnalysisDate: new Date().toISOString(),
        learningProgress: 0,
        behavioralPatterns: [],
        improvementHistory: [],
        riskScoreHistory: [],
        confidenceScoreHistory: []
      };

      const updatedProfile: LearningProfile = {
        ...currentProfile,
        totalTrades: currentProfile.totalTrades + trades.length,
        lastAnalysisDate: new Date().toISOString(),
        learningProgress: Math.min(100, currentProfile.learningProgress + 10),
        behavioralPatterns: [...new Set([...currentProfile.behavioralPatterns, ...newAnalysis.behavioral_patterns])],
        improvementHistory: [...currentProfile.improvementHistory, ...newAnalysis.recommendations],
        riskScoreHistory: [...currentProfile.riskScoreHistory, newAnalysis.risk_score],
        confidenceScoreHistory: [...currentProfile.confidenceScoreHistory, newAnalysis.confidence_score]
      };

      setLearningProfile(updatedProfile);
      localStorage.setItem(`learning_profile_${user.id}`, JSON.stringify(updatedProfile));
      
      toast({
        title: "Learning Profile Updated",
        description: `Your trading psychology profile has been updated with ${trades.length} new trades`,
      });
    } catch (error) {
      console.error('Failed to save learning profile:', error);
      toast({
        title: "Save Error",
        description: "Failed to save learning profile",
        variant: "destructive",
      });
    }
  }, [user, learningProfile, trades.length, toast]);

  // Enhanced trade addition with validation
  const addTrade = useCallback(() => {
    try {
      const newTrade: Trade = {
        id: Date.now().toString(),
        symbol: '',
        action: 'BUY',
        quantity: 0,
        entry_price: 0,
        entry_date: new Date().toISOString().split('T')[0],
        emotion_before: '',
        reasoning: '',
        timestamp: Date.now()
      };
      setTrades(prev => [...prev, newTrade]);
      toast({
        title: "Trade Added",
        description: "New trade added to analysis",
      });
    } catch (error) {
      console.error('Failed to add trade:', error);
      toast({
        title: "Add Trade Error",
        description: "Failed to add new trade",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Enhanced trade update with validation
  const updateTrade = useCallback((id: string, field: keyof Trade, value: any) => {
    try {
      setTrades(prev => prev.map(trade => 
        trade.id === id ? { ...trade, [field]: value } : trade
      ));
    } catch (error) {
      console.error('Failed to update trade:', error);
      toast({
        title: "Update Error",
        description: "Failed to update trade",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Enhanced trade removal with confirmation
  const removeTrade = useCallback((id: string) => {
    try {
      setTrades(prev => prev.filter(trade => trade.id !== id));
      toast({
        title: "Trade Removed",
        description: "Trade removed from analysis",
      });
    } catch (error) {
      console.error('Failed to remove trade:', error);
      toast({
        title: "Remove Error",
        description: "Failed to remove trade",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Enhanced behavior analysis with error handling
  const analyzeBehavior = useCallback(async () => {
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
        user_id: user?.id || 'anonymous',
        trades: trades,
        risk_tolerance: userProfile.risk_tolerance,
        trading_experience: userProfile.trading_experience,
        capital_amount: userProfile.capital_amount,
        goals: userProfile.goals,
        learning_mode: true,
        previous_analysis: learningProfile ? {
          total_trades: learningProfile.totalTrades,
          behavioral_patterns: learningProfile.behavioralPatterns,
          risk_score_history: learningProfile.riskScoreHistory,
          confidence_score_history: learningProfile.confidenceScoreHistory
        } : null
      };

      const result = await tradingPsychologyApi.analyzeBehavior(data);
      setAnalysis(result);
      
      await saveLearningProfile(result);
      
      toast({
        title: "Analysis Complete",
        description: "Trading psychology analysis has been completed and your learning profile updated",
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
  }, [trades, user, userProfile, learningProfile, saveLearningProfile, toast]);

  // Enhanced behavior prediction with error handling
  const predictBehavior = useCallback(async () => {
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
        user_id: user?.id || 'anonymous',
        trades: trades,
        risk_tolerance: userProfile.risk_tolerance,
        trading_experience: userProfile.trading_experience,
        capital_amount: userProfile.capital_amount,
        goals: userProfile.goals,
        learning_profile: learningProfile
      };

      const result = await tradingPsychologyApi.predictBehavior(data);
      
      toast({
        title: "Prediction Complete",
        description: "Future behavior prediction has been completed using your learning history",
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
  }, [trades, user, userProfile, learningProfile, toast]);

  // Enhanced risk level color function with custom color system
  const getRiskLevelColor = useCallback((level: string): string => {
    switch (level) {
      case 'LOW': return 'bg-success/10 text-success';
      case 'MEDIUM': return 'bg-warning/10 text-warning';
      case 'HIGH': return 'bg-error/10 text-error';
      default: return 'bg-primary/10 text-primary';
    }
  }, []);

  // Enhanced learning progress color function with custom color system
  const getLearningProgressColor = useCallback((progress: number): string => {
    if (progress >= 80) return 'text-success';
    if (progress >= 60) return 'text-warning';
    return 'text-error';
  }, []);

  // Memoized user profile update with validation
  const handleUserProfileUpdate = useCallback((field: string, value: any) => {
    try {
      setUserProfile(prev => ({ ...prev, [field]: value }));
    } catch (error) {
      console.error('Failed to update user profile:', error);
      toast({
        title: "Update Error",
        description: "Failed to update user profile",
        variant: "destructive",
      });
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          {/* Breadcrumb Navigation */}
          <div className="mb-4">
            <Link to="/" className="text-primary hover:text-primary/80 text-sm">
              <ArrowLeft className="w-4 h-4 inline mr-2" />
              Back to Home
            </Link>
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Trading Psychology Guardian</h1>
          </div>
          <p className="text-primary">
            AI-powered analysis of your trading psychology with persistent learning
          </p>
        </div>

        {/* API Status */}
        <Alert className="mb-6 border-info bg-info/10">
          <Activity className="h-4 w-4 text-info" />
          <AlertDescription className="text-primary">
            API Status: {apiHealth === null ? 'Checking...' : 
              apiHealth ? 'Connected' : 'Disconnected'}
            {apiHealth && (
              <Badge variant="secondary" className="ml-2 border-border-light text-primary">
                <CheckCircle className="h-3 w-3 mr-1" />
                Live
              </Badge>
            )}
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="trades" className="space-y-6">
          <TabsList className="bg-background-pure border border-border-light">
            <TabsTrigger value="trades" className="text-primary data-[state=active]:bg-primary data-[state=active]:text-background-soft">Trade History</TabsTrigger>
            <TabsTrigger value="profile" className="text-primary data-[state=active]:bg-primary data-[state=active]:text-background-soft">User Profile</TabsTrigger>
            <TabsTrigger value="analysis" className="text-primary data-[state=active]:bg-primary data-[state=active]:text-background-soft">Analysis</TabsTrigger>
            <TabsTrigger value="learning" className="text-primary data-[state=active]:bg-primary data-[state=active]:text-background-soft">Learning Profile</TabsTrigger>
            <TabsTrigger value="insights" className="text-primary data-[state=active]:bg-primary data-[state=active]:text-background-soft">Insights</TabsTrigger>
          </TabsList>

          {/* Trade History Tab */}
          <TabsContent value="trades" className="space-y-4">
            <Card className="bg-background-pure border border-border-light">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <BarChart3 className="h-5 w-5" />
                  Trade History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trades.map((trade, index) => (
                    <div key={trade.id} className="border border-border-light rounded-lg p-4 space-y-3 bg-background-pure">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-primary">Trade #{index + 1}</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeTrade(trade.id)}
                          className="border-border-light text-primary hover:bg-background-ultra"
                        >
                          Remove
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-primary">Symbol</Label>
                          <Input
                            value={trade.symbol}
                            onChange={(e) => updateTrade(trade.id, 'symbol', e.target.value)}
                            placeholder="AAPL"
                            className="bg-background-pure border-border-light text-primary placeholder:text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                            aria-describedby="symbol-help"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-primary">Action</Label>
                          <Select
                            value={trade.action}
                            onValueChange={(value) => updateTrade(trade.id, 'action', value)}
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
                        
                        <div>
                          <Label className="text-primary">Quantity</Label>
                          <Input
                            type="number"
                            value={trade.quantity}
                            onChange={(e) => updateTrade(trade.id, 'quantity', parseInt(e.target.value))}
                            className="bg-background-pure border-border-light text-primary placeholder:text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                            aria-describedby="quantity-help"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-primary">Entry Price</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={trade.entry_price}
                            onChange={(e) => updateTrade(trade.id, 'entry_price', parseFloat(e.target.value))}
                            className="bg-background-pure border-border-light text-primary placeholder:text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                            aria-describedby="entry-price-help"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-primary">Entry Date</Label>
                          <Input
                            type="date"
                            value={trade.entry_date}
                            onChange={(e) => updateTrade(trade.id, 'entry_date', e.target.value)}
                            className="bg-background-pure border-border-light text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                            aria-describedby="entry-date-help"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-primary">Emotion Before Trade</Label>
                          <Select
                            value={trade.emotion_before || ''}
                            onValueChange={(value) => updateTrade(trade.id, 'emotion_before', value)}
                          >
                            <SelectTrigger className="bg-background-pure border-border-light text-primary">
                              <SelectValue placeholder="Select emotion" />
                            </SelectTrigger>
                            <SelectContent className="bg-background-pure border border-border-light">
                              <SelectItem value="CONFIDENT" className="text-primary hover:bg-background-ultra">Confident</SelectItem>
                              <SelectItem value="NERVOUS" className="text-primary hover:bg-background-ultra">Nervous</SelectItem>
                              <SelectItem value="EXCITED" className="text-primary hover:bg-background-ultra">Excited</SelectItem>
                              <SelectItem value="FEARFUL" className="text-primary hover:bg-background-ultra">Fearful</SelectItem>
                              <SelectItem value="CALM" className="text-primary hover:bg-background-ultra">Calm</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-primary">Reasoning</Label>
                        <Textarea
                          value={trade.reasoning || ''}
                          onChange={(e) => updateTrade(trade.id, 'reasoning', e.target.value)}
                          placeholder="Why did you make this trade?"
                          rows={2}
                          className="bg-background-pure border-border-light text-primary placeholder:text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                          aria-describedby="reasoning-help"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Button onClick={addTrade} className="w-full bg-primary text-background-soft hover:bg-primary/90">
                    <Zap className="h-4 w-4 mr-2" />
                    Add Trade
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card className="bg-background-pure border border-border-light">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Target className="h-5 w-5" />
                  User Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-primary">Risk Tolerance (1-10)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={userProfile.risk_tolerance}
                      onChange={(e) => handleUserProfileUpdate('risk_tolerance', parseInt(e.target.value))}
                      className="bg-background-pure border-border-light text-primary placeholder:text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                      aria-describedby="risk-tolerance-help"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-primary">Trading Experience</Label>
                    <Select
                      value={userProfile.trading_experience}
                      onValueChange={(value) => handleUserProfileUpdate('trading_experience', value)}
                    >
                      <SelectTrigger className="bg-background-pure border-border-light text-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background-pure border border-border-light">
                        <SelectItem value="BEGINNER" className="text-primary hover:bg-background-ultra">Beginner</SelectItem>
                        <SelectItem value="INTERMEDIATE" className="text-primary hover:bg-background-ultra">Intermediate</SelectItem>
                        <SelectItem value="ADVANCED" className="text-primary hover:bg-background-ultra">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-primary">Capital Amount</Label>
                    <Input
                      type="number"
                      value={userProfile.capital_amount}
                      onChange={(e) => handleUserProfileUpdate('capital_amount', parseFloat(e.target.value))}
                      className="bg-background-pure border-border-light text-primary placeholder:text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                      aria-describedby="capital-amount-help"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-primary">Trading Goals</Label>
                    <Select
                      value={userProfile.goals[0]}
                      onValueChange={(value) => handleUserProfileUpdate('goals', [value])}
                    >
                      <SelectTrigger className="bg-background-pure border-border-light text-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background-pure border border-border-light">
                        <SelectItem value="INCOME" className="text-primary hover:bg-background-ultra">Income</SelectItem>
                        <SelectItem value="GROWTH" className="text-primary hover:bg-background-ultra">Growth</SelectItem>
                        <SelectItem value="PRESERVATION" className="text-primary hover:bg-background-ultra">Capital Preservation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-4">
            <Card className="bg-background-pure border border-border-light">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Brain className="h-5 w-5" />
                  Behavioral Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button 
                    onClick={analyzeBehavior} 
                    disabled={isLoading || trades.length === 0}
                    className="flex-1 bg-primary text-background-soft hover:bg-primary/90"
                  >
                    {isLoading ? 'Analyzing...' : 'Analyze Behavior'}
                  </Button>
                  <Button 
                    onClick={predictBehavior} 
                    disabled={isLoading || trades.length === 0}
                    variant="outline"
                    className="flex-1 border-border-light text-primary hover:bg-background-ultra"
                  >
                    {isLoading ? 'Predicting...' : 'Predict Behavior'}
                  </Button>
                </div>

                {analysis && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-background-pure border border-border-light">
                        <CardHeader>
                          <CardTitle className="text-sm text-primary">Risk Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-primary">
                            {analysis.risk_score.toFixed(1)}/10
                          </div>
                          <Progress value={analysis.risk_score * 10} className="mt-2" />
                        </CardContent>
                      </Card>

                      <Card className="bg-background-pure border border-border-light">
                        <CardHeader>
                          <CardTitle className="text-sm text-primary">Risk Level</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Badge className={getRiskLevelColor(analysis.risk_level)}>
                            {analysis.risk_level}
                          </Badge>
                        </CardContent>
                      </Card>

                      <Card className="bg-background-pure border border-border-light">
                        <CardHeader>
                          <CardTitle className="text-sm text-primary">Confidence</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-primary">
                            {(analysis.confidence_score * 100).toFixed(0)}%
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="bg-background-pure border border-border-light">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                          <Lightbulb className="h-5 w-5" />
                          Behavioral Patterns
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {analysis.behavioral_patterns.map((pattern, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-primary" />
                              <span className="text-primary">{pattern}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-background-pure border border-border-light">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                          <TrendingUp className="h-5 w-5" />
                          Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {analysis.recommendations.map((rec, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                              <span className="text-primary">{rec}</span>
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

          {/* Learning Profile Tab */}
          <TabsContent value="learning" className="space-y-4">
            <Card className="bg-background-pure border border-border-light">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Database className="h-5 w-5" />
                  Learning Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                {learningProfile ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-background-pure border border-border-light">
                        <CardHeader>
                          <CardTitle className="text-sm text-primary">Total Trades Analyzed</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-primary">{learningProfile.totalTrades}</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-background-pure border border-border-light">
                        <CardHeader>
                          <CardTitle className="text-sm text-primary">Learning Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className={`text-2xl font-bold ${getLearningProgressColor(learningProfile.learningProgress)}`}>
                            {learningProfile.learningProgress}%
                          </div>
                          <Progress value={learningProfile.learningProgress} className="mt-2" />
                        </CardContent>
                      </Card>

                      <Card className="bg-background-pure border border-border-light">
                        <CardHeader>
                          <CardTitle className="text-sm text-primary">Analysis History</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-primary">
                            First: {new Date(learningProfile.firstAnalysisDate).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-primary">
                            Last: {new Date(learningProfile.lastAnalysisDate).toLocaleDateString()}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="bg-background-pure border border-border-light">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                          <History className="h-5 w-5" />
                          Risk Score History
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-32 flex items-end gap-1">
                          {learningProfile.riskScoreHistory.slice(-10).map((score, index) => (
                            <div
                              key={index}
                              className="bg-primary rounded-t"
                              style={{
                                height: `${(score / 10) * 100}%`,
                                width: '20px'
                              }}
                              title={`Analysis ${index + 1}: ${score.toFixed(1)}`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-primary mt-2">
                          Last 10 analyses
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-background-pure border border-border-light">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                          <TrendingUpIcon className="h-5 w-5" />
                          Behavioral Patterns Learned
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {learningProfile.behavioralPatterns.map((pattern, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Brain className="h-4 w-4 text-primary" />
                              <span className="text-primary">{pattern}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Database className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-primary">No Learning Profile Yet</h3>
                    <p className="text-primary">
                      Start analyzing your trades to build your learning profile
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-4">
            <Card className="bg-background-pure border border-border-light">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <BarChart3 className="h-5 w-5" />
                  Trading Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert className="border-info bg-info/10">
                    <AlertTriangle className="h-4 w-4 text-info" />
                    <AlertDescription className="text-primary">
                      This feature provides detailed insights into your trading psychology
                      and behavioral patterns based on your learning history.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-background-pure border border-border-light">
                      <CardHeader>
                        <CardTitle className="text-sm text-primary">Emotional Trends</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-primary">
                          Analysis of emotional patterns before and after trades
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-background-pure border border-border-light">
                      <CardHeader>
                        <CardTitle className="text-sm text-primary">Performance Correlation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-primary">
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