
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

  const checkPurchaseStatus = async () => {
    if (!content || !user) {
      setIsChecking(false);
      return;
    }
    
    setIsChecking(true);
    try {
      const creatorCheck = content.creatorId === user.id;
      setIsCreator(creatorCheck);
      
      if (creatorCheck) {
        setIsPurchased(true);
        setIsChecking(false);
        return;
      }
      
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('id')
        .eq('content_id', content.id)
        .eq('user_id', user.id)
        .eq('is_deleted', false)
        .limit(1);
        
      if (error) {
        console.error("Error checking purchase status:", error);
        toast({ title: "Error", description: "Could not verify purchase status.", variant: "destructive" });
      } else {
        setIsPurchased(transactions && transactions.length > 0);
      }
    } catch (e) {
      console.error("Permission checking error:", e);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkPurchaseStatus();
  }, [content, user]);
  
  const refreshPermissions = () => {
    checkPurchaseStatus();
  };

  return { 
    isCreator, 
    isPurchased, 
    isChecking,
    refreshPermissions
  };
};
