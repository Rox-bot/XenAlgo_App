import React, { useState, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Star, 
  Download, 
  ShoppingCart, 
  Eye, 
  Clock, 
  FileText, 
  CheckCircle,
  AlertCircle,
  Play,
  Users,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { getIndicatorById, type Indicator } from '@/lib/indicators';
import { useAuth } from '@/contexts/AuthContext';
import { paymentService } from '@/lib/payment';
import Navbar from '@/components/layout/Navbar';

export default function IndicatorDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isPurchased, setIsPurchased] = useState(false); // TODO: Check from user purchases
  const [isLoading, setIsLoading] = useState(false);

  // Memoized indicator data
  const indicator = useMemo(() => {
    try {
      return getIndicatorById(id || '');
    } catch (error) {
      console.error('Error fetching indicator:', error);
      return null;
    }
  }, [id]);

  // Memoized currency formatter
  const formatCurrency = useCallback((amount: number) => {
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return `₹${amount}`;
    }
  }, []);

  // Memoized purchase handler
  const handlePurchase = useCallback(async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to purchase this indicator.",
        variant: "destructive",
      });
      return;
    }

    if (!indicator) {
      toast({
        title: "Error",
        description: "Indicator not found.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Create order
      const orderData = await paymentService.createIndicatorOrder({
        indicator_id: indicator.id,
        indicator_name: indicator.name,
        price: indicator.price,
        user_id: user.id,
        user_email: user.email || '',
        user_name: user.user_metadata?.full_name || user.email || '',
      });

      // Initialize payment
      await paymentService.initializeIndicatorPayment(orderData, {
        indicator_id: indicator.id,
        indicator_name: indicator.name,
        price: indicator.price,
        user_id: user.id,
        user_email: user.email || '',
        user_name: user.user_metadata?.full_name || user.email || '',
      });

      toast({
        title: "Payment Initiated",
        description: "Your payment has been initiated successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "Payment failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, indicator, toast]);

  // Memoized add to cart handler
  const handleAddToCart = useCallback(() => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to cart.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Added to Cart",
      description: "Indicator has been added to your cart.",
      variant: "default",
    });
  }, [user, toast]);

  // Memoized download handler
  const handleDownload = useCallback(() => {
    if (!isPurchased) {
      toast({
        title: "Purchase Required",
        description: "Please purchase this indicator first.",
        variant: "destructive",
      });
      return;
    }

    // TODO: Implement actual download
    toast({
      title: "Download Started",
      description: "Your download has started.",
      variant: "default",
    });
  }, [isPurchased, toast]);

  // Memoized star renderer
  const renderStars = useCallback((rating: number) => {
    try {
      return Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-warning fill-current' : 'text-border-light'}`}
        />
      ));
    } catch (error) {
      console.error('Error rendering stars:', error);
      return null;
    }
  }, []);

  if (!indicator) {
    return (
      <div className="min-h-screen bg-background-soft">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4 text-primary">Indicator Not Found</h1>
            <p className="text-primary mb-6">
              The indicator you're looking for doesn't exist.
            </p>
            <Link to="/indicators">
              <Button className="bg-primary text-background-soft hover:bg-primary-light">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Store
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-soft">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/indicators" className="text-primary hover:text-primary-light transition-colors">
            <ArrowLeft className="w-4 h-4 inline mr-2" />
            Back to Store
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {indicator.is_featured && (
                      <Badge variant="default" className="bg-background-pure border border-luxury-gold text-luxury-gold">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {indicator.is_new && (
                      <Badge variant="secondary" className="bg-background-pure border border-success text-success">
                        <Clock className="w-3 h-3 mr-1" />
                        New
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold mb-2 text-primary">{indicator.name}</h1>
                  <p className="text-lg text-primary mb-4">{indicator.short_description}</p>
                  
                  {/* Rating and Stats */}
                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-2">
                      {renderStars(indicator.rating)}
                      <span className="font-medium text-primary">{indicator.rating}</span>
                      <span className="text-primary">({indicator.review_count} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 text-primary">
                      <Users className="w-4 h-4" />
                      {indicator.sales_count} sales
                    </div>
                    <div className="flex items-center gap-2 text-primary">
                      <FileText className="w-4 h-4" />
                      {indicator.file_size}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Image */}
            <div className="mb-6">
              <img
                src={indicator.preview_url}
                alt={indicator.name}
                className="w-full h-64 object-cover rounded-lg border border-border-light"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 bg-background-pure border border-border-light">
                <TabsTrigger value="overview" className="text-primary data-[state=active]:bg-primary data-[state=active]:text-background-soft">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="features" className="text-primary data-[state=active]:bg-primary data-[state=active]:text-background-soft">
                  Features
                </TabsTrigger>
                <TabsTrigger value="installation" className="text-primary data-[state=active]:bg-primary data-[state=active]:text-background-soft">
                  Installation
                </TabsTrigger>
                <TabsTrigger value="reviews" className="text-primary data-[state=active]:bg-primary data-[state=active]:text-background-soft">
                  Reviews
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card className="bg-background-pure border border-border-light">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-primary">Description</h3>
                    <p className="text-primary leading-relaxed">
                      {indicator.description}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="mt-6">
                <Card className="bg-background-pure border border-border-light">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-primary">Key Features</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {indicator.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          <span className="text-primary">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <h3 className="text-xl font-semibold mb-4 text-primary">Requirements</h3>
                    <div className="space-y-2">
                      {indicator.requirements.map((requirement, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-info" />
                          <span className="text-sm text-primary">{requirement}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="installation" className="mt-6">
                <Card className="bg-background-pure border border-border-light">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-primary">Installation Guide</h3>
                    <div className="bg-background-ultra p-4 rounded-lg border border-border-light">
                      <pre className="whitespace-pre-wrap text-sm text-primary">{indicator.installation_guide}</pre>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <h3 className="text-xl font-semibold mb-4 text-primary">Usage Guide</h3>
                    <p className="text-primary leading-relaxed">
                      {indicator.usage_guide}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card className="bg-background-pure border border-border-light">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-primary">Customer Reviews</h3>
                    <p className="text-primary">
                      Reviews will be displayed here once customers start purchasing.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Purchase Card */}
              <Card className="mb-6 bg-background-pure border border-border-light">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {formatCurrency(indicator.price)}
                    </div>
                    {indicator.original_price && (
                      <div className="text-sm text-primary line-through">
                        {formatCurrency(indicator.original_price)}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {isPurchased ? (
                      <Button 
                        onClick={handleDownload} 
                        className="w-full bg-primary text-background-soft hover:bg-primary-light"
                        disabled={isLoading}
                        aria-label="Download indicator"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Download Indicator
                          </>
                        )}
                      </Button>
                    ) : (
                      <>
                        <Button 
                          onClick={handlePurchase} 
                          className="w-full bg-luxury-gold text-primary-deep hover:bg-luxury-goldHover"
                          disabled={isLoading}
                          aria-label="Purchase indicator"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4 mr-2" />
                              Buy Now
                            </>
                          )}
                        </Button>
                        <Button 
                          onClick={handleAddToCart} 
                          variant="outline" 
                          className="w-full bg-background-pure border-primary text-primary hover:bg-background-ultra"
                          disabled={isLoading}
                          aria-label="Add indicator to cart"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      </>
                    )}
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-primary">Instant download after purchase</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-primary">Free updates for 1 year</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-primary">24/7 support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-primary">Money-back guarantee</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Info Card */}
              <Card className="bg-background-pure border border-border-light">
                <CardHeader>
                  <CardTitle className="text-lg text-primary">Indicator Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-primary">Version</span>
                    <span className="font-medium text-primary">{indicator.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary">Last Updated</span>
                    <span className="font-medium text-primary">
                      {new Date(indicator.last_updated).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary">Author</span>
                    <span className="font-medium text-primary">{indicator.author}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary">Category</span>
                    <span className="font-medium text-primary">{indicator.category}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 