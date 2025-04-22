
import { Lock, DollarSign, Info, ShieldCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LockedContentProps {
  price: string;
  onUnlock: () => void;
  contentTitle?: string;
  isProcessing?: boolean;
}

const LockedContent = ({ price, onUnlock, contentTitle, isProcessing = false }: LockedContentProps) => {
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'premium'>('standard');
  
  const handlePlanSelect = (plan: 'standard' | 'premium') => {
    setSelectedPlan(plan);
  };
  
  const basePrice = parseFloat(price);
  const premiumPrice = (basePrice * 1.5).toFixed(2);
  
  return (
    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-8 text-center my-8 space-y-4 shadow-lg">
      <div className="w-16 h-16 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
        <Lock className="h-8 w-8 text-emerald-500" />
      </div>
      <h2 className="text-xl font-bold mb-2">Premium Content</h2>
      <p className="text-gray-300 mb-6">
        {contentTitle 
          ? `Unlock "${contentTitle}" with one of our plans` 
          : `Unlock this content with one of our plans`}
      </p>
      
      <Tabs defaultValue="standard" className="w-full" onValueChange={(value) => handlePlanSelect(value as 'standard' | 'premium')}>
        <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
          <TabsTrigger value="standard" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
            Standard
          </TabsTrigger>
          <TabsTrigger value="premium" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            Premium
          </TabsTrigger>
        </TabsList>
        <TabsContent value="standard">
          <Card className="border-0 bg-transparent">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">Standard Access</h3>
                <div className="text-3xl font-bold text-white mb-2">${basePrice.toFixed(2)}</div>
                <ul className="text-left text-sm space-y-2 mb-4">
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Basic access to this content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Read or view on any device</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="premium">
          <Card className="border-0 bg-transparent">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-purple-400 mb-2">Premium Access</h3>
                <div className="text-3xl font-bold text-white mb-2">${premiumPrice}</div>
                <ul className="text-left text-sm space-y-2 mb-4">
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Full access to this content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Downloadable version included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Early access to future updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Direct message with creator</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Button 
        onClick={onUnlock} 
        size="lg"
        className={`${selectedPlan === 'standard' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-purple-500 hover:bg-purple-600'} text-white px-8 py-6 flex items-center justify-center w-full sm:w-auto mx-auto mt-4`}
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
            Unlock {selectedPlan === 'standard' ? `$${basePrice.toFixed(2)}` : `$${premiumPrice}`}
          </>
        )}
      </Button>
      
      <div className="flex items-center justify-center mt-4 text-xs text-gray-400">
        <Info className="h-3 w-3 mr-1" />
        <span>Secure payment powered by our platform</span>
      </div>
    </div>
  );
};

export default LockedContent;
