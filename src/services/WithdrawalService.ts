
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
      // Since we can't directly use rpc('get_user_withdrawal_details'), we'll use a raw query
      const { data, error } = await supabase
        .from('withdrawal_details')
        .select('*')
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
      // Insert directly into the database instead of using an RPC function
      const { error } = await supabase
        .from('withdrawal_requests')
        .insert({
          user_id: userId,
          amount: values.amount,
          payment_method: 'bank_transfer',
          account_holder_name: values.accountHolderName,
          account_number: values.accountNumber,
          ifsc_code: values.ifscCode,
          bank_name: values.bankName,
          pan_number: values.panNumber,
          pan_name: values.panName,
          phone_number: values.phoneNumber,
          status: 'pending'
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
        });
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
      // Insert directly using table operations instead of RPC
      const { error } = await supabase
        .from('withdrawal_requests')
        .insert({
          user_id: userId,
          amount: values.amount,
          payment_method: 'upi',
          upi_id: values.upiId,
          pan_number: values.panNumber,
          pan_name: values.panName,
          phone_number: values.phoneNumber,
          status: 'pending'
        });
      
      if (error) throw new Error(error.message);
      
      // Save user details if requested
      if (values.saveDetails) {
        await WithdrawalService.saveUserWithdrawalDetails({
          upi_id: values.upiId,
          pan_number: values.panNumber,
          pan_name: values.panName,
          phone_number: values.phoneNumber
        });
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
  private static async saveUserWithdrawalDetails(details: Partial<SavedUserDetails>): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not authenticated");

      // Check if details already exist for this user
      const { data: existingData } = await supabase
        .from('withdrawal_details')
        .select('*')
        .eq('user_id', user.user.id)
        .maybeSingle();
      
      if (existingData) {
        // Update existing details
        await supabase
          .from('withdrawal_details')
          .update(details)
          .eq('user_id', user.user.id);
      } else {
        // Insert new details - need to include user_id which is not in the SavedUserDetails type
        await supabase
          .from('withdrawal_details')
          .insert({
            ...details,
            user_id: user.user.id
          });
      }
    } catch (error) {
      console.error('Error saving withdrawal details:', error);
    }
  }
}
