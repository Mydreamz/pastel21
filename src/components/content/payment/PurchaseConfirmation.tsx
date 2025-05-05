
import React from 'react';
import { useToast } from "@/hooks/use-toast";

interface PurchaseConfirmationProps {
  isCreator: boolean;
  isAlreadyPurchased: boolean;
  contentTitle: string;
  onUnlock: () => void;
}

const PurchaseConfirmation: React.FC<PurchaseConfirmationProps> = ({
  isCreator,
  isAlreadyPurchased,
  contentTitle,
  onUnlock
}) => {
  const { toast } = useToast();

  const handleConfirmAccess = () => {
    if (isCreator) {
      toast({
        title: "Creator Access",
        description: "You have full access as the content creator",
        variant: "default"
      });
    } else if (isAlreadyPurchased) {
      toast({
        title: "Already Purchased",
        description: "You've already purchased this content and have full access",
        variant: "default"
      });
    }
    
    onUnlock();
  };

  // Return null as this is a utility component
  return null;
};

export default PurchaseConfirmation;
