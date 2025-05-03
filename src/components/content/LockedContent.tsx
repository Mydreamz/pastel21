
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/App';
import { Lock, Check, ShoppingCart, IndianRupee, LogIn } from 'lucide-react';
import AuthDialog from '@/components/auth/AuthDialog';
import { calculateFees } from '@/utils/paymentUtils';

interface LockedContentProps {
  price: string;
  onUnlock: () => void;
  contentTitle?: string;
  isProcessing?: boolean;
  isPurchased?: boolean;
}

const LockedContent: React.FC<LockedContentProps> = ({
  price,
  onUnlock,
  contentTitle = "this content",
  isProcessing = false,
  isPurchased = false
}) => {
  const { user } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  
  // Calculate fees
  const priceNum = parseFloat(price);
  const { platformFee, creatorEarnings } = calculateFees(priceNum);
  
  const handlePurchaseClick = () => {
    if (!user) {
      setAuthTab('login');
      setShowAuthDialog(true);
    } else {
      onUnlock();
    }
  };
  
  return (
    <div className="p-6 border border-white/10 rounded-lg bg-black/20 backdrop-blur-sm text-center">
      <Lock className="h-12 w-12 mx-auto mb-4 text-emerald-500/80" />
      
      <h3 className="text-xl font-bold mb-2">
        {isPurchased ? 'You Own This Content' : 'Premium Content'}
      </h3>
      
      <p className="text-gray-300 mb-4">
        {isPurchased 
          ? "You've already purchased this content. Click below to access it."
          : `Purchase ${contentTitle} for ₹${priceNum.toFixed(2)} to view the full content`
        }
      </p>
      
      {!isPurchased && (
        <div className="bg-black/30 p-3 rounded-md mb-4 text-left text-sm">
          <div className="flex justify-between mb-2">
            <span>Content price:</span>
            <span>₹{priceNum.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2 text-gray-400 border-b border-white/10 pb-2">
            <span>Platform fee (7%):</span>
            <span>₹{platformFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-emerald-400 pt-1">
            <span>Creator receives:</span>
            <span>₹{creatorEarnings.toFixed(2)}</span>
          </div>
        </div>
      )}
      
      <Button
        onClick={handlePurchaseClick}
        disabled={isProcessing}
        className={`w-full ${isPurchased ? 'bg-emerald-600' : 'bg-emerald-500'} hover:bg-emerald-600 text-white`}
      >
        {isProcessing ? (
          <span className="flex items-center">
            <span className="animate-spin mr-2">●</span>
            Processing...
          </span>
        ) : isPurchased ? (
          <span className="flex items-center">
            <Check className="h-4 w-4 mr-2" />
            Access Content
          </span>
        ) : !user ? (
          <span className="flex items-center">
            <LogIn className="h-4 w-4 mr-2" />
            Sign in to Purchase
          </span>
        ) : (
          <span className="flex items-center">
            <IndianRupee className="h-4 w-4 mr-2" />
            Purchase for ₹{priceNum.toFixed(2)}
          </span>
        )}
      </Button>
      
      {!user && (
        <p className="text-sm mt-4 text-gray-400">
          You need to sign in or create an account to purchase content
        </p>
      )}
      
      <AuthDialog 
        showAuthDialog={showAuthDialog}
        setShowAuthDialog={setShowAuthDialog}
        authTab={authTab}
        setAuthTab={setAuthTab}
      />
    </div>
  );
};

export default LockedContent;
