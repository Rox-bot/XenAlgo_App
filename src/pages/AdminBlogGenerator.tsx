import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import {
  TrendingUp,
  FileText,
  Play,
  Download,
  Share2,
  CheckCircle,
  AlertCircle,
  Loader2,
  BarChart3,
  Target,
  RefreshCw,
  Award,
  TrendingDown,
  Activity,
  Zap,
  Crown,
  Star,
  ArrowUp,
  ArrowDown,
  BookOpen,
  GraduationCap,
  Brain,
  Shield,
  Calendar
} from 'lucide-react';
import { generateBlogPost, generateMultipleBlogPosts, type BlogPost, type BlogGenerationRequest } from '@/lib/aiBlogGenerator';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AdminBlogGenerator() {
  const [generatedBlogs, setGeneratedBlogs] = useState<BlogPost[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('trading-education');
  const [blogStyle, setBlogStyle] = useState('professional');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Trading Education Blog Generator State
  const [tradingTopics, setTradingTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [includeMarketing, setIncludeMarketing] = useState(true);
  const [generatedTradingBlog, setGeneratedTradingBlog] = useState<any>(null);
  const [isGeneratingTrading, setIsGeneratingTrading] = useState(false);

  // Memoized default topics
  const defaultTopics = useMemo(() => [
    "Bollinger Bands: Complete Guide to Volatility Trading",
    "MACD Indicator: Master the Momentum Oscillator", 
    "RSI (Relative Strength Index): Overbought and Oversold Signals",
    "Moving Averages: Simple vs Exponential - Which to Use?",
    "Stochastic Oscillator: Timing Your Entries Perfectly",
    "Williams %R: Advanced Momentum Analysis",
    "ADX Indicator: Measuring Trend Strength",
    "Fibonacci Retracements: Golden Ratio in Trading",
    "Support and Resistance: Key Levels Every Trader Must Know",
    "Volume Analysis: The Hidden Market Indicator",
    "Market Psychology: Understanding Fear and Greed",
    "Price Action Trading: Reading Candlestick Patterns",
    "Chart Patterns: Head and Shoulders, Triangles, Flags",
    "Swing Trading Strategies: 5-Day to 2-Week Holds",
    "Day Trading Techniques: Intraday Profit Strategies",
    "Position Sizing: The Key to Long-Term Success",
    "Stop Loss Strategies: Protecting Your Capital",
    "Risk-Reward Ratios: The 1:2 Rule",
    "Options Basics: Calls, Puts, and Strike Prices",
    "Implied Volatility: The Options Trader's Friend"
  ], []);

  // Memoized event handlers
  const loadTradingTopics = useCallback(async () => {
    try {
      const { supabase } = await import('@/integrations/supabase/client')
      
      const { data, error } = await supabase.functions.invoke('get-trading-topics')
      
      if (error) {
        throw error
      }
      
      setTradingTopics(data.topics || [])
      toast({
        title: "Success",
        description: `Loaded ${data.total_topics || 0} trading education topics`,
      });
    } catch (error) {
      console.error('Error loading trading topics:', error)
      // Set default topics on error
      setTradingTopics(defaultTopics)
      toast({
        title: "Info",
        description: "Using default topics while Supabase functions deploy",
      });
    }
  }, [defaultTopics, toast]);

  const handleGenerateTradingEducationBlog = useCallback(async () => {
    if (!selectedTopic) {
      toast({
        title: "Error",
        description: "Please select a topic first",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingTrading(true);
    setError(null);
    
    try {
      const { supabase } = await import('@/integrations/supabase/client')
      
      const { data, error } = await supabase.functions.invoke('generate-trading-blog', {
        body: {
          topic: selectedTopic,
          include_marketing: includeMarketing,
          style: 'professional'
        }
      })

      if (error) {
        throw error
      }

      setGeneratedTradingBlog(data);
      toast({
        title: "Success",
        description: "Trading education blog generated successfully!",
      });
    } catch (error) {
      console.error('Error generating trading education blog:', error);
      setError('Failed to generate blog. Please check your Supabase configuration.');
      toast({
        title: "Error",
        description: "Failed to generate blog. Please check your Supabase configuration.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingTrading(false);
    }
  }, [selectedTopic, includeMarketing, toast]);

  const handleGenerateDailyTradingEducationBlog = useCallback(async () => {
    setIsGeneratingTrading(true);
    setError(null);
    
    try {
      // Get today's topic based on date
      const today = new Date();
      const topicIndex = today.getDate() % tradingTopics.length;
      const todayTopic = tradingTopics[topicIndex];
      
      setSelectedTopic(todayTopic);
      
      const { supabase } = await import('@/integrations/supabase/client')
      
      const { data, error } = await supabase.functions.invoke('generate-trading-blog', {
        body: {
          topic: todayTopic,
          include_marketing: includeMarketing,
          style: 'professional'
        }
      })

      if (error) {
        throw error
      }

      setGeneratedTradingBlog(data);
      toast({
        title: "Success",
        description: `Daily blog generated for: ${todayTopic}`,
      });
    } catch (error) {
      console.error('Error generating daily blog:', error);
      setError('Failed to generate daily blog. Please check your Supabase configuration.');
      toast({
        title: "Error",
        description: "Failed to generate daily blog. Please check your Supabase configuration.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingTrading(false);
    }
  }, [tradingTopics, includeMarketing, toast]);

  const handleTopicChange = useCallback((value: string) => {
    try {
      setSelectedTopic(value);
    } catch (error) {
      console.error('Error updating topic:', error);
      toast({
        title: "Error",
        description: "Failed to update topic selection",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleMarketingToggle = useCallback((checked: boolean) => {
    try {
      setIncludeMarketing(checked);
    } catch (error) {
      console.error('Error updating marketing toggle:', error);
      toast({
        title: "Error",
        description: "Failed to update marketing preference",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Load on component mount
  useEffect(() => {
    loadTradingTopics();
  }, [loadTradingTopics]);

  return (
    <div className="min-h-screen bg-background-soft">
      <Navbar />
      
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">AI Trading Education Blog Generator</h1>
            <p className="text-primary">Generate professional trading education content with AI</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="trading-education" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Trading Education Blog Generator</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trading-education" className="space-y-6">
            <Card className="bg-background-pure border border-border-light">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <BookOpen className="w-5 h-5" />
                  Trading Education Blog Generator
                </CardTitle>
                <CardDescription className="text-primary">
                  Generate educational blogs about trading indicators, strategies, and concepts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Topic Selection */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="topic-select" className="text-sm font-medium text-primary">
                      Select Topic
                    </Label>
                    <Select value={selectedTopic} onValueChange={handleTopicChange}>
                      <SelectTrigger 
                        id="topic-select"
                        className="w-full mt-1 bg-background-pure border-border-light text-primary"
                        aria-describedby="topic-description"
                      >
                        <SelectValue placeholder="Choose a topic..." />
                      </SelectTrigger>
                      <SelectContent className="bg-background-pure border border-border-light">
                        {(tradingTopics || []).map((topic, index) => (
                          <SelectItem key={index} value={topic} className="text-primary hover:bg-background-ultra">
                            {topic}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div id="topic-description" className="sr-only">
                      Select a trading education topic to generate a blog about
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="includeMarketing"
                      checked={includeMarketing}
                      onChange={(e) => handleMarketingToggle(e.target.checked)}
                      className="rounded border-border-light"
                      aria-describedby="marketing-description"
                    />
                    <Label htmlFor="includeMarketing" className="text-sm text-primary">
                      Include marketing content (XenAlgo promotions)
                    </Label>
                    <div id="marketing-description" className="sr-only">
                      Toggle to include or exclude marketing content in the generated blog
                    </div>
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <Alert className="border-error bg-error/10">
                    <AlertCircle className="h-4 w-4 text-error" />
                    <AlertDescription className="text-error">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button 
                    onClick={handleGenerateTradingEducationBlog}
                    disabled={!selectedTopic || isGeneratingTrading}
                    className="flex-1 bg-primary text-background-soft hover:bg-primary-light"
                    aria-label="Generate blog for selected topic"
                  >
                    {isGeneratingTrading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Generate Blog
                      </>
                    )}
                  </Button>

                  <Button 
                    onClick={handleGenerateDailyTradingEducationBlog}
                    disabled={isGeneratingTrading}
                    variant="outline"
                    className="bg-background-pure border-primary text-primary hover:bg-background-ultra"
                    aria-label="Generate daily blog automatically"
                  >
                    {isGeneratingTrading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4 mr-2" />
                        Generate Daily Blog
                      </>
                    )}
                  </Button>
                </div>

                {/* Generated Blog Display */}
                {generatedTradingBlog && (
                  <div className="mt-6 p-4 border border-border-light rounded-lg bg-background-ultra">
                    <h3 className="font-semibold mb-2 text-primary">Generated Blog</h3>
                    <div className="space-y-2 text-sm text-primary">
                      <p><strong>Topic:</strong> {generatedTradingBlog.topic}</p>
                      <p><strong>Generated:</strong> {new Date(generatedTradingBlog.generated_at).toLocaleString()}</p>
                      <p><strong>Marketing:</strong> {generatedTradingBlog.marketing_included ? 'Included' : 'Excluded'}</p>
                    </div>
                    
                    {/* Blog Content */}
                    <div className="mt-4 space-y-4">
                      <div>
                        <h4 className="font-medium text-lg mb-2 text-primary">{generatedTradingBlog.title}</h4>
                        <p className="text-sm text-primary mb-2">{generatedTradingBlog.summary}</p>
                        <div className="flex gap-2 mb-4">
                          {generatedTradingBlog.keywords?.map((keyword: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-background-pure text-primary border-border-light">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-4 text-xs text-primary mb-4">
                          <span>Read time: {generatedTradingBlog.estimated_read_time}</span>
                          {generatedTradingBlog.difficulty_level && (
                            <span>Level: {generatedTradingBlog.difficulty_level}</span>
                          )}
                          {generatedTradingBlog.examples_count && (
                            <span>Examples: {generatedTradingBlog.examples_count}</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Blog Content - Full HTML with embedded CSS */}
                      <div className="border-t border-border-light pt-4">
                        <div 
                          dangerouslySetInnerHTML={{ __html: generatedTradingBlog.content }} 
                          className="blog-content text-primary"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 