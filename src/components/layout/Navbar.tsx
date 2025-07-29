import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Calculator, 
  TrendingUp, 
  BarChart3, 
  BookOpen, 
  AlertTriangle,
  Brain,
  Target,
  FileText,
  User,
  LogOut
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Market ticker data
  const [tickerData, setTickerData] = useState([
    { symbol: 'NIFTY 50', price: '18,234.50', change: '+2.34%', isPositive: true },
    { symbol: 'SENSEX', price: '60,123.75', change: '+1.87%', isPositive: true },
    { symbol: 'BANK NIFTY', price: '42,567.80', change: '-0.92%', isPositive: false },
    { symbol: 'RELIANCE', price: '2,456.30', change: '+1.23%', isPositive: true },
    { symbol: 'TCS', price: '3,789.45', change: '+0.78%', isPositive: true },
    { symbol: 'INFY', price: '1,567.90', change: '-0.45%', isPositive: false },
    { symbol: 'HDFC BANK', price: '1,678.20', change: '+1.56%', isPositive: true },
    { symbol: 'ICICI BANK', price: '987.65', change: '+2.12%', isPositive: true }
  ]);

  // Animate ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerData(prev => {
        const newData = [...prev];
        // Simulate price updates
        newData.forEach(item => {
          const change = (Math.random() - 0.5) * 0.5;
          const currentPrice = parseFloat(item.price.replace(/,/g, ''));
          const newPrice = currentPrice + change;
          const priceChange = ((change / currentPrice) * 100);
          
          item.price = newPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          item.change = `${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}%`;
          item.isPositive = priceChange >= 0;
        });
        return newData;
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      {/* Market Ticker */}
      <div className="bg-primary/5 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center overflow-hidden h-8">
            <div className="flex items-center gap-6 animate-scroll whitespace-nowrap">
              {tickerData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm font-medium">
                  <span className="text-foreground">{item.symbol}</span>
                  <span className="text-muted-foreground">{item.price}</span>
                  <span className={`${item.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {item.change}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">X</span>
            </div>
            <span className="font-bold text-xl">XenAlgo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Home
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium">
                  Financial Tools
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem>
                  <Link to="/calculators" className="w-full">Financial Calculators</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/screeners" className="w-full">Market Screeners</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/indicators" className="w-full">Technical Indicators</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/option-simulator" className="w-full">Option Simulator</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/option-recommender" className="w-full">AI Strategy Recommender</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium">
                  Trading Tools
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem>
                  <Link to="/trading-journal" className="w-full">Trading Journal</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/trading-journal/analytics" className="w-full">Trading Analytics</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/trading-journal/settings" className="w-full">Journal Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/trading-psychology" className="w-full">Trading Psychology</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              to="/courses"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/courses') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Courses
            </Link>

            <Link
              to="/market-insights" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/market-insights') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Market Insights
            </Link>
            <Link 
              to="/charting" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/charting') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Charts
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm font-medium">
                    <User className="mr-2 h-4 w-4" />
                    {user.email}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <Link to="/dashboard" className="w-full">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/trading-journal" className="w-full">Trading Journal</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/trading-journal/settings" className="w-full">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
          </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
          </div>
        </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-4 space-y-4">
              <Link
                to="/"
              className={`block text-sm font-medium transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
            </Link>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Financial Tools</div>
              <div className="pl-4 space-y-2">
                <Link 
                  to="/calculators" 
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Financial Calculators
              </Link>
              <Link
                  to="/screeners" 
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
              >
                  Market Screeners
              </Link>
              <Link
                to="/indicators"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
              >
                  Technical Indicators
              </Link>
              <Link
                  to="/option-simulator" 
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
              >
                  Option Simulator
              </Link>
              <Link
                  to="/option-recommender" 
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  AI Strategy Recommender
                </Link>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Trading Tools</div>
              <div className="pl-4 space-y-2">
                <Link 
                  to="/trading-journal" 
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
              >
                  Trading Journal
              </Link>
              <Link
                  to="/trading-journal/analytics" 
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
              >
                  Trading Analytics
              </Link>
                <Link 
                  to="/trading-journal/settings" 
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Journal Settings
                </Link>
              </div>
            </div>
            
              <Link
                to="/courses"
              className={`block text-sm font-medium transition-colors hover:text-primary ${
                isActive('/courses') ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
              >
                Courses
              </Link>

            <Link 
              to="/market-insights" 
              className={`block text-sm font-medium transition-colors hover:text-primary ${
                isActive('/market-insights') ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Market Insights
            </Link>
            <Link 
              to="/charting" 
              className={`block text-sm font-medium transition-colors hover:text-primary ${
                isActive('/charting') ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Charts
            </Link>
            
            {user && (
              <div className="space-y-2 pt-4 border-t border-border">
              <Link
                to="/dashboard"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
                <Link 
                  to="/trading-journal" 
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Trading Journal
                </Link>
                <Link 
                  to="/trading-journal/settings" 
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Settings
                </Link>
                <button 
                      onClick={() => {
                        signOut();
                    setIsMobileMenuOpen(false);
                      }}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Sign Out
                </button>
              </div>
            )}
            </div>
          </div>
        )}
    </nav>
  );
};

export default Navbar;