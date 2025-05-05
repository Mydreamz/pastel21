
import { supabase } from "@/integrations/supabase/client";
import { PaymentDistributionService } from "@/services/payment/PaymentDistributionService";

/**
 * Reconcile a user's earnings and balance based on transaction history
 * This is useful when there's a discrepancy between transactions and profile balance
 */
export async function reconcileUserBalance(userId: string) {
  try {
    console.log(`Starting balance reconciliation for user: ${userId}`);
    
    const result = await PaymentDistributionService.reconcileUserEarnings(userId);
    
    if (result.success) {
      console.log(`Reconciliation successful - Total earnings: ${result.totalEarnings}, Available balance: ${result.availableBalance}`);
      return {
        success: true,
        message: "Balance successfully reconciled",
        totalEarnings: result.totalEarnings,
        availableBalance: result.availableBalance
      };
    } else {
      console.error("Reconciliation failed:", result.error);
      return {
        success: false,
        message: "Failed to reconcile balance",
        error: result.error
      };
    }
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
    
    // Get the latest earnings summary to ensure we have the most up-to-date data
    const summary = await PaymentDistributionService.getCreatorEarningsSummary(userId);
    
    console.log(`Refreshed balance - Profile: ${profile?.available_balance || 0}, Summary: ${summary.available_balance}`);
    
    // If there's a significant discrepancy, reconcile
    const profileBalance = profile?.available_balance ? parseFloat(profile.available_balance) : 0;
    if (Math.abs(profileBalance - summary.available_balance) > 0.01) {
      console.log("Balance discrepancy detected, reconciling...");
      return reconcileUserBalance(userId);
    }
    
    return {
      success: true,
      message: "Balance refreshed successfully",
      totalEarnings: summary.total_earnings,
      availableBalance: summary.available_balance
    };
  } catch (error) {
    console.error("Error in refreshUserBalance:", error);
    return {
      success: false,
      message: "Error refreshing balance",
      error: String(error)
    };
  }
}
