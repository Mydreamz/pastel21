
import { supabase } from "@/integrations/supabase/client";

/**
 * Calculate platform fees and creator earnings from a payment amount
 */
export const calculateFees = (amount: number) => {
  const platformFee = amount * 0.07; // 7% platform fee
  const creatorEarnings = amount - platformFee;
  return { platformFee, creatorEarnings };
};

/**
 * Format a number as Indian Rupee currency
 */
export const formatCurrency = (amount: number): string => {
  if (typeof amount !== 'number') {
    amount = 0;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

/**
 * Check if a user has purchased a piece of content.
 */
export const hasUserPurchasedContent = async (contentId: string, userId: string): Promise<boolean> => {
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
