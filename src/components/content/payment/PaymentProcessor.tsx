
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
  
  const processPayment = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Use the simplified transaction processing approach
      const result: TransactionResult = await PaymentService.processPayment(
        contentId,
        userId,
        creatorId,
        parseFloat(price)
      );

      if (!result.success) {
        if (result.alreadyPurchased) {
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
        // Refresh the permissions to update the UI
        refreshPermissions();
        onSuccess();
        
        toast({
          title: "Payment Successful",
          description: `You've unlocked "${contentTitle}" and it's now in your library`,
          variant: "default"
        });
      }
    } catch (error: any) {
      // Handle payment errors
      toast({
        title: "Payment Failed",
        description: error.message || "Unable to process your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return { processPayment, isProcessing };
};
