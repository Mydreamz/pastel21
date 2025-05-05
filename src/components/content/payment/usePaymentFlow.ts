
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { usePaymentProcessor } from './PaymentProcessor';
import { usePurchaseVerification } from './PurchaseVerification';

/**
 * Hook to manage the payment flow for content purchase
 */
export const usePaymentFlow = (
  content: any,
  userId: string | undefined,
  isCreator: boolean,
  isPurchased: boolean,
  refreshPermissions: () => void,
  onUnlock: () => void
) => {
  const { toast } = useToast();
  const [isAlreadyPurchased, setIsAlreadyPurchased] = useState(false);
  
  // Use the payment processor hook
  const { processPayment, isProcessing } = usePaymentProcessor(
    content?.id,
    userId || '',
    content?.creatorId,
    content?.price,
    content?.title,
    onUnlock,
    refreshPermissions
  );
  
  // Use the purchase verification hook
  const { verifyPurchaseStatus } = usePurchaseVerification(content?.id, userId || '');
  
  // Handle content unlocking
  const handleUnlock = useCallback(async () => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to purchase this content",
        variant: "destructive"
      });
      return;
    }
    
    if (isCreator || isPurchased) {
      console.log("[PaymentFlow] User is creator or already purchased, unlocking directly");
      onUnlock();
      return;
    }
    
    // Double-check if the user has already purchased this content
    try {
      console.log("[PaymentFlow] Verifying purchase status before proceeding");
      const alreadyPurchased = await verifyPurchaseStatus();
      
      if (alreadyPurchased) {
        console.log("[PaymentFlow] Verification confirmed content is already purchased");
        setIsAlreadyPurchased(true);
        refreshPermissions();
        onUnlock();
        return;
      }
    } catch (e) {
      console.error("[PaymentFlow] Error verifying purchase status:", e);
    }
    
    // Process the payment
    console.log("[PaymentFlow] Processing payment");
    await processPayment();
  }, [userId, isCreator, isPurchased, onUnlock, processPayment, verifyPurchaseStatus, refreshPermissions, toast]);
  
  return {
    handleUnlock,
    isProcessing,
    isAlreadyPurchased
  };
};
