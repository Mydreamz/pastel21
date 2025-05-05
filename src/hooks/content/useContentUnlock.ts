
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content } from '@/types/content';
import { useContentCache } from '@/contexts/ContentCacheContext';
import { useToast } from '@/hooks/use-toast';
import { useContentTransaction } from './useContentTransaction';
import { useSecureFileUrl } from '@/hooks/useSecureFileUrl';

/**
 * Hook for handling content unlock logic
 */
export const useContentUnlock = (setIsUnlocked: (value: boolean) => void) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getSecureFileUrl } = useSecureFileUrl();
  const { isProcessing, handleContentPurchase } = useContentTransaction();
  const { checkPurchaseStatus, setPurchasedContentId } = useContentCache();

  const handleUnlock = useCallback(async (
    content: Content | null,
    contentId: string | undefined,
    userId: string | undefined,
    userName: string | undefined,
    isCreator: boolean = false
  ) => {
    console.log(`[useContentUnlock] handleUnlock called for content: ${contentId}`);
    
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to purchase content",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
    
    if (!content || !contentId) {
      toast({
        title: "Error",
        description: "Content not available",
        variant: "destructive"
      });
      return;
    }
    
    console.log(`[useContentUnlock] Unlocking content: ${contentId} for user: ${userId}`);
    
    // Check if it's free content
    if (parseFloat(content.price) === 0) {
      setIsUnlocked(true);
      return;
    }
    
    // Check if user is creator
    if (isCreator || content.creatorId === userId) {
      setIsUnlocked(true);
      toast({
        title: "Access granted",
        description: "You have full access as the creator",
      });
      return;
    }
    
    // Check if already purchased
    const isPurchased = await checkPurchaseStatus(content.id, userId);
    if (isPurchased) {
      setIsUnlocked(true);
      toast({
        title: "Content unlocked",
        description: "You already own this content",
      });
      return;
    }
    
    const userDisplayName = userName || userId;
    console.log(`[useContentUnlock] Processing purchase - price: ${content.price}`);
    
    const result = await handleContentPurchase(content, userId, userDisplayName);
    
    if (result) {
      setIsUnlocked(true);
      setPurchasedContentId(content.id);
      
      // After purchase, get secure URL for file if it exists
      if (content.filePath && 
          ['image', 'video', 'audio', 'document'].includes(content.contentType)) {
        try {
          await getSecureFileUrl(contentId, content.filePath, userId);
        } catch (e) {
          console.error("[useContentUnlock] Error getting secure file after purchase:", e);
        }
      }
    }
  }, [checkPurchaseStatus, getSecureFileUrl, handleContentPurchase, navigate, 
      setPurchasedContentId, setIsUnlocked, toast]);

  return {
    handleUnlock,
    isProcessing
  };
};
