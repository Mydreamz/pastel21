
import React, { useState } from 'react';
import LockedContent from '../LockedContent';
import { useAuth } from '@/contexts/AuthContext';
import AuthDialog from '@/components/auth/AuthDialog';
import { usePaymentFlow } from './usePaymentFlow';

interface PaymentFlowProps {
  content: any;
  onUnlock: () => void;
  isCreator: boolean;
  isPurchased: boolean;
  refreshPermissions: () => void;
  onPurchaseSuccess: () => void;
}

const PaymentFlow: React.FC<PaymentFlowProps> = ({ 
  content, 
  onUnlock, 
  isCreator, 
  isPurchased,
  refreshPermissions,
  onPurchaseSuccess
}) => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const { user, session } = useAuth();
  
  console.log('[PaymentFlow] Rendering with props:', {
    contentId: content?.id,
    contentPrice: content?.price,
    isCreator,
    isPurchased,
    isUserLoggedIn: !!user
  });
  
  // Use our custom hook to handle all payment flow logic
  const { isProcessing, isAlreadyPurchased, handleUnlock } = usePaymentFlow(
    content,
    user?.id,
    isCreator,
    isPurchased,
    refreshPermissions,
    onUnlock,
    onPurchaseSuccess
  );

  // Handle unlock request including authentication check
  const handleUnlockRequest = async () => {
    console.log('[PaymentFlow] Unlock request initiated');
    
    // If user is not authenticated, show auth dialog
    if (!session || !user) {
      console.log('[PaymentFlow] User not authenticated, showing auth dialog');
      setAuthTab('login');
      setShowAuthDialog(true);
      return;
    }
    
    // Otherwise process the unlock request
    console.log('[PaymentFlow] User authenticated, processing unlock');
    await handleUnlock();
  };

  // Show the LockedContent component for paid content when not unlocked and not already purchased
  const actuallyPurchased = isAlreadyPurchased || isPurchased;
  const shouldShowLockedContent = parseFloat(content?.price || '0') > 0 && !isCreator && !actuallyPurchased;
  
  console.log('[PaymentFlow] Render decision:', {
    shouldShowLockedContent,
    contentPrice: content?.price,
    isCreator,
    actuallyPurchased,
    isProcessing
  });
  
  if (shouldShowLockedContent) {
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
