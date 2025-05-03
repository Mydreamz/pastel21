
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
      const response = await fetch('/api/withdrawal-requests', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      const { data, error } = await response.json();
      
      if (error) throw new Error(error);
      
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
      const response = await fetch('/api/withdrawal-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
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
          status: 'pending',
          saveDetails: values.saveDetails
        })
      });
      
      const { error } = await response.json();
      
      if (error) throw new Error(error);
      
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
      const response = await fetch('/api/withdrawal-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          user_id: userId,
          amount: values.amount,
          upi_id: values.upiId,
          pan_number: values.panNumber,
          pan_name: values.panName,
          phone_number: values.phoneNumber,
          payment_method: 'upi',
          status: 'pending',
          saveDetails: values.saveDetails
        })
      });
      
      const { error } = await response.json();
      
      if (error) throw new Error(error);
      
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || "Failed to submit withdrawal request" 
      };
    }
  }
}
