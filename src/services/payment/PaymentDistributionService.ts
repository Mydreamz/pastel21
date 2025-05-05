
import { PaymentService } from './PaymentService';
import { TransactionResult, EarningsSummary } from '@/types/transaction';

/**
 * Legacy service for backward compatibility
 * @deprecated Use PaymentService directly instead
 */
export class PaymentDistributionService {
  /**
   * Process payment and distribute funds
   * @deprecated Use PaymentService.processPayment instead
   */
  static async processPayment(
    contentId: string,
    userId: string,
    creatorId: string,
    amount: number
  ): Promise<TransactionResult> {
    console.warn('PaymentDistributionService.processPayment is deprecated. Use PaymentService.processPayment instead.');
    return PaymentService.processPayment(contentId, userId, creatorId, amount);
  }

  /**
   * Get creator earnings summary
   * @deprecated Use PaymentService.getCreatorEarningsSummary instead
   */
  static async getCreatorEarningsSummary(creatorId: string): Promise<EarningsSummary> {
    console.warn('PaymentDistributionService.getCreatorEarningsSummary is deprecated. Use PaymentService.getCreatorEarningsSummary instead.');
    return PaymentService.getCreatorEarningsSummary(creatorId);
  }

  /**
   * Reconcile user earnings
   * @deprecated Use PaymentService.reconcileUserEarnings instead
   */
  static async reconcileUserEarnings(userId: string) {
    console.warn('PaymentDistributionService.reconcileUserEarnings is deprecated. Use PaymentService.reconcileUserEarnings instead.');
    return PaymentService.reconcileUserEarnings(userId);
  }
}
