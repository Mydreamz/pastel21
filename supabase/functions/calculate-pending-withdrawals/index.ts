
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create supabase admin client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Get request body
    const { userId } = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }

    // Calculate pending withdrawals
    const { data, error } = await supabaseClient
      .from('withdrawal_requests')
      .select('amount')
      .eq('user_id', userId)
      .in('status', ['pending', 'processing']);
    
    if (error) throw error;
    
    // Sum the amounts
    const total = data.reduce((sum, item) => {
      return sum + parseFloat(item.amount || '0');
    }, 0);

    return new Response(
      JSON.stringify({ 
        success: true, 
        total: total.toFixed(2) 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Error calculating pending withdrawals' 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
