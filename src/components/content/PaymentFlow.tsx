import React, { useState } from 'react';
import LockedContent from './LockedContent';
import { useAuth } from '@/contexts/AuthContext';
import AuthDialog from '@/components/auth/AuthDialog';
import { usePaymentFlow } from './payment/usePaymentFlow';

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
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const { user, session } = useAuth();
  
  // Use our custom hook to handle all payment flow logic
  const { isProcessing, isAlreadyPurchased, handleUnlock } = usePaymentFlow(
    content,
    user?.id,
    isCreator,
    isPurchased,
    refreshPermissions,
    onUnlock
  );

  // Handle unlock request including authentication check
  const handleUnlockRequest = async () => {
    // If user is not authenticated, show auth dialog
    if (!session || !user) {
      setAuthTab('login');
      setShowAuthDialog(true);
      return;
    }
    
    // Otherwise process the unlock request
    await handleUnlock();
  };

  // Show the LockedContent component for paid content when not unlocked and not already purchased
  const actuallyPurchased = isAlreadyPurchased || isPurchased;
  if (parseFloat(content.price) > 0 && !isCreator && !actuallyPurchased) {
    return (
      <>
        <LockedContent 
          price={content.price} 
          onUnlock={handleUnlockRequest}
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
