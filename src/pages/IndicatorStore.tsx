import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Star, 
  Download, 
  Eye, 
  Lock,
  Unlock,
  Sparkles,
  Zap,
  Brain,
  Target,
  TrendingUp,
  BarChart3,
  Crown,
  ArrowRight,
  Play,
  Users,
  Award,
  CheckCircle,
  Clock,
  Filter,
  Grid3X3,
  List,
  Quote,
  Star as StarIcon,
  Shield,
  Rocket,
  Globe,
  Activity,
  TrendingDown,
  DollarSign,
  Percent,
  Calendar,
  MessageSquare,
  ThumbsUp,
  Heart,
  Eye as EyeIcon,
  Download as DownloadIcon,
  Share2,
  Bookmark,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';

// Sample indicator data with subscription tiers
const FEATURED_INDICATORS = [
  {
    id: '1',
    name: 'AI Momentum Scanner',
    description: 'Advanced AI-powered momentum detection with 94% accuracy. Identifies stocks with strong momentum before they break out.',
    shortDescription: 'AI-powered momentum detection with 94% accuracy',
    category: 'AI-Powered',
    access: 'premium',
    image: '/images/ai-momentum-scanner.png',
    features: [
      'Real-time momentum analysis',
      'AI confidence scoring',
      'Multi-timeframe signals',
      'Custom alert system'
    ],
    accuracy: 94,
    users: 1247,
    rating: 4.8,
    reviews: 156,
    isNew: false,
    isFeatured: true,
    price: '₹999/month',
    originalPrice: '₹1499/month',
    discount: '33% OFF'
  },
  {
    id: '2',
    name: 'Volume Profile Master',
    description: 'Professional volume profile analysis with support/resistance identification. Essential for institutional-level trading.',
    shortDescription: 'Professional volume profile analysis',
    category: 'Technical',
    access: 'premium',
    image: '/images/volume-profile-master.png',
    features: [
      'Volume profile visualization',
      'Support/resistance levels',
      'Volume-based signals',
      'Multi-timeframe analysis'
    ],
    accuracy: 89,
    users: 892,
    rating: 4.7,
    reviews: 98,
    isNew: false,
    isFeatured: true,
    price: '₹799/month',
    originalPrice: '₹1199/month',
    discount: '33% OFF'
  },
  {
    id: '3',
    name: 'Neural Network Predictor',
    description: 'Cutting-edge neural network technology that predicts price movements with 91% accuracy. Uses advanced machine learning algorithms.',
    shortDescription: 'Neural network price prediction',
    category: 'AI-Powered',
    access: 'premium',
    image: '/images/neural-network-predictor.png',
    features: [
      'Neural network analysis',
      'Price prediction models',
      'Confidence scoring',
      'Real-time updates'
    ],
    accuracy: 91,
    users: 567,
    rating: 4.9,
    reviews: 67,
    isNew: true,
    isFeatured: true,
    price: '₹1299/month',
    originalPrice: '₹1999/month',
    discount: '35% OFF'
  }
];

const TESTIMONIALS = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Professional Trader",
    company: "Mumbai",
    avatar: "/images/avatar-1.png",
    rating: 5,
    content: "The AI Momentum Scanner has completely transformed my trading. I've seen a 40% improvement in my win rate since using it. The accuracy is incredible!",
    trades: 150,
    profit: "₹2.5L+",
    verified: true
  },
  {
    id: 2,
    name: "Priya Patel",
    role: "Day Trader",
    company: "Delhi",
    avatar: "/images/avatar-2.png",
    rating: 5,
    content: "XenAlgo's indicators are game-changing. The Volume Profile Master helped me identify key levels I was missing. My portfolio is up 65% this year!",
    trades: 89,
    profit: "₹1.8L+",
    verified: true
  },
  {
    id: 3,
    name: "Aman Kumar",
    role: "Swing Trader",
    company: "Bangalore",
    avatar: "/images/avatar-3.png",
    rating: 5,
    content: "The Neural Network Predictor is like having a crystal ball. It predicted the recent market moves with incredible accuracy. Worth every penny!",
    trades: 234,
    profit: "₹4.2L+",
    verified: true
  },
  {
    id: 4,
    name: "Sameera Bhatnagar",
    role: "Options Trader",
    company: "Chennai",
    avatar: "/images/avatar-4.png",
    rating: 5,
    content: "I've tried many indicators, but XenAlgo's AI-powered tools are in a league of their own. The confidence scoring is spot on!",
    trades: 176,
    profit: "₹3.1L+",
    verified: true
  }
];

