
import { supabase } from "@/integrations/supabase/client";
import { SavedUserDetails } from "@/types/transaction";

/**
 * Service for handling withdrawal-related API calls
 */
export class WithdrawalService {
  /**
   * Fetch saved withdrawal details for a user
   */
  static async getSavedWithdrawalDetails(accessToken: string): Promise<SavedUserDetails | null> {
    try {
      // Use the edge function to get user withdrawal details
      const { data, error } = await supabase.functions.invoke('withdrawal-requests', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      if (error) throw error;
      return data?.data as SavedUserDetails || null;
    } catch (error) {
      console.error('Error fetching saved details:', error);
      return null;
    }
  }

  /**
   * Submit a bank withdrawal request
   */
  static async submitBankWithdrawal(values: any, userId: string, accessToken: string): Promise<{success: boolean, error?: string}> {
    try {
      // Use the edge function to submit bank withdrawal request
      const { data, error } = await supabase.functions.invoke('withdrawal-requests', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        body: {
          account_holder_name: values.accountHolderName,
          account_number: values.accountNumber,
          ifsc_code: values.ifscCode,
          bank_name: values.bankName,
          pan_number: values.panNumber,
          pan_name: values.panName,
          phone_number: values.phoneNumber,
          amount: values.amount,
          payment_method: 'bank_transfer',
          saveDetails: values.saveDetails
        }
      });
      
      if (error) throw new Error(error.message);
      
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || "Failed to submit withdrawal request" 
      };
    }
  }

  /**
   * Submit a UPI withdrawal request
   */
  static async submitUpiWithdrawal(values: any, userId: string, accessToken: string): Promise<{success: boolean, error?: string}> {
    try {
      // Use the edge function to submit UPI withdrawal request
      const { data, error } = await supabase.functions.invoke('withdrawal-requests', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        body: {
          upi_id: values.upiId,
          pan_number: values.panNumber,
          pan_name: values.panName,
          phone_number: values.phoneNumber,
          amount: values.amount,
          payment_method: 'upi',
          saveDetails: values.saveDetails
        }
      });
      
      if (error) throw new Error(error.message);
      
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || "Failed to submit withdrawal request" 
      };
    }
  }

  /**
   * Save user's withdrawal details for future use
   * Note: This functionality is now handled by the edge function when submitting a withdrawal request
   */
  private static async saveUserWithdrawalDetails(details: Partial<SavedUserDetails>): Promise<void> {
    try {
      // This functionality is now handled by the edge function
      console.log("Saving withdrawal details is handled by the edge function");
    } catch (error) {
      console.error('Error saving withdrawal details:', error);
    }
  }
}
