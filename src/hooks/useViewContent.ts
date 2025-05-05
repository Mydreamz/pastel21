
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content } from '@/types/content';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useSecureFileUrl } from './content/useSecureFileUrl';
import { useContentTransaction } from './content/useContentTransaction';
import { useViewTracking } from './useViewTracking';
import { useContentCache } from '@/contexts/ContentCacheContext';

export const useViewContent = (id: string | undefined) => {
  const navigate = useNavigate();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const { user, session } = useAuth();
  
  // Track content loaded state to prevent duplicate operations
  const contentLoadedRef = useRef(false);
  const permissionsCheckedRef = useRef(false);
  const trackViewCompletedRef = useRef(false);
  const secureUrlRequestedRef = useRef(false);
  
  // Import sub-hooks
  const { 
    secureFileUrl, 
    secureFileLoading, 
    secureFileError, 
    getSecureFileUrl 
  } = useSecureFileUrl();
  
  const {
    isProcessing,
    handleContentPurchase,
  } = useContentTransaction();
  
  const { trackView } = useViewTracking();

  // Use our centralized cache system
  const { loadContent, getCachedContent, checkPurchaseStatus, setPurchasedContentId } = useContentCache();

  // Unified load content function that uses cache
  const handleContentLoad = useCallback(async (contentId: string) => {
    if (!contentId || contentLoadedRef.current) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Try to get from cache first, or load if not available
      const cachedContent = getCachedContent(contentId);
      let loadedContent: Content | null;
      
      if (cachedContent) {
        console.log("Using cached content data");
        loadedContent = cachedContent;
      } else {
        loadedContent = await loadContent(contentId);
      }
      
      if (!loadedContent) {
        setError("Content not found");
        return;
      }
      
      setContent(loadedContent);
      contentLoadedRef.current = true;
      
      // Track view once content is loaded - but only if we haven't already
      if (loadedContent && !trackViewCompletedRef.current) {
        trackView(contentId, user?.id);
        trackViewCompletedRef.current = true;
      }
      
    } catch (e: any) {
      console.error("Error loading content:", e);
      setError(e.message || "Error loading content");
    } finally {
      setLoading(false);
    }
  }, [getCachedContent, loadContent, trackView, user]);

  // Handle permissions check with optimization to prevent duplicate requests
  const handlePermissions = useCallback(async () => {
    if (!content || !content.id || !user || permissionsCheckedRef.current) return;
    
    try {
      permissionsCheckedRef.current = true;
      
      // Check if user is creator or has purchased the content
      const isCreator = content.creatorId === user.id;
      
      if (isCreator) {
        setIsUnlocked(true);
        // Mark as purchased/owned in global cache
        setPurchasedContentId(content.id);
        
        // If has file path, get secure URL (only once)
        if (content.filePath && 
            ['image', 'video', 'audio', 'document'].includes(content.contentType) &&
            !secureUrlRequestedRef.current) {
          secureUrlRequestedRef.current = true;
          await getSecureFileUrl(content.id, content.filePath, user.id);
        }
      } else {
        // Use centralized purchase check
        const userHasTransaction = await checkPurchaseStatus(content.id, user.id);
        
        if (parseFloat(content.price) === 0 || userHasTransaction) {
          setIsUnlocked(true);
          
          // If has file path, get secure URL (only once)
          if (content.filePath && 
              ['image', 'video', 'audio', 'document'].includes(content.contentType) &&
              !secureUrlRequestedRef.current) {
            secureUrlRequestedRef.current = true;
            await getSecureFileUrl(content.id, content.filePath, user.id);
          }
        } else if (window.location.pathname.startsWith('/view/')) {
          // Redirect to preview page if paid content that user hasn't purchased
          navigate(`/preview/${content.id}`);
        }
      }
    } catch (err) {
      console.error("Error checking permissions:", err);
    }
  }, [content, user, getSecureFileUrl, checkPurchaseStatus, navigate, setPurchasedContentId]);

  // Reset refs if id changes
  useEffect(() => {
    contentLoadedRef.current = false;
    permissionsCheckedRef.current = false;
    trackViewCompletedRef.current = false;
    secureUrlRequestedRef.current = false;
    setContent(null);
    setIsUnlocked(false);
    setError(null);
  }, [id]);

  // Load content when ID is available (only once)
  useEffect(() => {
    if (id && !contentLoadedRef.current) {
      handleContentLoad(id);
    }
  }, [id, handleContentLoad]);

  // Check permissions when content and user are available (only once)
  useEffect(() => {
    if (content && user && !permissionsCheckedRef.current) {
      handlePermissions();
    }
  }, [content, user, handlePermissions]);

  const handleUnlock = async () => {
    if (!session || !user) return;
    if (!content || !id) return;
    
    const userName = user.user_metadata?.name || user.email;
    const result = await handleContentPurchase(content, user.id, userName);
    
    if (result) {
      setIsUnlocked(true);
      setPurchasedContentId(content.id);
      
      // After purchase, get secure URL for file if it exists (only once)
      if (content.filePath && 
          ['image', 'video', 'audio', 'document'].includes(content.contentType) &&
          !secureUrlRequestedRef.current) {
        secureUrlRequestedRef.current = true;
        await getSecureFileUrl(id, content.filePath, user.id);
      }
    }
  };

  return {
    content,
    loading,
    error,
    isUnlocked,
    handleUnlock,
    isAuthenticated: !!session,
    secureFileUrl,
    secureFileLoading,
    secureFileError,
    isProcessing
  };
};
