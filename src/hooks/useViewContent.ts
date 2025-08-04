import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { useContentLoading } from './content/useContentLoading';
import { useSecureFileUrl } from '@/hooks/useSecureFileUrl';
import { useContentPermissions } from './useContentPermissions';

export const useViewContent = (id: string | undefined) => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [isProcessing] = useState(false); // No longer used for payments
  
  const { content, loading, error, handleContentLoad, resetTrackingState } = useContentLoading(id);
  const { isCreator, isPurchased, isChecking, refreshPermissions } = useContentPermissions(content);

  const {
    secureUrl: secureFileUrl,
    isLoading: secureFileLoading,
    error: secureFileError,
    getSecureFileUrl,
  } = useSecureFileUrl();

  const isUnlocked = isCreator || isPurchased;

  useEffect(() => {
    if (id) {
      resetTrackingState();
      handleContentLoad(id, user?.id);
    }
  }, [id, user?.id, handleContentLoad, resetTrackingState]);

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

    // This function now only handles authentication check
    // The actual payment is handled by Razorpay in LockedContent component
    console.log('handleUnlock called - this should use Razorpay payment flow');
    toast({ title: "Use Razorpay", description: "Please use the purchase button to buy content via Razorpay.", variant: "destructive" });
  }, [content, user, session, toast]);

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
