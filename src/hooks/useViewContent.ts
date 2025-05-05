
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Content } from '@/types/content';
import { useContentLoading } from './content/useContentLoading';
import { useContentAccess } from './content/useContentAccess';
import { useContentUnlock } from './content/useContentUnlock';

/**
 * Main hook for viewing content with permissions handling and unlocking
 */
export const useViewContent = (id: string | undefined) => {
  const { user, session } = useAuth();
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  // Use the refactored sub-hooks
  const { 
    content, 
    loading, 
    error, 
    handleContentLoad, 
    resetTrackingState 
  } = useContentLoading(id);
  
  const { 
    secureFileUrl, 
    secureFileLoading, 
    secureFileError,
    checkContentAccess,
    resetPermissionsState
  } = useContentAccess();
  
  const {
    handleUnlock: handleContentUnlock,
    isProcessing
  } = useContentUnlock(setIsUnlocked);

  // Reset state when ID changes
  useEffect(() => {
    if (id !== undefined) {
      resetTrackingState();
      resetPermissionsState();
      setIsUnlocked(false);
    }
  }, [id, resetTrackingState, resetPermissionsState]);

  // Load content and check permissions
  useEffect(() => {
    if (!id) return;
    
    const loadContentAndCheckPermissions = async () => {
      const loadedContent = await handleContentLoad(id, user?.id);
      
      if (loadedContent && user) {
        const hasAccess = await checkContentAccess(loadedContent, user.id);
        setIsUnlocked(hasAccess);
      }
    };
    
    loadContentAndCheckPermissions();
  }, [id, user, handleContentLoad, checkContentAccess]);

  // Main unlock handler function
  const handleUnlock = useCallback(async () => {
    const userName = user?.user_metadata?.name || user?.email;
    await handleContentUnlock(
      content,
      id,
      user?.id,
      userName,
      content?.creatorId === user?.id
    );
  }, [content, id, user, handleContentUnlock]);

  return {
    content,
    loading,
    error,
    secureFileUrl,
    secureFileLoading,
    secureFileError,
    isUnlocked,
    handleUnlock,
    isAuthenticated: !!session,
    isProcessing
  };
};
