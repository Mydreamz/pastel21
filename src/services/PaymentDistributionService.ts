
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
        // Access properties using type assertion since TypeScript doesn't know about these fields yet
        const profile = creatorProfile as any;
        currentTotalEarnings = profile.total_earnings ? 
          parseFloat(profile.total_earnings) : 0;
        currentAvailableBalance = profile.available_balance ? 
          parseFloat(profile.available_balance) : 0;
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
        // Use type assertion to access custom fields
        const profileData = profile as any;
        totalEarnings = profileData.total_earnings ? parseFloat(profileData.total_earnings) : 0;
        availableBalance = profileData.available_balance ? parseFloat(profileData.available_balance) : 0;
      }
      
      // Get pending withdrawals total using a custom API endpoint
      // This avoids TypeScript errors with direct RPC calls
      try {
        const response = await fetch('/api/calculate-pending-withdrawals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId: creatorId })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data?.total) {
            pendingWithdrawalsTotal = Number(data.total);
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
