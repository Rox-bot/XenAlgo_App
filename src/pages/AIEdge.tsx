import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { 
  Brain, 
  Target, 
  Zap, 
  Play, 
  ArrowRight, 
  CheckCircle, 
  Database, 
  Cpu, 
  Network, 
  Shield, 
  TrendingUp, 
  BarChart3,
  Users,
  Clock,
  Star,
  Award,
  Rocket,
  Globe,
  Sparkles,
  Crown,
  Eye,
  MessageSquare,
  Video,
  FileText,
  Calculator,
  ChartBar,
  Settings,
  Smartphone,
  Monitor,
  Tablet,
  Watch,
  Headphones,
  Camera,
  Mic,
  Code,
  Cloud,
  Wifi,
  Bluetooth,
  Satellite,
  Radar,
  Telescope,
  Microscope,
  Heart as HeartIcon,
  Brain as BrainIcon,
  Eye as EyeIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const AIEdge = () => {
  const [activeFeature, setActiveFeature] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Memoized features data
  const features = useMemo(() => [
    {
      id: 1,
      title: "AI-Powered Market Analysis",
      description: "Advanced machine learning algorithms analyze market patterns, sentiment, and news to predict price movements with 94% accuracy.",
      icon: Brain,
      gradient: 'from-primary to-luxury-gold',
      benefits: [
        "Real-time market sentiment analysis",
        "Multi-timeframe pattern recognition",
        "News impact assessment",
        "Risk-adjusted predictions"
      ],
      stats: {
        accuracy: "94%",
        speed: "0.1ms",
        coverage: "Global markets"
      }
    },
    {
      id: 2,
      title: "Intelligent Trading Signals",
      description: "Get precise entry and exit signals based on AI analysis of multiple technical indicators and market conditions.",
      icon: Target,
      gradient: 'from-success to-primary',
      benefits: [
        "Multi-indicator confirmation",
        "Customizable signal strength",
        "Real-time alerts",
        "Backtested strategies"
      ],
      stats: {
        accuracy: "87%",
        signals: "50+ daily",
        markets: "All major pairs"
      }
    },
    {
      id: 3,
      title: "Portfolio Optimization",
      description: "AI-driven portfolio management that automatically rebalances based on market conditions and risk preferences.",
      icon: TrendingUp,
      gradient: 'from-warning to-luxury-gold',
      benefits: [
        "Dynamic asset allocation",
        "Risk management automation",
        "Performance tracking",
        "Tax optimization"
      ],
      stats: {
        returns: "15% avg",
        risk: "Managed",
        rebalancing: "Auto"
      }
    }
  ], []);

  // Memoized demos data
  const demos = useMemo(() => [
    {
      id: 1,
      title: "AI Market Scanner Demo",
      description: "See how our AI scans thousands of stocks in real-time to find the best opportunities.",
      duration: "2:34",
      views: "15.2K",
      thumbnail: "/images/ai-market-scanner-demo.png"
    },
    {
      id: 2,
      title: "Signal Generation Process",
      description: "Watch our AI analyze multiple indicators and generate precise trading signals.",
      duration: "3:45",
      views: "12.8K",
      thumbnail: "/images/signal-generation-demo.png"
    },
    {
      id: 3,
      title: "Portfolio Optimization Demo",
      description: "Learn how AI optimizes your portfolio for maximum returns with minimal risk.",
      duration: "4:12",
      views: "9.6K",
      thumbnail: "/images/portfolio-optimization-demo.png"
    }
  ], []);

  // Memoized tech stack data
  const techStack = useMemo(() => [
    {
      name: "Machine Learning",
      desc: "Advanced neural networks and deep learning models",
      icon: Brain
    },
    {
      name: "Natural Language Processing",
      desc: "AI-powered news and sentiment analysis",
      icon: MessageSquare
    },
    {
      name: "Real-time Processing",
      desc: "Ultra-fast data processing and analysis",
      icon: Zap
    },
    {
      name: "Cloud Infrastructure",
      desc: "Scalable cloud-based AI processing",
      icon: Cloud
    }
  ], []);

  // Memoized performance metrics
  const performanceMetrics = useMemo(() => [
    { label: "AI Models", value: "50+", icon: Brain, color: "text-primary" },
    { label: "Accuracy", value: "94%", icon: Target, color: "text-success" },
    { label: "Processing Speed", value: "0.1ms", icon: Zap, color: "text-warning" },
    { label: "Data Points", value: "10M+", icon: Database, color: "text-info" }
  ], []);

  // Memoized event handlers
  const handleFeatureClick = useCallback((featureId: number) => {
    try {
      setActiveFeature(featureId);
    } catch (error) {
      console.error('Error updating active feature:', error);
      toast({
        title: "Error",
        description: "Failed to update feature selection. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleStartTrial = useCallback(async () => {
    try {
      setIsLoading(true);
      // Simulate trial start process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Free trial started successfully!",
      });
    } catch (error) {
      console.error('Error starting trial:', error);
      toast({
        title: "Error",
        description: "Failed to start trial. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleWatchDemo = useCallback((demoId: number) => {
    try {
      toast({
        title: "Demo",
        description: `Opening demo ${demoId}...`,
      });
    } catch (error) {
      console.error('Error opening demo:', error);
      toast({
        title: "Error",
        description: "Failed to open demo. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-background-soft">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-6 h-6 bg-primary rounded-full animate-pulse-glow"></div>
        <div className="absolute top-40 right-20 w-4 h-4 bg-luxury-gold rounded-full animate-pulse-glow delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-8 h-8 bg-success rounded-full animate-pulse-glow delay-2000"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-luxury-gold rounded-xl flex items-center justify-center shadow-glow">
                <Brain className="w-6 h-6 text-background-soft" />
              </div>
              <Badge className="bg-background-pure border border-primary text-primary text-lg px-6 py-3">
                <Sparkles className="w-5 h-5 mr-2" />
                AI-Powered Trading
              </Badge>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary-deep via-primary to-luxury-gold bg-clip-text text-transparent">
                The Future of Trading
              </span>
              <br />
              <span className="text-primary">is Here</span>
            </h1>
            
            <p className="text-2xl lg:text-3xl text-primary max-w-5xl mx-auto leading-relaxed">
              Experience the power of artificial intelligence in trading. 
              Our advanced AI systems analyze markets 24/7, providing you with 
              institutional-grade insights and automated trading strategies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-luxury-gold text-primary-deep hover:bg-luxury-goldHover border-0 shadow-glow hover:shadow-glow-strong text-xl px-10 py-6"
                onClick={handleStartTrial}
                disabled={isLoading}
                aria-label="Start free trial"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-primary-deep border-t-transparent rounded-full animate-spin mr-3" />
                ) : (
                  <Rocket className="w-6 h-6 mr-3" />
                )}
                {isLoading ? 'Starting...' : 'Start Free Trial'}
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-background-pure border-primary text-primary hover:bg-background-ultra text-xl px-10 py-6"
                aria-label="Watch demo"
              >
                <Play className="w-6 h-6 mr-3" />
                Watch Demo
              </Button>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12" role="grid" aria-label="Performance metrics">
              {performanceMetrics.map((stat, index) => (
                <div key={index} className="text-center" role="gridcell">
                  <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-primary">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-primary-deep to-luxury-gold bg-clip-text text-transparent">
                AI-Powered Features
              </span>
            </h2>
            <p className="text-xl text-primary max-w-4xl mx-auto">
              Discover how our cutting-edge AI technology revolutionizes your trading experience
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8" role="grid" aria-label="AI features">
            {features.map((feature) => (
              <Card 
                key={feature.id}
                className={`bg-background-pure border border-border-light shadow-medium hover:shadow-large transition-all duration-300 cursor-pointer ${
                  activeFeature === feature.id ? 'ring-2 ring-luxury-gold' : ''
                }`}
                onClick={() => handleFeatureClick(feature.id)}
                role="button"
                tabIndex={0}
                aria-label={`Select ${feature.title} feature`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleFeatureClick(feature.id);
                  }
                }}
              >
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center`}>
                      <feature.icon className="w-8 h-8 text-background-soft" />
                    </div>
                    <div>
                      <Badge className="bg-success text-background-soft mb-2">
                        AI-Powered
                      </Badge>
                      <Badge className="bg-background-pure border border-luxury-gold text-luxury-gold">
                        Premium
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-primary">{feature.title}</CardTitle>
                  <p className="text-primary mt-4">{feature.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          <span className="text-sm text-primary">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <Clock className="w-4 h-4" />
                      Real-time processing
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Videos */}
      <section className="py-20 bg-background-ultra">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-primary-deep to-luxury-gold bg-clip-text text-transparent">
                See AI in Action
              </span>
            </h2>
            <p className="text-xl text-primary max-w-3xl mx-auto">
              Watch our AI systems analyze markets and generate trading signals in real-time
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6" role="grid" aria-label="Demo videos">
            {demos.map((demo) => (
              <Card key={demo.id} className="bg-background-pure border border-border-light shadow-medium hover:shadow-large transition-all duration-300 group">
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-luxury-gold/20 rounded-lg flex items-center justify-center">
                    <Play className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <CardTitle className="text-lg font-bold group-hover:text-luxury-gold transition-colors text-primary">
                    {demo.title}
                  </CardTitle>
                  <p className="text-sm text-primary">{demo.description}</p>
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Clock className="w-4 h-4" />
                    {demo.duration}
                    <Eye className="w-4 h-4 ml-2" />
                    {demo.views}
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-4 w-full bg-background-pure border-primary text-primary hover:bg-background-ultra"
                    onClick={() => handleWatchDemo(demo.id)}
                    aria-label={`Watch ${demo.title} demo`}
                  >
                    Watch Demo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-primary-deep to-luxury-gold bg-clip-text text-transparent">
                Cutting-Edge Technology
              </span>
            </h2>
            <p className="text-xl text-primary max-w-3xl mx-auto">
              Built with the latest AI and machine learning technologies
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" role="grid" aria-label="Technology stack">
            {techStack.map((tech, index) => (
              <Card key={index} className="bg-background-pure border border-border-light shadow-medium text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-luxury-gold rounded-xl flex items-center justify-center mx-auto mb-4">
                    <tech.icon className="w-8 h-8 text-background-soft" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-primary">{tech.name}</h3>
                  <p className="text-sm text-primary">{tech.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-20 bg-background-ultra">
        <div className="container mx-auto px-4">
          <Card className="bg-background-pure border border-border-light shadow-large mb-20">
            <CardHeader>
              <h3 className="text-2xl font-bold text-primary">Performance Metrics</h3>
              <p className="text-primary">Real-time performance of our AI systems</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" role="grid" aria-label="Performance metrics">
                <div className="text-center" role="gridcell">
                  <div className="text-3xl font-bold text-success mb-2">94%</div>
                  <div className="text-sm text-primary">Prediction Accuracy</div>
                  <div className="text-xs text-primary mt-1">Last 30 days</div>
                </div>
                <div className="text-center" role="gridcell">
                  <div className="text-3xl font-bold text-primary mb-2">0.1ms</div>
                  <div className="text-sm text-primary">Processing Speed</div>
                  <div className="text-xs text-primary mt-1">Average latency</div>
                </div>
                <div className="text-center" role="gridcell">
                  <div className="text-3xl font-bold text-warning mb-2">10M+</div>
                  <div className="text-sm text-primary">Data Points</div>
                  <div className="text-xs text-primary mt-1">Processed daily</div>
                </div>
                <div className="text-center" role="gridcell">
                  <div className="text-3xl font-bold text-success mb-2">99.9%</div>
                  <div className="text-sm text-primary">Uptime</div>
                  <div className="text-xs text-primary mt-1">System reliability</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background-pure border border-border-light shadow-large">
            <CardContent className="p-12 text-center">
              <h3 className="text-3xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary-deep to-luxury-gold bg-clip-text text-transparent">
                  Ready to Experience AI Trading?
                </span>
              </h3>
              <p className="text-xl text-primary max-w-3xl mx-auto mb-8">
                Join thousands of traders who have already transformed their trading with AI-powered insights and strategies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-luxury-gold text-primary-deep hover:bg-luxury-goldHover border-0 shadow-glow text-xl px-10 py-6"
                  onClick={handleStartTrial}
                  disabled={isLoading}
                  aria-label="Start free trial"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-primary-deep border-t-transparent rounded-full animate-spin mr-3" />
                  ) : (
                    <Rocket className="w-6 h-6 mr-3" />
                  )}
                  {isLoading ? 'Starting...' : 'Start Free Trial'}
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-background-pure border-primary text-primary hover:bg-background-ultra text-xl px-10 py-6"
                  aria-label="Watch demo"
                >
                  <Play className="w-6 h-6 mr-3" />
                  Watch Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default AIEdge; 