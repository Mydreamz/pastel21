import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createHmac } from "https://deno.land/std@0.190.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

async function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const body = orderId + "|" + paymentId;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(body);
    
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const hmacBuffer = await crypto.subtle.sign("HMAC", key, messageData);
    const hmacArray = new Uint8Array(hmacBuffer);
    const expectedSignature = Array.from(hmacArray)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    return expectedSignature === signature;
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Verifying Razorpay payment...");
    
    // Initialize Supabase client with service role
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) throw new Error("User authentication failed");

    const user = userData.user;
    console.log("User authenticated:", user.id);

    // Parse request body
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature }: VerifyPaymentRequest = await req.json();
    console.log("Payment verification data:", { razorpay_order_id, razorpay_payment_id });

    // Get Razorpay secret for signature verification
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!razorpayKeySecret) {
      throw new Error("Razorpay secret not configured");
    }

    // Verify signature
    const isValidSignature = await verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      razorpayKeySecret
    );

    if (!isValidSignature) {
      console.error("Invalid payment signature");
      throw new Error("Payment signature verification failed");
    }

    console.log("Payment signature verified successfully");

    // Check if transaction already exists to prevent duplicates
    const { data: existingTransaction } = await supabaseClient
      .from('transactions')
      .select('id, payment_status')
      .eq('razorpay_payment_id', razorpay_payment_id)
      .eq('user_id', user.id)
      .single();

    if (existingTransaction) {
      console.log("Transaction already exists:", existingTransaction.id);
      if (existingTransaction.payment_status === 'success') {
        return new Response(JSON.stringify({
          success: true,
          transactionId: existingTransaction.id,
          message: "Payment already processed successfully"
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
    }

    // Get order from database
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('razorpay_order_id', razorpay_order_id)
      .eq('user_id', user.id)
      .single();

    if (orderError || !order) {
      throw new Error("Order not found");
    }

    console.log("Order found:", order.id);

    // Check if order is already paid
    if (order.status === 'paid') {
      console.log("Order already marked as paid");
      // Try to find the existing transaction
      const { data: orderTransaction } = await supabaseClient
        .from('transactions')
        .select('id')
        .eq('razorpay_order_id', razorpay_order_id)
        .eq('user_id', user.id)
        .eq('payment_status', 'success')
        .single();
      
      if (orderTransaction) {
        return new Response(JSON.stringify({
          success: true,
          transactionId: orderTransaction.id,
          message: "Payment already processed successfully"
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
    }

    // Update order status
    const { error: updateOrderError } = await supabaseClient
      .from('orders')
      .update({ 
        status: 'paid',
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id);

    if (updateOrderError) {
      console.error("Error updating order:", updateOrderError);
      throw new Error("Failed to update order status");
    }

    // Create transaction record with duplicate prevention
    const { data: transaction, error: transactionError } = await supabaseClient
      .from('transactions')
      .insert({
        content_id: order.content_id,
        user_id: user.id,
        creator_id: order.creator_id,
        amount: order.amount.toString(),
        platform_fee: order.platform_fee.toString(),
        creator_earnings: order.creator_earnings.toString(),
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature,
        payment_status: 'success',
        payment_method: 'razorpay',
        is_deleted: false
      })
      .select()
      .single();

    if (transactionError) {
      // If it's a unique constraint violation, the transaction already exists
      if (transactionError.code === '23505') {
        console.log("Transaction already exists (unique constraint violation)");
        const { data: existingTxn } = await supabaseClient
          .from('transactions')
          .select('id')
          .eq('razorpay_payment_id', razorpay_payment_id)
          .eq('user_id', user.id)
          .single();
        
        if (existingTxn) {
          return new Response(JSON.stringify({
            success: true,
            transactionId: existingTxn.id,
            message: "Payment already processed successfully"
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          });
        }
      }
      
      console.error("Error creating transaction:", transactionError);
      throw new Error("Failed to create transaction record");
    }

    console.log("Transaction created:", transaction.id);

    // Update creator balance (this will be handled by the existing trigger)
    console.log("Creator balance will be updated by trigger");

    return new Response(JSON.stringify({
      success: true,
      transactionId: transaction.id,
      message: "Payment verified successfully"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error verifying payment:", error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : "Internal server error" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});