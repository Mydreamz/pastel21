
import { useState, useCallback, useRef } from 'react';
import { Content } from '@/types/content';
import { useContentCache } from '@/contexts/ContentCacheContext';
import { useViewTracking } from '@/hooks/useViewTracking';

/**
 * Hook for loading content with caching and tracking views
 */
export const useContentLoading = (contentId: string | undefined) => {
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Track content loaded state to prevent duplicate operations
  const contentLoadedRef = useRef(false);
  const trackViewCompletedRef = useRef(false);
  
  // Import sub-hooks
  const { trackView } = useViewTracking();
  const { loadContent, getCachedContent } = useContentCache();

  // Memoize track view to prevent recreating on each render
  const memoizedTrackView = useCallback((id: string, userId?: string) => {
    if (!id) return;
    trackView(id, userId);
  }, [trackView]);

  // Unified load content function that uses cache
  const handleContentLoad = useCallback(async (id: string, userId?: string) => {
    if (!id || contentLoadedRef.current) return null;
    
    console.log(`[useContentLoading] Loading content: ${id}`);
    
    try {
      setLoading(true);
      setError(null);
      
      // Try to get from cache first, or load if not available
      const cachedContent = getCachedContent(id);
      let loadedContent: Content | null;
      
      if (cachedContent) {
        console.log("[useContentLoading] Using cached content data");
        loadedContent = cachedContent;
      } else {
        loadedContent = await loadContent(id);
      }
      
      if (!loadedContent) {
        setError("Content not found");
        return null;
      }
      
      setContent(loadedContent);
      contentLoadedRef.current = true;
      
      // Track view once content is loaded - but only if we haven't already
      if (loadedContent && !trackViewCompletedRef.current) {
        memoizedTrackView(id, userId);
        trackViewCompletedRef.current = true;
      }

      return loadedContent;
    } catch (e: any) {
      console.error("[useContentLoading] Error loading content:", e);
      // Ensure we set a string error, not an Error object
      setError(typeof e === 'string' ? e : (e?.message || "Error loading content"));
      return null;
    } finally {
      setLoading(false);
    }
  }, [getCachedContent, loadContent, memoizedTrackView]);

  // Reset tracking flags when contentId changes
  const resetTrackingState = useCallback(() => {
    contentLoadedRef.current = false;
    trackViewCompletedRef.current = false;
  }, []);

  return {
    content,
    loading,
    error,
    handleContentLoad,
    resetTrackingState
  };
};