const STATS = [
  { label: "Active Users", value: "15,000+", icon: Users, color: "text-primary" },
  { label: "Win Rate", value: "87%", icon: Target, color: "text-success" },
  { label: "Total Profit", value: "₹25Cr+", icon: DollarSign, color: "text-luxury-gold" },
  { label: "Accuracy", value: "94%", icon: Award, color: "text-warning" }
];

const SUBSCRIPTION_PLANS = [
  {
    name: "Starter",
    price: "₹499",
    period: "/month",
    description: "Perfect for beginners",
    features: [
      "5 Premium Indicators",
      "Basic AI Analysis",
      "Email Support",
      "Mobile App Access"
    ],
    popular: false,
    badge: null
  },
  {
    name: "Professional",
    price: "₹999",
    period: "/month",
    description: "For serious traders",
    features: [
      "All Premium Indicators",
      "Advanced AI Analysis",
      "Priority Support",
      "Custom Alerts",
      "API Access"
    ],
    popular: true,
    badge: "Most Popular"
  },
  {
    name: "Elite",
    price: "₹1999",
    period: "/month",
    description: "For institutional traders",
    features: [
      "All Premium Indicators",
      "Custom AI Models",
      "24/7 Support",
      "White Label Options",
      "Dedicated Account Manager"
    ],
    popular: false,
    badge: "Enterprise"
  }
];

