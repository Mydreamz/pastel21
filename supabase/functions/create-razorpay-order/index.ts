import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateOrderRequest {
  contentId: string;
  amount: number;
  currency?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Creating Razorpay order...");
    
    // Initialize Supabase client with service role for database operations
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
    const { contentId, amount, currency = 'INR' }: CreateOrderRequest = await req.json();
    console.log("Order details:", { contentId, amount, currency });

    // Validate content exists and get creator info
    const { data: content, error: contentError } = await supabaseClient
      .from('contents')
      .select('id, creator_id, title, price')
      .eq('id', contentId)
      .single();

    if (contentError || !content) {
      throw new Error("Content not found");
    }

    // Check if user already purchased this content
    const { data: existingTransaction } = await supabaseClient
      .from('transactions')
      .select('id')
      .eq('content_id', contentId)
      .eq('user_id', user.id)
      .eq('is_deleted', false)
      .single();

    if (existingTransaction) {
      throw new Error("Content already purchased");
    }

    // Calculate fees
    const platformFee = amount * 0.07;
    const creatorEarnings = amount - platformFee;

    // Get Razorpay credentials
    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error("Razorpay credentials not configured");
    }

    // Create Razorpay order
    const razorpayAuth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    const orderData = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: currency,
      receipt: `order_${user.id}_${contentId}_${Date.now()}`,
      notes: {
        content_id: contentId,
        user_id: user.id,
        creator_id: content.creator_id,
        content_title: content.title
      }
    };

    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${razorpayAuth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    if (!razorpayResponse.ok) {
      const errorText = await razorpayResponse.text();
      console.error("Razorpay API error:", errorText);
      throw new Error("Failed to create Razorpay order");
    }

    const razorpayOrder = await razorpayResponse.json();
    console.log("Razorpay order created:", razorpayOrder.id);

    // Store order in database
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user.id,
        content_id: contentId,
        creator_id: content.creator_id,
        razorpay_order_id: razorpayOrder.id,
        amount: amount,
        currency: currency,
        platform_fee: platformFee,
        creator_earnings: creatorEarnings,
        status: 'created'
      })
      .select()
      .single();

    if (orderError) {
      console.error("Database error:", orderError);
      throw new Error("Failed to store order in database");
    }

    console.log("Order stored in database:", order.id);

    return new Response(JSON.stringify({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: razorpayKeyId,
      receipt: razorpayOrder.receipt,
      notes: razorpayOrder.notes
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Internal server error" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});