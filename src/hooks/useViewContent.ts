
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content } from '@/types/content';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/App';
import { useSecureFileUrl } from './content/useSecureFileUrl';
import { supabaseToContent } from './content/useContentMapping';
import { useContentTransaction } from './content/useContentTransaction';

export const useViewContent = (id: string | undefined) => {
  const navigate = useNavigate();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const { user, session } = useAuth();
  
  // Import sub-hooks
  const { 
    secureFileUrl, 
    secureFileLoading, 
    secureFileError, 
    getSecureFileUrl 
  } = useSecureFileUrl();
  
  const {
    isProcessing,
    handleContentPurchase
  } = useContentTransaction();

  // Track if content is already loaded to prevent duplicate loading
  const contentLoadedRef = useRef(false);
  const transactionCheckedRef = useRef(false);

  // Memoize the loadContent function to prevent recreating on every render
  const loadContent = useCallback(async () => {
    if (!id || contentLoadedRef.current) {
      if (!id) {
        setError("No content ID provided");
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log(`Loading content with ID: ${id}`);
      
      // Supabase query for the content
      const { data: foundContent, error: contentError } = await supabase
        .from('contents')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (contentError) {
        console.error("Error fetching content:", contentError);
        throw contentError;
      }

      if (!foundContent) {
        console.error(`Content with ID ${id} not found`);
        setError("Content not found");
        setContent(null);
        return;
      }
      
      console.log("Content found:", foundContent);
      const mapped = supabaseToContent(foundContent);
      setContent(mapped);
      contentLoadedRef.current = true;

      // Handle authentication cases
      if (user) {
        // Check if user is creator or has purchased the content
        const isCreator = mapped.creatorId === user.id;
        console.log(`User is creator: ${isCreator}`);
        
        if (isCreator) {
          setIsUnlocked(true);
          
          // If has file path, get secure URL
          if (mapped.filePath && ['image', 'video', 'audio', 'document'].includes(mapped.contentType)) {
            console.log(`Getting secure URL for creator's content, file path: ${mapped.filePath}`);
            await getSecureFileUrl(id, mapped.filePath, user.id);
          }
        } else if (!transactionCheckedRef.current) {
          // Check for transactions - use a single DB query
          transactionCheckedRef.current = true;
          console.log(`Checking if user ${user.id} has purchased content ${id}`);
          const { data: transactions, error: txError } = await supabase
            .from('transactions')
            .select('id')
            .eq('content_id', id)
            .eq('user_id', user.id)
            .eq('is_deleted', false)
            .limit(1);

          if (txError) {
            console.error("Error checking transactions:", txError);
          }

          const userHasTransaction = (transactions && transactions.length > 0);
          console.log(`User has transaction: ${userHasTransaction}`);
          
          if (parseFloat(mapped.price) === 0 || userHasTransaction) {
            setIsUnlocked(true);
            
            // If has file path, get secure URL
            if (mapped.filePath && ['image', 'video', 'audio', 'document'].includes(mapped.contentType)) {
              console.log(`Getting secure URL for purchased content, file path: ${mapped.filePath}`);
              await getSecureFileUrl(id, mapped.filePath, user.id);
            }
          } else if (window.location.pathname.startsWith('/view/')) {
            // Redirect to preview page if paid content that user hasn't purchased
            console.log("Redirecting to preview page for unpurchased paid content");
            navigate(`/preview/${id}`);
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
          navigate(`/preview/${id}`);
        }
      }
    } catch (e: any) {
      console.error("Error in loadContent:", e);
      setError(e.message || "Error loading content");
    } finally {
      setLoading(false);
    }
  }, [id, user, session, navigate, getSecureFileUrl]);

  // Reset refs if id changes
  useEffect(() => {
    contentLoadedRef.current = false;
    transactionCheckedRef.current = false;
  }, [id]);

  // Fetch content on initial load and when dependencies change
  useEffect(() => {
    if (!contentLoadedRef.current) {
      loadContent();
    }
  }, [loadContent]);

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
