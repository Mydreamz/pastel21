
import { supabase } from "@/integrations/supabase/client";
import { EarningsSummary } from "@/types/transaction";
import { calculatePendingWithdrawals } from "@/utils/paymentUtils";

/**
 * Get a creator's earnings summary
 */
export async function getCreatorEarningsSummary(creatorId: string): Promise<EarningsSummary> {
  try {
    console.log("Getting earnings summary for creator:", creatorId);
    
    // Get creator profile with earnings data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', creatorId)
      .single();

    if (profileError) {
      console.error("Error fetching profile for earnings:", profileError);
    }

    // Initialize values
    let totalEarnings = 0;
    let availableBalance = 0;
    let pendingWithdrawalsTotal = 0;
    
    // Extract profile data if available
    if (profile) {
      console.log("Profile data for earnings:", profile);
      // Use type assertion to access custom fields
      const profileData = profile as any;
      totalEarnings = profileData.total_earnings ? parseFloat(profileData.total_earnings) : 0;
      availableBalance = profileData.available_balance ? parseFloat(profileData.available_balance) : 0;
      
      console.log("Extracted from profile - Total earnings:", totalEarnings, "Available balance:", availableBalance);
    } else {
      console.log("No profile data found for earnings calculation");
    }
    
    // Get pending withdrawals total using direct calculation
    try {
      pendingWithdrawalsTotal = await calculatePendingWithdrawals(creatorId);
      console.log("Pending withdrawals calculated:", pendingWithdrawalsTotal);
    } catch (withdrawalError) {
      console.error("Error calculating pending withdrawals:", withdrawalError);
    }

    // Get transaction count
    const { count: transactionCount, error: countError } = await supabase
      .from('transactions')
      .select('id', { count: 'exact', head: true })
      .eq('creator_id', creatorId);

    if (countError) {
      console.error("Error counting transactions:", countError);
    }
    
    console.log("Transaction count:", transactionCount);

    const summary = {
      total_earnings: totalEarnings,
      available_balance: availableBalance,
      pending_withdrawals: pendingWithdrawalsTotal,
      total_transactions: transactionCount || 0
    };
    
    console.log("Final earnings summary:", summary);
    return summary;
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
