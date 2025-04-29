
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

export const useContentPermissions = (content: any) => {
  const [isCreator, setIsCreator] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { toast } = useToast();

  // Function to check if content is purchased by the current user
  const checkPurchaseStatus = async () => {
    setIsChecking(true);
    
    if (!content) {
      setIsChecking(false);
      return;
    }

    try {
      const auth = localStorage.getItem('auth');
      if (auth) {
        const parsedAuth = JSON.parse(auth);
        if (parsedAuth && parsedAuth.user) {
          // Check if user is the creator
          setIsCreator(content.creatorId === parsedAuth.user.id);
          
          // Check if the content has been purchased by this user
          const { data: transactions, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('content_id', content.id)
            .eq('user_id', parsedAuth.user.id)
            .eq('is_deleted', false)
            .limit(1);
            
          if (error) {
            console.error("Error checking purchase status:", error);
          } else {
            setIsPurchased(transactions && transactions.length > 0);
          }
        }
      }
    } catch (e) {
      console.error("Permission checking error:", e);
    } finally {
      setIsChecking(false);
    }
  };

  // Function to refresh permissions after actions like purchasing
  const refreshPermissions = () => {
    checkPurchaseStatus();
  };

  useEffect(() => {
    checkPurchaseStatus();
  }, [content]);

  return { 
    isCreator, 
    isPurchased, 
    isChecking,
    refreshPermissions
  };
};
