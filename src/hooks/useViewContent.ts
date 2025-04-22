
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from '@/contexts/NotificationContext';
import { Content } from '@/types/content';
import { supabase } from '@/integrations/supabase/client';

export const useViewContent = (id: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('auth');
      if (auth) {
        try {
          const parsedAuth = JSON.parse(auth);
          if (parsedAuth && parsedAuth.user) {
            setIsAuthenticated(true);
            setUserData(parsedAuth.user);
            return parsedAuth.user;
          }
        } catch (e) {
          console.error("Auth parsing error", e);
        }
      }
      return null;
    };

    const loadContent = async () => {
      if (!id) {
        setError("No content ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Supabase query for the content
        const { data: foundContent, error: contentError } = await supabase
          .from('contents')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (contentError) {
          throw contentError;
        }

        if (foundContent) {
          setContent(foundContent as Content);
          const user = checkAuth();

          if (user) {
            // Query for transactions
            const { data: transactions } = await supabase
              .from('transactions')
              .select('*')
              .eq('content_id', id)
              .eq('user_id', user.id);

            const userHasTransaction = (transactions && transactions.length > 0);

            const isCreator = foundContent.creator_id === user.id;

            if (
              parseFloat(foundContent.price) === 0 ||
              isCreator ||
              userHasTransaction
            ) {
              setIsUnlocked(true);
            } else if (window.location.pathname.startsWith('/view/')) {
              navigate(`/preview/${id}`);
            }
          } else if (
            window.location.pathname.startsWith('/view/') &&
            parseFloat(foundContent.price) > 0
          ) {
            navigate(`/preview/${id}`);
          }
        } else {
          setError("Content not found");
          setContent(null);
        }
      } catch (e: any) {
        setError(e.message || "Error loading content");
      } finally {
        setLoading(false);
      }
    };

    loadContent();
    // eslint-disable-next-line
  }, [id]);

  const handleUnlock = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to unlock this content",
        variant: "destructive"
      });
      return;
    }

    if (!content) return;

    try {
      // Insert transaction
      const { error: transactionError } = await supabase.from('transactions').insert([{
        content_id: id,
        user_id: userData.id,
        creator_id: content.creator_id,
        amount: content.price,
        timestamp: new Date().toISOString()
      }]);

      if (transactionError) {
        throw transactionError;
      }

      setIsUnlocked(true);

      toast({
        title: "Content unlocked",
        description: `Thank you for your purchase of $${parseFloat(content.price).toFixed(2)}`
      });

      navigate(`/view/${id}`);

      if (content && userData) {
        addNotification({
          title: "New Purchase",
          message: `${userData.name} purchased your content "${content.title}" for $${parseFloat(content.price).toFixed(2)}`,
          type: 'content',
          link: `/profile`
        });
      }

    } catch (e: any) {
      toast({
        title: "Transaction failed",
        description: e.message || "There was a problem processing your purchase",
        variant: "destructive"
      });
    }
  };

  return {
    content,
    loading,
    error,
    isUnlocked,
    handleUnlock,
    isAuthenticated
  };
};
