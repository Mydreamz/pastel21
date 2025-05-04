
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
      // Use Supabase directly with raw query approach since withdrawal_details isn't in types
      const { data, error } = await supabase
        .rpc('get_user_withdrawal_details')
        .single();
      
      if (error) {
        // Only throw if it's not a "no rows returned" error
        if (error.code !== 'PGRST116') throw error;
        return null;
      }
      
      return data as SavedUserDetails || null;
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
      // Insert directly into the database using a raw query approach
      const { error } = await supabase.rpc('create_bank_withdrawal_request', {
        user_id_param: userId,
        amount_param: values.amount,
        account_holder_name_param: values.accountHolderName,
        account_number_param: values.accountNumber,
        ifsc_code_param: values.ifscCode,
        bank_name_param: values.bankName,
        pan_number_param: values.panNumber,
        pan_name_param: values.panName,
        phone_number_param: values.phoneNumber
      });
      
      if (error) throw new Error(error.message);
      
      // Save user details if requested
      if (values.saveDetails) {
        await WithdrawalService.saveUserWithdrawalDetails({
          account_holder_name: values.accountHolderName,
          account_number: values.accountNumber,
          ifsc_code: values.ifscCode,
          bank_name: values.bankName,
          pan_number: values.panNumber,
          pan_name: values.panName,
          phone_number: values.phoneNumber
        }, userId);
      }
      
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
      // Insert directly using RPC instead of direct table access
      const { error } = await supabase.rpc('create_upi_withdrawal_request', {
        user_id_param: userId,
        amount_param: values.amount,
        upi_id_param: values.upiId,
        pan_number_param: values.panNumber,
        pan_name_param: values.panName,
        phone_number_param: values.phoneNumber
      });
      
      if (error) throw new Error(error.message);
      
      // Save user details if requested
      if (values.saveDetails) {
        await WithdrawalService.saveUserWithdrawalDetails({
          upi_id: values.upiId,
          pan_number: values.panNumber,
          pan_name: values.panName,
          phone_number: values.phoneNumber
        }, userId);
      }
      
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
   */
  private static async saveUserWithdrawalDetails(details: Partial<SavedUserDetails>, userId: string): Promise<void> {
    try {
      // Save the withdrawal details using an RPC function
      await supabase.rpc('save_user_withdrawal_details', {
        user_id_param: userId,
        details_param: details
      });
    } catch (error) {
      console.error('Error saving withdrawal details:', error);
    }
  }
}
