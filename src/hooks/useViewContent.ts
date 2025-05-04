
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content } from '@/types/content';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/App';
import { useSecureFileUrl } from './content/useSecureFileUrl';
import { supabaseToContent } from './content/useContentMapping';
import { useContentTransaction } from './content/useContentTransaction';
import { useViewTracking } from './useViewTracking';

export const useViewContent = (id: string | undefined) => {
  const navigate = useNavigate();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const { user, session } = useAuth();
  
  // Track content loading state to prevent duplicate calls
  const contentLoadingRef = useRef(false);
  const contentLoadAttemptedRef = useRef(false);
  const contentLoadedRef = useRef(false);
  const transactionCheckedRef = useRef(false);
  
  // Import sub-hooks
  const { 
    secureFileUrl, 
    secureFileLoading, 
    secureFileError, 
    getSecureFileUrl 
  } = useSecureFileUrl();
  
  const {
    isProcessing,
    handleContentPurchase,
    checkPurchaseStatus
  } = useContentTransaction();
  
  const { trackView } = useViewTracking();

  // Memoize the loadContent function with better state tracking
  const loadContent = useCallback(async (contentId: string) => {
    if (!contentId || contentLoadingRef.current || contentLoadedRef.current) {
      return;
    }

    try {
      contentLoadingRef.current = true;
      setLoading(true);
      setError(null);
      console.log(`Loading content with ID: ${contentId}`);
      
      // Supabase query for the content
      const { data: foundContent, error: contentError } = await supabase
        .from('contents')
        .select('*')
        .eq('id', contentId)
        .maybeSingle();

      if (contentError) {
        console.error("Error fetching content:", contentError);
        throw contentError;
      }

      if (!foundContent) {
        console.error(`Content with ID ${contentId} not found`);
        setError("Content not found");
        setContent(null);
        return;
      }
      
      console.log("Content found:", foundContent);
      const mapped = supabaseToContent(foundContent);
      setContent(mapped);
      contentLoadedRef.current = true;
      
      // Track the content view only once when content is first loaded
      if (mapped) {
        trackView(contentId, user?.id);
      }

      // Handle authentication cases
      if (user) {
        // Check if user is creator or has purchased the content
        const isCreator = mapped.creatorId === user.id;
        console.log(`User is creator: ${isCreator}`);
        
        if (isCreator) {
          setIsUnlocked(true);
          
          // If has file path, get secure URL
          if (mapped.filePath && ['image', 'video', 'audio', 'document'].includes(mapped.contentType)) {
            await getSecureFileUrl(contentId, mapped.filePath, user.id);
          }
        } else if (!transactionCheckedRef.current) {
          // Check for transactions - use cached result if available
          transactionCheckedRef.current = true;
          
          const userHasTransaction = await checkPurchaseStatus(contentId, user.id);
          console.log(`User has transaction: ${userHasTransaction}`);
          
          if (parseFloat(mapped.price) === 0 || userHasTransaction) {
            setIsUnlocked(true);
            
            // If has file path, get secure URL
            if (mapped.filePath && ['image', 'video', 'audio', 'document'].includes(mapped.contentType)) {
              await getSecureFileUrl(contentId, mapped.filePath, user.id);
            }
          } else if (window.location.pathname.startsWith('/view/')) {
            // Redirect to preview page if paid content that user hasn't purchased
            console.log("Redirecting to preview page for unpurchased paid content");
            navigate(`/preview/${contentId}`);
          }
        }
      } else {
        // Handle unauthenticated user
        console.log("User is not authenticated");
        
        if (parseFloat(mapped.price) === 0) {
          // Free content is still unlocked for unauthenticated users
          console.log("Content is free - unlocking for unauthenticated user");
          setIsUnlocked(true);
        } else if (window.location.pathname.startsWith('/view/')) {
          // Only redirect if we're on the view route and it's paid content
          console.log("Redirecting unauthenticated user to preview page for paid content");
          navigate(`/preview/${contentId}`);
        }
      }
    } catch (e: any) {
      console.error("Error in loadContent:", e);
      setError(e.message || "Error loading content");
    } finally {
      setLoading(false);
      contentLoadingRef.current = false;
      contentLoadAttemptedRef.current = true;
    }
  }, [user, session, navigate, getSecureFileUrl, checkPurchaseStatus, trackView]);

  // Reset refs if id changes
  useEffect(() => {
    contentLoadedRef.current = false;
    contentLoadAttemptedRef.current = false;
    transactionCheckedRef.current = false;
    contentLoadingRef.current = false;
    
    setContent(null);
    setIsUnlocked(false);
    setError(null);
  }, [id]);

  // Fetch content only once on initial load with proper dependency tracking
  useEffect(() => {
    if (id && !contentLoadAttemptedRef.current) {
      loadContent(id);
    }
  }, [id, loadContent]);

  const handleUnlock = async () => {
    if (!session || !user) {
      return;
    }

    if (!content || !id) return;
    
    const userName = user.user_metadata?.name || user.email;
    const result = await handleContentPurchase(content, user.id, userName);
    
    if (result) {
      setIsUnlocked(true);
      transactionCheckedRef.current = true;
      
      // After purchase, get secure URL for file if it exists
      if (content.filePath && ['image', 'video', 'audio', 'document'].includes(content.contentType)) {
        console.log(`Getting secure URL after purchase, file path: ${content.filePath}`);
        await getSecureFileUrl(id, content.filePath, user.id);
      }
    }
  };

  return {
    content,
    loading,
    error,
    isUnlocked,
    handleUnlock,
    isAuthenticated: !!session,
    secureFileUrl,
    secureFileLoading,
    secureFileError,
    isProcessing
  };
};
