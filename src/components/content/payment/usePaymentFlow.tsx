
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
        console.log('[usePaymentFlow] Payment successful, calling onUnlock');
        setIsAlreadyPurchased(true);
        refreshPermissions();
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
      console.log('[usePaymentFlow] Checking purchase status for:', content.id, userId);
      const hasPurchased = await verifyPurchaseStatus();
      console.log('[usePaymentFlow] Purchase status result:', hasPurchased);
      
      if (hasPurchased !== isAlreadyPurchased) {
        setIsAlreadyPurchased(hasPurchased);
      }
      setHasCheckedPurchase(true);
    } catch (e) {
      console.error("[usePaymentFlow] Exception checking purchase status:", e);
    }
  }, [userId, content?.id, isAlreadyPurchased, verifyPurchaseStatus]);
  
  useEffect(() => {
    if ((userId && content?.id) && (!hasCheckedPurchase || isPurchased !== isAlreadyPurchased)) {
      checkPurchaseStatus();
    }
  }, [userId, content?.id, isPurchased, isAlreadyPurchased, hasCheckedPurchase, checkPurchaseStatus]);
  
  const handleUnlock = async () => {
    console.log('[usePaymentFlow] handleUnlock called', {
      isProcessing,
      isCreator,
      isAlreadyPurchased,
      isPurchased,
      contentPrice: content?.price
    });

    if (isProcessing) {
      console.log('[usePaymentFlow] Already processing, returning');
      return; // Prevent multiple clicks
    }

    if (isCreator) {
      console.log('[usePaymentFlow] User is creator, granting access');
      toast({
        title: "Creator Access",
        description: "You have full access as the content creator",
        variant: "default"
      });
      onUnlock();
      return;
    }

    if (isAlreadyPurchased || isPurchased) {
      console.log('[usePaymentFlow] Content already purchased, granting access');
      toast({
        title: "Already Purchased",
        description: "You've already purchased this content and have full access",
        variant: "default"
      });
      onUnlock();
      return;
    }

    if (parseFloat(content.price) === 0) {
      console.log('[usePaymentFlow] Free content, granting access');
      onUnlock();
      return;
    }

    // Process the payment
    console.log('[usePaymentFlow] Processing payment for content:', content.id);
    await processPayment();
  };
  
  return {
    isProcessing,
    isAlreadyPurchased: isAlreadyPurchased || isPurchased,
    handleUnlock
  };
};
