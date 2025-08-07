# Razorpay Integration Setup Guide

## 🚀 **Phase 1: Razorpay Account Setup**

### 1. Create Razorpay Account
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up for a new account
3. Complete KYC verification
4. Get your API keys from the dashboard

### 2. Get API Keys
```bash
# From Razorpay Dashboard > Settings > API Keys
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

## 🔧 **Phase 2: Supabase Edge Functions Setup**

### 1. Install Supabase CLI
```bash
npm install -g supabase
```

### 2. Login to Supabase
```bash
supabase login
```

### 3. Link Your Project
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### 4. Set Environment Variables
```bash
# Set Razorpay credentials in Supabase secrets
supabase secrets set RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
supabase secrets set RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

### 5. Deploy Edge Functions
```bash
# Deploy both functions
supabase functions deploy create-razorpay-order
supabase functions deploy verify-payment
```

## 🌐 **Phase 3: Frontend Environment Setup**

### 1. Add Environment Variables
Create `.env.local` file:
```bash
# .env.local
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Update Payment Service
The payment service is already configured to use these environment variables.

## 🧪 **Phase 4: Testing**

### 1. Test Order Creation
```javascript
// Test the create-razorpay-order function
const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
  body: {
    amount: 99900, // ₹999 in paise
    currency: 'INR',
    receipt: `order_${Date.now()}`,
    notes: {
      tier_id: 'premium',
      user_id: 'user-id',
    },
  },
});
```

### 2. Test Payment Verification
```javascript
// Test the verify-payment function
const { data, error } = await supabase.functions.invoke('verify-payment', {
  body: {
    razorpay_payment_id: 'pay_xxxxxxxxxxxxx',
    razorpay_order_id: 'order_xxxxxxxxxxxxx',
    razorpay_signature: 'signature',
    user_id: 'user-id',
  },
});
```

## 📱 **Phase 5: Payment Flow**

### 1. User clicks "Upgrade"
2. **PaymentModal** opens
3. User clicks "Pay ₹999"
4. **createOrder()** calls Supabase Edge Function
5. Edge Function creates Razorpay order
6. **initializePayment()** opens Razorpay modal
7. User completes payment
8. **handlePaymentSuccess()** verifies payment
9. Subscription status updated in database

## 🔒 **Security Features**

### 1. Signature Verification
- All payments are verified using HMAC SHA256
- Prevents payment tampering
- Ensures payment authenticity

### 2. Server-Side Processing
- All sensitive operations happen on Supabase Edge Functions
- API keys never exposed to frontend
- Secure payment handling

### 3. Database Updates
- Payment status updated only after verification
- User subscription activated only on successful payment
- Audit trail maintained

## 🚨 **Troubleshooting**

### Common Issues:

1. **"Razorpay credentials not configured"**
   - Check if secrets are set: `supabase secrets list`
   - Redeploy functions: `supabase functions deploy`

2. **"Invalid payment signature"**
   - Verify Razorpay key secret is correct
   - Check if payment was tampered with

3. **"Failed to update subscription"**
   - Check database permissions
   - Verify user_id exists

4. **Razorpay modal not opening**
   - Check if Razorpay script is loaded
   - Verify REACT_APP_RAZORPAY_KEY_ID is set

## 📊 **Monitoring**

### 1. Supabase Logs
```bash
# View function logs
supabase functions logs create-razorpay-order
supabase functions logs verify-payment
```

### 2. Razorpay Dashboard
- Monitor payments in Razorpay dashboard
- Check settlement reports
- View transaction history

## 🎯 **Next Steps**

After Razorpay integration is complete:

1. **Test with real payments** (use test mode first)
2. **Add payment analytics** to track conversion rates
3. **Implement subscription management** (cancel, upgrade, downgrade)
4. **Add payment notifications** (email confirmations)
5. **Create billing dashboard** for users

## 💡 **Production Checklist**

- [ ] Switch to live Razorpay keys
- [ ] Test with real payments
- [ ] Set up webhook notifications
- [ ] Add payment failure handling
- [ ] Implement subscription renewal
- [ ] Add payment analytics
- [ ] Set up monitoring alerts 