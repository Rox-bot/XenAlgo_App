# 🚀 Razorpay Integration Setup Guide

## Step 1: Create Razorpay Account

1. **Sign up at [razorpay.com](https://razorpay.com)**
2. **Complete business verification**
3. **Get your API keys from Dashboard → Settings → API Keys**
4. **Note down:**
   - Key ID (starts with `rzp_test_` for test mode)
   - Key Secret (starts with `test_` for test mode)

## Step 2: Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
VITE_RAZORPAY_KEY_SECRET=test_your_key_secret_here

# Supabase Configuration
VITE_SUPABASE_URL=https://tbgzjvxgkslgkcppsmcl.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Step 3: Set Supabase Secrets

Run these commands in your terminal:

```bash
# Set Razorpay credentials in Supabase
npx supabase secrets set RAZORPAY_KEY_ID=rzp_test_your_key_id_here
npx supabase secrets set RAZORPAY_KEY_SECRET=test_your_key_secret_here

# Deploy Edge Functions
npx supabase functions deploy create-razorpay-order
npx supabase functions deploy verify-payment
```

## Step 4: Configure Razorpay Webhook

1. **Go to Razorpay Dashboard → Settings → Webhooks**
2. **Add webhook URL:**
   ```
   https://tbgzjvxgkslgkcppsmcl.supabase.co/functions/v1/verify-payment
   ```
3. **Select events:**
   - `payment.captured`
   - `payment.failed`

## Step 5: Test the Integration

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Go to `/indicators` and try purchasing an indicator**

3. **Check the payment flow:**
   - Razorpay modal should open
   - Payment should be processed
   - User subscription should be updated

## Step 6: Go Live

1. **Switch to Razorpay Live mode**
2. **Update environment variables with live keys**
3. **Update webhook URL to live Supabase project**
4. **Deploy to production**

## Troubleshooting

### Common Issues:

1. **"Razorpay not loaded"**
   - Check if `VITE_RAZORPAY_KEY_ID` is set correctly
   - Ensure Razorpay script is loading

2. **"Payment verification failed"**
   - Check webhook configuration
   - Verify `RAZORPAY_KEY_SECRET` in Supabase secrets

3. **"Edge Function not found"**
   - Run `npx supabase functions deploy`
   - Check function logs: `npx supabase functions logs`

### Testing Commands:

```bash
# Check Supabase status
npx supabase status

# View function logs
npx supabase functions logs create-razorpay-order
npx supabase functions logs verify-payment

# Test function locally
npx supabase functions serve
```

## Security Notes

- ✅ Never commit API keys to git
- ✅ Use environment variables
- ✅ Verify payment signatures
- ✅ Use HTTPS in production
- ✅ Implement proper error handling

## Next Steps

After successful integration:
1. **Add real indicator images**
2. **Implement download functionality**
3. **Add user purchase history**
4. **Move to Phase 2B or Phase 3** 