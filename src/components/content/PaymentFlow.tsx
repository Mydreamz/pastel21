
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import LockedContent from './LockedContent';
import { useAuth } from '@/App';
import { supabase } from '@/integrations/supabase/client';
import { PaymentDistributionService } from '@/services/PaymentDistributionService';

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
  const { user, session } = useAuth();

  const handleUnlock = async () => {
    if (isCreator) {
      toast({
        title: "Creator Access",
        description: "You have full access as the content creator",
        variant: "default"
      });
      onUnlock();
      return;
    }

    if (isPurchased) {
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

    setIsProcessing(true);
    
    // Check if user is authenticated before proceeding with payment
    if (!session || !user) {
      setIsProcessing(false);
      // The auth dialog will be shown by the LockedContent component
      return;
    }
    
    try {
      // Check again server-side if the content has already been purchased
      const { data: existingTransactions, error: checkError } = await supabase
        .from('transactions')
        .select('id')
        .eq('content_id', content.id)
        .eq('user_id', user.id)
        .eq('is_deleted', false)
        .limit(1);
        
      if (checkError) {
        throw new Error("Error checking transaction status");
      }
      
      // If already purchased, prevent duplicate purchase
      if (existingTransactions && existingTransactions.length > 0) {
        toast({
          title: "Already In Your Library",
          description: "You've already purchased this content. You can access it from your purchased content section.",
          variant: "default"
        });
        refreshPermissions();
        onUnlock();
        setIsProcessing(false);
        return;
      }
      
      // Process payment with fee distribution
      const paymentAmount = parseFloat(content.price);
      const result = await PaymentDistributionService.processPayment(
        content.id,
        user.id,
        content.creatorId,
        paymentAmount
      );

      if (!result.success) {
        throw new Error(result.error || "Failed to process payment");
      }
      
      // Refresh the permissions to update the UI
      refreshPermissions();
      onUnlock();
      
      toast({
        title: "Payment Successful",
        description: `You've unlocked "${content.title}" and it's now in your library`,
        variant: "default"
      });
    } catch (error: any) {
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
  if (parseFloat(content.price) > 0 && !isCreator && !isPurchased) {
    return (
      <LockedContent 
        price={content.price} 
        onUnlock={handleUnlock}
        contentTitle={content.title}
        isProcessing={isProcessing}
        isPurchased={isPurchased}
      />
    );
  }

  // Return null if content is free, user is creator, or content is already purchased
  return null;
};

export default PaymentFlow;
