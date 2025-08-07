import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  Target, 
  Sparkles, 
  Crown,
  ArrowRight,
  Play,
  Users,
  Award,
  Shield
} from 'lucide-react';

interface AIHeroProps {
  className?: string;
}

export function AIHero({ className }: AIHeroProps) {
  return (
    <div className={`relative min-h-screen neural-pattern ${className}`}>
      {/* Neural Network Background */}
      <div className="absolute inset-0 neural-bg opacity-30"></div>
      
      {/* Floating AI Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-electric-blue rounded-full animate-pulse-glow"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-neon-purple rounded-full animate-pulse-glow delay-1000"></div>
      <div className="absolute bottom-40 left-1/4 w-3 h-3 bg-matrix-green rounded-full animate-pulse-glow delay-2000"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Hero Content */}
          <div className="space-y-8">
            {/* Premium Badge */}
            <div className="flex items-center gap-3">
              <Badge className="glass-dark border-neon-purple/20 text-neon-purple animate-pulse-glow">
                <Crown className="w-3 h-3 mr-1" />
                AI-Powered Platform
              </Badge>
              <Badge variant="secondary" className="glass border-electric-blue/20 text-electric-blue">
                <Users className="w-3 h-3 mr-1" />
                2,847 Elite Traders
              </Badge>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-electric-blue via-neon-purple to-matrix-green bg-clip-text text-transparent">
                  Where AI Meets
                </span>
                <br />
                <span className="text-foreground">Alpha</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Institutional-grade AI trading intelligence for retail traders. 
                Backtested, verified, and profitable strategies powered by advanced machine learning.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="gradient-primary text-white border-0 shadow-glow hover:shadow-glow-strong transition-all duration-300 group"
              >
                <Sparkles className="w-5 h-5 mr-2 group-hover:animate-spin" />
                Activate AI Edge
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="glass-dark border-neon-purple/20 text-neon-purple hover:bg-neon-purple/10"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-8">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-matrix-green" />
                <span className="text-sm text-muted-foreground">Bank-grade Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-gold" />
                <span className="text-sm text-muted-foreground">Verified Results</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-electric-blue" />
                <span className="text-sm text-muted-foreground">95% Win Rate</span>
              </div>
            </div>
          </div>

          {/* Right Side - AI Dashboard Preview */}
          <div className="relative">
            {/* Main Dashboard Card */}
            <Card className="glass-dark border-neon-purple/20 shadow-glow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* AI Status Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-matrix-green rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-matrix-green">AI Active</span>
                    </div>
                    <Badge className="bg-gradient-to-r from-electric-blue to-neon-purple text-white">
                      <Brain className="w-3 h-3 mr-1" />
                      Neural Network
                    </Badge>
                  </div>

                  {/* Live Trading Chart */}
                  <div className="h-32 bg-gradient-to-r from-deep-navy to-charcoal rounded-lg p-4 relative overflow-hidden">
                    <div className="absolute inset-0 neural-pattern opacity-20"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">RELIANCE</span>
                        <span className="text-sm text-matrix-green">+2.45%</span>
                      </div>
                      {/* Simulated Chart Line */}
                      <div className="h-16 flex items-end gap-1">
                        {[20, 25, 30, 28, 35, 40, 38, 42, 45, 48, 50, 52].map((height, i) => (
                          <div 
                            key={i}
                            className="flex-1 bg-gradient-to-t from-electric-blue to-neon-purple rounded-sm"
                            style={{ height: `${height}%` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* AI Analysis */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">AI Confidence</span>
                      <span className="text-sm text-matrix-green font-bold">87%</span>
                    </div>
                    <div className="w-full bg-charcoal rounded-full h-2">
                      <div 
                        className="confidence-high h-2 rounded-full transition-all duration-500"
                        style={{ width: '87%' }}
                      ></div>
                    </div>
                  </div>

                  {/* AI Recommendations */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-electric-blue/10 rounded border border-electric-blue/20">
                      <Target className="w-4 h-4 text-electric-blue" />
                      <span className="text-sm">Strong Buy Signal Detected</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gold/10 rounded border border-gold/20">
                      <Zap className="w-4 h-4 text-gold" />
                      <span className="text-sm">Risk: 2.1% of Portfolio</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Floating Stats Cards */}
            <Card className="absolute -top-4 -left-4 glass-dark border-electric-blue/20 shadow-premium">
              <CardContent className="p-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-electric-blue">₹2.5Cr+</div>
                  <div className="text-xs text-muted-foreground">Trading Volume</div>
                </div>
              </CardContent>
            </Card>

            <Card className="absolute -bottom-4 -right-4 glass-dark border-matrix-green/20 shadow-premium">
              <CardContent className="p-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-matrix-green">95%</div>
                  <div className="text-xs text-muted-foreground">Win Rate</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 