export default function IndicatorStore() {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const { toast } = useToast();
  const [selectedIndicator, setSelectedIndicator] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  const isPremiumUser = subscription?.tier === 'premium' || subscription?.tier === 'elite';

  // Memoized premium user check
  const premiumStatus = useMemo(() => ({
    isPremium: isPremiumUser,
    tier: subscription?.tier || 'free'
  }), [isPremiumUser, subscription?.tier]);

  // Memoized indicator access handler
  const handleGetAccess = useCallback(async (indicator: any) => {
    try {
      setIsLoading(true);
      
      if (indicator.access === 'premium' && !premiumStatus.isPremium) {
        toast({
          title: "Premium Required",
          description: "This indicator requires a premium subscription.",
          variant: "destructive",
        });
        return;
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Access Granted",
        description: `You now have access to ${indicator.name}`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error granting access:', error);
      toast({
        title: "Error",
        description: "Failed to grant access. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [premiumStatus.isPremium, toast]);

  // Memoized indicator card renderer
  const renderIndicatorCard = useCallback((indicator: any) => (
    <Card 
      key={indicator.id} 
      className="bg-background-pure border border-border-light shadow-medium hover:shadow-large transition-all duration-300 group cursor-pointer"
      onClick={() => setSelectedIndicator(indicator)}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${indicator.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setSelectedIndicator(indicator);
        }
      }}
    >
      <CardHeader className="pb-4">
        <div className="relative">
          <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-luxury-gold/20 rounded-lg flex items-center justify-center">
            <div className="text-6xl">📊</div>
          </div>
          
          {/* Access Badge */}
          <div className="absolute top-3 left-3">
            {indicator.access === 'premium' ? (
              <Badge className="bg-background-pure border border-luxury-gold text-luxury-gold">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            ) : (
              <Badge className="bg-background-pure border border-success text-success">
                <Unlock className="w-3 h-3 mr-1" />
                Free
              </Badge>
            )}
          </div>

          {/* Discount Badge */}
          {indicator.discount && (
            <Badge className="absolute top-3 right-3 bg-gradient-to-r from-error to-luxury-gold text-background-soft">
              {indicator.discount}
            </Badge>
          )}

          {/* New Badge */}
          {indicator.isNew && (
            <Badge className="absolute bottom-3 right-3 bg-gradient-to-r from-primary to-success text-background-soft">
              <Sparkles className="w-3 h-3 mr-1" />
              New
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg font-bold group-hover:text-luxury-gold transition-colors text-primary">
                {indicator.name}
              </CardTitle>
              <p className="text-sm text-primary mt-1">
                {indicator.shortDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-primary">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {indicator.users.toLocaleString()}
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-warning fill-current" />
            {indicator.rating}
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3 text-success" />
            {indicator.accuracy}%
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">
            {indicator.price}
          </span>
          {indicator.originalPrice && (
            <span className="text-sm text-primary line-through">
              {indicator.originalPrice}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Features */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-primary">Key Features</h4>
            <div className="space-y-1">
              {indicator.features.slice(0, 3).map((feature: string, index: number) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <CheckCircle className="w-3 h-3 text-success" />
                  <span className="text-primary">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Access Button */}
          <Button 
            className={`w-full ${
              indicator.access === 'premium' && !premiumStatus.isPremium
                ? 'bg-background-pure border border-luxury-gold text-luxury-gold hover:bg-background-ultra'
                : 'bg-luxury-gold text-primary-deep hover:bg-luxury-goldHover border-0 shadow-glow hover:shadow-glow-strong'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleGetAccess(indicator);
            }}
            disabled={isLoading}
            aria-label={`Get access to ${indicator.name}`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : indicator.access === 'premium' && !premiumStatus.isPremium ? (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Upgrade Required
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Get Access
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  ), [premiumStatus.isPremium, handleGetAccess, isLoading]);

  return (
    <div className="min-h-screen bg-background-soft">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Zap className="w-8 h-8 text-primary" />
              <Badge className="bg-background-pure border border-primary text-primary text-lg px-4 py-2">
                Premium Indicators
              </Badge>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary-deep via-primary to-luxury-gold bg-clip-text text-transparent">
                AI-Powered
              </span>
              <br />
              <span className="text-primary">Trading Indicators</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-primary max-w-4xl mx-auto">
              Experience institutional-grade trading indicators powered by artificial intelligence. 
              Join 15,000+ traders who trust XenAlgo for 94% accuracy and ₹25Cr+ in profits.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-luxury-gold text-primary-deep hover:bg-luxury-goldHover border-0 shadow-glow hover:shadow-glow-strong text-lg px-8 py-4"
                aria-label="Start free trial for premium indicators"
              >
                <Sparkles className="w-6 h-6 mr-3" />
                Start Free Trial
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-background-pure border-primary text-primary hover:bg-background-ultra text-lg px-8 py-4"
                aria-label="Watch demo of indicators"
              >
                <Play className="w-6 h-6 mr-3" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {STATS.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-primary">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Featured Indicators */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-primary-deep to-luxury-gold bg-clip-text text-transparent">
              Featured Indicators
            </span>
          </h2>
          <p className="text-xl text-primary max-w-3xl mx-auto">
            Our most popular AI-powered indicators trusted by thousands of traders worldwide
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {FEATURED_INDICATORS.map(indicator => renderIndicatorCard(indicator))}
        </div>

        {/* Testimonials */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-primary-deep to-luxury-gold bg-clip-text text-transparent">
              What Traders Say
            </span>
          </h2>
          <p className="text-xl text-primary max-w-3xl mx-auto">
            Join thousands of successful traders who have transformed their trading with XenAlgo
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {TESTIMONIALS.map((testimonial) => (
            <Card key={testimonial.id} className="bg-background-pure border border-border-light shadow-medium">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-luxury-gold rounded-full flex items-center justify-center">
                    <span className="text-background-soft font-bold">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-primary">{testimonial.name}</h3>
                      {testimonial.verified && (
                        <Badge className="bg-success text-background-soft text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-primary mb-3">{testimonial.role} • {testimonial.company}</p>
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <StarIcon key={i} className="w-4 h-4 text-warning fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-primary mb-3">"{testimonial.content}"</p>
                    <div className="flex items-center gap-4 text-xs text-primary">
                      <span>{testimonial.trades} trades</span>
                      <span>₹{testimonial.profit} profit</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Subscription Plans */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-primary-deep to-luxury-gold bg-clip-text text-transparent">
              Choose Your Plan
            </span>
          </h2>
          <p className="text-xl text-primary max-w-3xl mx-auto">
            Start with our free trial and upgrade as you grow
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {SUBSCRIPTION_PLANS.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative bg-background-pure border border-border-light ${
                plan.popular 
                  ? 'border-luxury-gold/20 shadow-glow' 
                  : 'border-border-light'
              }`}
            >
              {plan.badge && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-luxury-gold to-primary text-primary-deep">
                  {plan.badge}
                </Badge>
              )}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-primary">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-primary">{plan.period}</span>
                </div>
                <p className="text-sm text-primary">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-sm text-primary">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-luxury-gold text-primary-deep border-0 shadow-glow hover:bg-luxury-goldHover' 
                      : 'bg-background-pure border-primary text-primary hover:bg-background-ultra'
                  }`}
                  aria-label={`Choose ${plan.name} plan`}
                >
                  {plan.popular ? 'Get Started' : 'Choose Plan'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="bg-background-pure border border-border-light shadow-glow">
          <CardContent className="p-12 text-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-primary-deep to-luxury-gold bg-clip-text text-transparent">
                  Ready to Transform Your Trading?
                </span>
              </h3>
              <p className="text-xl text-primary max-w-2xl mx-auto">
                Join 15,000+ traders who have already discovered the power of AI-powered indicators. 
                Start your free trial today and see the difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-luxury-gold text-primary-deep border-0 shadow-glow text-lg px-8 py-4 hover:bg-luxury-goldHover"
                  aria-label="Start free trial for premium indicators"
                >
                  <Rocket className="w-6 h-6 mr-3" />
                  Start Free Trial
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-background-pure border-primary text-primary text-lg px-8 py-4 hover:bg-background-ultra"
                  aria-label="Contact sales team"
                >
                  <MessageSquare className="w-6 h-6 mr-3" />
                  Talk to Sales
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Indicator Detail Modal */}
      {selectedIndicator && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background-pure border border-border-light shadow-glow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-2xl font-bold text-primary">{selectedIndicator.name}</CardTitle>
                    {selectedIndicator.access === 'premium' ? (
                      <Badge className="bg-background-pure border border-luxury-gold text-luxury-gold">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    ) : (
                      <Badge className="bg-background-pure border border-success text-success">
                        <Unlock className="w-3 h-3 mr-1" />
                        Free
                      </Badge>
                    )}
                  </div>
                  <p className="text-primary">{selectedIndicator.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIndicator(null)}
                  className="text-primary hover:text-primary hover:bg-background-ultra"
                  aria-label="Close modal"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gradient-to-br from-primary/10 to-luxury-gold/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{selectedIndicator.accuracy}%</div>
                  <div className="text-xs text-primary">Accuracy</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-success/10 to-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-success">{selectedIndicator.users.toLocaleString()}</div>
                  <div className="text-xs text-primary">Users</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-warning/10 to-luxury-gold/10 rounded-lg">
                  <div className="text-2xl font-bold text-warning">{selectedIndicator.rating}</div>
                  <div className="text-xs text-primary">Rating</div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="text-lg font-semibold mb-3 text-primary">Features</h4>
                <div className="grid grid-cols-1 gap-2">
                  {selectedIndicator.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-sm text-primary">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <Button 
                className={`w-full ${
                  selectedIndicator.access === 'premium' && !premiumStatus.isPremium
                    ? 'bg-background-pure border border-luxury-gold text-luxury-gold hover:bg-background-ultra'
                    : 'bg-luxury-gold text-primary-deep border-0 shadow-glow hover:bg-luxury-goldHover'
                }`}
                onClick={() => {
                  handleGetAccess(selectedIndicator);
                  setSelectedIndicator(null);
                }}
                disabled={isLoading}
                aria-label={`Get access to ${selectedIndicator.name}`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : selectedIndicator.access === 'premium' && !premiumStatus.isPremium ? (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Upgrade Required
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Get Access
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 