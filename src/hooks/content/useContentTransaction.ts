
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
        throw error;
      }
      
      const result = transactions && transactions.length > 0;
      console.log(`Direct query result: ${result ? 'Purchased' : 'Not purchased'}`);
      return result;
    } catch (err) {
      console.error("Error checking purchase status:", err);
      // Default to false on error to force purchase flow
      return false;
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
        return true;
      }
      
      console.log(`User ${userId} purchasing content ${content.id} for ${content.price}`);
      
      try {
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
            console.log("Duplicate purchase detected, continuing as success");
            toast({
              title: "Already Purchased",
              description: "You've already purchased this content",
              variant: "default"
            });
            return true;
          }
          
          // Check if this is a schema cache error
          if (error.message && error.message.includes("column") && error.message.includes("does not exist")) {
            console.error("Schema cache error, trying alternative approach");
            
            // Try inserting with only the guaranteed fields
            const { data: basicData, error: basicError } = await supabase.from('transactions').insert([{
              content_id: content.id,
              user_id: userId,
              creator_id: content.creatorId,
              amount: content.price,
              timestamp: new Date().toISOString()
            }]).select();
            
            if (basicError) {
              if (basicError.code === '23505') {
                console.log("Duplicate purchase detected in fallback, continuing as success");
                toast({
                  title: "Already Purchased",
                  description: "You've already purchased this content",
                  variant: "default"
                });
                return true;
              }
              console.error("Basic transaction failed:", basicError);
              throw basicError;
            }
            
            console.log("Basic transaction succeeded:", basicData);
          } else {
            console.error("Transaction error:", error);
            throw error;
          }
        }

        console.log("Transaction recorded successfully");
        
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
      } catch (transactionError) {
        // One final attempt to verify purchase status before failing
        const verifyPurchase = await checkPurchaseStatus(content.id, userId);
        if (verifyPurchase) {
          console.log("Transaction verification succeeded despite earlier error");
          toast({
            title: "Content unlocked",
            description: `Thank you for your purchase of ₹${parseFloat(content.price).toFixed(2)}`
          });
          navigate(`/view/${content.id}`);
          return true;
        }
        
        throw transactionError;
      }
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
