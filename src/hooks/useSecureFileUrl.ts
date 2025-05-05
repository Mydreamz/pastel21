
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
 * Cached version of fetchSecureFileUrl with a cache duration of 15 minutes (increased from 10)
 * Using a stable reference to prevent unnecessary rerenders
 */
const getCachedSecureFileUrl = createCacheableRequest(fetchSecureFileUrl, 15 * 60 * 1000);

/**
 * Hook for handling secure file URLs with caching to prevent repeated requests
 */
export const useSecureFileUrl = () => {
  const { toast } = useToast();
  const [secureUrl, setSecureUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const hasFetchedRef = useRef(false);

  const getSecureFileUrl = useCallback(async (
    contentId: string, 
    filePath: string | undefined, 
    userId?: string
  ): Promise<string | null> => {
    if (!contentId || !filePath) {
      return null;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Fixed TypeScript error: Direct awaiting of the function instead of returning a Promise<Promise<string>>
      const url = await getCachedSecureFileUrl(contentId, filePath);
      
      setSecureUrl(url);
      hasFetchedRef.current = true;
      return url;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get secure URL');
      setError(error);
      toast({
        title: 'Error',
        description: 'Failed to load secure content URL',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    secureUrl,
    isLoading,
    error,
    getSecureFileUrl
  };
};
