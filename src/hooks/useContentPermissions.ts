
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/App';

export const useContentPermissions = (content: any) => {
  const [isCreator, setIsCreator] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [purchaseId, setPurchaseId] = useState<string | null>(null);
  const { user } = useAuth();

  // Add a function to explicitly check permissions that can be called from outside
  const checkPermissions = useCallback(async () => {
    if (!content || !user) {
      setIsCreator(false);
      setIsPurchased(false);
      setPurchaseId(null);
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
        setPurchaseId(null);
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
      
      // Store the purchase ID for potential deletion
      if (hasPurchased && transactions[0]) {
        setPurchaseId(transactions[0].id);
      } else {
        setPurchaseId(null);
      }
    } catch (err) {
      console.error('Error checking permissions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [content, user]);

  // Function to delete a purchase
  const deletePurchase = useCallback(async () => {
    if (!purchaseId || !user) {
      return { success: false, error: 'No purchase found or user not authenticated' };
    }
    
    try {
      // Mark transaction as deleted rather than actually deleting it
      const { error } = await supabase
        .from('transactions')
        .update({ is_deleted: true })
        .eq('id', purchaseId)
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error deleting purchase:', error);
        return { success: false, error: error.message };
      }
      
      // Refresh permissions
      await checkPermissions();
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting purchase:', err);
      return { success: false, error: err.message };
    }
  }, [purchaseId, user, checkPermissions]);

  // Initial permission check when component mounts or dependencies change
  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  return { 
    isCreator, 
    isPurchased, 
    isLoading,
    purchaseId,
    refetchPermissions: checkPermissions,
    deletePurchase
  };
};
