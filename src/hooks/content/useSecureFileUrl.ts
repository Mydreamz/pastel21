
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for handling secure file URLs
 */
export const useSecureFileUrl = () => {
  const [secureFileUrl, setSecureFileUrl] = useState<string | null>(null);
  const [secureFileLoading, setSecureFileLoading] = useState(false);
  const [secureFileError, setSecureFileError] = useState<string | null>(null);

  /**
   * Function to get secure URL for protected content
   */
  const getSecureFileUrl = async (contentId: string, filePath: string | undefined, userId?: string) => {
    if (!filePath) {
      console.log("Cannot get secure URL: Missing file path");
      return null;
    }
    
    if (!userId) {
      console.log("Cannot get secure URL: User not authenticated");
      return null;
    }
    
    setSecureFileLoading(true);
    setSecureFileError(null);
    
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
        return null;
      }

      if (!data?.secureUrl) {
        console.error('No secure URL returned from function');
        setSecureFileError("Server returned an invalid response");
        return null;
      }

      console.log('Secure URL retrieved successfully');
      setSecureFileUrl(data.secureUrl);
      return data.secureUrl;
    } catch (err: any) {
      console.error('Failed to get secure file URL:', err);
      setSecureFileError(`Error: ${err.message || "Unknown error"}`);
      return null;
    } finally {
      setSecureFileLoading(false);
    }
  };

  return {
    secureFileUrl,
    secureFileLoading,
    secureFileError,
    getSecureFileUrl,
    setSecureFileUrl
  };
};
