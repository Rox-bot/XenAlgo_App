import React from 'react';
import { Crown, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { UpgradeModal } from './UpgradeModal';
import { useState } from 'react';

export function SubscriptionStatus() {
  const { subscription, currentUsage, getLimit, isUnlimited, hasFeature } = useSubscription();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  if (!subscription) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <span className="text-sm">Loading subscription...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const monthlyLimit = getLimit('monthlyTrades');
  const categoryLimit = getLimit('tradeCategories');
  const isUnlimitedTrades = isUnlimited('monthlyTrades');
  const isUnlimitedCategories = isUnlimited('tradeCategories');

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            Subscription Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{subscription.tier.toUpperCase()} Plan</p>
              <p className="text-sm text-muted-foreground">
                Status: <Badge variant="default">{subscription.status}</Badge>
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowUpgradeModal(true)}>
              Upgrade
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Monthly Trades</h4>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{currentUsage.monthlyTrades}</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-lg font-bold">
                  {isUnlimitedTrades ? '∞' : monthlyLimit}
                </span>
                {currentUsage.monthlyTrades >= monthlyLimit && !isUnlimitedTrades && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Categories</h4>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{currentUsage.categories}</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-lg font-bold">
                  {isUnlimitedCategories ? '∞' : categoryLimit}
                </span>
                {currentUsage.categories >= categoryLimit && !isUnlimitedCategories && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Features</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                {hasFeature('tradeCategories') ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span>Trade Categories</span>
              </div>
              <div className="flex items-center gap-2">
                {hasFeature('advancedAnalytics') ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span>Advanced Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                {hasFeature('exportData') ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span>Export Data</span>
              </div>
              <div className="flex items-center gap-2">
                {hasFeature('prioritySupport') ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span>Priority Support</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
      />
    </>
  );
} 