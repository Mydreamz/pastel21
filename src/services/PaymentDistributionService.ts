
import { supabase } from "@/integrations/supabase/client";
import { calculateFees, validateTransaction } from "@/utils/paymentUtils";

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

      // Create transaction record
      const { data: transaction, error } = await supabase
        .from('transactions')
        .insert({
          content_id: contentId,
          user_id: userId,
          creator_id: creatorId,
          amount: amount,
          platform_fee: platformFee,
          creator_earnings: creatorEarnings,
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
      const { data: creatorProfile } = await supabase
        .from('profiles')
        .select('total_earnings, available_balance')
        .eq('id', creatorId)
        .single();

      if (!creatorProfile) {
        // Create profile if it doesn't exist
        await supabase
          .from('profiles')
          .insert({
            id: creatorId,
            total_earnings: earnings,
            available_balance: earnings,
            updated_at: new Date().toISOString()
          });
      } else {
        // Update existing profile
        const newTotalEarnings = (creatorProfile.total_earnings || 0) + earnings;
        const newAvailableBalance = (creatorProfile.available_balance || 0) + earnings;
        
        await supabase
          .from('profiles')
          .update({
            total_earnings: newTotalEarnings,
            available_balance: newAvailableBalance,
            updated_at: new Date().toISOString()
          })
          .eq('id', creatorId);
      }
    } catch (error) {
      console.error("Error updating creator earnings:", error);
      // We don't throw here to prevent transaction failure, 
      // but log for administrative review
    }
  }

  /**
   * Get a creator's earnings summary
   */
  static async getCreatorEarningsSummary(creatorId: string) {
    try {
      // Get creator profile with earnings data
      const { data: profile } = await supabase
        .from('profiles')
        .select('total_earnings, available_balance')
        .eq('id', creatorId)
        .single();

      // Get pending withdrawals total
      const { data: pendingWithdrawals, error: withdrawalError } = await supabase
        .from('withdrawal_requests')
        .select('amount')
        .eq('user_id', creatorId)
        .in('status', ['pending', 'processing']);

      if (withdrawalError) {
        console.error("Error fetching pending withdrawals:", withdrawalError);
      }

      // Calculate total pending withdrawals
      const pendingWithdrawalsTotal = pendingWithdrawals?.reduce(
        (total, withdrawal) => total + withdrawal.amount, 
        0
      ) || 0;

      // Get transaction count
      const { count: transactionCount } = await supabase
        .from('transactions')
        .select('id', { count: 'exact', head: true })
        .eq('creator_id', creatorId);

      return {
        total_earnings: profile?.total_earnings || 0,
        available_balance: profile?.available_balance || 0,
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
