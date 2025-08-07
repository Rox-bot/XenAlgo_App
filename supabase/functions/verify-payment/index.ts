import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get Razorpay credentials from environment
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!razorpayKeySecret) {
      throw new Error('Razorpay credentials not configured')
    }

    // Parse request body
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      user_id 
    } = await req.json()

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`
    const signature = razorpay_signature

    // Create HMAC SHA256
    const encoder = new TextEncoder()
    const key = encoder.encode(razorpayKeySecret)
    const message = encoder.encode(text)
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    
    const signatureBytes = await crypto.subtle.sign('HMAC', cryptoKey, message)
    const expectedSignature = Array.from(new Uint8Array(signatureBytes))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    if (signature !== expectedSignature) {
      throw new Error('Invalid payment signature')
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Update user subscription
    const { error: updateError } = await supabase
      .from('user_subscriptions')
      .update({
        status: 'active',
        payment_id: razorpay_payment_id,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user_id)

    if (updateError) {
      throw new Error(`Failed to update subscription: ${updateError.message}`)
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Payment verified successfully',
        payment_id: razorpay_payment_id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error verifying payment:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
}) 