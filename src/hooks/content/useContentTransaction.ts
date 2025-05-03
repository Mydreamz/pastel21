
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
    
    try {
      // Try to use the database function if available
      const { data, error } = await supabase.rpc('has_purchased_content', {
        user_id_param: userId,
        content_id_param: contentId
      });
      
      if (error) {
        console.warn("Could not use RPC function, falling back to query:", error);
        return hasUserPurchasedContent(contentId, userId);
      }
      
      return data;
    } catch (err) {
      console.warn("Error with RPC function, falling back to query:", err);
      return hasUserPurchasedContent(contentId, userId);
    }
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
      // Check if already purchased - with extra validation
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
      
      // Insert transaction with validation
      const { data, error } = await supabase.from('transactions').insert([{
        content_id: content.id,
        user_id: userId,
        creator_id: content.creatorId,
        amount: content.price,
        platform_fee: (parseFloat(content.price) * 0.07).toFixed(2),
        creator_earnings: (parseFloat(content.price) * 0.93).toFixed(2),
        timestamp: new Date().toISOString(),
        status: 'completed'
      }]).select();

      if (error) {
        // Check if this is a duplicate purchase error
        if (error.code === '23505') {
          toast({
            title: "Already Purchased",
            description: "You've already purchased this content",
            variant: "default"
          });
          return true;
        }
        console.error("Transaction error:", error);
        throw error;
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
