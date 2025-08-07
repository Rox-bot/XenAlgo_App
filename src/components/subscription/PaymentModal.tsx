import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { paymentService } from '@/lib/payment';
import { toast } from 'sonner';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTier: string;
}

interface TierInfo {
  id: string;
  name: string;
  price: number;
  features: string[];
  color: string;
  icon: React.ReactNode;
}

const TIER_INFO: Record<string, TierInfo> = {
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 999,
    features: [
      'Unlimited Trades',
      'Trade Categories',
      'Advanced Analytics',
      'Export Data',
      'Priority Support',
      'Community Access'
    ],
    color: 'bg-info',
    icon: <Zap className="h-6 w-6" />
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 1999,
    features: [
      'Everything in Premium',
      'White Label',
      'Custom Integrations',
      'API Access',
      'Dedicated Support',
      'Custom Reports'
    ],
    color: 'bg-luxury-gold',
    icon: <Crown className="h-6 w-6" />
  }
};

export function PaymentModal({ open, onOpenChange, selectedTier }: PaymentModalProps) {
  const { user } = useAuth();
  const { subscription, refetch } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const tierInfo = TIER_INFO[selectedTier];
  
  if (!tierInfo) {
    return null;
  }

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please log in to continue');
      return;
    }

    setIsProcessing(true);

    try {
      // Create order
      const orderData = await paymentService.createOrder({
        tier_id: selectedTier,
        price: tierInfo.price,
        user_id: user.id,
        user_email: user.email || '',
        user_name: user.user_metadata?.full_name || user.email || '',
      });

      // Initialize payment
      await paymentService.initializePayment(orderData, {
        tier_id: selectedTier,
        tier_name: tierInfo.name,
        user_id: user.id,
        name: user.user_metadata?.full_name || user.email || '',
        email: user.email || '',
      });

      // Refresh subscription data
      await refetch();
      
      toast.success('Payment processed successfully!');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-background-pure border border-border-light">
        <DialogHeader>
          <DialogTitle className="text-center text-primary">Upgrade to {tierInfo.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Tier Card */}
          <Card className="border-2 border-primary bg-background-pure">
            <CardHeader className="text-center pb-4">
              <div className={`mx-auto w-12 h-12 rounded-full ${tierInfo.color} flex items-center justify-center text-background-soft mb-4`}>
                {tierInfo.icon}
              </div>
              <CardTitle className="text-xl text-primary">{tierInfo.name}</CardTitle>
              <div className="text-3xl font-bold text-primary">
                {formatCurrency(tierInfo.price)}
                <span className="text-sm font-normal text-text-cool">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tierInfo.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-success flex-shrink-0" />
                    <span className="text-sm text-primary">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Current Plan */}
          {subscription && (
            <div className="text-center p-4 bg-background-ultra rounded-lg border border-border-light">
              <p className="text-sm text-text-cool">Current Plan</p>
              <Badge variant="outline" className="mt-1 bg-background-pure text-primary border-border-light">
                {subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)}
              </Badge>
            </div>
          )}

          {/* Payment Button */}
          <Button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-primary text-background-soft hover:bg-primary-light"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ${formatCurrency(tierInfo.price)}`
            )}
          </Button>

          {/* Security Notice */}
          <div className="text-center text-xs text-text-cool">
            <p>🔒 Secure payment powered by Razorpay</p>
            <p>Your payment information is encrypted and secure</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 