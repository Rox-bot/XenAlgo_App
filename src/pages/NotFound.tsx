import React, { useEffect, useCallback } from 'react';
import { useLocation, Link } from "react-router-dom";
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Home, 
  Search, 
  ArrowLeft, 
  AlertTriangle,
  MapPin,
  Navigation,
  HelpCircle
} from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  const { toast } = useToast();

  // Memoized error logging with error handling
  const logError = useCallback(() => {
    try {
      console.error(
        "404 Error: User attempted to access non-existent route:",
        location.pathname
      );
      
      // Show user-friendly error message
      toast({
        title: "Page Not Found",
        description: `The page "${location.pathname}" could not be found.`,
        variant: "destructive",
      });
    } catch (error) {
      console.error('Error logging 404:', error);
    }
  }, [location.pathname, toast]);

  // Memoized navigation suggestions
  const getNavigationSuggestions = useCallback(() => {
    try {
      const suggestions = [
        { name: 'Home', path: '/', icon: Home, description: 'Return to the main page' },
        { name: 'Dashboard', path: '/dashboard', icon: Navigation, description: 'Access your trading dashboard' },
        { name: 'Market Insights', path: '/market-insights', icon: Search, description: 'Browse trading education blogs' },
        { name: 'Indicators', path: '/indicators', icon: MapPin, description: 'Explore trading indicators' },
        { name: 'Calculators', path: '/calculators', icon: HelpCircle, description: 'Use financial calculators' },
      ];
      
      return suggestions.filter(suggestion => suggestion.path !== location.pathname);
    } catch (error) {
      console.error('Error getting navigation suggestions:', error);
      return [];
    }
  }, [location.pathname]);

  useEffect(() => {
    logError();
  }, [logError]);

  return (
    <div className="min-h-screen bg-background-soft">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Main 404 Content */}
          <Card className="bg-background-pure border border-border-light shadow-large">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-12 h-12 text-error" />
                </div>
              </div>
              
              <CardTitle className="text-6xl font-bold text-primary mb-4">
                404
              </CardTitle>
              
              <h2 className="text-2xl font-semibold text-primary mb-4">
                Oops! Page Not Found
              </h2>
              
              <p className="text-primary mb-6 max-w-2xl mx-auto">
                The page you're looking for doesn't exist. It might have been moved, deleted, 
                or you entered the wrong URL. Let's get you back on track!
              </p>
            </CardHeader>
            
            <CardContent className="space-y-8">
              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  className="bg-primary text-background-soft hover:bg-primary-light"
                  aria-label="Return to home page"
                >
                  <Link to="/">
                    <Home className="w-4 h-4 mr-2" />
                    Return to Home
                  </Link>
                </Button>
                
                <Button 
                  variant="outline"
                  className="bg-background-pure border-primary text-primary hover:bg-background-ultra"
                  onClick={() => window.history.back()}
                  aria-label="Go back to previous page"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              </div>

              {/* Error Details */}
              <div className="bg-background-ultra rounded-lg p-4 border border-border-light">
                <h3 className="font-semibold text-primary mb-2">Error Details</h3>
                <p className="text-sm text-primary">
                  <strong>Requested URL:</strong> {location.pathname}
                </p>
                <p className="text-sm text-primary">
                  <strong>Timestamp:</strong> {new Date().toLocaleString()}
                </p>
              </div>

              {/* Navigation Suggestions */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-4">
                  Popular Pages You Might Be Looking For
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getNavigationSuggestions().map((suggestion, index) => (
                    <Card 
                      key={index}
                      className="bg-background-ultra border border-border-light hover:shadow-medium transition-shadow cursor-pointer"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <suggestion.icon className="w-4 h-4 text-primary" />
                          </div>
                          <h4 className="font-semibold text-primary">
                            {suggestion.name}
                          </h4>
                        </div>
                        <p className="text-sm text-primary mb-3">
                          {suggestion.description}
                        </p>
                        <Button 
                          asChild
                          size="sm"
                          variant="outline"
                          className="w-full bg-background-pure border-primary text-primary hover:bg-background-ultra"
                          aria-label={`Navigate to ${suggestion.name}`}
                        >
                          <Link to={suggestion.path}>
                            Visit {suggestion.name}
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Help Section */}
              <div className="bg-background-ultra rounded-lg p-6 border border-border-light">
                <h3 className="text-lg font-semibold text-primary mb-4">
                  Need Help?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-primary mb-2">Contact Support</h4>
                    <p className="text-sm text-primary mb-3">
                      If you believe this is an error, please contact our support team.
                    </p>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="bg-background-pure border-primary text-primary hover:bg-background-ultra"
                      aria-label="Contact support"
                    >
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-primary mb-2">Search Site</h4>
                    <p className="text-sm text-primary mb-3">
                      Use our search to find what you're looking for.
                    </p>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="bg-background-pure border-primary text-primary hover:bg-background-ultra"
                      aria-label="Search the site"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Search Site
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
