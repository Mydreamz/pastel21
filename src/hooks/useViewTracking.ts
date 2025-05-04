
import { useRef, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useViewTracking = () => {
  const processedViews = useRef<Set<string>>(new Set());
  const isProcessingRef = useRef<boolean>(false);
  const queuedViews = useRef<Array<{contentId: string, userId?: string}>>([]);

  // Process the view queue periodically
  useEffect(() => {
    const processQueue = async () => {
      if (isProcessingRef.current || queuedViews.current.length === 0) {
        return;
      }

      isProcessingRef.current = true;
      
      try {
        // Take up to 5 views at a time
        const batch = queuedViews.current.splice(0, 5);
        
        // Group by contentId to reduce number of requests
        const groupedViews = batch.reduce((acc, curr) => {
          const key = `${curr.contentId}-${curr.userId || 'anonymous'}`;
          if (!acc[key]) {
            acc[key] = curr;
          }
          return acc;
        }, {} as Record<string, {contentId: string, userId?: string}>);
        
        // Process each unique view
        await Promise.all(Object.values(groupedViews).map(async view => {
          await supabase.from('content_views').insert([{
            content_id: view.contentId,
            user_id: view.userId || null,
            timestamp: new Date().toISOString()
          }]);
        }));
      } catch (error) {
        console.error("Error processing view queue:", error);
      } finally {
        isProcessingRef.current = false;
      }
    };

    const interval = setInterval(processQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  const trackView = (contentId: string, userId?: string) => {
    // Create a unique key for this view
    const viewKey = `${contentId}-${userId || 'anonymous'}`;
    
    // Only queue if not already processed in this session
    if (!processedViews.current.has(viewKey)) {
      queuedViews.current.push({ contentId, userId });
      processedViews.current.add(viewKey);
    }
  };

  return { trackView };
};
