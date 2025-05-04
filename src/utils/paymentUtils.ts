
import { supabase } from "@/integrations/supabase/client";

/**
 * Calculate platform fees and creator earnings from a payment amount
 */
export const calculateFees = (amount: number, feePercentage: number = 7) => {
  // Ensure we're working with valid numbers
  const safeAmount = Math.max(0, Number(amount) || 0);
  const safeFeePercentage = Math.max(0, Number(feePercentage) || 0);
  
  // Calculate platform fee: amount * (feePercentage / 100)
  const platformFee = (safeAmount * safeFeePercentage) / 100;
  
  // Creator earnings is the remaining amount after deducting platform fee
  const creatorEarnings = safeAmount - platformFee;
  
  // Debug logging to verify calculations
  console.log(`Payment amount: ${safeAmount}, Fee percentage: ${safeFeePercentage}%`);
  console.log(`Platform fee: ${platformFee.toFixed(2)}, Creator earnings: ${creatorEarnings.toFixed(2)}`);
  
  return {
    platformFee: parseFloat(platformFee.toFixed(2)),
    creatorEarnings: parseFloat(creatorEarnings.toFixed(2))
  };
};

/**
 * Format a number as Indian Rupee currency
 */
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

/**
 * Validate a transaction object has all required fields
 */
export const validateTransaction = (transaction: any): boolean => {
  if (!transaction) return false;
  
  const requiredFields = ['content_id', 'user_id', 'creator_id', 'amount'];
  const isValid = requiredFields.every(field => transaction[field] !== undefined && transaction[field] !== null);
  
  if (!isValid) {
    console.error("Transaction validation failed:", transaction);
    const missingFields = requiredFields.filter(field => transaction[field] === undefined || transaction[field] === null);
    console.error("Missing fields:", missingFields);
  }
  
  return isValid;
};

/**
 * Check if a user has already purchased a specific content
 * Uses direct database query with fallback
 */
export const hasUserPurchasedContent = async (contentId: string, userId: string) => {
  if (!contentId || !userId) return false;
  
  try {
    // Try to use the database function if available
    try {
      const { data, error } = await supabase.rpc('has_purchased_content', {
        user_id_param: userId,
        content_id_param: contentId
      });
      
      if (!error) {
        return !!data;
      }
    } catch (e) {
      // Silently continue to fallback
      console.warn("RPC function not available, using fallback");
    }
    
    // Fallback to direct query
    const { data, error } = await supabase
      .from('transactions')
      .select('id')
      .eq('content_id', contentId)
      .eq('user_id', userId)
      .eq('is_deleted', false)
      .limit(1);
      
    if (error) {
      console.error("Error checking purchase status:", error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (e) {
    console.error("Exception checking purchase status:", e);
    return false;
  }
};

/**
 * Calculate pending withdrawals for a user
 * Handles API fallback for totals
 */
export const calculatePendingWithdrawals = async (userId: string): Promise<number> => {
  if (!userId) return 0;
  
  try {
    // First try using a custom RPC call for get_pending_withdrawals
    // This is safely outside the type system to avoid TypeScript errors
    try {
      const session = await supabase.auth.getSession();
      const authToken = session.data.session?.access_token;
      
      if (!authToken) {
        console.warn("No auth token available for RPC call");
        throw new Error("No auth token");
      }
      
      const supabaseUrl = (supabase as any).supabaseUrl || "https://pdlqxpckrxrsfyuknsjg.supabase.co";
      const supabaseKey = (supabase as any).supabaseKey;
      
      // Call the RPC function directly (outside the TypeScript type system)
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/get_pending_withdrawals`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'apikey': supabaseKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ user_id_param: userId })
      });
      
      if (response.ok) {
        const result = await response.json();
        const pendingAmount = parseFloat(String(result));
        if (!isNaN(pendingAmount)) {
          return pendingAmount;
        }
      }
    } catch (e) {
      console.warn("RPC function not available for pending withdrawals, using fallback:", e);
    }
    
    // Then try the API endpoint
    try {
      const baseUrl = window.location.origin;
      const apiUrl = `${baseUrl}/api/calculate-pending-withdrawals`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const result = await response.json();
          return parseFloat(String(result.total)) || 0;
        }
        console.warn("API response was not JSON, using fallback");
      }
    } catch (e) {
      console.warn("API endpoint not available for pending withdrawals, using direct query fallback");
    }
    
    // Direct query fallback using custom fetch to avoid TypeScript errors
    // with tables that aren't in the TypeScript definitions yet
    const session = await supabase.auth.getSession();
    const authToken = session.data.session?.access_token;
    
    if (!authToken) {
      console.warn("No auth token available for withdrawal requests query");
      return 0;
    }

    // Use the Supabase REST API directly to avoid TypeScript errors
    const supabaseUrl = (supabase as any).supabaseUrl || "https://pdlqxpckrxrsfyuknsjg.supabase.co";
    const supabaseKey = (supabase as any).supabaseKey;
    
    const apiUrl = `${supabaseUrl}/rest/v1/withdrawal_requests`;
    const response = await fetch(`${apiUrl}?user_id=eq.${userId}&status=in.(pending,processing)&select=amount`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'apikey': supabaseKey,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error("Error fetching withdrawal requests:", response.statusText);
      return 0;
    }

    const withdrawals = await response.json();
    return (withdrawals || []).reduce((sum: number, item: any) => sum + parseFloat(item.amount || '0'), 0);
    
  } catch (e) {
    console.error("Exception calculating pending withdrawals:", e);
    return 0;
  }
};
