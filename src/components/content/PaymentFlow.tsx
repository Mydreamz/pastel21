
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import LockedContent from './LockedContent';
import { useAuth } from '@/App';
import { supabase } from '@/integrations/supabase/client';
import { PaymentDistributionService } from '@/services/PaymentDistributionService';
import AuthDialog from '@/components/auth/AuthDialog';

interface PaymentFlowProps {
  content: any;
  onUnlock: () => void;
  isCreator: boolean;
  isPurchased: boolean;
  refreshPermissions: () => void;
}

const PaymentFlow: React.FC<PaymentFlowProps> = ({ 
  content, 
  onUnlock, 
  isCreator, 
  isPurchased,
  refreshPermissions
}) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const { user, session } = useAuth();
  const [hasCheckedPurchase, setHasCheckedPurchase] = useState(false);
  const [isAlreadyPurchased, setIsAlreadyPurchased] = useState(isPurchased);
  
  // Check if the user has already purchased this content
  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (!user || !content?.id) return;
      
      try {
        // Direct query for purchase check
        const { data, error } = await supabase
          .from('transactions')
          .select('id')
          .eq('content_id', content.id)
          .eq('user_id', user.id)
          .eq('is_deleted', false)
          .limit(1);
          
        if (error) {
          console.error("Error checking purchase status:", error);
          return;
        }
        
        setIsAlreadyPurchased(data && data.length > 0);
        setHasCheckedPurchase(true);
      } catch (e) {
        console.error("Exception checking purchase status:", e);
      }
    };
    
    checkPurchaseStatus();
  }, [user, content?.id, isPurchased]);

  const handleUnlock = async () => {
    if (isProcessing) {
      return; // Prevent multiple clicks
    }

    if (isCreator) {
      toast({
        title: "Creator Access",
        description: "You have full access as the content creator",
        variant: "default"
      });
      onUnlock();
      return;
    }

    if (isAlreadyPurchased || isPurchased) {
      toast({
        title: "Already Purchased",
        description: "You've already purchased this content and have full access",
        variant: "default"
      });
      onUnlock();
      return;
    }

    if (parseFloat(content.price) === 0) {
      onUnlock();
      return;
    }

    // If user is not authenticated, show auth dialog
    if (!session || !user) {
      setAuthTab('login');
      setShowAuthDialog(true);
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Use the simplified transaction processing approach
      const result = await PaymentDistributionService.processPayment(
        content.id,
        user.id,
        content.creatorId,
        parseFloat(content.price)
      );

      if (!result.success) {
        if (result.alreadyPurchased) {
          toast({
            title: "Already In Your Library",
            description: "You've already purchased this content. You can access it from your purchased content section.",
            variant: "default"
          });
          setIsAlreadyPurchased(true);
          refreshPermissions();
          onUnlock();
        } else {
          throw new Error(result.error || "Failed to process payment");
        }
      } else {
        // Refresh the permissions to update the UI
        refreshPermissions();
        setIsAlreadyPurchased(true);
        onUnlock();
        
        toast({
          title: "Payment Successful",
          description: `You've unlocked "${content.title}" and it's now in your library`,
          variant: "default"
        });
      }
    } catch (error: any) {
      // One final check to see if the transaction actually went through
      try {
        const { data } = await supabase
          .from('transactions')
          .select('id')
          .eq('content_id', content.id)
          .eq('user_id', user.id)
          .eq('is_deleted', false)
          .limit(1);
          
        if (data && data.length > 0) {
          // Transaction exists despite the error!
          toast({
            title: "Payment Successful",
            description: `You've unlocked "${content.title}" and it's now in your library`,
            variant: "default"
          });
          refreshPermissions();
          setIsAlreadyPurchased(true);
          onUnlock();
          return;
        }
      } catch (finalCheckError) {
        // If this fails too, proceed to the error message
      }
      
      toast({
        title: "Payment Failed",
        description: error.message || "Unable to process your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Show the LockedContent component for paid content when not unlocked and not already purchased
  const actuallyPurchased = isAlreadyPurchased || isPurchased;
  if (parseFloat(content.price) > 0 && !isCreator && !actuallyPurchased) {
    return (
      <>
        <LockedContent 
          price={content.price} 
          onUnlock={handleUnlock}
          contentTitle={content.title}
          isProcessing={isProcessing}
          isPurchased={actuallyPurchased}
        />
        
        <AuthDialog 
          showAuthDialog={showAuthDialog}
          setShowAuthDialog={setShowAuthDialog}
          authTab={authTab}
          setAuthTab={setAuthTab}
        />
      </>
    );
  }

  // Return null if content is free, user is creator, or content is already purchased
  return null;
};

export default PaymentFlow;
