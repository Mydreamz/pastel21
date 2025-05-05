
import { supabase } from "@/integrations/supabase/client";
import { PaymentDistributionService } from "@/services/payment/PaymentDistributionService";

/**
 * Reconcile a user's earnings and balance based on transaction history
 * This is useful when there's a discrepancy between transactions and profile balance
 */
export async function reconcileUserBalance(userId: string) {
  try {
    console.log(`Starting balance reconciliation for user: ${userId}`);
    
    // Get all completed transactions for this user
    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select('creator_earnings')
      .eq('creator_id', userId)
      .eq('status', 'completed')
      .eq('is_deleted', false);
      
    if (txError) {
      console.error("Error fetching transactions for reconciliation:", txError);
      return {
        success: false,
        message: "Failed to fetch transactions",
        error: txError.message
      };
    }
    
    // Calculate total earnings from transactions
    let totalEarnings = 0;
    if (transactions && transactions.length > 0) {
      totalEarnings = transactions.reduce((sum, tx) => 
        sum + (tx.creator_earnings ? parseFloat(tx.creator_earnings) : 0), 0);
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
      return {
        success: false,
        message: "Failed to fetch withdrawals",
        error: wdError.message
      };
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
      return {
        success: false,
        message: "Failed to update profile",
        error: updateError.message
      };
    }
    
    console.log("Balance reconciliation completed successfully");
    return {
      success: true,
      message: "Balance successfully reconciled",
      totalEarnings,
      availableBalance
    };
  } catch (error) {
    console.error("Error in reconcileUserBalance:", error);
    return {
      success: false,
      message: "Error reconciling balance",
      error: String(error)
    };
  }
}

/**
 * Refresh a user's balance from the database
 * Useful when the UI balance might be out of sync
 */
export async function refreshUserBalance(userId: string) {
  try {
    console.log(`Refreshing balance for user: ${userId}`);
    
    // First try to get profile data
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('total_earnings, available_balance')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error("Error fetching profile for balance refresh:", error);
      
      // If profile doesn't exist, try to reconcile
      if (error.code === 'PGRST116') {
        return reconcileUserBalance(userId);
      }
      
      return {
        success: false,
        message: "Failed to refresh balance",
        error: error.message
      };
    }
    
    // Force reconciliation to ensure accurate balance
    console.log("Performing full reconciliation to ensure accurate balance");
    return reconcileUserBalance(userId);
  } catch (error) {
    console.error("Error in refreshUserBalance:", error);
    return {
      success: false,
      message: "Error refreshing balance",
      error: String(error)
    };
  }
}
