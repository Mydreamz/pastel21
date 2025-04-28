
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from '@/contexts/NotificationContext';
import { Content, ContentType } from '@/types/content';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/App';

const supabaseToContent = (row: any): Content => ({
  id: row.id,
  title: row.title,
  teaser: row.teaser,
  price: row.price,
  content: row.content,
  contentType: row.content_type as ContentType,
  creatorId: row.creator_id,
  creatorName: row.creator_name,
  expiry: row.expiry || undefined,
  scheduledFor: row.scheduled_for || undefined,
  scheduledTime: row.scheduled_time || undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  status: row.status || 'published',
  fileUrl: row.file_url || undefined,
  fileName: row.file_name || undefined,
  fileType: row.file_type || undefined,
  fileSize: row.file_size || undefined,
  filePath: row.file_path || undefined,
  tags: row.tags || [],
  category: row.category || undefined,
  views: row.views ?? undefined
});

export const useViewContent = (id: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [secureFileUrl, setSecureFileUrl] = useState<string | null>(null);
  const [secureFileLoading, setSecureFileLoading] = useState(false);
  const [secureFileError, setSecureFileError] = useState<string | null>(null);
  const { user, session } = useAuth();

  // Function to get secure URL for protected content
  const getSecureFileUrl = async (contentId: string, filePath: string | undefined) => {
    if (!filePath || !user) {
      console.log("Cannot get secure URL: Missing file path or user not authenticated");
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
      return data.secureUrl;
    } catch (err: any) {
      console.error('Failed to get secure file URL:', err);
      setSecureFileError(`Error: ${err.message || "Unknown error"}`);
      return null;
    } finally {
      setSecureFileLoading(false);
    }
  };
  
  // Function to load content
  const loadContent = useCallback(async () => {
    if (!id) {
      setError("No content ID provided");
      setLoading(false);
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

      if (user) {
        // Check if user is creator or has purchased the content
        const isCreator = mapped.creatorId === user.id;
        console.log(`User is creator: ${isCreator}`);
        
        if (isCreator) {
          setIsUnlocked(true);
          
          // If has file path, get secure URL
          if (mapped.filePath && ['image', 'video', 'audio', 'document'].includes(mapped.contentType)) {
            console.log(`Getting secure URL for creator's content, file path: ${mapped.filePath}`);
            const url = await getSecureFileUrl(id, mapped.filePath);
            setSecureFileUrl(url);
          }
        } else {
          // Check for transactions
          console.log(`Checking if user ${user.id} has purchased content ${id}`);
          const { data: transactions, error: txError } = await supabase
            .from('transactions')
            .select('*')
            .eq('content_id', id)
            .eq('user_id', user.id);

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
              const url = await getSecureFileUrl(id, mapped.filePath);
              setSecureFileUrl(url);
            }
          } else if (window.location.pathname.startsWith('/view/')) {
            // Redirect to preview page if paid content that user hasn't purchased
            console.log("Redirecting to preview page for unpurchased paid content");
            navigate(`/preview/${id}`);
          }
        }
      } else if (
        window.location.pathname.startsWith('/view/') &&
        parseFloat(foundContent.price) > 0
      ) {
        // Redirect to preview page if user is not authenticated and content is paid
        console.log("Redirecting unauthenticated user to preview page for paid content");
        navigate(`/preview/${id}`);
      } else if (parseFloat(foundContent.price) === 0) {
        // Free content is still unlocked, but we need to handle the file URL differently
        console.log("Content is free - unlocking for unauthenticated user");
        setIsUnlocked(true);
      }
    } catch (e: any) {
      console.error("Error in loadContent:", e);
      setError(e.message || "Error loading content");
    } finally {
      setLoading(false);
    }
  }, [id, user, navigate, getSecureFileUrl]);

  // Load content on initial render and when dependencies change
  useEffect(() => {
    loadContent();
  }, [loadContent]);

  // Function to handle content purchase
  const handleUnlock = async () => {
    if (!session || !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to unlock this content",
        variant: "destructive"
      });
      return;
    }

    if (!content || !id) return;

    try {
      console.log(`User ${user.id} purchasing content ${id}`);
      
      // Insert transaction
      const { error: transactionError } = await supabase.from('transactions').insert([{
        content_id: id,
        user_id: user.id,
        creator_id: content.creatorId,
        amount: content.price,
        timestamp: new Date().toISOString()
      }]);

      if (transactionError) {
        console.error("Transaction error:", transactionError);
        throw transactionError;
      }

      setIsUnlocked(true);

      // After purchase, get secure URL for file if it exists
      if (content.filePath && ['image', 'video', 'audio', 'document'].includes(content.contentType)) {
        console.log(`Getting secure URL after purchase, file path: ${content.filePath}`);
        const url = await getSecureFileUrl(id, content.filePath);
        setSecureFileUrl(url);
      }

      toast({
        title: "Content unlocked",
        description: `Thank you for your purchase of $${parseFloat(content.price).toFixed(2)}`
      });

      // Redirect to the view page with a purchase parameter
      navigate(`/view/${id}?purchased=true`);

      if (content && user) {
        addNotification({
          title: "New Purchase",
          message: `${user.user_metadata?.name || user.email} purchased your content "${content.title}" for $${parseFloat(content.price).toFixed(2)}`,
          type: 'content',
          link: `/profile`
        });
      }

    } catch (e: any) {
      console.error("Error in handleUnlock:", e);
      toast({
        title: "Transaction failed",
        description: e.message || "There was a problem processing your purchase",
        variant: "destructive"
      });
    }
  };

  // Function to refetch content
  const refetchContent = useCallback(() => {
    // Reset state for content reload
    setSecureFileUrl(null);
    setSecureFileError(null);
    
    // Reload content
    loadContent();
  }, [loadContent]);

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
    refetchContent
  };
};
