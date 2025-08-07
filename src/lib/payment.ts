import { supabase } from '@/integrations/supabase/client';

export interface PaymentOptions {
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
}

export interface SubscriptionData {
  tier_id: string;
  price: number;
  user_id: string;
  user_email: string;
  user_name: string;
}

export interface IndicatorPurchaseData {
  indicator_id: string;
  indicator_name: string;
  price: number;
  user_id: string;
  user_email: string;
  user_name: string;
}

export class RazorpayPaymentService {
  private razorpay: any;

  constructor() {
    this.initializeRazorpay();
  }

  private initializeRazorpay() {
    // Load Razorpay script dynamically
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      this.razorpay = (window as any).Razorpay;
    };
  }

  // Create order on Supabase Edge Function
  async createOrder(subscriptionData: SubscriptionData): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount: subscriptionData.price * 100, // Convert to paise
          currency: 'INR',
          receipt: `order_${Date.now()}`,
          notes: {
            tier_id: subscriptionData.tier_id,
            user_id: subscriptionData.user_id,
          },
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Create indicator purchase order
  async createIndicatorOrder(purchaseData: IndicatorPurchaseData): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount: purchaseData.price * 100, // Convert to paise
          currency: 'INR',
          receipt: `indicator_${Date.now()}`,
          notes: {
            indicator_id: purchaseData.indicator_id,
            user_id: purchaseData.user_id,
            purchase_type: 'indicator',
          },
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating indicator order:', error);
      throw error;
    }
  }

  // Initialize Razorpay payment
  async initializePayment(orderData: any, userData: any): Promise<void> {
    if (!this.razorpay) {
      throw new Error('Razorpay not loaded');
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'XenAlgo',
      description: `Subscription - ${userData.tier_name}`,
      order_id: orderData.id,
      prefill: {
        name: userData.name,
        email: userData.email,
      },
      notes: {
        tier_id: userData.tier_id,
        user_id: userData.user_id,
      },
      theme: {
        color: '#10b981',
      },
      handler: async (response: any) => {
        await this.handlePaymentSuccess(response, userData.user_id);
      },
      modal: {
        ondismiss: () => {
          console.log('Payment modal dismissed');
        },
      },
    };

    const razorpayInstance = new this.razorpay(options);
    razorpayInstance.open();
  }

  // Initialize indicator purchase payment
  async initializeIndicatorPayment(orderData: any, purchaseData: IndicatorPurchaseData): Promise<void> {
    if (!this.razorpay) {
      throw new Error('Razorpay not loaded');
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'XenAlgo',
      description: `Indicator Purchase - ${purchaseData.indicator_name}`,
      order_id: orderData.id,
      prefill: {
        name: purchaseData.user_name,
        email: purchaseData.user_email,
      },
      notes: {
        indicator_id: purchaseData.indicator_id,
        user_id: purchaseData.user_id,
        purchase_type: 'indicator',
      },
      theme: {
        color: '#10b981',
      },
      handler: async (response: any) => {
        await this.handleIndicatorPaymentSuccess(response, purchaseData.user_id, purchaseData.indicator_id);
      },
      modal: {
        ondismiss: () => {
          console.log('Payment modal dismissed');
        },
      },
    };

    const rzp = new this.razorpay(options);
    rzp.open();
  }

  // Handle successful payment
  async handlePaymentSuccess(response: any, userId: string): Promise<void> {
    try {
      // Verify payment on backend
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          user_id: userId,
        },
      });

      if (error) throw error;

      // Update subscription status
      await this.updateSubscriptionStatus(userId, 'active', response.razorpay_payment_id);

      console.log('Payment successful:', data);
    } catch (error) {
      console.error('Error handling payment success:', error);
      throw error;
    }
  }

  // Update subscription status
  async updateSubscriptionStatus(userId: string, status: string, paymentId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          status,
          payment_id: paymentId,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating subscription status:', error);
      throw error;
    }
  }

  // Get subscription status
  async getSubscriptionStatus(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting subscription status:', error);
      throw error;
    }
  }

  // Handle indicator payment success
  async handleIndicatorPaymentSuccess(response: any, userId: string, indicatorId: string): Promise<void> {
    try {
      // Verify payment with Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          user_id: userId,
          indicator_id: indicatorId,
        },
      });

      if (error) throw error;

      // Update user purchases
      await this.updateIndicatorPurchaseStatus(userId, indicatorId, 'completed', response.razorpay_payment_id);

      console.log('Indicator purchase successful:', data);
    } catch (error) {
      console.error('Error handling indicator payment success:', error);
      throw error;
    }
  }

  // Update indicator purchase status
  async updateIndicatorPurchaseStatus(userId: string, indicatorId: string, status: string, paymentId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_purchases')
        .upsert({
          user_id: userId,
          indicator_id: indicatorId,
          status,
          payment_id: paymentId,
          purchase_date: new Date().toISOString(),
          download_count: 0,
          last_download: null,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating indicator purchase status:', error);
      throw error;
    }
  }
}

export const paymentService = new RazorpayPaymentService(); 