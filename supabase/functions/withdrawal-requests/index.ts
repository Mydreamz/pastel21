
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the JWT token in the authorization header
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Handle GET request for getting saved withdrawal details
    if (req.method === 'GET') {
      const { data: withdrawalDetails, error } = await supabaseClient
        .from('withdrawal_details')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ data: withdrawalDetails || null }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Handle POST request for withdrawal request submission
    if (req.method === 'POST') {
      const requestData = await req.json();
      const { saveDetails, ...withdrawalData } = requestData;
      
      // Create withdrawal request - data is already encrypted from the client
      const { error: withdrawalError } = await supabaseClient
        .from('withdrawal_requests')
        .insert({
          ...withdrawalData,
          user_id: user.id, // Ensure user_id is from the token
        });

      if (withdrawalError) {
        return new Response(
          JSON.stringify({ error: withdrawalError.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // If user wants to save details for future use
      if (saveDetails) {
        const detailsToSave = {
          user_id: user.id,
          account_holder_name: withdrawalData.account_holder_name,
          account_number: withdrawalData.account_number, // Already encrypted
          ifsc_code: withdrawalData.ifsc_code, // Already encrypted
          bank_name: withdrawalData.bank_name,
          upi_id: withdrawalData.upi_id, // Already encrypted
          pan_number: withdrawalData.pan_number, // Already encrypted
          pan_name: withdrawalData.pan_name,
          phone_number: withdrawalData.phone_number // Already encrypted
        };

        // Check if details already exist
        const { data: existingDetails } = await supabaseClient
          .from('withdrawal_details')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (existingDetails) {
          // Update existing details
          await supabaseClient
            .from('withdrawal_details')
            .update(detailsToSave)
            .eq('user_id', user.id);
        } else {
          // Insert new details
          await supabaseClient
            .from('withdrawal_details')
            .insert(detailsToSave);
        }
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return 405 for unsupported methods
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
