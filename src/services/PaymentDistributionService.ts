import { supabase } from "@/integrations/supabase/client";
import { calculateFees, validateTransaction, calculatePendingWithdrawals } from "@/utils/paymentUtils";
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
        return {
          success: false,
          error: "You've already purchased this content",
          alreadyPurchased: true
        };
      }

      // Calculate fee distribution
      const { platformFee, creatorEarnings } = calculateFees(
        amount, 
        this.PLATFORM_FEE_PERCENTAGE
      );

      console.log(`Processing payment - Amount: ${amount}, Platform fee: ${platformFee}, Creator earnings: ${creatorEarnings}`);

      // First, ensure the columns exist in the transactions table
      try {
        // Force refresh the schema cache with a simple query
        await supabase.from('transactions').select('id').limit(1);
      } catch (err) {
        console.log("Pre-check query executed");
      }

      // Create transaction record - convert numbers to strings for Supabase
      try {
        const { data: transaction, error } = await supabase
          .from('transactions')
          .insert({
            content_id: contentId,
            user_id: userId,
            creator_id: creatorId,
            amount: amount.toString(),
            platform_fee: platformFee.toString(),
            creator_earnings: creatorEarnings.toString(),
            timestamp: new Date().toISOString(),
            status: 'completed'
          })
          .select()
          .single();

        if (error) {
          // If the error is a duplicate row violation, it means the content was already purchased
          if (error.code === '23505') { // PostgreSQL unique constraint violation
            return {
              success: false,
              error: "You've already purchased this content",
              alreadyPurchased: true
            };
          }
          
          // If the error is related to missing columns, try an alternate approach
          if (error.message && error.message.includes("column") && error.message.includes("does not exist")) {
            console.error("Column missing error, trying alternative approach:", error);
            
            // Try inserting with only the basic fields that are guaranteed to exist
            const { data: basicTransaction, error: basicError } = await supabase
              .from('transactions')
              .insert({
                content_id: contentId,
                user_id: userId,
                creator_id: creatorId,
                amount: amount.toString(),
                timestamp: new Date().toISOString()
              })
              .select()
              .single();
              
            if (basicError) {
              console.error("Even basic transaction failed:", basicError);
              throw new Error("Failed to record transaction: " + basicError.message);
            }
            
            // If basic transaction succeeded, continue with the process
            console.log("Basic transaction recorded successfully:", basicTransaction);
          } else {
            console.error("Transaction recording error:", error);
            throw new Error("Failed to record transaction: " + error.message);
          }
        }
      } catch (insertError) {
        console.error("Exception during transaction insert:", insertError);
        throw new Error("Failed to process payment: " + (insertError instanceof Error ? insertError.message : "Unknown error"));
      }

      // Update creator's earnings in their profile
      await this.updateCreatorEarnings(creatorId, creatorEarnings);

      return {
        success: true,
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
      
      // Debug log to verify the earnings are being added correctly
      console.log(`Updating creator earnings. Current total: ${currentTotalEarnings}, Current balance: ${currentAvailableBalance}`);
      console.log(`Adding creator earnings (after fee): ${earnings}`);
      
      // Update existing profile with new values
      // IMPORTANT: Only add the creator earnings (after platform fee deduction)
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
          // If columns don't exist, try a different approach
          if (updateError.message && updateError.message.includes("column") && updateError.message.includes("does not exist")) {
            console.log("Profile columns missing, trying to update only existing fields");
            
            // Try updating just the basic fields
            const { error: basicUpdateError } = await supabase
              .from('profiles')
              .update({
                updated_at: new Date().toISOString()
              })
              .eq('id', creatorId);
              
            if (basicUpdateError) {
              console.error("Basic profile update failed:", basicUpdateError);
            } else {
              console.log("Basic profile update succeeded, but earnings were not recorded");
            }
          } else {
            console.error("Error updating creator earnings:", updateError);
          }
        } else {
          console.log("Creator earnings updated successfully");
        }
      } catch (updateException) {
        console.error("Exception during profile update:", updateException);
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
