
import { supabase } from "@/integrations/supabase/client";
import { calculateFees } from "@/utils/paymentUtils";
import { EarningsSummary } from "@/types/transaction";
import { calculatePendingWithdrawals } from "@/utils/paymentUtils";

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
      
      // Check if transaction already exists (prevent duplicate purchases)
      const { data: existingTransactions, error: checkError } = await supabase
        .from('transactions')
        .select('id')
        .eq('content_id', contentId)
        .eq('user_id', userId)
        .eq('is_deleted', false)
        .limit(1);
      
      if (checkError) {
        console.error("Error checking for existing transactions:", checkError);
        throw new Error("Failed to validate transaction uniqueness");
      }
      
      // If transaction already exists, prevent duplicate purchase
      if (existingTransactions && existingTransactions.length > 0) {
        console.log("Transaction already exists, returning success as already purchased");
        return {
          success: true,
          alreadyPurchased: true,
          message: "Content already purchased"
        };
      }

      // Calculate fee distribution
      const { platformFee, creatorEarnings } = calculateFees(
        amount, 
        this.PLATFORM_FEE_PERCENTAGE
      );

      console.log(`Processing payment - Amount: ${amount}, Platform fee: ${platformFee}, Creator earnings: ${creatorEarnings}`);

      // Create transaction record with all fields including fee distribution
      try {
        // Create the basic transaction object first (required fields only)
        const baseTransactionData = {
          content_id: contentId,
          user_id: userId,
          creator_id: creatorId,
          amount: amount.toString(),
          timestamp: new Date().toISOString(),
          is_deleted: false
        };
        
        // Handle potential schema cache issues by inserting in two stages if needed
        try {
          // First attempt: Try inserting with all fields including fee distribution
          const fullTransactionData = {
            ...baseTransactionData,
            platform_fee: platformFee.toString(),
            creator_earnings: creatorEarnings.toString(),
            status: 'completed'
          };
          
          const { data, error } = await supabase
            .from('transactions')
            .insert(fullTransactionData)
            .select();
            
          if (error) {
            // If schema cache error, throw to trigger fallback
            if (error.message?.includes("column") || error.message?.includes("schema cache")) {
              console.warn("Schema cache issue detected, trying fallback insertion:", error);
              throw new Error("Schema cache error");
            }
            
            // If the error indicates a duplicate purchase
            if (error.code === '23505' || error.message?.includes("duplicate")) {
              console.log("Duplicate transaction detected via error, treating as success");
              return {
                success: true,
                alreadyPurchased: true,
                message: "Content already purchased"
              };
            }
            
            throw error;
          }
          
          console.log("Transaction recorded successfully with full data:", data);
          return {
            success: true,
            platformFee,
            creatorEarnings
          };
          
        } catch (schemaError: any) {
          // Fallback: Try inserting with just the base fields if there was a schema error
          console.warn("Using fallback transaction insertion with base fields only");
          
          const { data: baseData, error: baseError } = await supabase
            .from('transactions')
            .insert(baseTransactionData)
            .select();
            
          if (baseError) {
            // If this also fails with a duplicate error, treat as success
            if (baseError.code === '23505' || baseError.message?.includes("duplicate")) {
              return {
                success: true,
                alreadyPurchased: true,
                message: "Content already purchased"
              };
            }
            
            throw baseError;
          }
          
          console.log("Transaction recorded successfully with basic data:", baseData);
        }
      } catch (insertError: any) {
        console.error("Exception during transaction insert:", insertError);
        
        // One last check before failing - see if the transaction was actually created
        const { data: finalCheck } = await supabase
          .from('transactions')
          .select('id')
          .eq('content_id', contentId)
          .eq('user_id', userId)
          .limit(1);
          
        if (finalCheck && finalCheck.length > 0) {
          console.log("Transaction exists after error check, treating as success");
          return {
            success: true,
            alreadyPurchased: true,
            message: "Content already purchased"
          };
        }
        
        throw new Error("Failed to process payment: " + (insertError.message || "Unknown error"));
      }

      // Attempt to update creator's earnings, but only add the creator_earnings amount (not the full amount)
      try {
        await this.updateCreatorEarnings(creatorId, creatorEarnings);
      } catch (earningsError) {
        console.warn("Could not update creator earnings, but transaction was recorded:", earningsError);
        // Non-fatal error, continue
      }

      return {
        success: true,
        platformFee,
        creatorEarnings
      };
    } catch (error: any) {
      console.error("Payment processing error:", error);
      return {
        success: false,
        error: error.message || "Unknown payment error"
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
        .select('id, total_earnings, available_balance')
        .eq('id', creatorId)
        .single();

      // Initialize values, handling the case where fields might not exist yet
      let currentTotalEarnings = 0;
      let currentAvailableBalance = 0;
      
      if (error) {
        console.log("Fetching profile data error:", error);
      } else if (creatorProfile) {
        // Access properties safely
        const profile = creatorProfile as any;
        currentTotalEarnings = profile.total_earnings ? 
          parseFloat(profile.total_earnings) : 0;
        currentAvailableBalance = profile.available_balance ? 
          parseFloat(profile.available_balance) : 0;
      }
      
      // Debug log to verify the earnings are being added correctly
      console.log(`Updating creator earnings. Current total: ${currentTotalEarnings}, Current balance: ${currentAvailableBalance}`);
      console.log(`Adding creator earnings (after fee): ${earnings}`);
      
      // Update existing profile with new values
      const newTotalEarnings = currentTotalEarnings + earnings;
      const newAvailableBalance = currentAvailableBalance + earnings;
      
      console.log(`New total earnings: ${newTotalEarnings}, New balance: ${newAvailableBalance}`);
      
      try {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            total_earnings: newTotalEarnings.toFixed(2),
            available_balance: newAvailableBalance.toFixed(2),
            updated_at: new Date().toISOString()
          })
          .eq('id', creatorId);
          
        if (updateError) {
          console.error("Error updating creator earnings:", updateError);
        } else {
          console.log("Creator earnings updated successfully");
        }
      } catch (updateException) {
        console.error("Exception during profile update:", updateException);
      }
    } catch (error) {
      console.error("Error updating creator earnings:", error);
      // We don't throw here to prevent transaction failure
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
}
