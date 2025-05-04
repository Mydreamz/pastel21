
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { Lock, Check, IndianRupee, LogIn } from 'lucide-react';
import AuthDialog from '@/components/auth/AuthDialog';
import { calculateFees, formatCurrency } from '@/utils/paymentUtils';
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
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
      if (isPurchased) {
        toast({
          title: "Already Purchased",
          description: "You've already purchased this content",
        });
      }
      onUnlock();
    }
  };
  
  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-pastel-50/90 to-white/80 backdrop-blur-md border border-pastel-200/30 shadow-neumorphic hover:shadow-lg transition-all duration-300">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-gradient-to-br from-pastel-200 to-pastel-400/30 rounded-full shadow-neumorphic">
          <Lock className="h-10 w-10 text-pastel-700" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-2 text-center text-pastel-800 dark:text-white">
        {isPurchased ? 'You Own This Content' : 'Premium Content'}
      </h3>
      
      <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
        {isPurchased 
          ? "You've already purchased this content. Click below to access it."
          : `Purchase ${contentTitle} for ${formatCurrency(priceNum)} to view the full content`
        }
      </p>
      
      {!isPurchased && (
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg mb-5 text-left text-sm border border-pastel-200/30 shadow-neumorphic-inset">
          <div className="flex justify-between mb-2 text-gray-700 dark:text-white font-medium">
            <span>Content price:</span>
            <span>{formatCurrency(priceNum)}</span>
          </div>
          <div className="flex justify-between mb-2 text-gray-500 dark:text-gray-400 border-b border-pastel-200/30 pb-2">
            <span>Platform fee (7%):</span>
            <span>{formatCurrency(platformFee)}</span>
          </div>
          <div className="flex justify-between text-pastel-700 dark:text-pastel-300 font-medium pt-1">
            <span>Creator receives:</span>
            <span>{formatCurrency(creatorEarnings)}</span>
          </div>
        </div>
      )}
      
      <Button
        onClick={handlePurchaseClick}
        disabled={isProcessing}
        className={`w-full transition-all duration-300 ${
          isPurchased 
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700' 
            : 'bg-gradient-to-r from-pastel-500 to-pastel-600 hover:from-pastel-600 hover:to-pastel-700'
        } text-white shadow-md hover:shadow-lg animate-fade-in`}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
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
            Purchase for {formatCurrency(priceNum)}
          </span>
        )}
      </Button>
      
      {!user && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You need to sign in or create an account to purchase content
          </p>
          <div className="flex justify-center mt-2 space-x-3">
            <Button 
              variant="outline"
              onClick={() => {
                setAuthTab('login');
                setShowAuthDialog(true);
              }}
              className="border-pastel-200 hover:bg-pastel-50 text-pastel-700"
            >
              Sign In
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setAuthTab('signup');
                setShowAuthDialog(true);
              }}
              className="border-pastel-200 hover:bg-pastel-50 text-pastel-700"
            >
              Create Account
            </Button>
          </div>
        </div>
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
