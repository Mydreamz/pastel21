
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
        .select('total_earnings, available_balance')
        .eq('id', creatorId)
        .single();

      if (error) {
        // Handle case where columns might not exist yet
        console.log("Fetching profile data error:", error);
      }

      // Initialize values, handling the case where fields might not exist yet
      const currentTotalEarnings = creatorProfile?.total_earnings ? parseFloat(creatorProfile.total_earnings) : 0;
      const currentAvailableBalance = creatorProfile?.available_balance ? parseFloat(creatorProfile.available_balance) : 0;
      
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
        .select('total_earnings, available_balance')
        .eq('id', creatorId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
      }

      // Get pending withdrawals total - temporarily disabled until table exists
      let pendingWithdrawalsTotal = 0;
      try {
        // Check if the withdrawal_requests table exists
        const { error: tableCheckError } = await supabase
          .from('withdrawal_requests')
          .select('id')
          .limit(1);

        if (!tableCheckError) {
          // Table exists, fetch withdrawal data
          const { data: pendingWithdrawals } = await supabase
            .from('withdrawal_requests')
            .select('amount')
            .eq('user_id', creatorId)
            .in('status', ['pending', 'processing']);

          pendingWithdrawalsTotal = pendingWithdrawals?.reduce(
            (total, withdrawal) => total + parseFloat(withdrawal.amount), 
            0
          ) || 0;
        }
      } catch (withdrawalError) {
        console.error("Error checking withdrawals:", withdrawalError);
      }

      // Get transaction count
      const { count: transactionCount } = await supabase
        .from('transactions')
        .select('id', { count: 'exact', head: true })
        .eq('creator_id', creatorId);

      // Handle cases where profile data might not exist yet
      const totalEarnings = profile?.total_earnings ? parseFloat(profile.total_earnings) : 0;
      const availableBalance = profile?.available_balance ? parseFloat(profile.available_balance) : 0;

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
