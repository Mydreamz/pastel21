
import { useState, useCallback, useRef } from 'react';
import { Content } from '@/types/content';
import { useContentCache } from '@/contexts/ContentCacheContext';
import { useSecureFileUrl } from '@/hooks/useSecureFileUrl';

/**
 * Hook for handling content access permissions and secure file URLs
 */
export const useContentAccess = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const permissionsCheckedRef = useRef(false);
  const secureUrlRequestedRef = useRef(false);
  
  const { 
    secureUrl: secureFileUrl, 
    isLoading: secureFileLoading, 
    error: secureFileError, 
    getSecureFileUrl 
  } = useSecureFileUrl();
  
  const { checkPurchaseStatus, setPurchasedContentId } = useContentCache();

  // Check if user has access to the content
  const checkContentAccess = useCallback(async (
    content: Content | null, 
    userId?: string
  ) => {
    if (!content || !content.id || !userId || permissionsCheckedRef.current) {
      return false;
    }
    
    console.log(`[useContentAccess] Checking permissions for content: ${content.id}, user: ${userId}`);
    permissionsCheckedRef.current = true;
    
    try {
      const isCreator = content.creatorId === userId;
      const isFree = parseFloat(content.price) === 0;

      // Handle creator access
      if (isCreator) {
        console.log(`[useContentAccess] Access granted as creator.`);
        setIsUnlocked(true);
        if (content.filePath && ['image', 'video', 'audio', 'document'].includes(content.contentType) && !secureUrlRequestedRef.current) {
          secureUrlRequestedRef.current = true;
          console.log(`[useContentAccess] Creator requesting secure URL for: ${content.filePath}`);
          await getSecureFileUrl(content.id, content.filePath, userId);
        }
        return true;
      }

      // Handle free content
      if (isFree) {
        console.log(`[useContentAccess] Access granted as content is free.`);
        setIsUnlocked(true);
        // Free content should use public fileUrl, no secure URL needed unless filePath is present
        // and we want to enforce secure access for free content too.
        // For now, assuming public fileUrl is sufficient for free content.
        return true;
      }
      
      // Handle paid content for non-creators
      const hasAccess = await checkPurchaseStatus(content.id, userId);
      console.log(`[useContentAccess] Purchase status for non-creator: ${hasAccess}`);
      setIsUnlocked(hasAccess);
      
      if (hasAccess) {
        setPurchasedContentId(content.id);
        if (content.filePath && ['image', 'video', 'audio', 'document'].includes(content.contentType) && !secureUrlRequestedRef.current) {
          secureUrlRequestedRef.current = true;
          console.log(`[useContentAccess] Purchased user requesting secure URL for: ${content.filePath}`);
          await getSecureFileUrl(content.id, content.filePath, userId);
        }
      }

      return hasAccess;
    } catch (err: any) {
      console.error("[useContentAccess] Error checking permissions:", err);
      return false;
    }
  }, [checkPurchaseStatus, getSecureFileUrl, setPurchasedContentId]);

  // Reset refs when content changes
  const resetPermissionsState = useCallback(() => {
    permissionsCheckedRef.current = false;
    secureUrlRequestedRef.current = false;
    setIsUnlocked(false);
  }, []);

  return {
    isUnlocked,
    secureFileUrl,
    secureFileLoading,
    secureFileError,
    checkContentAccess,
    resetPermissionsState
  };
};
