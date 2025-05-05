
import { supabase } from "@/integrations/supabase/client";

/**
 * Update creator's earnings total and available balance
 */
export async function updateCreatorEarnings(creatorId: string, earnings: number) {
  try {
    console.log(`Updating creator earnings - Creator: ${creatorId}, Earnings: ${earnings}`);
    
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
      console.error("Fetching profile data error:", error);
      
      // If profile doesn't exist, create it
      if (error.code === 'PGRST116') {
        console.log("Profile not found, creating new profile for user:", creatorId);
        await createNewProfile(creatorId, earnings);
        return;
      }
      
      throw error; // Rethrow error to be caught and logged
    } else if (creatorProfile) {
      // Access properties safely
      console.log("Current profile data:", creatorProfile);
      currentTotalEarnings = creatorProfile.total_earnings ? 
        parseFloat(creatorProfile.total_earnings) : 0;
      currentAvailableBalance = creatorProfile.available_balance ? 
        parseFloat(creatorProfile.available_balance) : 0;
    }
    
    // Calculate new values
    const newTotalEarnings = currentTotalEarnings + earnings;
    const newAvailableBalance = currentAvailableBalance + earnings;
    
    console.log(`Updating earnings - Current: ${currentTotalEarnings} → New: ${newTotalEarnings}`);
    console.log(`Updating balance - Current: ${currentAvailableBalance} → New: ${newAvailableBalance}`);
    
    // Update existing profile with new values
    try {
      const { error: updateError, data: updateData } = await supabase
        .from('profiles')
        .update({
          total_earnings: newTotalEarnings.toFixed(2),
          available_balance: newAvailableBalance.toFixed(2),
          updated_at: new Date().toISOString()
        })
        .eq('id', creatorId)
        .select();
        
      if (updateError) {
        console.error("Error updating creator earnings:", updateError);
        throw updateError;
      }
      
      console.log("Profile updated successfully:", updateData);
      return true;
    } catch (updateException) {
      console.error("Exception during profile update:", updateException);
      throw updateException;
    }
  } catch (error) {
    console.error("Error updating creator earnings:", error);
    // Throw the error so it can be handled by the calling function
    throw error;
  }
}

/**
 * Create a new profile for a user with initial earnings
 */
async function createNewProfile(userId: string, initialEarnings: number) {
  try {
    console.log(`Creating new profile for user ${userId} with initial earnings ${initialEarnings}`);
    
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        total_earnings: initialEarnings.toFixed(2),
        available_balance: initialEarnings.toFixed(2),
        updated_at: new Date().toISOString()
      });
      
    if (error) {
      console.error("Error creating new profile:", error);
      throw error;
    }
    
    console.log("New profile created successfully with initial earnings");
  } catch (error) {
    console.error("Exception creating new profile:", error);
    throw error; // Rethrow to be caught by caller
  }
}

/**
 * Reconcile user earnings from transaction history
 * This function recalculates total earnings and available balance
 * based on transaction history, fixing any discrepancies
 */
export async function reconcileUserEarnings(userId: string) {
  try {
    console.log(`Starting earnings reconciliation for user: ${userId}`);
    
    // Get all completed transactions where this user is the creator
    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select('creator_earnings')
      .eq('creator_id', userId)
      .eq('status', 'completed')
      .eq('is_deleted', false);
      
    if (txError) {
      console.error("Error fetching transactions for reconciliation:", txError);
      throw txError;
    }
    
    // Calculate total earnings from transactions
    let totalEarnings = 0;
    if (transactions && transactions.length > 0) {
      totalEarnings = transactions.reduce((sum, tx) => {
        return sum + (tx.creator_earnings ? parseFloat(tx.creator_earnings) : 0);
      }, 0);
    }
    
    console.log(`Calculated total earnings from ${transactions?.length || 0} transactions: ${totalEarnings}`);
    
    // Get withdrawal requests to calculate available balance
    const { data: withdrawals, error: wdError } = await supabase
      .from('withdrawal_requests')
      .select('amount')
      .eq('user_id', userId)
      .in('status', ['completed', 'processing', 'pending']);
      
    if (wdError) {
      console.error("Error fetching withdrawals for reconciliation:", wdError);
      throw wdError;
    }
    
    // Calculate total withdrawn amount
    let totalWithdrawn = 0;
    if (withdrawals && withdrawals.length > 0) {
      totalWithdrawn = withdrawals.reduce((sum, wd) => sum + (wd.amount || 0), 0);
    }
    
    console.log(`Calculated total withdrawals from ${withdrawals?.length || 0} requests: ${totalWithdrawn}`);
    
    // Calculate available balance
    const availableBalance = Math.max(0, totalEarnings - totalWithdrawn);
    console.log(`Calculated available balance: ${availableBalance}`);
    
    // Update the profile with reconciled values
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        total_earnings: totalEarnings.toFixed(2),
        available_balance: availableBalance.toFixed(2),
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
      
    if (updateError) {
      console.error("Error updating profile with reconciled earnings:", updateError);
      throw updateError;
    }
    
    console.log("Earnings reconciliation completed successfully");
    return {
      success: true,
      totalEarnings,
      availableBalance
    };
  } catch (error) {
    console.error("Error during earnings reconciliation:", error);
    return {
      success: false,
      error: "Failed to reconcile earnings"
    };
  }
}
