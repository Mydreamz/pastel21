
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from '@/contexts/NotificationContext';
import { supabase } from '@/integrations/supabase/client';
import { Content } from '@/types/content';
import { PaymentDistributionService } from '@/services/PaymentDistributionService';

/**
 * Hook for handling content transactions (purchases)
 */
export const useContentTransaction = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [isProcessing, setIsProcessing] = useState(false);
  // Use a ref to track processed transaction IDs to avoid duplicate processing
  const processedTransactionIdsRef = useRef<Set<string>>(new Set());

  /**
   * Check if a user has purchased a specific content
   * Use cache for repeated checks on the same content
   */
  const purchaseCache = useRef<Record<string, boolean>>({});
  
  const checkPurchaseStatus = async (contentId: string, userId: string) => {
    if (!contentId || !userId) return false;
    
    // Generate a unique key for this content/user pair
    const cacheKey = `${contentId}-${userId}`;
    
    // Check cache first
    if (purchaseCache.current[cacheKey] !== undefined) {
      return purchaseCache.current[cacheKey];
    }
    
    try {
      console.log(`Checking purchase status for content ${contentId} by user ${userId}`);
      
      // Direct query approach - simpler and more reliable
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('id')
        .eq('content_id', contentId)
        .eq('user_id', userId)
        .eq('is_deleted', false)
        .limit(1);
      
      if (error) {
        console.error("Error checking purchase status:", error);
        return false;
      }
      
      const result = transactions && transactions.length > 0;
      console.log(`Purchase check result: ${result ? 'Purchased' : 'Not purchased'}`);
      
      // Store in cache
      purchaseCache.current[cacheKey] = result;
      return result;
    } catch (err) {
      console.error("Error checking purchase status:", err);
      return false;
    }
  };
  
  /**
   * Handle content purchase/unlock with debouncing to prevent multiple calls
   */
  const handleContentPurchase = async (content: Content | null, userId: string, userName: string | null) => {
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

    setIsProcessing(true);
    processedTransactionIdsRef.current.add(transactionId);
    
    try {
      console.log(`Starting purchase process for content ${content.id} by user ${userId}`);
      
      // Check if already purchased
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
      const paymentResult = await PaymentDistributionService.processPayment(
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
          
          // Update cache
          purchaseCache.current[`${content.id}-${userId}`] = true;
          navigate(`/view/${content.id}`);
          return true;
        }
        
        throw new Error(paymentResult.error || "Failed to process payment");
      }
      
      // Purchase successful - update cache
      purchaseCache.current[`${content.id}-${userId}`] = true;
      
      // Purchase successful
      toast({
        title: "Content unlocked",
        description: `Thank you for your purchase of ₹${parseFloat(content.price).toFixed(2)}${paymentResult.creatorEarnings ? `. Creator receives ₹${paymentResult.creatorEarnings.toFixed(2)}.` : ''}`
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
          
          // Update cache
          purchaseCache.current[`${content.id}-${userId}`] = true;
          
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
      
      // Remove the transaction ID from the set after a delay
      setTimeout(() => {
        processedTransactionIdsRef.current.delete(transactionId);
      }, 5000);
    }
  };

  return {
    isProcessing,
    checkPurchaseStatus,
    handleContentPurchase
  };
};
