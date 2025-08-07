import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Zap, 
  Sparkles, 
  Crown, 
  Target, 
  TrendingUp, 
  BarChart3, 
  Users, 
  Award, 
  CheckCircle, 
  ArrowRight, 
  Play, 
  Shield, 
  Rocket, 
  Star,
  Clock, 
  Lock,
  Unlock,
  DollarSign,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Product Screenshots Carousel Data
  const productScreenshots = [
    {
      id: 1,
      title: "AI Momentum Scanner",
      description: "Real-time momentum detection with 94% accuracy",
      image: "/images/ai-momentum-scanner.png",
      features: ["Live market scanning", "AI confidence scoring", "Multi-timeframe analysis"]
    },
    {
      id: 2,
      title: "Volume Profile Master",
      description: "Professional volume analysis with support/resistance levels",
      image: "/images/volume-profile-master.png",
      features: ["Volume visualization", "Key level identification", "Breakout alerts"]
    },
    {
      id: 3,
      title: "Neural Network Predictor",
      description: "Advanced AI predictions with confidence scoring",
      image: "/images/neural-network-predictor.png",
      features: ["Neural network analysis", "Price predictions", "Risk assessment"]
    }
  ];

  // Testimonials Data
  const testimonials = [
    {
      id: 1,
      name: "Rajesh Kumar",
      role: "Day Trader",
      company: "Mumbai",
      rating: 5,
      content: "XenAlgo's AI indicators have completely transformed my trading. The accuracy is incredible!",
      trades: 150,
      profit: "2.5L",
      verified: true
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "Swing Trader",
      company: "Delhi",
      rating: 5,
      content: "The volume profile indicator helped me identify key levels I was missing. Game changer!",
      trades: 89,
      profit: "1.8L",
      verified: true
    },
    {
      id: 3,
      name: "Amit Patel",
      role: "Options Trader",
      company: "Bangalore",
      rating: 5,
      content: "Neural network predictions are spot on. My win rate improved from 60% to 85%!",
      trades: 234,
      profit: "4.2L",
      verified: true
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % productScreenshots.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + productScreenshots.length) % productScreenshots.length);
  };

  return (
    <div className="min-h-screen bg-background-soft">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-deep/10 via-primary/5 to-luxury-gold/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary-deep via-primary to-luxury-gold bg-clip-text text-transparent">
                AI-Powered Trading
              </span>
              <br />
              <span className="text-primary">That Actually Works</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-primary leading-relaxed mb-12 max-w-3xl mx-auto">
              Experience institutional-grade indicators powered by artificial intelligence. 
              Join 15,000+ traders who trust XenAlgo for 94% accuracy.
            </p>

            {/* Credibility Metrics */}
            <div className="grid grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">15,000+</div>
                <div className="text-sm text-primary">Active Traders</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-success">94%</div>
                <div className="text-sm text-primary">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-luxury-gold">₹25Cr+</div>
                <div className="text-sm text-primary">Total Profits</div>
                </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-luxury-gold text-primary-deep hover:bg-luxury-goldHover border-0 shadow-glow hover:shadow-glow-strong text-lg px-8 py-4">
                <Link to="/register">
                  <Rocket className="w-6 h-6 mr-3" />
                  Start Free Trial
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-background-pure border-primary text-primary hover:bg-background-ultra text-lg px-8 py-4">
                <Link to="/courses">
                  <Play className="w-6 h-6 mr-3" />
                  Watch Demo
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-6 pt-8">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-success" />
                <span className="text-sm text-primary">30-Day Money Back</span>
                  </div>
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                <span className="text-sm text-primary">Bank-Level Security</span>
                </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-luxury-gold" />
                <span className="text-sm text-primary">Instant Access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Features Section */}
      <section className="py-20 bg-background-pure">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-primary-deep to-luxury-gold bg-clip-text text-transparent">
                AI-Powered Indicators That Actually Work
              </span>
            </h2>
            <p className="text-xl text-primary max-w-3xl mx-auto">
              Stop guessing. Start winning with indicators that learn from market patterns and adapt to changing conditions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                title: "AI Momentum Scanner",
                description: "Detect momentum shifts before they happen with 94% accuracy",
                image: "/images/ai-momentum-scanner.png",
                accuracy: 94,
                users: 1247,
                price: "₹999/month"
              },
              {
                title: "Volume Profile Master",
                description: "Identify key support/resistance levels with institutional precision",
                image: "/images/volume-profile-master.png",
                accuracy: 89,
                users: 892,
                price: "₹799/month"
              },
              {
                title: "Neural Network Predictor",
                description: "Predict market movements with advanced AI algorithms",
                image: "/images/neural-network-predictor.png",
                accuracy: 91,
                users: 567,
                price: "₹1299/month"
              }
            ].map((indicator, index) => (
              <Card key={index} className="bg-background-pure border border-border-light shadow-medium hover:shadow-large transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-luxury-gold/20 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-4xl">📊</div>
                  </div>
                  <CardTitle className="text-xl font-bold text-primary">{indicator.title}</CardTitle>
                  <p className="text-text-cool">{indicator.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-success" />
                        <span className="text-sm font-medium text-text-cool">{indicator.accuracy}% Accuracy</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-text-cool">{indicator.users.toLocaleString()} users</span>
                            </div>
                          </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">{indicator.price}</span>
                      <Button asChild size="sm" className="bg-luxury-gold text-primary-deep hover:bg-luxury-goldHover border-0">
                        <Link to="/indicators">
                          Try Now
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                        </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-background-soft">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-primary-deep to-luxury-gold bg-clip-text text-transparent">
                Real Traders, Real Results
              </span>
            </h2>
            <p className="text-xl text-primary max-w-3xl mx-auto">
              Join thousands of successful traders who have transformed their trading with XenAlgo indicators
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {testimonials.map((testimonial) => (
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
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
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

          {/* Success Metrics */}
          <Card className="bg-background-pure border border-border-light shadow-large">
            <CardContent className="p-12">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                {[
                  { label: "Active Users", value: "15,000+", icon: Users, color: "text-primary" },
                  { label: "Total Profits", value: "₹25Cr+", icon: DollarSign, color: "text-luxury-gold" },
                  { label: "Win Rate", value: "87%", icon: Target, color: "text-success" },
                  { label: "User Rating", value: "4.9/5", icon: Star, color: "text-warning" }
                ].map((metric, index) => (
                  <div key={index}>
                    <div className={`text-4xl font-bold ${metric.color} mb-2`}>
                      {metric.value}
                    </div>
                    <div className="text-sm text-primary">{metric.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-background-pure">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-primary-deep to-luxury-gold bg-clip-text text-transparent">
                Choose Your Plan
              </span>
            </h2>
            <p className="text-xl text-primary max-w-3xl mx-auto">
              Start with our free trial and upgrade when you're ready to scale
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "Free",
                period: "7 days",
                features: [
                  "AI Momentum Scanner",
                  "Basic support",
                  "5 trades per day",
                  "Email alerts"
                ],
                popular: false,
                cta: "Start Free Trial"
              },
              {
                name: "Pro",
                price: "₹999",
                period: "per month",
                features: [
                  "All Starter features",
                  "Volume Profile Master",
                  "Unlimited trades",
                  "Priority support",
                  "Advanced analytics"
                ],
                popular: true,
                cta: "Get Pro Plan"
              },
              {
                name: "Enterprise",
                price: "₹2499",
                period: "per month",
                features: [
                  "All Pro features",
                  "Neural Network Predictor",
                  "Custom indicators",
                  "Dedicated support",
                  "API access",
                  "White-label options"
                ],
                popular: false,
                cta: "Contact Sales"
              }
            ].map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-luxury-gold shadow-glow' : 'border-border-light'} bg-background-pure`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-luxury-gold text-primary-deep px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-primary">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-text-cool">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                        <span className="text-primary">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-luxury-gold text-primary-deep hover:bg-luxury-goldHover' : 'bg-primary text-background-soft hover:bg-primary-light'}`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-deep to-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-background-soft mb-6">
            Ready to Transform Your Trading?
          </h2>
          <p className="text-xl text-background-soft/90 mb-8 max-w-2xl mx-auto">
            Join 15,000+ traders who have already discovered the power of AI-driven trading indicators
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-luxury-gold text-primary-deep hover:bg-luxury-goldHover text-lg px-8 py-4">
              <Link to="/register">
                <Rocket className="w-6 h-6 mr-3" />
                Start Free Trial
                <ArrowRight className="w-6 h-6 ml-3" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-background-soft text-background-soft hover:bg-background-soft/10 text-lg px-8 py-4">
              <Link to="/courses">
                <Play className="w-6 h-6 mr-3" />
                Watch Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-deep text-background-soft py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-luxury-gold to-warning-DEFAULT rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary-deep" />
                </div>
                <span className="font-bold text-xl">XenAlgo</span>
              </div>
              <p className="text-background-soft/80 mb-4">
                AI-powered trading indicators that help you make smarter investment decisions.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-background-soft/80 hover:text-luxury-gold transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-background-soft/80 hover:text-luxury-gold transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-background-soft/80 hover:text-luxury-gold transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-background-soft/80 hover:text-luxury-gold transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-background-soft/80">
                <li><Link to="/indicators" className="hover:text-luxury-gold transition-colors">Features</Link></li>
                <li><Link to="/calculators" className="hover:text-luxury-gold transition-colors">Pricing</Link></li>
                <li><Link to="/courses" className="hover:text-luxury-gold transition-colors">API</Link></li>
                <li><Link to="/market-insights" className="hover:text-luxury-gold transition-colors">Documentation</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-background-soft/80">
                <li><Link to="/about" className="hover:text-luxury-gold transition-colors">About</Link></li>
                <li><Link to="/market-insights" className="hover:text-luxury-gold transition-colors">Blog</Link></li>
                <li><Link to="/careers" className="hover:text-luxury-gold transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-luxury-gold transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-background-soft/80">
                <li><Link to="/help" className="hover:text-luxury-gold transition-colors">Help Center</Link></li>
                <li><Link to="/community" className="hover:text-luxury-gold transition-colors">Community</Link></li>
                <li><Link to="/status" className="hover:text-luxury-gold transition-colors">Status</Link></li>
                <li><Link to="/security" className="hover:text-luxury-gold transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-8 bg-border-light/20" />
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-background-soft/80 text-sm">
              © 2024 XenAlgo. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-background-soft/80 hover:text-luxury-gold transition-colors text-sm">Privacy Policy</Link>
              <Link to="/terms" className="text-background-soft/80 hover:text-luxury-gold transition-colors text-sm">Terms of Service</Link>
              <Link to="/cookies" className="text-background-soft/80 hover:text-luxury-gold transition-colors text-sm">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;