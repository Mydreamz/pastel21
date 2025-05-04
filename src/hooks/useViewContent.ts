
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

  // Cache for the loaded content to prevent duplicate loadings
  const contentCache = useRef<Record<string, Content>>({});

  // Memoize the loadContent function with better state tracking
  const loadContent = useCallback(async (contentId: string) => {
    // Prevent duplicate loading attempts
    if (!contentId || contentLoadingRef.current || contentLoadedRef.current) {
      return;
    }

    try {
      contentLoadingRef.current = true;
      setLoading(true);
      setError(null);
      console.log(`Loading content with ID: ${contentId}`);
      
      // Check if content is already in cache
      if (contentCache.current[contentId]) {
        console.log("Using cached content data");
        setContent(contentCache.current[contentId]);
        contentLoadedRef.current = true;
        // Track view even when using cached data
        trackView(contentId, user?.id);
        
        // Handle permissions based on cached content
        handlePermissions(contentCache.current[contentId], contentId);
        return;
      }
      
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
      
      // Store in cache
      contentCache.current[contentId] = mapped;
      
      setContent(mapped);
      contentLoadedRef.current = true;
      
      // Track the content view only once when content is first loaded
      if (mapped) {
        trackView(contentId, user?.id);
      }

      // Handle authentication cases
      handlePermissions(mapped, contentId);
      
    } catch (e: any) {
      console.error("Error in loadContent:", e);
      setError(e.message || "Error loading content");
    } finally {
      setLoading(false);
      contentLoadingRef.current = false;
      contentLoadAttemptedRef.current = true;
    }
  }, [user, session, navigate, getSecureFileUrl, checkPurchaseStatus, trackView]);

  // Helper function to handle permissions and secure URLs
  const handlePermissions = useCallback(async (contentData: Content, contentId: string) => {
    if (!contentData || !user) return;
    
    // Handle authentication cases
    // Check if user is creator or has purchased the content
    const isCreator = contentData.creatorId === user.id;
    console.log(`User is creator: ${isCreator}`);
    
    if (isCreator) {
      setIsUnlocked(true);
      
      // If has file path, get secure URL
      if (contentData.filePath && ['image', 'video', 'audio', 'document'].includes(contentData.contentType)) {
        await getSecureFileUrl(contentId, contentData.filePath, user.id);
      }
    } else if (!transactionCheckedRef.current) {
      // Check for transactions - use cached result if available
      transactionCheckedRef.current = true;
      
      console.log(`Checking if user ${user.id} has purchased content ${contentId}`);
      const userHasTransaction = await checkPurchaseStatus(contentId, user.id);
      console.log(`User has transaction: ${userHasTransaction}`);
      
      if (parseFloat(contentData.price) === 0 || userHasTransaction) {
        setIsUnlocked(true);
        
        // If has file path, get secure URL
        if (contentData.filePath && ['image', 'video', 'audio', 'document'].includes(contentData.contentType)) {
          await getSecureFileUrl(contentId, contentData.filePath, user.id);
        }
      } else if (window.location.pathname.startsWith('/view/')) {
        // Redirect to preview page if paid content that user hasn't purchased
        console.log("Redirecting to preview page for unpurchased paid content");
        navigate(`/preview/${contentId}`);
      }
    }
  }, [user, getSecureFileUrl, checkPurchaseStatus, navigate]);

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
