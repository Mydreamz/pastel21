
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { usePurchaseVerification } from './PurchaseVerification';
import { usePaymentProcessor } from './PaymentProcessor';

export const usePaymentFlow = (
  content: any,
  userId: string | undefined,
  isCreator: boolean,
  isPurchased: boolean,
  refreshPermissions: () => void,
  onUnlock: () => void
) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasCheckedPurchase, setHasCheckedPurchase] = useState(false);
  const [isAlreadyPurchased, setIsAlreadyPurchased] = useState(isPurchased);
  
  // Use our utility hooks
  const { verifyPurchaseStatus } = content?.id && userId ? 
    usePurchaseVerification(content.id, userId) : 
    { verifyPurchaseStatus: async () => false };
  
  const { processPayment, isProcessing: processingPayment } = content ? 
    usePaymentProcessor(
      content.id,
      userId || '',
      content.creatorId,
      content.price,
      content.title,
      () => {
        setIsAlreadyPurchased(true);
        onUnlock();
      },
      refreshPermissions
    ) : { processPayment: async () => {}, isProcessing: false };
  
  // Update isProcessing state based on payment processor
  useEffect(() => {
    setIsProcessing(processingPayment);
  }, [processingPayment]);
  
  // Check if the user has already purchased this content
  const checkPurchaseStatus = useCallback(async () => {
    if (!userId || !content?.id) return;
    
    try {
      const hasPurchased = await verifyPurchaseStatus();
      
      if (hasPurchased !== isAlreadyPurchased) {
        setIsAlreadyPurchased(hasPurchased);
      }
      setHasCheckedPurchase(true);
    } catch (e) {
      console.error("Exception checking purchase status:", e);
    }
  }, [userId, content?.id, isAlreadyPurchased, verifyPurchaseStatus]);
  
  useEffect(() => {
    if ((userId && content?.id) && (!hasCheckedPurchase || isPurchased !== isAlreadyPurchased)) {
      checkPurchaseStatus();
    }
  }, [userId, content?.id, isPurchased, isAlreadyPurchased, hasCheckedPurchase, checkPurchaseStatus]);
  
  const handleUnlock = async () => {
    if (isProcessing) {
      return; // Prevent multiple clicks
    }

    if (isCreator) {
      toast({
        title: "Creator Access",
        description: "You have full access as the content creator",
        variant: "default"
      });
      onUnlock();
      return;
    }

    if (isAlreadyPurchased || isPurchased) {
      toast({
        title: "Already Purchased",
        description: "You've already purchased this content and have full access",
        variant: "default"
      });
      onUnlock();
      return;
    }

    if (parseFloat(content.price) === 0) {
      onUnlock();
      return;
    }

    // Process the payment
    await processPayment();
  };
  
  return {
    isProcessing,
    isAlreadyPurchased: isAlreadyPurchased || isPurchased,
    handleUnlock
  };
};
