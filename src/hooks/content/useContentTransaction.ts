
import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from '@/contexts/NotificationContext';
import { Content } from '@/types/content';
import { PaymentDistributionService } from '@/services/payment/PaymentDistributionService';
import { useContentCache } from '@/contexts/ContentCacheContext';
import { TransactionResult } from '@/types/transaction';

/**
 * Hook for handling content transactions (purchases) with improved caching and deduplication
 */
export const useContentTransaction = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [isProcessing, setIsProcessing] = useState(false);
  const { checkPurchaseStatus, setPurchasedContentId } = useContentCache();
  
  // Use a ref to track processed transaction IDs to avoid duplicate processing
  const processedTransactionIdsRef = useRef<Set<string>>(new Set());
  
  // Track in-flight requests to prevent duplicate calls
  const pendingRequestsRef = useRef<Record<string, Promise<boolean>>>({});

  /**
   * Handle content purchase/unlock with debouncing to prevent multiple calls
   */
  const handleContentPurchase = useCallback(async (content: Content | null, userId: string, userName: string | null) => {
    if (!content || !content.id) {
      toast({
        title: "Error",
        description: "Content information is missing",
        variant: "destructive"
      });
      return false;
    }

    if (isProcessing) {
      toast({
        title: "Processing",
        description: "Your previous request is still processing",
        variant: "default"
      });
      return false;
    }

    // Create a transaction ID
    const transactionId = `${content.id}-${userId}`;
    
    // Check if we've already processed this transaction
    if (processedTransactionIdsRef.current.has(transactionId)) {
      toast({
        title: "Already Processing",
        description: "Your payment is already being processed",
        variant: "default"
      });
      return false;
    }
    
    // Check if there's an in-flight purchase request
    if (pendingRequestsRef.current[`purchase-${transactionId}`]) {
      try {
        return await pendingRequestsRef.current[`purchase-${transactionId}`];
      } catch (error) {
        console.error("Error in pending purchase:", error);
        return false;
      }
    }

    setIsProcessing(true);
    processedTransactionIdsRef.current.add(transactionId);
    
    // Create a new promise for this purchase
    const purchasePromise = (async () => {
      try {
        console.log(`Starting purchase process for content ${content.id} by user ${userId}`);
        
        // Check if already purchased - reuse the centralized check
        const alreadyPurchased = await checkPurchaseStatus(content.id, userId);
        if (alreadyPurchased) {
          console.log("Content already purchased, skipping transaction");
          toast({
            title: "Already Purchased",
            description: "You've already purchased this content",
            variant: "default"
          });
          
          navigate(`/view/${content.id}`);
          return true;
        }
        
        console.log(`User ${userId} purchasing content ${content.id} for ${content.price}`);
        
        // Use the PaymentDistributionService for processing
        const paymentResult: TransactionResult = await PaymentDistributionService.processPayment(
          content.id,
          userId,
          content.creatorId,
          parseFloat(content.price)
        );
        
        if (!paymentResult.success) {
          if (paymentResult.alreadyPurchased) {
            console.log("Already purchased based on service response");
            toast({
              title: "Content unlocked",
              description: "You already own this content. It has been unlocked for viewing."
            });
            
            // Update centralized purchase cache
            setPurchasedContentId(content.id);
            navigate(`/view/${content.id}`);
            return true;
          }
          
          throw new Error(paymentResult.error || "Failed to process payment");
        }
        
        // Update centralized purchase cache
        setPurchasedContentId(content.id);
        
        // Purchase successful
        let successMessage = `Thank you for your purchase of ₹${parseFloat(content.price).toFixed(2)}`;
        if (paymentResult.creatorEarnings) {
          successMessage += `. Creator receives ₹${paymentResult.creatorEarnings.toFixed(2)}.`;
        }
        
        toast({
          title: "Content unlocked",
          description: successMessage
        });
        
        navigate(`/view/${content.id}`);
        
        // Send notification to creator
        if (content && userId) {
          addNotification({
            title: "New Purchase",
            message: `${userName || userId} purchased your content "${content.title}" for ₹${parseFloat(content.price).toFixed(2)}`,
            type: 'content',
            link: `/profile`
          });
        }
        
        return true;
      } catch (e: any) {
        console.error("Error in handleContentPurchase:", e);
        
        // Final verification check - did the transaction succeed despite errors?
        try {
          const finalCheck = await checkPurchaseStatus(content.id, userId);
          if (finalCheck) {
            console.log("Final check shows purchase succeeded despite errors");
            
            // Update centralized purchase cache
            setPurchasedContentId(content.id);
            
            toast({
              title: "Content unlocked",
              description: `Your purchase was successful despite some technical issues.`
            });
            
            navigate(`/view/${content.id}`);
            return true;
          }
        } catch (verifyErr) {
          console.warn("Error during final verification check:", verifyErr);
        }
        
        toast({
          title: "Transaction failed",
          description: e.message || "There was a problem processing your purchase",
          variant: "destructive"
        });
        return false;
      } finally {
        setIsProcessing(false);
        
        // Remove the transaction ID from the processing list after a delay
        setTimeout(() => {
          processedTransactionIdsRef.current.delete(transactionId);
          delete pendingRequestsRef.current[`purchase-${transactionId}`];
        }, 5000);
      }
    })();
    
    // Store the promise
    pendingRequestsRef.current[`purchase-${transactionId}`] = purchasePromise;
    
    return purchasePromise;
  }, [isProcessing, navigate, toast, addNotification, checkPurchaseStatus, setPurchasedContentId]);

  return {
    isProcessing,
    handleContentPurchase
  };
};
