
import React from 'react';
import { Button } from '@/components/ui/button';

interface DirectPurchaseButtonProps {
  price: string;
  isProcessing: boolean;
  onPurchase: () => void;
}

const DirectPurchaseButton = ({ price, isProcessing, onPurchase }: DirectPurchaseButtonProps) => {
  if (isProcessing) return null;
  
  return (
    <div className="my-4 text-center">
      <Button 
        onClick={onPurchase}
        className="bg-emerald-500 hover:bg-emerald-600 text-white touch-target mobile-touch-feedback"
        size="lg"
        disabled={isProcessing}
      >
        Purchase Now (₹{parseFloat(price).toFixed(2)})
      </Button>
    </div>
  );
};

export default DirectPurchaseButton;
