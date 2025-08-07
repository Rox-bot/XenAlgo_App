import React, { useState } from 'react';
import { Check, Crown, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { SUBSCRIPTION_TIERS } from '@/lib/subscription';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { PaymentModal } from './PaymentModal';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: string;
}

interface FeatureItem {
  name: string;
  free: boolean;
  premium: boolean;
  pro: boolean;
}

export function UpgradeModal({ open, onOpenChange, feature }: UpgradeModalProps) {
  const { subscription } = useSubscription();
  const currentTier = subscription?.tier || 'free';
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>('');

  const features: FeatureItem[] = [
    { name: 'Trading Journal', free: true, premium: true, pro: true },
    { name: 'Basic Analytics', free: true, premium: true, pro: true },
    { name: 'Financial Calculators', free: true, premium: true, pro: true },
    { name: 'Basic Indicators', free: true, premium: true, pro: true },
    { name: '15 Trades/Month', free: true, premium: false, pro: false },
    { name: '100 Trades/Month', free: false, premium: true, pro: false },
    { name: 'Unlimited Trades', free: false, premium: false, pro: true },
    { name: 'Trade Categories', free: false, premium: true, pro: true },
    { name: 'Advanced Analytics', free: false, premium: true, pro: true },
    { name: 'Export Data', free: false, premium: true, pro: true },
    { name: 'Priority Support', free: false, premium: true, pro: true },
    { name: 'Custom Reports', free: false, premium: true, pro: true },
    { name: 'API Access', free: false, premium: true, pro: true },
    { name: 'Community Access', free: false, premium: true, pro: true },
    { name: 'White Label', free: false, premium: false, pro: true },
    { name: 'Custom Integrations', free: false, premium: false, pro: true },
  ];

  const handleUpgrade = (tierId: string) => {
    if (tierId === 'free') return;
    
    setSelectedTier(tierId);
    setShowPaymentModal(true);
  };

  const getFeatureIcon = (tier: string, hasFeature: boolean) => {
    if (!hasFeature) return null;
    
    switch (tier) {
      case 'free':
        return <Check className="h-4 w-4 text-success" />;
      case 'premium':
        return <Zap className="h-4 w-4 text-info" />;
      case 'pro':
        return <Crown className="h-4 w-4 text-luxury-gold" />;
      default:
        return <Check className="h-4 w-4 text-success" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-background-pure border border-border-light">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-primary">
            {feature ? `Upgrade to access ${feature}` : 'Choose Your Plan'}
          </DialogTitle>
          <DialogDescription className="text-center text-text-cool">
            Select the perfect plan for your trading needs
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          {Object.entries(SUBSCRIPTION_TIERS).map(([tierId, tier]) => (
            <div
              key={tierId}
              className={`relative rounded-lg border-2 p-6 bg-background-pure ${
                currentTier === tierId
                  ? 'border-primary bg-primary/5'
                  : 'border-border-light hover:border-primary/50'
              }`}
            >
              {currentTier === tierId && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-success text-background-soft">
                  Current Plan
                </Badge>
              )}
              
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-primary">{tier.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-primary">₹{tier.price}</span>
                  <span className="text-text-cool">/month</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {features.map((featureItem) => {
                  const hasFeature = featureItem[tierId as keyof FeatureItem] as boolean;
                  return (
                    <div key={featureItem.name} className="flex items-center gap-2">
                      {getFeatureIcon(tierId, hasFeature)}
                      <span className={`text-sm ${hasFeature ? 'text-primary' : 'text-text-cool line-through'}`}>
                        {featureItem.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              <Button
                className="w-full"
                variant={currentTier === tierId ? 'outline' : 'default'}
                disabled={currentTier === tierId}
                onClick={() => handleUpgrade(tierId)}
              >
                {currentTier === tierId ? 'Current Plan' : 'Upgrade'}
              </Button>
            </div>
          ))}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-border-light text-primary hover:bg-background-ultra">
            Maybe Later
          </Button>
          <div className="text-sm text-text-cool text-center sm:text-left">
            All plans include a 7-day free trial. Cancel anytime.
          </div>
        </DialogFooter>
      </DialogContent>
      
      {/* Payment Modal */}
      <PaymentModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        selectedTier={selectedTier}
      />
    </Dialog>
  );
} 