import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create supabase admin client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get request body
    const body = await req.json();
    const { action } = body;

    // Simple admin auth check - verify the admin token format
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer admin-')) {
      return new Response(
        JSON.stringify({ error: 'Admin authentication required' }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401 
        }
      );
    }

    switch (action) {
      case 'get-stats':
        return await getAdminStats(supabaseAdmin);
      case 'get-users':
        return await getUsers(supabaseAdmin);
      case 'get-transactions':
        return await getTransactions(supabaseAdmin);
      case 'get-withdrawals':
        return await getWithdrawals(supabaseAdmin);
      case 'get-contents':
        return await getContents(supabaseAdmin);
      case 'update-withdrawal-status':
        const { withdrawalId, status } = body;
        return await updateWithdrawalStatus(supabaseAdmin, withdrawalId, status);
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400 
          }
        );
    }

  } catch (error) {
    console.error('Admin dashboard error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error' 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});

async function getAdminStats(supabaseAdmin: any) {
  try {
    // Get user count from auth.users table for accurate total
    const { data: authUsersResponse } = await supabaseAdmin.auth.admin.listUsers();
    const totalUsers = authUsersResponse?.users?.length || 0;

    // Get all other stats in parallel
    const [
      { count: totalContent },
      { data: platformFees },
      { count: totalViews },
      { count: totalTransactions },
      { data: pendingWithdrawals }
    ] = await Promise.all([
      supabaseAdmin.from('contents').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('platform_fees').select('amount').eq('is_deleted', false),
      supabaseAdmin.from('content_views').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('transactions').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('withdrawal_requests').select('amount').in('status', ['pending', 'processing'])
    ]);

    const totalRevenue = platformFees?.reduce((sum: number, fee: any) => sum + parseFloat(fee.amount || '0'), 0) || 0;
    const totalPendingWithdrawals = pendingWithdrawals?.reduce((sum: number, req: any) => sum + parseFloat(req.amount || '0'), 0) || 0;

    const stats = {
      totalUsers,
      totalContent: totalContent || 0,
      totalRevenue: totalRevenue.toFixed(2),
      totalViews: totalViews || 0,
      totalTransactions: totalTransactions || 0,
      pendingWithdrawals: totalPendingWithdrawals.toFixed(2)
    };

    return new Response(
      JSON.stringify({ success: true, data: stats }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    throw new Error(`Error fetching admin stats: ${error.message}`);
  }
}

async function getUsers(supabaseAdmin: any) {
  try {
    // Get all users from auth.users and combine with profile data
    const { data: authUsersResponse } = await supabaseAdmin.auth.admin.listUsers();
    const authUsers = authUsersResponse?.users || [];

    // Get all profiles data
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*');

    if (profileError) throw profileError;

    // Combine auth users with profile data
    const users = authUsers.map(authUser => {
      const profile = profiles?.find(p => p.id === authUser.id);
      return {
        id: authUser.id,
        email: authUser.email,
        name: profile?.name || authUser.user_metadata?.name || 'No name',
        total_earnings: profile?.total_earnings || '0.0',
        available_balance: profile?.available_balance || '0.0',
        created_at: authUser.created_at,
        updated_at: profile?.updated_at || authUser.updated_at
      };
    });

    return new Response(
      JSON.stringify({ success: true, data: users }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
}

async function getTransactions(supabaseAdmin: any) {
  try {
    const { data, error } = await supabaseAdmin
      .from('transactions')
      .select(`
        id,
        amount,
        platform_fee,
        creator_earnings,
        payment_status,
        payment_method,
        timestamp,
        razorpay_payment_id
      `)
      .order('timestamp', { ascending: false })
      .limit(100);

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    throw new Error(`Error fetching transactions: ${error.message}`);
  }
}

async function getWithdrawals(supabaseAdmin: any) {
  try {
    const { data, error } = await supabaseAdmin
      .from('withdrawal_requests')
      .select(`
        id,
        user_id,
        amount,
        payment_method,
        status,
        account_holder_name,
        account_number,
        ifsc_code,
        bank_name,
        upi_id,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    throw new Error(`Error fetching withdrawals: ${error.message}`);
  }
}

async function getContents(supabaseAdmin: any) {
  try {
    const { data, error } = await supabaseAdmin
      .from('contents')
      .select(`
        id,
        title,
        content_type,
        price,
        views,
        creator_name,
        status,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    throw new Error(`Error fetching contents: ${error.message}`);
  }
}

async function updateWithdrawalStatus(supabaseAdmin: any, withdrawalId: string, status: string) {
  try {
    const { error } = await supabaseAdmin
      .from('withdrawal_requests')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', withdrawalId);

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, message: 'Withdrawal status updated' }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    throw new Error(`Error updating withdrawal status: ${error.message}`);
  }
}