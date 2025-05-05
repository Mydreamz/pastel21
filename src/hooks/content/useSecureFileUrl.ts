import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { createCacheableRequest } from '@/utils/requestUtils';

/**
 * Private implementation function to get a secure file URL
 */
const fetchSecureFileUrl = async (
  contentId: string, 
  filePath: string | undefined
): Promise<string | null> => {
  if (!filePath) {
    console.log("Cannot get secure URL: Missing file path");
    return null;
  }
  
  try {
    console.log(`Getting secure URL for content ID: ${contentId}, file path: ${filePath}`);
    
    // Call the secure-media edge function with POST method and JSON body
    const { data, error } = await supabase.functions.invoke('secure-media', {
      body: { 
        contentId, 
        filePath 
      },
      method: 'POST',
    });

    if (error) {
      console.error('Error getting secure file URL:', error);
      return null;
    }

    if (!data?.secureUrl) {
      console.error('No secure URL returned from function');
      return null;
    }

    console.log('Secure URL retrieved successfully');
    return data.secureUrl;
  } catch (err: any) {
    console.error('Failed to get secure file URL:', err);
    return null;
  }
};

/**
 * Cached version of fetchSecureFileUrl with a cache duration of 5 minutes
 * Using a stable reference to prevent unnecessary rerenders
 */
const getCachedSecureFileUrl = createCacheableRequest(fetchSecureFileUrl, 5 * 60 * 1000);

/**
 * Hook for handling secure file URLs with caching to prevent repeated requests
 */
export const useSecureFileUrl = () => {
  const [secureFileUrl, setSecureFileUrl] = useState<string | null>(null);
  const [secureFileLoading, setSecureFileLoading] = useState(false);
  const [secureFileError, setSecureFileError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Keep track of in-flight requests to prevent duplicates
  const requestInProgress = useRef<Record<string, Promise<string | null>>>({});

  /**
   * Function to get secure URL for protected content with improved caching
   */
  const getSecureFileUrl = useCallback(async (
    contentId: string, 
    filePath: string | undefined, 
    userId?: string
  ): Promise<string | null> => {
    if (!filePath) {
      console.log("Cannot get secure URL: Missing file path");
      return null;
    }
    
    if (!userId) {
      console.log("Cannot get secure URL: User not authenticated");
      return null;
    }

    // Generate a cache key for this specific request
    const cacheKey = `${contentId}-${filePath}`;
    
    // If we already have a request in progress for this key, return that promise
    if (requestInProgress.current[cacheKey]) {
      return requestInProgress.current[cacheKey];
    }

    setSecureFileLoading(true);
    setSecureFileError(null);
    
    try {
      // Fix: Get the promise from the cached function, avoiding nested promises
      const promise = getCachedSecureFileUrl(contentId, filePath);
      requestInProgress.current[cacheKey] = promise;
      
      // Await the promise to get the actual string value
      const url = await promise;
      
      if (!url) {
        setSecureFileError("Failed to get secure file URL");
        toast({
          title: "Error loading file",
          description: "Could not load the secure file. Please try again.",
          variant: "destructive"
        });
        return null;
      }
      
      setSecureFileUrl(url);
      return url;
    } catch (err: any) {
      setSecureFileError(`Error: ${err.message || "Unknown error"}`);
      toast({
        title: "Error loading file",
        description: "Could not load the secure file. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      // Remove the in-flight request tracking
      delete requestInProgress.current[cacheKey];
      setSecureFileLoading(false);
    }
  }, [toast]);

  return {
    secureFileUrl,
    secureFileLoading,
    secureFileError,
    getSecureFileUrl,
    setSecureFileUrl
  };
};
