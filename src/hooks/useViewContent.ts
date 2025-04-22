
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
        const contents = JSON.parse(localStorage.getItem('contents') || '[]');
        const foundContent = contents.find((item: any) => item.id === id);
        
        if (foundContent) {
          // Log the content being loaded
          console.log("Found content:", foundContent);
          setContent(foundContent);
          const user = checkAuth();
          
          if (user) {
            const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
            const userHasTransaction = transactions.some(
              (tx: any) => tx.contentId === id && tx.userId === user.id
            );
            
            if (
              parseFloat(foundContent.price) === 0 || 
              foundContent.creatorId === user.id ||
              userHasTransaction
            ) {
              setIsUnlocked(true);
            }
          } else {
            // Handle the case for non-authenticated users
            // They can see preview but not unlocked content
            setIsUnlocked(false);
          }
        } else {
          console.error("Content not found for ID:", id);
          setError("Content not found");
        }
      } catch (e) {
        console.error("Error fetching content:", e);
        setError("Error loading content");
      } finally {
        setLoading(false);
      }
    };
    
    loadContent();
  }, [id]);

  const handleUnlock = () => {
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
      const transaction = {
        id: crypto.randomUUID(),
        contentId: id,
        userId: userData.id,
        creatorId: content.creatorId,
        amount: content.price,
        timestamp: new Date().toISOString()
      };
      
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      transactions.push(transaction);
      localStorage.setItem('transactions', JSON.stringify(transactions));
      
      setIsUnlocked(true);
      
      toast({
        title: "Content unlocked",
        description: `Thank you for your purchase of $${content.price ? parseFloat(content.price).toFixed(2) : '0.00'}`
      });
      
      // Redirect to full content view
      navigate(`/view/${id}`);
      
      if (content && userData) {
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
    handleUnlock,
    isAuthenticated
  };
};
