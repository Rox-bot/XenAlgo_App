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
  Brain,
  Target,
  BarChart3,
  TrendingUp,
  Calculator,
  BookOpen,
  User,
  LogOut,
  Crown,
  Sparkles,
  Zap,
  FileText,
  Settings,
  Download,
  Play,
  Shield,
  Users,
  Award,
  Home,
  DollarSign,
  ChartBar,
  Heart
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-primary-deep text-background-soft border-b border-border-light/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-luxury-gold to-warning-DEFAULT rounded-xl flex items-center justify-center shadow-glow">
              <Brain className="w-6 h-6 text-primary-deep" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl bg-gradient-to-r from-luxury-gold to-warning-DEFAULT bg-clip-text text-transparent">
                XenAlgo
              </span>
              <span className="text-xs text-background-soft/80">AI Trading Intelligence</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Home */}
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-luxury-gold flex items-center gap-2 ${
                isActive('/') ? 'text-luxury-gold' : 'text-background-soft'
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </Link>

            {/* Market Insights */}
            <Link
              to="/market-insights"
              className={`text-sm font-medium transition-colors hover:text-luxury-gold flex items-center gap-2 ${
                isActive('/market-insights') ? 'text-luxury-gold' : 'text-background-soft'
              }`}
            >
              <FileText className="w-4 h-4" />
              Market Insights
            </Link>

            {/* Courses */}
            <Link
              to="/courses"
              className={`text-sm font-medium transition-colors hover:text-luxury-gold flex items-center gap-2 ${
                isActive('/courses') ? 'text-luxury-gold' : 'text-background-soft'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Courses
            </Link>

            {/* Financial Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium text-background-soft hover:text-luxury-gold hover:bg-primary/20">
                  <Calculator className="w-4 h-4 mr-2" />
                  Tools
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background-pure border border-border-light">
                <DropdownMenuItem asChild>
                  <Link to="/calculators" className="flex items-center gap-2 text-primary hover:text-luxury-gold">
                    <Calculator className="w-4 h-4" />
                    Calculators
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/indicators" className="flex items-center gap-2 text-primary hover:text-luxury-gold">
                    <BarChart3 className="w-4 h-4" />
                    Indicators
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/screeners" className="flex items-center gap-2 text-primary hover:text-luxury-gold">
                    <Target className="w-4 h-4" />
                    Screeners
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/trading-journal" className="flex items-center gap-2 text-primary hover:text-luxury-gold">
                    <ChartBar className="w-4 h-4" />
                    Trading Journal
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* AI Edge */}
            <Link
              to="/ai-edge"
              className={`text-sm font-medium transition-colors hover:text-luxury-gold flex items-center gap-2 ${
                isActive('/ai-edge') ? 'text-luxury-gold' : 'text-background-soft'
              }`}
            >
              <Brain className="w-4 h-4" />
              AI Edge
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-background-soft hover:text-luxury-gold hover:bg-primary/20">
                    <User className="w-4 h-4 mr-2" />
                    {user.email?.split('@')[0]}
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-background-pure border border-border-light">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center gap-2 text-primary hover:text-luxury-gold">
                      <BarChart3 className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2 text-primary hover:text-luxury-gold">
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center gap-2 text-primary hover:text-luxury-gold">
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/subscription" className="flex items-center gap-2 text-primary hover:text-luxury-gold">
                      <Crown className="w-4 h-4" />
                      Subscription
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => signOut()}
                    className="flex items-center gap-2 text-error hover:text-error/80"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" className="text-background-soft hover:text-luxury-gold hover:bg-primary/20">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-luxury-gold text-primary-deep hover:bg-luxury-goldHover">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              className="lg:hidden text-background-soft hover:text-luxury-gold hover:bg-primary/20"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border-light/50 bg-primary-deep">
            <div className="space-y-2">
              <Link
                to="/"
                className={`block px-4 py-2 text-sm font-medium transition-colors hover:text-luxury-gold ${
                  isActive('/') ? 'text-luxury-gold' : 'text-background-soft'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="w-4 h-4 inline mr-2" />
                Home
              </Link>
              <Link
                to="/market-insights"
                className={`block px-4 py-2 text-sm font-medium transition-colors hover:text-luxury-gold ${
                  isActive('/market-insights') ? 'text-luxury-gold' : 'text-background-soft'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Market Insights
              </Link>
              <Link
                to="/courses"
                className={`block px-4 py-2 text-sm font-medium transition-colors hover:text-luxury-gold ${
                  isActive('/courses') ? 'text-luxury-gold' : 'text-background-soft'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BookOpen className="w-4 h-4 inline mr-2" />
                Courses
              </Link>
              <Link
                to="/calculators"
                className={`block px-4 py-2 text-sm font-medium transition-colors hover:text-luxury-gold ${
                  isActive('/calculators') ? 'text-luxury-gold' : 'text-background-soft'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Calculator className="w-4 h-4 inline mr-2" />
                Calculators
              </Link>
              <Link
                to="/ai-edge"
                className={`block px-4 py-2 text-sm font-medium transition-colors hover:text-luxury-gold ${
                  isActive('/ai-edge') ? 'text-luxury-gold' : 'text-background-soft'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Brain className="w-4 h-4 inline mr-2" />
                AI Edge
              </Link>
              
              {user && (
                <>
                  <Link
                    to="/dashboard"
                    className={`block px-4 py-2 text-sm font-medium transition-colors hover:text-luxury-gold ${
                      isActive('/dashboard') ? 'text-luxury-gold' : 'text-background-soft'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BarChart3 className="w-4 h-4 inline mr-2" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm font-medium text-error hover:text-error/80"
                  >
                    <LogOut className="w-4 h-4 inline mr-2" />
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;