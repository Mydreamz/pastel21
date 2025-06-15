
import { supabase } from '@/integrations/supabase/client';
import { TransactionResult } from '@/types/transaction';

interface PaytmPaymentRequest {
  contentId: string;
  userId: string;
  creatorId: string;
  amount: number;
}

interface PaytmInitiateResponse {
  success: boolean;
  data?: {
    MID: string;
    WEBSITE: string;
    INDUSTRY_TYPE_ID: string;
    CHANNEL_ID: string;
    ORDER_ID: string;
    CUST_ID: string;
    TXN_AMOUNT: string;
    CALLBACK_URL: string;
    CHECKSUMHASH: string;
    sessionId: string;
  };
  redirectUrl?: string;
  error?: string;
}

interface PaytmStatusResponse {
  success: boolean;
  data?: {
    status: string;
    sessionId: string;
    gatewayTransactionId?: string;
    amount: number;
  };
  error?: string;
}

export class PaytmPaymentService {
  private static readonly PAYTM_PRODUCTION_URL = 'https://securegw.paytm.in/theia/processTransaction';
  private static readonly PAYTM_STAGING_URL = 'https://securegw-stage.paytm.in/theia/processTransaction';
  
  /**
   * Initiate Paytm payment
   */
  static async initiatePayment(request: PaytmPaymentRequest): Promise<TransactionResult> {
    try {
      console.log('[PaytmPaymentService] Initiating payment:', request);
      
      // Generate unique order ID
      const orderId = `MONITIZE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const { data, error } = await supabase.functions.invoke('paytm-payment', {
        body: {
          action: 'initiate',
          contentId: request.contentId,
          userId: request.userId,
          creatorId: request.creatorId,
          amount: request.amount,
          orderId
        }
      });

      if (error) {
        console.error('[PaytmPaymentService] Error calling function:', error);
        return {
          success: false,
          error: 'Failed to initiate payment: ' + error.message
        };
      }

      const response: PaytmInitiateResponse = data;
      
      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Failed to initiate payment'
        };
      }

      // Store session ID for status checking
      sessionStorage.setItem('paytm_session_id', response.data?.sessionId || '');
      
      // Redirect to Paytm payment page
      this.redirectToPaytm(response.data!, response.redirectUrl!);
      
      return {
        success: true,
        message: 'Redirecting to payment gateway...',
        transactionId: response.data?.ORDER_ID
      };
    } catch (error) {
      console.error('[PaytmPaymentService] Exception:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during payment initiation'
      };
    }
  }

  /**
   * Redirect user to Paytm payment page
   */
  private static redirectToPaytm(paymentData: any, actionUrl: string): void {
    // Create a form to POST data to Paytm
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = actionUrl;
    form.style.display = 'none';

    // Add all payment parameters as hidden inputs
    Object.keys(paymentData).forEach(key => {
      if (key !== 'sessionId') { // Exclude internal fields
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = paymentData[key];
        form.appendChild(input);
      }
    });

    document.body.appendChild(form);
    form.submit();
  }

  /**
   * Check payment status
   */
  static async checkPaymentStatus(sessionId: string): Promise<PaytmStatusResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('paytm-payment', {
        body: {
          action: 'status',
          orderId: sessionId
        }
      });

      if (error) {
        console.error('[PaytmPaymentService] Error checking status:', error);
        return {
          success: false,
          error: 'Failed to check payment status: ' + error.message
        };
      }

      return data;
    } catch (error) {
      console.error('[PaytmPaymentService] Exception checking status:', error);
      return {
        success: false,
        error: 'An unexpected error occurred while checking payment status'
      };
    }
  }

  /**
   * Handle payment return (success/failure)
   */
  static async handlePaymentReturn(urlParams: URLSearchParams): Promise<TransactionResult> {
    const status = urlParams.get('status');
    const txnId = urlParams.get('txnId');
    const error = urlParams.get('error');

    if (status === 'completed' && txnId) {
      return {
        success: true,
        message: 'Payment completed successfully',
        transactionId: txnId
      };
    } else {
      return {
        success: false,
        error: error || 'Payment was not completed'
      };
    }
  }

  /**
   * Verify if payment was successful for a content
   */
  static async verifyContentPurchase(contentId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('id')
        .eq('content_id', contentId)
        .eq('user_id', userId)
        .eq('status', 'completed')
        .limit(1);

      if (error) {
        console.error('[PaytmPaymentService] Error verifying purchase:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('[PaytmPaymentService] Exception verifying purchase:', error);
      return false;
    }
  }
}
