
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { PaymentService } from '@/services/payment/PaymentService';
import { TransactionResult } from '@/types/transaction';

interface PaymentProcessorProps {
  contentId: string;
  userId: string;
  creatorId: string;
  price: string;
  contentTitle: string;
  onSuccess: () => void;
  refreshPermissions: () => void;
}

const PaymentProcessor = ({
  contentId,
  userId,
  creatorId,
  price,
  contentTitle,
  onSuccess,
  refreshPermissions
}: PaymentProcessorProps) => {
  // This component doesn't render anything visually
  return null;
};

// Export both the component and the utility hook
export default PaymentProcessor;

// Export the hook for use in other components
export const usePaymentProcessor = (
  contentId: string,
  userId: string,
  creatorId: string,
  price: string,
  contentTitle: string,
  onSuccess: () => void,
  refreshPermissions: () => void
) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const processPayment = async (paymentMethod: 'internal' | 'paytm' = 'internal') => {
    if (isProcessing) {
      console.log('[PaymentProcessor] Already processing payment, skipping');
      return;
    }
    
    console.log('[PaymentProcessor] Starting payment process:', {
      contentId,
      userId,
      price,
      paymentMethod
    });
    
    setIsProcessing(true);
    
    try {
      // Use the enhanced PaymentService with payment method support
      const result: TransactionResult = await PaymentService.processPayment(
        contentId,
        userId,
        creatorId,
        parseFloat(price),
        paymentMethod
      );

      console.log('[PaymentProcessor] Payment result:', result);

      if (!result.success) {
        if (result.alreadyPurchased) {
          console.log('[PaymentProcessor] Content already purchased');
          toast({
            title: "Already In Your Library",
            description: "You've already purchased this content. You can access it from your purchased content section.",
            variant: "default"
          });
          refreshPermissions();
          onSuccess();
        } else {
          throw new Error(result.error || "Failed to process payment");
        }
      } else {
        console.log('[PaymentProcessor] Payment successful');
        
        // For Paytm payments, the user will be redirected to the payment gateway
        // The success callback will be handled by the return URL
        if (paymentMethod === 'paytm') {
          toast({
            title: "Redirecting to Payment Gateway",
            description: "You will be redirected to complete your payment securely.",
            variant: "default"
          });
          // Note: User will be redirected, so we don't call onSuccess here
        } else {
          // For internal payments, proceed normally
          refreshPermissions();
          onSuccess();
          
          toast({
            title: "Payment Successful",
            description: `You've unlocked "${contentTitle}" and it's now in your library`,
            variant: "default"
          });
        }
      }
    } catch (error: any) {
      console.error('[PaymentProcessor] Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Unable to process your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      // Only reset processing state for non-Paytm payments
      // For Paytm, the user will be redirected
      if (paymentMethod !== 'paytm') {
        setIsProcessing(false);
      }
    }
  };

  return { processPayment, isProcessing };
};
