
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
      // Use centralized purchase check
      const hasAccess = await checkPurchaseStatus(content.id, userId);
      
      setIsUnlocked(hasAccess);
      
      if (hasAccess) {
        // Mark as purchased/owned in global cache
        setPurchasedContentId(content.id);
        
        // If has file path, get secure URL (only once)
        if (content.filePath && 
            ['image', 'video', 'audio', 'document'].includes(content.contentType) &&
            !secureUrlRequestedRef.current) {
          secureUrlRequestedRef.current = true;
          console.log(`[useContentAccess] Requesting secure URL for: ${content.id}, ${content.filePath}`);
          await getSecureFileUrl(content.id, content.filePath, userId);
        }
      } else if (parseFloat(content.price) === 0) {
        // Free content is automatically unlocked
        setIsUnlocked(true);
      }

      return hasAccess || parseFloat(content.price) === 0;
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
