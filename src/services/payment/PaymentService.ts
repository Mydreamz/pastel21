
import { supabase } from '@/integrations/supabase/client';
import { TransactionResult } from '@/types/transaction';
import { PaytmPaymentService } from './PaytmPaymentService';

export class PaymentService {
  /**
   * Process payment with multiple payment methods
   */
  static async processPayment(
    contentId: string,
    userId: string,
    creatorId: string,
    amount: number,
    paymentMethod: 'internal' | 'paytm' = 'internal'
  ): Promise<TransactionResult> {
    console.log(`[PaymentService] Processing ${paymentMethod} payment:`, {
      contentId,
      userId,
      creatorId,
      amount,
      paymentMethod
    });

    // Check if already purchased first
    const alreadyPurchased = await this.checkExistingPurchase(contentId, userId);
    if (alreadyPurchased) {
      console.log('[PaymentService] Content already purchased');
      return {
        success: true,
        alreadyPurchased: true,
        message: 'Content already purchased'
      };
    }

    // Route to appropriate payment method
    if (paymentMethod === 'paytm') {
      return await PaytmPaymentService.initiatePayment({
        contentId,
        userId,
        creatorId,
        amount
      });
    } else {
      return await this.processInternalPayment(contentId, userId, creatorId, amount);
    }
  }

  /**
   * Process internal/direct payment (existing logic)
   */
  private static async processInternalPayment(
    contentId: string,
    userId: string,
    creatorId: string,
    amount: number
  ): Promise<TransactionResult> {
    try {
      // Calculate fees
      const platformFee = amount * 0.07; // 7% platform fee
      const creatorEarnings = amount - platformFee;

      // Create transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          content_id: contentId,
          user_id: userId,
          creator_id: creatorId,
          amount: amount.toString(),
          platform_fee: platformFee.toString(),
          creator_earnings: creatorEarnings.toString(),
          payment_method: 'internal',
          status: 'completed'
        })
        .select()
        .single();

      if (transactionError) {
        console.error('[PaymentService] Transaction creation failed:', transactionError);
        throw new Error('Failed to create transaction record');
      }

      console.log('[PaymentService] Transaction created successfully:', transaction.id);

      return {
        success: true,
        message: 'Payment processed successfully',
        platformFee,
        creatorEarnings,
        transactionId: transaction.id
      };
    } catch (error: any) {
      console.error('[PaymentService] Internal payment error:', error);
      return {
        success: false,
        error: error.message || 'Payment processing failed'
      };
    }
  }

  /**
   * Check if user has already purchased the content
   */
  private static async checkExistingPurchase(contentId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('id')
        .eq('content_id', contentId)
        .eq('user_id', userId)
        .eq('status', 'completed')
        .eq('is_deleted', false)
        .limit(1);

      if (error) {
        console.error('[PaymentService] Error checking existing purchase:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('[PaymentService] Exception checking purchase:', error);
      return false;
    }
  }

  /**
   * Verify payment status for any payment method
   */
  static async verifyPayment(
    contentId: string,
    userId: string,
    transactionId?: string,
    paymentMethod?: string
  ): Promise<boolean> {
    if (paymentMethod === 'paytm' && transactionId) {
      return await PaytmPaymentService.verifyContentPurchase(contentId, userId);
    }
    
    return await this.checkExistingPurchase(contentId, userId);
  }

  /**
   * Handle payment callback/return from gateway
   */
  static async handlePaymentReturn(
    paymentMethod: string,
    urlParams: URLSearchParams
  ): Promise<TransactionResult> {
    if (paymentMethod === 'paytm') {
      return await PaytmPaymentService.handlePaymentReturn(urlParams);
    }
    
    return {
      success: false,
      error: 'Unknown payment method'
    };
  }
}
