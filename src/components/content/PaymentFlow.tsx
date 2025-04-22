
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
    
    // Simulate payment process for demonstration
    setTimeout(() => {
      try {
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
    }, 1500);
  };

  // Always show the LockedContent component for paid content when not unlocked
  console.log("PaymentFlow: Content price:", content.price, "isCreator:", isCreator);
  if (parseFloat(content.price) > 0 && !isCreator) {
    console.log("PaymentFlow: Showing payment button for content:", content.title);
    return (
      <LockedContent 
        price={content.price} 
        onUnlock={handleUnlock}
        contentTitle={content.title}
        isProcessing={isProcessing}
      />
    );
  }

  // Return null if content is free or user is creator
  return null;
};

export default PaymentFlow;
