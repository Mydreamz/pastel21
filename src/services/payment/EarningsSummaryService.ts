
import { supabase } from "@/integrations/supabase/client";
import { EarningsSummary } from "@/types/transaction";
import { calculatePendingWithdrawals } from "@/utils/paymentUtils";

/**
 * Service for retrieving earnings summaries
 */
export class EarningsSummaryService {
  /**
   * Get a creator's earnings summary
   */
  static async getCreatorEarningsSummary(creatorId: string): Promise<EarningsSummary> {
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
        
        // If profile doesn't exist, we'll return zeros but also try to reconcile
        if (profileError.code === 'PGRST116') {
          console.log("Profile not found, attempting reconciliation...");
          // Import here to avoid circular dependency
          const { CreatorEarningsService } = await import('./CreatorEarningsService');
          await CreatorEarningsService.reconcileUserEarnings(creatorId);
        }
      }

      // Initialize values
      let totalEarnings = 0;
      let availableBalance = 0;
      let pendingWithdrawalsTotal = 0;
      
      // Extract profile data if available
      if (profile) {
        console.log("Profile data for earnings:", profile);
        // Use type assertion to access custom fields
        totalEarnings = profile.total_earnings ? parseFloat(profile.total_earnings) : 0;
        availableBalance = profile.available_balance ? parseFloat(profile.available_balance) : 0;
        
        console.log("Extracted from profile - Total earnings:", totalEarnings, "Available balance:", availableBalance);
      } else {
        console.log("No profile data found, calculating earnings from transactions...");
        
        // Calculate earnings from transactions if profile is missing
        const { data: transactions, error: txError } = await supabase
          .from('transactions')
          .select('creator_earnings')
          .eq('creator_id', creatorId)
          .eq('status', 'completed')
          .eq('is_deleted', false);
          
        if (!txError && transactions) {
          totalEarnings = transactions.reduce((sum, tx) => 
            sum + (tx.creator_earnings ? parseFloat(tx.creator_earnings) : 0), 0);
          availableBalance = totalEarnings; // Initially set to same as earnings, will subtract withdrawals
          console.log("Calculated from transactions - Total earnings:", totalEarnings);
        }
      }
      
      // Get pending withdrawals total using direct calculation
      try {
        pendingWithdrawalsTotal = await calculatePendingWithdrawals(creatorId);
        console.log("Pending withdrawals calculated:", pendingWithdrawalsTotal);
        
        // Ensure available balance is properly reduced by pending withdrawals
        if (!profile) {
          availableBalance = Math.max(0, availableBalance - pendingWithdrawalsTotal);
        }
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
}
