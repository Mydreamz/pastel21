
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from '@/contexts/NotificationContext';
import { Content } from '@/types/content';

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
    const auth = localStorage.getItem('auth');
    if (auth) {
      try {
        const parsedAuth = JSON.parse(auth);
        if (parsedAuth && parsedAuth.user) {
          setIsAuthenticated(true);
          setUserData(parsedAuth.user);
        }
      } catch (e) {
        console.error("Auth parsing error", e);
      }
    }
    
    if (id) {
      try {
        const contents = JSON.parse(localStorage.getItem('contents') || '[]');
        const foundContent = contents.find((item: any) => item.id === id);
        
        if (foundContent) {
          setContent(foundContent);
          
          const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
          const userHasTransaction = transactions.some(
            (tx: any) => tx.contentId === id && tx.userId === (userData?.id || '')
          );
          
          if (
            parseFloat(foundContent.price) === 0 || 
            foundContent.creatorId === userData?.id ||
            userHasTransaction
          ) {
            setIsUnlocked(true);
          }
        } else {
          setError("Content not found");
        }
      } catch (e) {
        console.error("Error fetching content:", e);
        setError("Error loading content");
      }
      
      setLoading(false);
    }
  }, [id, userData]);

  const handleUnlock = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to unlock this content",
        variant: "destructive"
      });
      navigate(`/preview/${id}`);
      return;
    }
    
    try {
      const transaction = {
        id: crypto.randomUUID(),
        contentId: id,
        userId: userData.id,
        creatorId: content?.creatorId,
        amount: content?.price,
        timestamp: new Date().toISOString()
      };
      
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      transactions.push(transaction);
      localStorage.setItem('transactions', JSON.stringify(transactions));
      
      setIsUnlocked(true);
      
      toast({
        title: "Content unlocked",
        description: `Thank you for your purchase of $${content?.price ? parseFloat(content.price).toFixed(2) : '0.00'}`
      });
      
      // Redirect to full content view
      navigate(`/view/${id}`);
      
      if (content) {
        addNotification({
          title: "New Purchase",
          message: `${userData.name} purchased your content "${content.title}" for $${content.price ? parseFloat(content.price).toFixed(2) : '0.00'}`,
          type: 'content',
          link: `/profile`
        });
      }
      
    } catch (e) {
      console.error("Error processing transaction:", e);
      toast({
        title: "Transaction failed",
        description: "There was a problem processing your purchase",
        variant: "destructive"
      });
    }
  };

  return {
    content,
    loading,
    error,
    isUnlocked,
    handleUnlock
  };
};
