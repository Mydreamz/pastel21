
import { supabase } from "@/integrations/supabase/client";
import { SavedUserDetails } from "@/types/transaction";
import { createCacheableRequest } from "@/utils/requestUtils";
import { encryptionUtils } from "@/utils/encryptionUtils";

/**
 * Service for handling withdrawal-related API calls with improved caching and encryption
 */
export class WithdrawalService {
  /**
   * Internal request tracking to prevent duplicate in-flight requests
   */
  private static inFlightRequests: Record<string, Promise<any>> = {};
  
  /**
   * Fields that should be encrypted when saving withdrawal details
   */
  private static SENSITIVE_FIELDS = [
    'account_number',
    'ifsc_code',
    'upi_id',
    'pan_number',
    'phone_number'
  ];
  
  /**
   * Get a unique key for tracking requests
   */
  private static getRequestKey(method: string, userId: string): string {
    return `${method}-${userId}`;
  }
  
  /**
   * Fetch saved withdrawal details for a user
   */
  static async _getSavedWithdrawalDetails(accessToken: string): Promise<SavedUserDetails | null> {
    try {
      // Use the edge function to get user withdrawal details
      const { data, error } = await supabase.functions.invoke('withdrawal-requests', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      if (error) throw error;
      
      // Decrypt sensitive fields if data exists
      if (data?.data) {
        return await encryptionUtils.decryptFields(
          data.data as SavedUserDetails, 
          this.SENSITIVE_FIELDS
        );
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching saved details:', error);
      return null;
    }
  }

  /**
   * Cached version of getSavedWithdrawalDetails
   * The cache will last for 2 minutes to reduce repeated requests
   */
  static getSavedWithdrawalDetails = createCacheableRequest(
    WithdrawalService._getSavedWithdrawalDetails,
    2 * 60 * 1000 // 2 minutes cache
  );

  /**
   * Submit a bank withdrawal request with deduplication for in-flight requests
   */
  static async submitBankWithdrawal(
    values: any, 
    userId: string, 
    accessToken: string
  ): Promise<{success: boolean, error?: string}> {
    // Create a unique request key
    const requestKey = WithdrawalService.getRequestKey('bank-withdrawal', userId);
    
    // If we already have a request in progress, wait for it
    if (WithdrawalService.inFlightRequests[requestKey]) {
      try {
        return await WithdrawalService.inFlightRequests[requestKey];
      } catch (error: any) {
        return { 
          success: false, 
          error: error.message || "Failed to submit withdrawal request" 
        };
      }
    }
    
    // Create a new request
    const requestPromise = (async () => {
      try {
        // Encrypt sensitive data before sending to the edge function
        const sensitiveData = {
          account_number: values.accountNumber,
          ifsc_code: values.ifscCode,
          pan_number: values.panNumber,
          phone_number: values.phoneNumber
        };
        
        const encryptedData = await encryptionUtils.encryptFields(sensitiveData, Object.keys(sensitiveData));
        
        // Use the edge function to submit bank withdrawal request with encrypted data
        const { data, error } = await supabase.functions.invoke('withdrawal-requests', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          body: {
            account_holder_name: values.accountHolderName,
            account_number: encryptedData.account_number,
            ifsc_code: encryptedData.ifsc_code,
            bank_name: values.bankName,
            pan_number: encryptedData.pan_number,
            pan_name: values.panName,
            phone_number: encryptedData.phone_number,
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
      } finally {
        // Remove the in-flight request tracking
        delete WithdrawalService.inFlightRequests[requestKey];
      }
    })();
    
    // Track this request
    WithdrawalService.inFlightRequests[requestKey] = requestPromise;
    
    return requestPromise;
  }

  /**
   * Submit a UPI withdrawal request with deduplication for in-flight requests
   */
  static async submitUpiWithdrawal(
    values: any, 
    userId: string, 
    accessToken: string
  ): Promise<{success: boolean, error?: string}> {
    // Create a unique request key
    const requestKey = WithdrawalService.getRequestKey('upi-withdrawal', userId);
    
    // If we already have a request in progress, wait for it
    if (WithdrawalService.inFlightRequests[requestKey]) {
      try {
        return await WithdrawalService.inFlightRequests[requestKey];
      } catch (error: any) {
        return { 
          success: false, 
          error: error.message || "Failed to submit withdrawal request" 
        };
      }
    }
    
    // Create a new request
    const requestPromise = (async () => {
      try {
        // Encrypt sensitive data before sending to the edge function
        const sensitiveData = {
          upi_id: values.upiId,
          pan_number: values.panNumber,
          phone_number: values.phoneNumber
        };
        
        const encryptedData = await encryptionUtils.encryptFields(sensitiveData, Object.keys(sensitiveData));
        
        // Use the edge function to submit UPI withdrawal request with encrypted data
        const { data, error } = await supabase.functions.invoke('withdrawal-requests', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          body: {
            upi_id: encryptedData.upi_id,
            pan_number: encryptedData.pan_number,
            pan_name: values.panName,
            phone_number: encryptedData.phone_number,
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
      } finally {
        // Remove the in-flight request tracking
        delete WithdrawalService.inFlightRequests[requestKey];
      }
    })();
    
    // Track this request
    WithdrawalService.inFlightRequests[requestKey] = requestPromise;
    
    return requestPromise;
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
