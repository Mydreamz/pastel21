
import { processPurchaseTransaction } from './TransactionProcessingService';
import { updateCreatorEarnings } from './CreatorEarningsService';
import { getCreatorEarningsSummary } from './EarningsSummaryService';

export class PaymentDistributionService {
  private static PLATFORM_FEE_PERCENTAGE = 7;

  /**
   * Process a payment, distributing funds between platform and creator
   */
  static async processPayment(contentId: string, userId: string, creatorId: string, amount: number) {
    try {
      // Validate inputs
      if (!contentId || !userId || !creatorId || amount <= 0) {
        throw new Error("Invalid payment parameters");
      }
      
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
          await updateCreatorEarnings(creatorId, transactionResult.creatorEarnings || 0);
        } catch (earningsError) {
          console.warn("Could not update creator earnings, but transaction was recorded:", earningsError);
          // Non-fatal error, continue
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
  static async getCreatorEarningsSummary(creatorId: string) {
    return getCreatorEarningsSummary(creatorId);
  }
}
