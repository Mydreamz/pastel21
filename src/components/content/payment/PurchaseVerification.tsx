
import React from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PurchaseVerificationProps {
  contentId: string;
  userId: string;
}

const PurchaseVerification = ({
  contentId,
  userId
}: PurchaseVerificationProps) => {
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

  // This component doesn't render anything visually
  return null;
};

// Export both the component and the utility function
export default PurchaseVerification;

// Export the verification function for use in hooks
export const usePurchaseVerification = (contentId: string, userId: string) => {
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
