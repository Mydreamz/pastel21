
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SecureFileUrlState {
  secureUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

// Global cache to reduce redundant calls
const urlCache: Record<string, {
  url: string;
  expires: number;
}> = {};

// Track in-flight requests to prevent duplicates
const pendingRequests: Record<string, Promise<string>> = {};

// Cache expiration time - 4 minutes to be safe (signed URLs last 5 mins)
const CACHE_DURATION = 4 * 60 * 1000;

export const useSecureFileUrl = () => {
  const [state, setState] = useState<SecureFileUrlState>({
    secureUrl: null,
    isLoading: false,
    error: null
  });
  const { toast } = useToast();

  // Clear cache entries that have expired
  const cleanupCache = useCallback(() => {
    const now = Date.now();
    Object.keys(urlCache).forEach(key => {
      if (urlCache[key].expires < now) {
        delete urlCache[key];
      }
    });
  }, []);

  // Main function to get secure file URL with caching
  const getSecureFileUrl = useCallback(async (
    contentId: string,
    filePath: string,
    userId?: string
  ): Promise<string> => {
    if (!contentId || !filePath) {
      setState(prev => ({ ...prev, error: 'Missing content ID or file path' }));
      return Promise.reject('Missing content ID or file path');
    }

    // Create a cache key from content ID and file path
    const cacheKey = `${contentId}:${filePath}`;
    
    // Check if we have a cached URL that hasn't expired
    cleanupCache();
    if (urlCache[cacheKey] && urlCache[cacheKey].expires > Date.now()) {
      console.log(`[useSecureFileUrl] Using cached URL for ${cacheKey}`);
      setState(prev => ({ 
        ...prev, 
        secureUrl: urlCache[cacheKey].url,
        isLoading: false,
        error: null
      }));
      return urlCache[cacheKey].url;
    }

    // Check if there's already a request in flight for this file
    if (pendingRequests[cacheKey]) {
      console.log(`[useSecureFileUrl] Reusing in-flight request for ${cacheKey}`);
      
      try {
        // Wait for the existing request and return its result directly
        const url = await pendingRequests[cacheKey];
        setState(prev => ({ 
          ...prev, 
          secureUrl: url,
          isLoading: false,
          error: null
        }));
        return url;
      } catch (err) {
        setState(prev => ({ 
          ...prev, 
          secureUrl: null,
          isLoading: false,
          error: err instanceof Error ? err.message : String(err)
        }));
        throw err;
      }
    }

    // If we got here, we need to make a new request
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    // Create a new promise for this request
    const requestPromise = (async () => {
      try {
        console.log(`[useSecureFileUrl] Fetching secure URL for ${cacheKey}`);
        
        // Call the secure-media edge function to get a signed URL
        const { data, error } = await supabase.functions.invoke('secure-media', {
          body: { 
            contentId, 
            filePath,
            userId 
          }
        });
        
        if (error) {
          throw new Error(error.message || 'Failed to get secure file URL');
        }
        
        if (!data?.signedUrl) {
          throw new Error('No signed URL returned');
        }
        
        // Store URL in cache with expiration time
        urlCache[cacheKey] = {
          url: data.signedUrl,
          expires: Date.now() + CACHE_DURATION
        };
        
        // Update state with the URL
        setState(prev => ({ 
          ...prev, 
          secureUrl: data.signedUrl,
          isLoading: false,
          error: null
        }));
        
        return data.signedUrl;
      } catch (err) {
        console.error('[useSecureFileUrl] Error:', err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        
        setState(prev => ({ 
          ...prev, 
          secureUrl: null,
          isLoading: false,
          error: errorMessage
        }));
        
        toast({
          title: "Error getting secure file",
          description: errorMessage,
          variant: "destructive"
        });
        
        throw err;
      } finally {
        // Remove this request from pending when done
        delete pendingRequests[cacheKey];
      }
    })();
    
    // Store the promise so we can reuse it
    pendingRequests[cacheKey] = requestPromise;
    
    return requestPromise;
  }, [cleanupCache, toast]);

  return {
    ...state,
    getSecureFileUrl
  };
};
