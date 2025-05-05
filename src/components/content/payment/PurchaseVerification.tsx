
import React from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PurchaseVerificationProps {
  contentId: string;
  userId: string;
}

const PurchaseVerification: React.FC<PurchaseVerificationProps> = ({
  contentId,
  userId
}) => {
  const verifyPurchaseStatus = async (): Promise<boolean> => {
    if (!userId || !contentId) return false;
    
    try {
      // Direct query for purchase check
      const { data, error } = await supabase
        .from('transactions')
        .select('id')
        .eq('content_id', contentId)
        .eq('user_id', userId)
        .eq('is_deleted', false)
        .limit(1);
        
      if (error) {
        console.error("Error checking purchase status:", error);
        return false;
      }
      
      return data && data.length > 0;
    } catch (e) {
      console.error("Exception checking purchase status:", e);
      return false;
    }
  };

  return { verifyPurchaseStatus };
};

export default PurchaseVerification;
