
import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

/**
 * Hook for handling secure file URLs with caching to prevent repeated requests
 */
export const useSecureFileUrl = () => {
  const [secureFileUrl, setSecureFileUrl] = useState<string | null>(null);
  const [secureFileLoading, setSecureFileLoading] = useState(false);
  const [secureFileError, setSecureFileError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Cache URLs to avoid repeated requests (persistent across component re-renders)
  const urlCache = useRef<Record<string, string>>({});
  // Track in-flight requests to prevent duplicate calls
  const pendingRequests = useRef<Record<string, Promise<string | null>>>({});

  /**
   * Function to get secure URL for protected content with improved caching
   */
  const getSecureFileUrl = useCallback(async (contentId: string, filePath: string | undefined, userId?: string) => {
    if (!filePath) {
      console.log("Cannot get secure URL: Missing file path");
      return null;
    }
    
    if (!userId) {
      console.log("Cannot get secure URL: User not authenticated");
      return null;
    }

    // Create a cache key
    const cacheKey = `${contentId}-${filePath}`;
    
    // Check if URL is already in cache
    if (urlCache.current[cacheKey]) {
      console.log("Using cached secure URL");
      setSecureFileUrl(urlCache.current[cacheKey]);
      return urlCache.current[cacheKey];
    }
    
    // Check if there's already a pending request for this URL
    if (pendingRequests.current[cacheKey]) {
      console.log("Using pending request for secure URL");
      try {
        const result = await pendingRequests.current[cacheKey];
        setSecureFileUrl(result);
        return result;
      } catch (err) {
        console.error("Error resolving pending secure URL request:", err);
        return null;
      }
    }
    
    setSecureFileLoading(true);
    setSecureFileError(null);
    
    // Create a new promise for this request
    const requestPromise = (async () => {
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
          setSecureFileError(`Failed to get secure file: ${error.message || "Unknown error"}`);
          toast({
            title: "Error loading file",
            description: "Could not load the secure file. Please try again.",
            variant: "destructive"
          });
          return null;
        }

        if (!data?.secureUrl) {
          console.error('No secure URL returned from function');
          setSecureFileError("Server returned an invalid response");
          return null;
        }

        console.log('Secure URL retrieved successfully');
        
        // Cache the URL
        urlCache.current[cacheKey] = data.secureUrl;
        setSecureFileUrl(data.secureUrl);
        return data.secureUrl;
      } catch (err: any) {
        console.error('Failed to get secure file URL:', err);
        setSecureFileError(`Error: ${err.message || "Unknown error"}`);
        toast({
          title: "Error loading file",
          description: "Could not load the secure file. Please try again.",
          variant: "destructive"
        });
        return null;
      } finally {
        setSecureFileLoading(false);
        // Remove from pending requests after completion
        delete pendingRequests.current[cacheKey];
      }
    })();
    
    // Store the promise to prevent duplicate requests
    pendingRequests.current[cacheKey] = requestPromise;
    
    return requestPromise;
  }, [toast]);

  return {
    secureFileUrl,
    secureFileLoading,
    secureFileError,
    getSecureFileUrl,
    setSecureFileUrl
  };
};
