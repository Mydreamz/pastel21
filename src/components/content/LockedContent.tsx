
import { Lock, DollarSign, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/App';
import AuthDialog from "../auth/AuthDialog";
import { useState } from 'react';

interface LockedContentProps {
  price: string;
  onUnlock: () => void;
  contentTitle?: string;
  isProcessing?: boolean;
}

const LockedContent = ({ price, onUnlock, contentTitle, isProcessing = false }: LockedContentProps) => {
  const basePrice = parseFloat(price);
  const { user } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('signup');

  const handlePayClick = () => {
    if (!user) {
      setShowAuthDialog(true);
    } else {
      onUnlock();
    }
  };

  return (
    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-4 sm:p-8 text-center my-8 space-y-4 shadow-lg max-w-full sm:max-w-lg mx-auto">
      <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center mb-3 sm:mb-4">
        <Lock className="h-7 w-7 sm:h-8 sm:w-8 text-emerald-500" />
      </div>
      <h2 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Premium Content</h2>
      <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
        {contentTitle 
          ? `Unlock "${contentTitle}" to view the full content.` 
          : `Unlock this content to view the full content.`}
      </p>
      <div className="text-center">
        <div className="text-2xl sm:text-3xl font-bold text-white mb-3">${basePrice.toFixed(2)}</div>
        <Button
          onClick={handlePayClick}
          size="lg"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg flex items-center justify-center w-full sm:max-w-xs mx-auto mt-3 text-base sm:text-lg font-medium"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="animate-spin mr-2">●</span>
              Processing...
            </>
          ) : (
            <>
              <DollarSign className="mr-2 h-5 w-5" />
              Pay & Unlock
            </>
          )}
        </Button>
      </div>
      <div className="flex items-center justify-center mt-3 sm:mt-4 text-xs sm:text-sm text-gray-400">
        <Info className="h-3 w-3 mr-1" />
        <span>
          Secure payment powered by our platform
        </span>
      </div>
      
      {/* Authentication Dialog */}
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
