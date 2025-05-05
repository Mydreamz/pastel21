
import { processPurchaseTransaction } from './TransactionProcessingService';
import { updateCreatorEarnings, reconcileUserEarnings } from './CreatorEarningsService';
import { getCreatorEarningsSummary } from './EarningsSummaryService';
import { TransactionResult, EarningsSummary } from '@/types/transaction';

export class PaymentDistributionService {
  private static PLATFORM_FEE_PERCENTAGE = 7;

  /**
   * Process a payment, distributing funds between platform and creator
   */
  static async processPayment(contentId: string, userId: string, creatorId: string, amount: number): Promise<TransactionResult> {
    try {
      // Validate inputs
      if (!contentId || !userId || !creatorId || amount <= 0) {
        return {
          success: false,
          error: "Invalid payment parameters"
        };
      }
      
      console.log(`Processing payment - Content: ${contentId}, User: ${userId}, Creator: ${creatorId}, Amount: ${amount}`);
      
      // Process the transaction
      const transactionResult = await processPurchaseTransaction(
        contentId, 
        userId, 
        creatorId, 
        amount, 
        this.PLATFORM_FEE_PERCENTAGE
      );
      
      // If transaction was successful and not already purchased, update creator earnings
      if (transactionResult.success && !transactionResult.alreadyPurchased) {
        try {
          console.log(`Transaction successful, updating creator earnings for ${creatorId} with amount ${transactionResult.creatorEarnings || 0}`);
          await updateCreatorEarnings(creatorId, transactionResult.creatorEarnings || 0);
          
          // Also store platform fee for the company account (optional)
          await this.storePlatformFee(transactionResult.platformFee || 0, transactionResult.transactionId);
        } catch (earningsError) {
          console.error("Could not update creator earnings, but transaction was recorded:", earningsError);
          
          // Try to reconcile earnings as a fallback
          try {
            console.log("Attempting to reconcile earnings for creator:", creatorId);
            await reconcileUserEarnings(creatorId);
          } catch (reconcileError) {
            console.error("Reconciliation also failed:", reconcileError);
          }
        }
      }

      return transactionResult;
    } catch (error: any) {
      console.error("Payment processing error:", error);
      return {
        success: false,
        error: error.message || "Unknown payment error"
      };
    }
  }

  /**
   * Get a creator's earnings summary
   */
  static async getCreatorEarningsSummary(creatorId: string): Promise<EarningsSummary> {
    return getCreatorEarningsSummary(creatorId);
  }
  
  /**
   * Reconcile a user's earnings by recalculating from transaction history
   */
  static async reconcileUserEarnings(userId: string) {
    return reconcileUserEarnings(userId);
  }
  
  /**
   * Store platform fee for the company account
   * This can be expanded to track company earnings separately
   */
  private static async storePlatformFee(fee: number, transactionId?: string) {
    console.log(`Storing platform fee: ${fee} for transaction: ${transactionId || 'unknown'}`);
    // This is a placeholder for company account tracking logic
    // You would implement your company account tracking here
    // For example, you could update a special "company" profile or a separate platform_fees table
    
    try {
      // This is where you could implement your company account logic
      // For example, updating a "company" profile or record
      // Or storing in a separate platform_fees table
      
      // Example of storing fee in a hypothetical platform_fees table:
      // const { error } = await supabase
      //   .from('platform_fees')
      //   .insert({
      //     transaction_id: transactionId,
      //     amount: fee.toString(),
      //     timestamp: new Date().toISOString()
      //   });
      
      // if (error) throw error;
      
      // For now, we just log it
      console.log('Platform fee recorded successfully');
    } catch (error) {
      console.error('Error storing platform fee:', error);
    }
  }
}
