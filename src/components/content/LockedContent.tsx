
import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/App';
import { Lock, Check, ShoppingCart } from 'lucide-react';

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
  
  return (
    <div className="p-6 border border-white/10 rounded-lg bg-black/20 backdrop-blur-sm text-center">
      <Lock className="h-12 w-12 mx-auto mb-4 text-emerald-500/80" />
      
      <h3 className="text-xl font-bold mb-2">
        {isPurchased ? 'You Own This Content' : 'Premium Content'}
      </h3>
      
      <p className="text-gray-300 mb-6">
        {isPurchased 
          ? "You've already purchased this content. Click below to access it."
          : `Purchase ${contentTitle} for $${parseFloat(price).toFixed(2)} to view the full content`
        }
      </p>
      
      <Button
        onClick={onUnlock}
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
        ) : (
          <span className="flex items-center">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Purchase for ${parseFloat(price).toFixed(2)}
          </span>
        )}
      </Button>
      
      {!user && (
        <p className="text-sm mt-4 text-gray-400">
          Sign in or create an account to purchase content
        </p>
      )}
    </div>
  );
};

export default LockedContent;
