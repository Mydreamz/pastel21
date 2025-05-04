
import { useState } from 'react';
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

  /**
   * Check if a user has purchased a specific content
   */
  const checkPurchaseStatus = async (contentId: string, userId: string) => {
    if (!contentId || !userId) return false;
    
    try {
      console.log(`Checking purchase status for content ${contentId} by user ${userId}`);
      
      // Try to use the database function if available
      try {
        const { data, error } = await supabase.rpc('has_purchased_content', {
          user_id_param: userId,
          content_id_param: contentId
        });
        
        if (!error) {
          console.log(`RPC function result: ${data}`);
          return data;
        }
        
        console.warn("Could not use RPC function, falling back to query:", error);
      } catch (err) {
        console.warn("Error with RPC function, falling back to query:", err);
      }
      
      // Regular query fallback
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('id')
        .eq('content_id', contentId)
        .eq('user_id', userId)
        .eq('is_deleted', false)
        .limit(1);
      
      if (error) {
        console.error("Error in transaction check:", error);
        // Since this is just a check, don't throw - default to false
        return false;
      }
      
      const result = transactions && transactions.length > 0;
      console.log(`Direct query result: ${result ? 'Purchased' : 'Not purchased'}`);
      return result;
    } catch (err) {
      console.error("Error checking purchase status:", err);
      // Default to false on error
      return false;
    }
  };
  
  /**
   * Handle content purchase/unlock - uses the more robust PaymentDistributionService
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

    setIsProcessing(true);
    
    try {
      console.log(`Starting purchase process for content ${content.id} by user ${userId}`);
      
      // Check if already purchased - with extra validation
      const alreadyPurchased = await checkPurchaseStatus(content.id, userId);
      if (alreadyPurchased) {
        console.log("Content already purchased, skipping transaction");
        toast({
          title: "Already Purchased",
          description: "You've already purchased this content",
          variant: "default"
        });
        
        // Navigate to view the content since it's already purchased
        navigate(`/view/${content.id}`);
        return true;
      }
      
      console.log(`User ${userId} purchasing content ${content.id} for ${content.price}`);
      
      // Use the PaymentDistributionService for more robust processing
      const paymentResult = await PaymentDistributionService.processPayment(
        content.id,
        userId,
        content.creatorId,
        parseFloat(content.price)
      );
      
      if (!paymentResult.success) {
        throw new Error(paymentResult.error || "Failed to process payment");
      }
      
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
      
      // Final verification check - did it succeed despite errors?
      try {
        const finalCheck = await checkPurchaseStatus(content.id, userId);
        if (finalCheck) {
          console.log("Final check shows purchase succeeded despite errors");
          toast({
            title: "Content unlocked",
            description: `Your purchase was successful despite some technical issues.`
          });
          
          navigate(`/view/${content.id}`);
          return true;
        }
      } catch (verifyErr) {
        // Ignore errors in the final check
      }
      
      toast({
        title: "Transaction failed",
        description: e.message || "There was a problem processing your purchase",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    checkPurchaseStatus,
    handleContentPurchase
  };
};
