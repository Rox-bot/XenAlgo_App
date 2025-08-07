import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Target, 
  BarChart3, 
  TrendingUp, 
  Zap, 
  Shield,
  Sparkles,
  Crown,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Activity
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
  badge?: string;
  link: string;
  features: string[];
  aiConfidence?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  gradient,
  badge,
  link,
  features,
  aiConfidence
}) => {
  return (
    <Card className="glass-dark border-neon-purple/20 shadow-premium hover:shadow-glow transition-all duration-300 group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${gradient} shadow-glow`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">{title}</CardTitle>
              {badge && (
                <Badge className="mt-1 bg-gradient-to-r from-electric-blue to-neon-purple text-white">
                  {badge}
                </Badge>
              )}
            </div>
          </div>
          {aiConfidence && (
            <div className="text-right">
              <div className="text-sm text-muted-foreground">AI Confidence</div>
              <div className="text-2xl font-bold text-matrix-green">{aiConfidence}%</div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{description}</p>
        
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-matrix-green" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <Link to={link}>
          <Button 
            variant="outline" 
            className="w-full glass-dark border-electric-blue/20 text-electric-blue hover:bg-electric-blue/10 group"
          >
            Explore {title}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export function PremiumFeatures() {
  const features = [
    {
      icon: Brain,
      title: "AI Strategy Recommender",
      description: "Get intelligent option strategy recommendations based on market conditions and your risk profile.",
      gradient: "bg-gradient-to-r from-electric-blue to-neon-purple",
      badge: "AI-Powered",
      link: "/option-recommender",
      features: [
        "Real-time market analysis",
        "Risk-adjusted recommendations",
        "Backtested strategies",
        "Confidence scoring"
      ],
      aiConfidence: 94
    },
    {
      icon: Target,
      title: "Option Simulator",
      description: "Build and test complex option strategies with real-time P&L visualization and Greeks analysis.",
      gradient: "bg-gradient-to-r from-matrix-green to-electric-blue",
      badge: "Advanced",
      link: "/option-simulator",
      features: [
        "Real-time Greeks calculation",
        "P&L visualization",
        "Risk management tools",
        "Strategy comparison"
      ],
      aiConfidence: 89
    },
    {
      icon: BarChart3,
      title: "Trading Analytics",
      description: "Comprehensive performance analysis with AI-powered insights and behavioral pattern recognition.",
      gradient: "bg-gradient-to-r from-gold to-neon-red",
      badge: "Premium",
      link: "/trading-journal/analytics",
      features: [
        "AI performance insights",
        "Behavioral analysis",
        "Risk assessment",
        "Portfolio optimization"
      ],
      aiConfidence: 91
    },
    {
      icon: TrendingUp,
      title: "Market Screeners",
      description: "Find stocks based on technical indicators and fundamental data with AI-powered filtering.",
      gradient: "bg-gradient-to-r from-neon-purple to-matrix-green",
      badge: "Smart",
      link: "/screeners",
      features: [
        "AI-powered filtering",
        "Technical indicators",
        "Fundamental analysis",
        "Custom alerts"
      ],
      aiConfidence: 87
    }
  ];

  return (
    <section className="py-20 neural-pattern">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-6 h-6 text-gold" />
            <Badge className="glass-dark border-gold/20 text-gold">
              Premium Features
            </Badge>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="bg-gradient-to-r from-electric-blue via-neon-purple to-matrix-green bg-clip-text text-transparent">
              AI-Powered
            </span>
            <br />
            <span className="text-foreground">Trading Intelligence</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience institutional-grade trading tools enhanced with artificial intelligence. 
            Every feature is designed to give you the edge in today's markets.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* AI Stats Section */}
        <div className="mt-20">
          <Card className="glass-dark border-electric-blue/20 shadow-glow">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-electric-blue">95%</div>
                  <div className="text-sm text-muted-foreground">Win Rate</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-matrix-green">₹2.5Cr+</div>
                  <div className="text-sm text-muted-foreground">Trading Volume</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-gold">50K+</div>
                  <div className="text-sm text-muted-foreground">Active Traders</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-neon-purple">24/7</div>
                  <div className="text-sm text-muted-foreground">AI Monitoring</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">
              Ready to Experience 
              <span className="bg-gradient-to-r from-electric-blue to-matrix-green bg-clip-text text-transparent"> AI-Powered Trading?</span>
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of elite traders who have already discovered the power of AI-driven trading intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="gradient-primary text-white border-0 shadow-glow hover:shadow-glow-strong transition-all duration-300 group"
              >
                <Sparkles className="w-5 h-5 mr-2 group-hover:animate-spin" />
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="glass-dark border-neon-purple/20 text-neon-purple hover:bg-neon-purple/10"
              >
                <Shield className="w-5 h-5 mr-2" />
                View Security
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 