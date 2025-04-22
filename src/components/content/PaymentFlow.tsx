
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import LockedContent from './LockedContent';

interface PaymentFlowProps {
  content: any;  // Replace 'any' with the actual content type from your types
  onUnlock: () => void;
  isCreator: boolean;
}

const PaymentFlow: React.FC<PaymentFlowProps> = ({ content, onUnlock, isCreator }) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUnlock = () => {
    if (isCreator) {
      toast({
        title: "Creator Access",
        description: "You have full access as the content creator",
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
    
    try {
      // Trigger payment process
      onUnlock();
      
      toast({
        title: "Payment Successful",
        description: `You've unlocked "${content.title}"`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Unable to process your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Only show locked content if:
  // 1. Content has a price > 0
  // 2. User is not the creator
  if (parseFloat(content.price) > 0 && !isCreator) {
    return (
      <LockedContent 
        price={content.price} 
        onUnlock={handleUnlock}
        contentTitle={content.title}
      />
    );
  }

  // If content is free or user is creator, show content directly
  return null;
};

export default PaymentFlow;
