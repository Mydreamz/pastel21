
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

export const useContentPermissions = (content: any) => {
  const { user } = useAuth();
  const [isCreator, setIsCreator] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { toast } = useToast();

  // Function to check if content is purchased by the current user
  const checkPurchaseStatus = async () => {
    // Don't check if user or content is not available yet.
    if (!user || !content) {
      setIsChecking(false);
      // Reset state if user logs out or content is not present
      if (!user) {
        setIsCreator(false);
        setIsPurchased(false);
      }
      return;
    }

    setIsChecking(true);
    console.log(`[useContentPermissions] Checking permissions for content ${content.id} and user ${user.id}`);

    try {
      // Check if user is the creator
      const creatorCheck = content.creatorId === user.id;
      setIsCreator(creatorCheck);
      
      // If user is creator, they have "purchased" access.
      if (creatorCheck) {
        setIsPurchased(true);
        setIsChecking(false);
        return;
      }

      // Check if the content has been purchased by this user
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('id')
        .eq('content_id', content.id)
        .eq('user_id', user.id)
        .eq('is_deleted', false)
        .limit(1);
        
      if (error) {
        console.error("Error checking purchase status:", error);
        setIsPurchased(false);
      } else {
        const purchasedCheck = transactions && transactions.length > 0;
        console.log(`[useContentPermissions] Purchase check result: ${purchasedCheck}`);
        setIsPurchased(purchasedCheck);
      }
    } catch (e) {
      console.error("Permission checking error:", e);
      setIsPurchased(false);
    } finally {
      setIsChecking(false);
    }
  };

  // Function to refresh permissions after actions like purchasing
  const refreshPermissions = () => {
    console.log('[useContentPermissions] Refreshing permissions...');
    checkPurchaseStatus();
  };

  useEffect(() => {
    checkPurchaseStatus();
  }, [content, user]);

  return { 
    isCreator, 
    isPurchased, 
    isChecking,
    refreshPermissions
  };
};
