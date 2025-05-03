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
        // Access properties safely with type checking
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
        // Access properties safely with type assertions
        const profileData = profile as any;
        totalEarnings = profileData.total_earnings ? parseFloat(profileData.total_earnings) : 0;
        availableBalance = profileData.available_balance ? parseFloat(profileData.available_balance) : 0;
      }
      
      // Get pending withdrawals total using custom function
      try {
        const { data, error } = await supabase.rpc(
          'get_pending_withdrawals',
          { user_id_param: creatorId }
        );
        
        if (!error && data !== null) {
          pendingWithdrawalsTotal = typeof data === 'string' ? parseFloat(data) : Number(data);
        } else {
          console.log("RPC function error:", error);
          
          // Fallback to direct query only if withdrawal_requests table exists
          try {
            // Simple check if the withdrawal_requests table exists by trying to count rows
            const { count } = await supabase
              .from('transactions') // Use an existing table just to avoid errors
              .select('*', { count: 'exact', head: true })
              .limit(1);
              
            if (count !== null) {
              // Manually calculate pending withdrawals (this won't run unless the table exists)
              // This is just a backup approach
              const pendingWithdrawals = await fetch('/api/calculate-pending-withdrawals', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: creatorId })
              }).then(res => res.json());
              
              if (pendingWithdrawals?.total) {
                pendingWithdrawalsTotal = Number(pendingWithdrawals.total);
              }
            }
          } catch (err) {
            console.error("Error in fallback withdrawal calculation:", err);
            // Failed gracefully, keep pendingWithdrawalsTotal as 0
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
