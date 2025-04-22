
import { Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState } from 'react';

interface LockedContentProps {
  price: string;
  onUnlock: () => void;
}

const LockedContent = ({ price, onUnlock }: LockedContentProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUnlock = () => {
    setIsProcessing(true);
    // Trigger the unlock process
    try {
      onUnlock();
    } finally {
      // Set processing back to false after a short delay to show loading state
      setTimeout(() => setIsProcessing(false), 1500);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
      <div className="w-16 h-16 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
        <Lock className="h-8 w-8 text-emerald-500" />
      </div>
      <h2 className="text-xl font-bold mb-2">Premium Content</h2>
      <p className="text-gray-400 mb-6">
        Unlock this content for ${parseFloat(price).toFixed(2)}
      </p>
      <Button 
        onClick={handleUnlock} 
        className="bg-emerald-500 hover:bg-emerald-600 text-white px-8"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <span className="animate-spin mr-2">●</span>
            Processing...
          </>
        ) : (
          'Unlock Now'
        )}
      </Button>
    </div>
  );
};

export default LockedContent;
