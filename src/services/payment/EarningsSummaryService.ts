
import { supabase } from "@/integrations/supabase/client";
import { EarningsSummary } from "@/types/transaction";
import { calculatePendingWithdrawals } from "@/utils/paymentUtils";

/**
 * Get a creator's earnings summary
 */
export async function getCreatorEarningsSummary(creatorId: string): Promise<EarningsSummary> {
  try {
    // Get creator profile with earnings data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', creatorId)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
    }

    // Initialize values
    let totalEarnings = 0;
    let availableBalance = 0;
    let pendingWithdrawalsTotal = 0;
    
    // Extract profile data if available
    if (profile) {
      // Use type assertion to access custom fields
      const profileData = profile as any;
      totalEarnings = profileData.total_earnings ? parseFloat(profileData.total_earnings) : 0;
      availableBalance = profileData.available_balance ? parseFloat(profileData.available_balance) : 0;
    }
    
    // Get pending withdrawals total using direct calculation
    pendingWithdrawalsTotal = await calculatePendingWithdrawals(creatorId);

    // Get transaction count
    const { count: transactionCount, error: countError } = await supabase
      .from('transactions')
      .select('id', { count: 'exact', head: true })
      .eq('creator_id', creatorId);

    if (countError) {
      console.error("Error counting transactions:", countError);
    }

    return {
      total_earnings: totalEarnings,
      available_balance: availableBalance,
      pending_withdrawals: pendingWithdrawalsTotal,
      total_transactions: transactionCount || 0
    };
  } catch (error) {
    console.error("Error getting earnings summary:", error);
    return {
      total_earnings: 0,
      available_balance: 0,
      pending_withdrawals: 0,
      total_transactions: 0
    };
  }
}
