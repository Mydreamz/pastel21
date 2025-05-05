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
 * Cached version of fetchSecureFileUrl with a cache duration of 10 minutes (increased from 5)
 * Using a stable reference to prevent unnecessary rerenders
 */
const getCachedSecureFileUrl = createCacheableRequest(fetchSecureFileUrl, 10 * 60 * 1000);

/**
 * Hook for handling secure file URLs with caching to prevent repeated requests
 */
export const useSecureFileUrl = (contentId: string, filePath: string | undefined) => {
  const { toast } = useToast();
  const [secureUrl, setSecureUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const hasFetchedRef = useRef(false);

  const getSecureUrl = useCallback(async () => {
    if (!contentId || !filePath || hasFetchedRef.current) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const url = await getCachedSecureFileUrl(contentId, filePath);
      setSecureUrl(url);
      hasFetchedRef.current = true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get secure URL');
      setError(error);
      toast({
        title: 'Error',
        description: 'Failed to load secure content URL',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [contentId, filePath, toast]);

  return {
    secureUrl,
    isLoading,
    error,
    getSecureUrl
  };
};
