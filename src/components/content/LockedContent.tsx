
import { Lock, DollarSign, Info, ShieldCheck, CreditCard } from 'lucide-react';
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
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'premium' | 'dummy'>('standard');
  const [isDummyProcessing, setIsDummyProcessing] = useState(false);
  const [dummyCard, setDummyCard] = useState("");

  const handlePlanSelect = (plan: 'standard' | 'premium' | 'dummy') => {
    setSelectedPlan(plan);
  };

  const basePrice = parseFloat(price);
  const premiumPrice = (basePrice * 1.5).toFixed(2);

  const handleDummyPayment = () => {
    setIsDummyProcessing(true);
    setTimeout(() => {
      setIsDummyProcessing(false);
      onUnlock();
    }, 1300);
  };

  return (
    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-4 sm:p-8 text-center my-8 space-y-4 shadow-lg max-w-full sm:max-w-lg mx-auto">
      <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center mb-3 sm:mb-4">
        <Lock className="h-7 w-7 sm:h-8 sm:w-8 text-emerald-500" />
      </div>
      <h2 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Premium Content</h2>
      <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
        {contentTitle 
          ? `Unlock "${contentTitle}" with one of our plans` 
          : `Unlock this content with one of our plans`}
      </p>
      
      <Tabs defaultValue="standard" className="w-full" onValueChange={(value) => handlePlanSelect(value as 'standard' | 'premium' | 'dummy')}>
        <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 rounded-md min-h-[2.5rem]">
          <TabsTrigger value="standard" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-xs sm:text-base px-2 py-1 sm:py-2">
            Standard
          </TabsTrigger>
          <TabsTrigger value="premium" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-xs sm:text-base px-2 py-1 sm:py-2">
            Premium
          </TabsTrigger>
          <TabsTrigger value="dummy" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs sm:text-base px-2 py-1 sm:py-2">
            Dummy Pay
          </TabsTrigger>
        </TabsList>
        <TabsContent value="standard">
          <Card className="border-0 bg-transparent">
            <CardContent className="p-2 sm:p-4">
              <div className="text-center">
                <h3 className="text-base sm:text-lg font-semibold text-emerald-400 mb-1 sm:mb-2">Standard Access</h3>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-2">${basePrice.toFixed(2)}</div>
                <ul className="text-left text-xs sm:text-sm space-y-2 mb-3 sm:mb-4">
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Basic access to this content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Read or view on any device</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="premium">
          <Card className="border-0 bg-transparent">
            <CardContent className="p-2 sm:p-4">
              <div className="text-center">
                <h3 className="text-base sm:text-lg font-semibold text-purple-400 mb-1 sm:mb-2">Premium Access</h3>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-2">${premiumPrice}</div>
                <ul className="text-left text-xs sm:text-sm space-y-2 mb-3 sm:mb-4">
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Full access to this content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Downloadable version included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Early access to future updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Direct message with creator</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="dummy">
          <Card className="border-0 bg-transparent">
            <CardContent className="p-2 sm:p-4 space-y-2 sm:space-y-3">
              <div className="text-center">
                <h3 className="text-base sm:text-lg font-semibold text-orange-400 mb-1 sm:mb-2">Dummy Payment (Demo Only)</h3>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-2">${basePrice.toFixed(2)}</div>
                <div className="flex flex-col sm:flex-row items-center justify-center mb-3 sm:mb-4 gap-1 sm:gap-2">
                  <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400" />
                  <span className="text-orange-200 text-xs sm:text-sm">Use <span className="bg-gray-800/70 px-1 rounded">4242 4242 4242 4242</span> as test card</span>
                </div>
                <input
                  type="text"
                  value={dummyCard}
                  onChange={e => setDummyCard(e.target.value)}
                  placeholder="Enter dummy card number (e.g. 4242...)"
                  className="block mx-auto bg-white/10 border border-white/10 rounded px-2 sm:px-3 py-2 text-xs sm:text-sm text-white mb-1 sm:mb-2 w-full max-w-xs text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={isDummyProcessing}
                  maxLength={19}
                  inputMode="numeric"
                />
                <div className="text-xs text-gray-400 mb-2 sm:mb-4">No real payment will be taken. This is for demo purposes only.</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Render appropriate button based on selected plan */}
      <div className="flex justify-center">
        {selectedPlan === 'dummy' ? (
          <Button
            onClick={handleDummyPayment}
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white px-2 sm:px-8 py-4 sm:py-6 rounded-lg flex items-center justify-center w-full max-w-xs sm:w-auto mx-auto mt-3 sm:mt-4 text-base sm:text-lg"
            disabled={isDummyProcessing || !dummyCard.startsWith('4242')}
          >
            {isDummyProcessing ? (
              <>
                <span className="animate-spin mr-2">●</span>
                Processing...
              </>
            ) : (
              <>
                <DollarSign className="mr-2 h-5 w-5" />
                Dummy Pay (${basePrice.toFixed(2)})
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={onUnlock}
            size="lg"
            className={`${selectedPlan === 'standard' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-purple-500 hover:bg-purple-600'} text-white px-2 sm:px-8 py-4 sm:py-6 rounded-lg flex items-center justify-center w-full max-w-xs sm:w-auto mx-auto mt-3 sm:mt-4 text-base sm:text-lg`}
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
        )}
      </div>
      <div className="flex items-center justify-center mt-3 sm:mt-4 text-xs sm:text-sm text-gray-400">
        <Info className="h-3 w-3 mr-1" />
        <span>
          Secure payment powered by our platform
          {selectedPlan === 'dummy' && (
            <span className="ml-2 text-orange-400">(Demo only, does not charge real money)</span>
          )}
        </span>
      </div>
    </div>
  );
};

export default LockedContent;
