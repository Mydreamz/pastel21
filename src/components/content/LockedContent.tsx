
import { Lock, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState } from 'react';

interface LockedContentProps {
  price: string;
  onUnlock: () => void;
  contentTitle?: string;
}

const LockedContent = ({ price, onUnlock, contentTitle }: LockedContentProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUnlock = () => {
    setIsProcessing(true);
    try {
      onUnlock();
    } catch (error) {
      console.error("Unlock failed", error);
    } finally {
      setTimeout(() => setIsProcessing(false), 1500);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center my-8 space-y-4">
      <div className="w-16 h-16 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
        <Lock className="h-8 w-8 text-emerald-500" />
      </div>
      <h2 className="text-xl font-bold mb-2">Premium Content</h2>
      <p className="text-gray-400 mb-6">
        {contentTitle 
          ? `Unlock "${contentTitle}" for just $${parseFloat(price).toFixed(2)}` 
          : `Unlock this content for $${parseFloat(price).toFixed(2)}`}
      </p>
      <Button 
        onClick={handleUnlock} 
        size="lg"
        className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 flex items-center justify-center w-full md:w-auto mx-auto"
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
            Unlock Now - ${parseFloat(price).toFixed(2)}
          </>
        )}
      </Button>
      <div className="text-xs text-gray-500 mt-2">
        Secure payment powered by our platform
      </div>
    </div>
  );
};

export default LockedContent;
