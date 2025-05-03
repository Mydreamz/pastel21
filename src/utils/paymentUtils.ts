
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
 */
export const hasUserPurchasedContent = async (contentId: string, userId: string) => {
  if (!contentId || !userId) return false;
  
  try {
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
