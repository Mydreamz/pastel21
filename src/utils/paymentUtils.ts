
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
    // We can't use RPC directly since get_pending_withdrawals isn't in the types
    // So we'll just use the API endpoint directly
    const apiUrl = `${window.location.origin}/api/calculate-pending-withdrawals`;
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      
      if (response.ok) {
        const result = await response.json();
        return parseFloat(result.total) || 0;
      }
    } catch (e) {
      console.warn("API endpoint not available for pending withdrawals, using fallback");
    }
    
    // Since withdrawal_requests isn't in the types, we need to use a raw query
    // This works because Supabase will still execute it, but TypeScript won't be aware of the types
    const { data, error } = await supabase
      .from('transactions') // Use a known table to satisfy TypeScript
      .select('*')
      .eq('id', 'dummy-query') // This query won't return results
      .limit(0); // Limit to 0 to make it efficient
      
    // Then manually call the PostgreSQL query using the fetch API and Supabase REST interface
    const supabaseUrl = `${supabase.supabaseUrl}/rest/v1/withdrawal_requests`;
    const supabaseKey = supabase.supabaseKey;
    
    const response = await fetch(supabaseUrl + `?user_id=eq.${encodeURIComponent(userId)}&status=in.(pending,processing)&select=amount`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error("Error fetching withdrawal requests:", response.statusText);
      return 0;
    }
    
    const withdrawals = await response.json();
    
    // Sum up all amounts
    return withdrawals.reduce((sum: number, item: any) => sum + parseFloat(item.amount || '0'), 0) || 0;
  } catch (e) {
    console.error("Exception calculating pending withdrawals:", e);
    return 0;
  }
};

