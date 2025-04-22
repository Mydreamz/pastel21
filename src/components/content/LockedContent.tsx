
import { Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface LockedContentProps {
  price: string;
  onUnlock: () => void;
}

const LockedContent = ({ price, onUnlock }: LockedContentProps) => {
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
        onClick={onUnlock} 
        className="bg-emerald-500 hover:bg-emerald-600 text-white px-8"
      >
        Unlock Now
      </Button>
    </div>
  );
};

export default LockedContent;
