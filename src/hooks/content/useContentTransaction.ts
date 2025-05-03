
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from '@/contexts/NotificationContext';
import { supabase } from '@/integrations/supabase/client';
import { Content } from '@/types/content';
import { hasUserPurchasedContent } from '@/utils/paymentUtils';

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
    
    return await hasUserPurchasedContent(contentId, userId);
  };
  
  /**
   * Handle content purchase/unlock
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

    setIsProcessing(true);
    
    try {
      // Check if already purchased
      const alreadyPurchased = await checkPurchaseStatus(content.id, userId);
      if (alreadyPurchased) {
        toast({
          title: "Already Purchased",
          description: "You've already purchased this content",
          variant: "default"
        });
        return true;
      }
      
      console.log(`User ${userId} purchasing content ${content.id}`);
      
      // Insert transaction
      const { error: transactionError } = await supabase.from('transactions').insert([{
        content_id: content.id,
        user_id: userId,
        creator_id: content.creatorId,
        amount: content.price,
        timestamp: new Date().toISOString()
      }]);

      if (transactionError) {
        console.error("Transaction error:", transactionError);
        throw transactionError;
      }

      toast({
        title: "Content unlocked",
        description: `Thank you for your purchase of ₹${parseFloat(content.price).toFixed(2)}`
      });

      navigate(`/view/${content.id}`);

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
