
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { useContentLoading } from './content/useContentLoading';
import { useSecureFileUrl } from '@/hooks/useSecureFileUrl';
import { calculateFees } from '@/utils/paymentUtils';
import { useContentPermissions } from './useContentPermissions';

export const useViewContent = (id: string | undefined) => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { content, loading, error } = useContentLoading(id);
  const { isCreator, isPurchased, isChecking, refreshPermissions } = useContentPermissions(content);

  const {
    secureUrl: secureFileUrl,
    isLoading: secureFileLoading,
    error: secureFileError,
    getSecureFileUrl,
  } = useSecureFileUrl();

  const isUnlocked = isCreator || isPurchased;

  useEffect(() => {
    if (isUnlocked && content?.filePath) {
      getSecureFileUrl(content.id, content.filePath);
    }
  }, [isUnlocked, content, getSecureFileUrl]);

  const handleUnlock = useCallback(async () => {
    if (!user || !session) {
      toast({ title: "Authentication Required", description: "Please sign in to purchase content.", variant: "destructive" });
      return;
    }
    if (!content) {
      toast({ title: "Error", description: "Content not available for purchase.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);

    const price = parseFloat(content.price);
    if (isNaN(price) || price <= 0) {
      toast({ title: "Error", description: "This content is not for sale.", variant: "destructive" });
      setIsProcessing(false);
      return;
    }
    
    const { platformFee, creatorEarnings } = calculateFees(price);

    const { error: transactionError } = await supabase.from('transactions').insert({
      content_id: content.id,
      user_id: user.id,
      creator_id: content.creatorId,
      amount: price,
      platform_fee: platformFee,
      creator_earnings: creatorEarnings,
    });

    if (transactionError) {
      console.error('Transaction Error:', transactionError);
      toast({ title: "Purchase Failed", description: transactionError.message, variant: "destructive" });
    } else {
      toast({ title: "Purchase Successful!", description: `You have purchased "${content.title}".` });
      refreshPermissions();
    }

    setIsProcessing(false);
  }, [content, user, session, toast, refreshPermissions]);

  return {
    content,
    loading: loading || isChecking,
    error,
    secureFileUrl,
    secureFileLoading,
    secureFileError,
    isUnlocked,
    handleUnlock,
    isAuthenticated: !!session,
    isProcessing,
    isCreator,
    isPurchased,
    refreshPermissions
  };
};
