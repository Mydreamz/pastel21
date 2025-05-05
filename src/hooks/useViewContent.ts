
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content } from '@/types/content';
import { useAuth } from '@/contexts/AuthContext';
import { useSecureFileUrl } from './useSecureFileUrl';
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
    secureUrl: secureFileUrl, 
    isLoading: secureFileLoading, 
    error: secureFileError, 
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
    
    console.log(`[ViewContent] Loading content: ${contentId}`);
    
    try {
      setLoading(true);
      setError(null);
      
      // Try to get from cache first, or load if not available
      const cachedContent = getCachedContent(contentId);
      let loadedContent: Content | null;
      
      if (cachedContent) {
        console.log("[ViewContent] Using cached content data");
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
      console.error("[ViewContent] Error loading content:", e);
      // Ensure we set a string error, not an Error object
      setError(typeof e === 'string' ? e : (e?.message || "Error loading content"));
    } finally {
      setLoading(false);
    }
  }, [getCachedContent, loadContent, trackView, user]);

  // Handle permissions check with optimization to prevent duplicate requests
  const handlePermissions = useCallback(async () => {
    if (!content || !content.id || !user || permissionsCheckedRef.current) return;
    
    console.log(`[ViewContent] Checking permissions for content: ${content.id}, user: ${user.id}`);
    permissionsCheckedRef.current = true;
    
    try {
      // Use centralized purchase check
      const hasAccess = await checkPurchaseStatus(content.id, user.id);
      
      setIsUnlocked(hasAccess);
      
      if (hasAccess) {
        // Mark as purchased/owned in global cache
        setPurchasedContentId(content.id);
        
        // If has file path, get secure URL (only once)
        if (content.filePath && 
            ['image', 'video', 'audio', 'document'].includes(content.contentType) &&
            !secureUrlRequestedRef.current) {
          secureUrlRequestedRef.current = true;
          console.log(`[ViewContent] Requesting secure URL for: ${content.id}, ${content.filePath}`);
          await getSecureFileUrl(content.id, content.filePath, user.id);
        }
      } else if (parseFloat(content.price) === 0) {
        // Free content is automatically unlocked
        setIsUnlocked(true);
      } else if (window.location.pathname.startsWith('/view/')) {
        // Redirect to preview page if paid content that user hasn't purchased
        navigate(`/preview/${content.id}`);
      }
    } catch (err: any) {
      console.error("[ViewContent] Error checking permissions:", err);
      // Make sure we convert any errors to strings
      setError(typeof err === 'string' ? err : (err?.message || "Error checking content permissions"));
    }
  }, [content, user, getSecureFileUrl, checkPurchaseStatus, navigate, setPurchasedContentId]);

  // Reset refs if id changes
  useEffect(() => {
    if (id !== undefined) {
      contentLoadedRef.current = false;
      permissionsCheckedRef.current = false;
      secureUrlRequestedRef.current = false;
      setIsUnlocked(false);
    }
  }, [id]);

  // Load content and check permissions with optimized approach to reduce duplicate calls
  useEffect(() => {
    if (!id || contentLoadedRef.current) return;

    const loadContentAndCheckPermissions = async () => {
      try {
        // Use cached content if available
        const cachedContent = getCachedContent(id);
        if (cachedContent) {
          console.log("[ViewContent] Using cached content");
          setContent(cachedContent);
          contentLoadedRef.current = true;
          
          // Track view once if not already tracked
          if (!trackViewCompletedRef.current) {
            trackView(id, user?.id);
            trackViewCompletedRef.current = true;
          }
        } else {
          // Load from database if not cached
          const loadedContent = await loadContent(id);
          if (loadedContent) {
            setContent(loadedContent);
            contentLoadedRef.current = true;
            
            // Track view once
            if (!trackViewCompletedRef.current) {
              trackView(id, user?.id);
              trackViewCompletedRef.current = true;
            }
          } else {
            setError("Content not found");
          }
        }

        // Only check permissions if user is authenticated
        if (user && content) {
          await handlePermissions();
        } else if (content && parseFloat(content.price) > 0 && window.location.pathname.startsWith('/view/')) {
          // Redirect unauthenticated users for paid content
          navigate(`/preview/${id}`);
        }
      } catch (err: any) {
        console.error("[ViewContent] Error loading content:", err);
        setError(typeof err === 'string' ? err : (err?.message || "Error loading content"));
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    loadContentAndCheckPermissions();
  }, [id, user, loadContent, handlePermissions, navigate, content?.price, getCachedContent, trackView]);

  const handleUnlock = async () => {
    if (!session || !user) return;
    if (!content || !id) return;
    
    console.log(`[ViewContent] Unlocking content: ${id}`);
    
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
