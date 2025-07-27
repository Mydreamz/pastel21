
import React from 'react';
import { Button } from "@/components/ui/button";
import { Lock, IndianRupee } from 'lucide-react';
import { formatCurrency, calculateFees } from '@/utils/paymentUtils';
import { useRazorpayPayment } from '@/hooks/useRazorpayPayment';
import { useAuth } from '@/contexts/AuthContext';

interface LockedContentProps {
  price: string;
  onUnlock: () => void;
  contentTitle?: string;
  isProcessing?: boolean;
  contentId?: string;
}

const LockedContent: React.FC<LockedContentProps> = ({
  price,
  onUnlock,
  contentTitle = "this content",
  isProcessing = false,
  contentId,
}) => {
  const priceNum = parseFloat(price);
  const { platformFee, creatorEarnings } = calculateFees(priceNum);
  const { initiatePayment, isProcessing: razorpayProcessing } = useRazorpayPayment();
  const { user } = useAuth();

  const handlePayment = async () => {
    if (!contentId) {
      onUnlock(); // Fallback to original behavior
      return;
    }

    await initiatePayment(
      contentId,
      priceNum,
      contentTitle,
      user?.email,
      user?.user_metadata?.name,
      () => {
        onUnlock(); // Call the original unlock function after successful payment
      }
    );
  };

  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-pastel-50/90 to-white/80 backdrop-blur-md border border-pastel-200/30 shadow-neumorphic">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-gradient-to-br from-pastel-200 to-pastel-400/30 rounded-full shadow-neumorphic">
          <Lock className="h-10 w-10 text-pastel-700" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-2 text-center text-pastel-800">
        Premium Content
      </h3>
      
      <p className="text-center text-gray-600 mb-6">
        {`Purchase ${contentTitle} for ${formatCurrency(priceNum)} to view the full content`}
      </p>
      
      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg mb-5 text-left text-sm border border-pastel-200/30 shadow-neumorphic-inset">
        <div className="flex justify-between mb-2 text-gray-700 font-medium">
          <span>Content price:</span>
          <span>{formatCurrency(priceNum)}</span>
        </div>
        <div className="flex justify-between mb-2 text-gray-500 border-b border-pastel-200/30 pb-2">
          <span>Platform fee (7%):</span>
          <span>{formatCurrency(platformFee)}</span>
        </div>
        <div className="flex justify-between text-pastel-700 font-medium pt-1">
          <span>Creator receives:</span>
          <span>{formatCurrency(creatorEarnings)}</span>
        </div>
      </div>
      
      <Button
        onClick={handlePayment}
        disabled={isProcessing || razorpayProcessing}
        className="w-full bg-gradient-to-r from-pastel-500 to-pastel-600 text-white shadow-md hover:shadow-lg"
      >
        {(isProcessing || razorpayProcessing) ? (
          <span className="flex items-center justify-center">
            <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
            Processing...
          </span>
        ) : (
          <span className="flex items-center">
            <IndianRupee className="h-4 w-4 mr-2" />
            Purchase for {formatCurrency(priceNum)}
          </span>
        )}
      </Button>
    </div>
  );
};

export default LockedContent;
