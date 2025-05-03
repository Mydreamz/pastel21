
import { supabase } from "@/integrations/supabase/client";
import { calculateFees, validateTransaction } from "@/utils/paymentUtils";
import { EarningsSummary } from "@/types/transaction";

export class PaymentDistributionService {
  private static PLATFORM_FEE_PERCENTAGE = 7;

  /**
   * Process a payment, distributing funds between platform and creator
   */
  static async processPayment(contentId: string, userId: string, creatorId: string, amount: number) {
    try {
      // Validate inputs
      if (!contentId || !userId || !creatorId || amount <= 0) {
        throw new Error("Invalid payment parameters");
      }

      // Calculate fee distribution
      const { platformFee, creatorEarnings } = calculateFees(
        amount, 
        this.PLATFORM_FEE_PERCENTAGE
      );

      // Create transaction record - convert numbers to strings for Supabase
      const { data: transaction, error } = await supabase
        .from('transactions')
        .insert({
          content_id: contentId,
          user_id: userId,
          creator_id: creatorId,
          amount: amount.toString(), // Convert to string for Supabase
          platform_fee: platformFee.toString(), // Convert to string for Supabase
          creator_earnings: creatorEarnings.toString(), // Convert to string for Supabase
          timestamp: new Date().toISOString(),
          status: 'completed'
        })
        .select()
        .single();

      if (error) {
        console.error("Transaction recording error:", error);
        throw new Error("Failed to record transaction");
      }

      // Update creator's earnings in their profile
      await this.updateCreatorEarnings(creatorId, creatorEarnings);

      return {
        success: true,
        transaction,
        platformFee,
        creatorEarnings
      };
    } catch (error) {
      console.error("Payment processing error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown payment error"
      };
    }
  }

  /**
   * Update creator's earnings total
   */
  private static async updateCreatorEarnings(creatorId: string, earnings: number) {
    try {
      // First get current creator profile
      const { data: creatorProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', creatorId)
        .single();

      // Initialize values, handling the case where fields might not exist yet
      let currentTotalEarnings = 0;
      let currentAvailableBalance = 0;
      
      if (error) {
        // Handle case where profile doesn't exist or columns might not exist yet
        console.log("Fetching profile data error:", error);
      } else if (creatorProfile) {
        // Safely access properties that might not exist yet
        currentTotalEarnings = creatorProfile.total_earnings ? 
          parseFloat(creatorProfile.total_earnings as string) : 0;
        currentAvailableBalance = creatorProfile.available_balance ? 
          parseFloat(creatorProfile.available_balance as string) : 0;
      }
      
      // Update existing profile with new values
      const newTotalEarnings = currentTotalEarnings + earnings;
      const newAvailableBalance = currentAvailableBalance + earnings;
      
      await supabase
        .from('profiles')
        .update({
          total_earnings: newTotalEarnings.toString(),
          available_balance: newAvailableBalance.toString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', creatorId);
    } catch (error) {
      console.error("Error updating creator earnings:", error);
      // We don't throw here to prevent transaction failure, 
      // but log for administrative review
    }
  }

  /**
   * Get a creator's earnings summary
   */
  static async getCreatorEarningsSummary(creatorId: string): Promise<EarningsSummary> {
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
        totalEarnings = profile.total_earnings ? parseFloat(profile.total_earnings as string) : 0;
        availableBalance = profile.available_balance ? parseFloat(profile.available_balance as string) : 0;
      }
      
      // Get pending withdrawals total using RPC function or direct query
      try {
        // Try using an RPC function first (safer approach)
        const { data: pendingData, error: rpcError } = await supabase.rpc('get_pending_withdrawals', {
          user_id_param: creatorId
        });
        
        if (!rpcError && pendingData !== null) {
          pendingWithdrawalsTotal = parseFloat(pendingData);
        } else {
          // Fallback: Direct query (may fail if table doesn't exist)
          console.log("RPC function not available, trying direct query");
          
          // Check if the withdrawal_requests table exists first
          const { count, error: countError } = await supabase
            .from('withdrawal_requests')
            .select('*', { count: 'exact', head: true })
            .limit(1);
            
          if (!countError) {
            // Table exists, proceed with query
            const { data: requests } = await supabase
              .from('withdrawal_requests')
              .select('amount')
              .eq('user_id', creatorId)
              .in('status', ['pending', 'processing']);
              
            if (requests && requests.length > 0) {
              pendingWithdrawalsTotal = requests.reduce(
                (total, req) => total + (typeof req.amount === 'string' ? 
                  parseFloat(req.amount) : (req.amount as number)), 0
              );
            }
          }
        }
      } catch (err) {
        console.error("Error checking withdrawals:", err);
      }

      // Get transaction count
      const { count: transactionCount } = await supabase
        .from('transactions')
        .select('id', { count: 'exact', head: true })
        .eq('creator_id', creatorId);

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
}
