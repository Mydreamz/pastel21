
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content } from '@/types/content';
import { useAuth } from '@/contexts/AuthContext';
import { useSecureFileUrl } from './useSecureFileUrl';
import { useContentTransaction } from './content/useContentTransaction';
import { useViewTracking } from './useViewTracking';
import { useContentCache } from '@/contexts/ContentCacheContext';
import { useToast } from "@/hooks/use-toast";

// Memoize handlers outside the component to ensure stable references
const memoizedTrackView = (trackView: any, id: string | undefined, userId: string | undefined) => {
  if (!id) return;
  trackView(id, userId);
};

export const useViewContent = (id: string | undefined) => {
  const navigate = useNavigate();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const { user, session } = useAuth();
  const { toast } = useToast();
  
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
    
    console.log(`[useViewContent] Loading content: ${contentId}`);
    
    try {
      setLoading(true);
      setError(null);
      
      // Try to get from cache first, or load if not available
      const cachedContent = getCachedContent(contentId);
      let loadedContent: Content | null;
      
      if (cachedContent) {
        console.log("[useViewContent] Using cached content data");
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
        memoizedTrackView(trackView, contentId, user?.id);
        trackViewCompletedRef.current = true;
      }
      
    } catch (e: any) {
      console.error("[useViewContent] Error loading content:", e);
      // Ensure we set a string error, not an Error object
      setError(typeof e === 'string' ? e : (e?.message || "Error loading content"));
    } finally {
      setLoading(false);
    }
  }, [getCachedContent, loadContent, trackView, user]);

  // Handle permissions check with optimization to prevent duplicate requests
  const handlePermissions = useCallback(async () => {
    if (!content || !content.id || !user || permissionsCheckedRef.current) return;
    
    console.log(`[useViewContent] Checking permissions for content: ${content.id}, user: ${user.id}`);
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
          console.log(`[useViewContent] Requesting secure URL for: ${content.id}, ${content.filePath}`);
          await getSecureFileUrl(content.id, content.filePath, user.id);
        }
      } else if (parseFloat(content.price) === 0) {
        // Free content is automatically unlocked
        setIsUnlocked(true);
      }
    } catch (err: any) {
      console.error("[useViewContent] Error checking permissions:", err);
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
    setLoading(true);
    const loadContentAndCheckPermissions = async () => {
      try {
        // Use cached content if available
        const cachedContent = getCachedContent(id);
        if (cachedContent) {
          console.log("[useViewContent] Using cached content");
          setContent(cachedContent);
          contentLoadedRef.current = true;
          if (!trackViewCompletedRef.current) {
            memoizedTrackView(trackView, id, user?.id);
            trackViewCompletedRef.current = true;
          }
        } else {
          const loadedContent = await loadContent(id);
          if (loadedContent) {
            setContent(loadedContent);
            contentLoadedRef.current = true;
            if (!trackViewCompletedRef.current) {
              memoizedTrackView(trackView, id, user?.id);
              trackViewCompletedRef.current = true;
            }
          } else {
            setError("Content not found");
          }
        }
        if (user && content) {
          await handlePermissions();
        }
      } catch (err: any) {
        console.error("[useViewContent] Error loading content:", err);
        setError(typeof err === 'string' ? err : (err?.message || "Error loading content"));
      } finally {
        setLoading(false);
      }
    };
    loadContentAndCheckPermissions();
    // Only depend on id and user to avoid unnecessary re-runs
  }, [id, user]);

  const handleUnlock = useCallback(async () => {
    console.log(`[useViewContent] handleUnlock called, isProcessing: ${isProcessing}`);
    
    if (!session || !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to purchase content",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
    
    if (!content || !id) {
      toast({
        title: "Error",
        description: "Content not available",
        variant: "destructive"
      });
      return;
    }
    
    console.log(`[useViewContent] Unlocking content: ${id} for user: ${user.id}`);
    
    // Check if it's free content
    if (parseFloat(content.price) === 0) {
      setIsUnlocked(true);
      return;
    }
    
    // Check if user is creator
    if (content.creatorId === user.id) {
      setIsUnlocked(true);
      toast({
        title: "Access granted",
        description: "You have full access as the creator",
      });
      return;
    }
    
    // Check if already purchased
    const isPurchased = await checkPurchaseStatus(content.id, user.id);
    if (isPurchased) {
      setIsUnlocked(true);
      toast({
        title: "Content unlocked",
        description: "You already own this content",
      });
      return;
    }
    
    const userName = user.user_metadata?.name || user.email;
    console.log(`[useViewContent] Processing purchase - price: ${content.price}`);
    
    const result = await handleContentPurchase(content, user.id, userName);
    
    if (result) {
      setIsUnlocked(true);
      setPurchasedContentId(content.id);
      
      // After purchase, get secure URL for file if it exists (only once)
      if (content.filePath && 
          ['image', 'video', 'audio', 'document'].includes(content.contentType) &&
          !secureUrlRequestedRef.current) {
        secureUrlRequestedRef.current = true;
        try {
          await getSecureFileUrl(id, content.filePath, user.id);
        } catch (e) {
          console.error("[useViewContent] Error getting secure file after purchase:", e);
        }
      }
    }
  }, [session, user, content, id, checkPurchaseStatus, handleContentPurchase, setPurchasedContentId, getSecureFileUrl, navigate, toast]);

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
