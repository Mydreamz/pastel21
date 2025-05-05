
import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { createCacheableRequest } from '@/utils/requestUtils';

// Cache for URL requests to avoid repeated edge function calls
const secureUrlCache = new Map<string, {
  url: string,
  timestamp: number
}>();

// Cache duration increased to 30 minutes to reduce requests
const CACHE_DURATION = 30 * 60 * 1000;

/**
 * Private implementation function to get a secure file URL
 * with improved caching and error handling
 */
const fetchSecureFileUrl = async (
  contentId: string, 
  filePath: string | undefined
): Promise<string | null> => {
  if (!filePath) {
    console.log("[SecureFileUrl] Cannot get secure URL: Missing file path");
    return null;
  }
  
  // Generate a consistent cache key
  const cacheKey = `${contentId}:${filePath}`;
  const cached = secureUrlCache.get(cacheKey);
  
  // Return cached URL if still valid
  if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
    console.log(`[SecureFileUrl] Using cached secure URL for ${cacheKey}`);
    return cached.url;
  }
  
  try {
    console.log(`[SecureFileUrl] Fetching secure URL for content ID: ${contentId}, file path: ${filePath}`);
    
    // Call the secure-media edge function with POST method and JSON body
    const { data, error } = await supabase.functions.invoke('secure-media', {
      body: { 
        contentId, 
        filePath 
      },
      method: 'POST',
    });

    if (error) {
      console.error('[SecureFileUrl] Error getting secure file URL:', error);
      return null;
    }

    if (!data?.secureUrl) {
      console.error('[SecureFileUrl] No secure URL returned from function');
      return null;
    }

    console.log('[SecureFileUrl] Secure URL retrieved successfully');
    
    // Cache the result
    secureUrlCache.set(cacheKey, {
      url: data.secureUrl,
      timestamp: Date.now()
    });
    
    return data.secureUrl;
  } catch (err: any) {
    console.error('[SecureFileUrl] Failed to get secure file URL:', err);
    return null;
  }
};

/**
 * Cached version of fetchSecureFileUrl with longer cache duration
 */
const getCachedSecureFileUrl = createCacheableRequest(fetchSecureFileUrl, CACHE_DURATION);

/**
 * Hook for handling secure file URLs with optimized caching
 */
export const useSecureFileUrl = () => {
  const { toast } = useToast();
  const [secureUrl, setSecureUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pendingRequestRef = useRef<Promise<string | null> | null>(null);
  const hasFetchedRef = useRef(false);

  // Memoized function to get secure URL
  const getSecureFileUrl = useCallback(async (
    contentId: string, 
    filePath: string | undefined, 
    userId?: string
  ): Promise<string | null> => {
    if (!contentId || !filePath) {
      return null;
    }
    
    // If already fetching for the same content, reuse the request
    if (pendingRequestRef.current) {
      console.log('[SecureFileUrl] Reusing in-flight request');
      return pendingRequestRef.current;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {      
      // Create a new request and store the promise
      const requestPromise = getCachedSecureFileUrl(contentId, filePath);
      pendingRequestRef.current = requestPromise;
      
      const url = await requestPromise;
      
      if (!url) {
        throw new Error('Failed to get secure URL');
      }
      
      setSecureUrl(url);
      hasFetchedRef.current = true;
      return url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get secure URL';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: 'Failed to load secure content URL',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
      pendingRequestRef.current = null;
    }
  }, [toast]);

  return {
    secureUrl,
    isLoading,
    error,
    getSecureFileUrl
  };
};
