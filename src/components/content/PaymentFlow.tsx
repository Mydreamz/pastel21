
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import LockedContent from './LockedContent';
import { useAuth } from '@/App';

interface PaymentFlowProps {
  content: any;  // Replace 'any' with the actual content type from your types
  onUnlock: () => void;
  isCreator: boolean;
}

const PaymentFlow: React.FC<PaymentFlowProps> = ({ content, onUnlock, isCreator }) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, session } = useAuth();

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
    
    // Check if user is authenticated before proceeding with payment
    if (!session || !user) {
      setIsProcessing(false);
      // The auth dialog will be shown by the LockedContent component
      return;
    }
    
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

  // Only show the LockedContent component for paid content when not unlocked
  if (parseFloat(content.price) > 0 && !isCreator) {
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
