
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface PaytmConfig {
  MID: string
  MERCHANT_KEY: string
  WEBSITE: string
  INDUSTRY_TYPE: string
  CHANNEL_ID: string
  CALLBACK_URL: string
}

interface PaymentRequest {
  contentId: string
  userId: string
  creatorId: string
  amount: number
  orderId: string
  action: 'initiate' | 'verify' | 'status'
  gatewayData?: any
}

interface PaytmResponse {
  success: boolean
  data?: any
  error?: string
  redirectUrl?: string
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Paytm configuration
const getPaytmConfig = (): PaytmConfig => ({
  MID: Deno.env.get('PAYTM_MID') || '',
  MERCHANT_KEY: Deno.env.get('PAYTM_MERCHANT_KEY') || '',
  WEBSITE: Deno.env.get('PAYTM_WEBSITE') || 'WEBSTAGING',
  INDUSTRY_TYPE: Deno.env.get('PAYTM_INDUSTRY_TYPE') || 'Retail',
  CHANNEL_ID: 'WEB',
  CALLBACK_URL: `${supabaseUrl}/functions/v1/paytm-payment`
})

// Generate checksum for Paytm
async function generateChecksum(params: Record<string, string>, merchantKey: string): Promise<string> {
  const sortedKeys = Object.keys(params).sort()
  const queryString = sortedKeys.map(key => `${key}=${params[key]}`).join('&')
  const finalString = queryString + merchantKey
  
  const encoder = new TextEncoder()
  const data = encoder.encode(finalString)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Verify checksum from Paytm
async function verifyChecksum(params: Record<string, string>, merchantKey: string, receivedChecksum: string): Promise<boolean> {
  const { CHECKSUMHASH, ...paramsWithoutChecksum } = params
  const calculatedChecksum = await generateChecksum(paramsWithoutChecksum, merchantKey)
  return calculatedChecksum === receivedChecksum
}

// Create payment session in database
async function createPaymentSession(request: PaymentRequest, config: PaytmConfig) {
  const sessionId = `PAYTM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const { data, error } = await supabase
    .from('payment_sessions')
    .insert({
      user_id: request.userId,
      content_id: request.contentId,
      creator_id: request.creatorId,
      amount: request.amount,
      payment_method: 'paytm',
      session_id: sessionId,
      status: 'pending'
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating payment session:', error)
    throw new Error('Failed to create payment session')
  }

  return { sessionData: data, sessionId }
}

// Initiate payment with Paytm
async function initiatePayment(request: PaymentRequest): Promise<PaytmResponse> {
  const config = getPaytmConfig()
  
  if (!config.MID || !config.MERCHANT_KEY) {
    return { success: false, error: 'Paytm configuration not found' }
  }

  try {
    const { sessionData, sessionId } = await createPaymentSession(request, config)
    
    const params = {
      MID: config.MID,
      WEBSITE: config.WEBSITE,
      INDUSTRY_TYPE_ID: config.INDUSTRY_TYPE,
      CHANNEL_ID: config.CHANNEL_ID,
      ORDER_ID: sessionId,
      CUST_ID: request.userId,
      MOBILE_NO: '',
      EMAIL: '',
      TXN_AMOUNT: request.amount.toString(),
      CALLBACK_URL: `${config.CALLBACK_URL}?action=callback`
    }

    const checksum = await generateChecksum(params, config.MERCHANT_KEY)
    
    // Update session with gateway order ID
    await supabase
      .from('payment_sessions')
      .update({ 
        gateway_order_id: sessionId,
        status: 'processing'
      })
      .eq('id', sessionData.id)

    return {
      success: true,
      data: {
        ...params,
        CHECKSUMHASH: checksum,
        sessionId: sessionData.id
      },
      redirectUrl: 'https://securegw-stage.paytm.in/theia/processTransaction'
    }
  } catch (error) {
    console.error('Error initiating payment:', error)
    return { success: false, error: error.message }
  }
}

// Handle Paytm callback
async function handleCallback(request: Request): Promise<PaytmResponse> {
  const config = getPaytmConfig()
  const formData = await request.formData()
  const params: Record<string, string> = {}
  
  for (const [key, value] of formData.entries()) {
    params[key] = value.toString()
  }

  const receivedChecksum = params.CHECKSUMHASH || ''
  const isValidChecksum = await verifyChecksum(params, config.MERCHANT_KEY, receivedChecksum)

  if (!isValidChecksum) {
    console.error('Invalid checksum received from Paytm')
    return { success: false, error: 'Invalid checksum' }
  }

  const orderId = params.ORDERID
  const status = params.STATUS
  const txnId = params.TXNID
  const amount = parseFloat(params.TXNAMOUNT || '0')

  try {
    // Update payment session
    const { data: session, error: sessionError } = await supabase
      .from('payment_sessions')
      .update({
        status: status === 'TXN_SUCCESS' ? 'completed' : 'failed',
        gateway_transaction_id: txnId,
        gateway_response: params
      })
      .eq('session_id', orderId)
      .select()
      .single()

    if (sessionError) {
      console.error('Error updating payment session:', sessionError)
      return { success: false, error: 'Failed to update payment session' }
    }

    // If payment successful, create transaction record
    if (status === 'TXN_SUCCESS' && session) {
      const platformFee = amount * 0.07 // 7% platform fee
      const creatorEarnings = amount - platformFee

      const { error: txnError } = await supabase
        .from('transactions')
        .insert({
          content_id: session.content_id,
          user_id: session.user_id,
          creator_id: session.creator_id,
          amount: amount.toString(),
          platform_fee: platformFee.toString(),
          creator_earnings: creatorEarnings.toString(),
          payment_method: 'paytm',
          gateway_transaction_id: txnId,
          gateway_response: params,
          status: 'completed'
        })

      if (txnError) {
        console.error('Error creating transaction:', txnError)
        return { success: false, error: 'Payment verified but transaction creation failed' }
      }

      // Update creator earnings
      const { error: profileError } = await supabase.rpc('update_creator_earnings', {
        creator_id: session.creator_id,
        earnings_amount: creatorEarnings
      })

      if (profileError) {
        console.log('Warning: Failed to update creator earnings:', profileError)
      }
    }

    return { 
      success: true, 
      data: { 
        status: status === 'TXN_SUCCESS' ? 'completed' : 'failed',
        transactionId: txnId,
        amount: amount
      }
    }
  } catch (error) {
    console.error('Error handling callback:', error)
    return { success: false, error: error.message }
  }
}

// Check payment status
async function checkPaymentStatus(sessionId: string): Promise<PaytmResponse> {
  try {
    const { data: session, error } = await supabase
      .from('payment_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single()

    if (error) {
      return { success: false, error: 'Payment session not found' }
    }

    return {
      success: true,
      data: {
        status: session.status,
        sessionId: session.session_id,
        gatewayTransactionId: session.gateway_transaction_id,
        amount: session.amount
      }
    }
  } catch (error) {
    console.error('Error checking payment status:', error)
    return { success: false, error: error.message }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const action = url.searchParams.get('action') || 'initiate'

    if (action === 'callback') {
      const result = await handleCallback(req)
      
      // Redirect user to appropriate page
      const redirectUrl = result.success 
        ? `${supabaseUrl.replace('supabase.co', 'vercel.app')}/payment-success?status=${result.data?.status}&txnId=${result.data?.transactionId}`
        : `${supabaseUrl.replace('supabase.co', 'vercel.app')}/payment-failed?error=${encodeURIComponent(result.error || 'Payment failed')}`
      
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          'Location': redirectUrl
        }
      })
    }

    const requestData: PaymentRequest = await req.json()

    let result: PaytmResponse

    switch (requestData.action) {
      case 'initiate':
        result = await initiatePayment(requestData)
        break
      case 'status':
        result = await checkPaymentStatus(requestData.orderId)
        break
      default:
        result = { success: false, error: 'Invalid action' }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in paytm-payment function:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
