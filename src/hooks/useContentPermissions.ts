
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/App';

export const useContentPermissions = (content: any) => {
  const [isCreator, setIsCreator] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Add a function to explicitly check permissions that can be called from outside
  const checkPermissions = useCallback(async () => {
    if (!content || !user) {
      setIsCreator(false);
      setIsPurchased(false);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Check if user is creator
      const isContentCreator = content.creatorId === user.id;
      setIsCreator(isContentCreator);
      
      if (isContentCreator) {
        // Creator has full access
        setIsPurchased(true);
        return;
      }
      
      // Check if user has purchased content by querying Supabase
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('content_id', content.id)
        .eq('user_id', user.id)
        .eq('is_deleted', false);
        
      if (error) {
        console.error('Error checking transactions:', error);
        throw error;
      }
      
      const hasPurchased = transactions && transactions.length > 0;
      setIsPurchased(hasPurchased);
    } catch (err) {
      console.error('Error checking permissions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [content, user]);

  // Initial permission check when component mounts or dependencies change
  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  return { 
    isCreator, 
    isPurchased, 
    isLoading, 
    refetchPermissions: checkPermissions // Expose the function to manually refresh permissions
  };
};
