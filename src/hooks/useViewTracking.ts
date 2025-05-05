
import { useRef, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook for tracking content views with improved batching and throttling
 */
export const useViewTracking = () => {
  // Cache to track which content has been viewed in this session
  const processedViews = useRef<Set<string>>(new Set());
  
  // Processing state and queue
  const isProcessingRef = useRef<boolean>(false);
  const queuedViews = useRef<Array<{contentId: string, userId?: string}>>([]);
  
  // Track last view timestamp to prevent rapid duplicate tracking
  const lastViewTimeRef = useRef<Record<string, number>>({});
  
  // Track if interval is set up
  const isSetupRef = useRef<boolean>(false);

  // Process the view queue periodically with reduced frequency
  useEffect(() => {
    // Prevent multiple interval setups
    if (isSetupRef.current) return;
    isSetupRef.current = true;
    
    const processQueue = async () => {
      if (isProcessingRef.current || queuedViews.current.length === 0) {
        return;
      }

      isProcessingRef.current = true;
      
      try {
        // Take up to 20 views at a time for bigger batches
        const batch = queuedViews.current.splice(0, 20);
        
        // Group by contentId to deduplicate requests
        const groupedViews = batch.reduce((acc, curr) => {
          const key = `${curr.contentId}-${curr.userId || 'anonymous'}`;
          if (!acc[key]) {
            acc[key] = curr;
          }
          return acc;
        }, {} as Record<string, {contentId: string, userId?: string}>);
        
        // Create a single batch insert for all views
        const viewsToInsert = Object.values(groupedViews).map(view => ({
          content_id: view.contentId,
          user_id: view.userId || null,
          timestamp: new Date().toISOString()
        }));
        
        // Only make the API call if there are views to insert
        if (viewsToInsert.length > 0) {
          await supabase.from('content_views').insert(viewsToInsert);
          console.log(`Tracked ${viewsToInsert.length} content views in batch`);
        }
      } catch (error) {
        console.error("Error processing view queue:", error);
      } finally {
        isProcessingRef.current = false;
      }
    };

    // Increase the polling interval to reduce API calls (now every 60 seconds)
    const interval = setInterval(processQueue, 60000);
    return () => {
      clearInterval(interval);
      isSetupRef.current = false;
    };
  }, []);

  /**
   * Track a content view with throttling to prevent excessive tracking
   * Memoized with useCallback to prevent re-creation on each render
   */
  const trackView = useCallback((contentId: string, userId?: string) => {
    if (!contentId) return;
    
    // Create a unique key for this view
    const viewKey = `${contentId}-${userId || 'anonymous'}`;
    
    // Get current time
    const now = Date.now();
    
    // Implement throttling - only track once every 30 minutes for the same content/user
    const lastViewTime = lastViewTimeRef.current[viewKey] || 0;
    if (now - lastViewTime < 30 * 60 * 1000) {
      return; // Skip if viewed recently
    }
    
    // Update last view time
    lastViewTimeRef.current[viewKey] = now;
    
    // Only queue if not already processed in this session
    if (!processedViews.current.has(viewKey)) {
      queuedViews.current.push({ contentId, userId });
      processedViews.current.add(viewKey);
      console.log(`View queued for tracking: ${contentId}`);
    }
  }, []);

  return { trackView };
};
