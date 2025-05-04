
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
      // Use Supabase directly instead of calling the Edge Function
      const { data, error } = await supabase
        .from('withdrawal_details')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id || '')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      return data || null;
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
      // Insert directly into the database instead of using an Edge Function
      const { error } = await supabase
        .from('withdrawal_requests')
        .insert({
          user_id: userId,
          amount: values.amount,
          account_holder_name: values.accountHolderName,
          account_number: values.accountNumber,
          ifsc_code: values.ifscCode,
          bank_name: values.bankName,
          pan_number: values.panNumber,
          pan_name: values.panName,
          phone_number: values.phoneNumber,
          payment_method: 'bank_transfer',
          status: 'pending'
        });
      
      if (error) throw new Error(error.message);
      
      // Save user details if requested
      if (values.saveDetails) {
        await WithdrawalService.saveUserWithdrawalDetails({
          user_id: userId,
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
      // Insert directly into the database instead of using an Edge Function
      const { error } = await supabase
        .from('withdrawal_requests')
        .insert({
          user_id: userId,
          amount: values.amount,
          upi_id: values.upiId,
          pan_number: values.panNumber,
          pan_name: values.panName,
          phone_number: values.phoneNumber,
          payment_method: 'upi',
          status: 'pending'
        });
      
      if (error) throw new Error(error.message);
      
      // Save user details if requested
      if (values.saveDetails) {
        await WithdrawalService.saveUserWithdrawalDetails({
          user_id: userId,
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
      // Check if details already exist for this user
      const { data: existingDetails } = await supabase
        .from('withdrawal_details')
        .select('*')
        .eq('user_id', details.user_id || '')
        .single();
      
      if (existingDetails) {
        // Update existing details
        await supabase
          .from('withdrawal_details')
          .update(details)
          .eq('user_id', details.user_id || '');
      } else {
        // Insert new details
        await supabase
          .from('withdrawal_details')
          .insert(details);
      }
    } catch (error) {
      console.error('Error saving withdrawal details:', error);
    }
  }
}
