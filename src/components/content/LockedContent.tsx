
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
      
      <Tabs defaultValue="standard" className="w-full" onValueChange={(value) => handlePlanSelect(value as 'standard' | 'premium' | 'dummy')}>
        <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
          <TabsTrigger value="standard" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
            Standard
          </TabsTrigger>
          <TabsTrigger value="premium" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            Premium
          </TabsTrigger>
          <TabsTrigger value="dummy" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Dummy Pay
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
        <TabsContent value="dummy">
          <Card className="border-0 bg-transparent">
            <CardContent className="p-4 space-y-3">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-orange-400 mb-2">Dummy Payment (Demo Only)</h3>
                <div className="text-3xl font-bold text-white mb-2">${basePrice.toFixed(2)}</div>
                <div className="flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6 mr-1 text-orange-400" />
                  <span className="text-orange-200">Use <span className="bg-gray-800/70 px-1 rounded">4242 4242 4242 4242</span> as test card</span>
                </div>
                <input
                  type="text"
                  value={dummyCard}
                  onChange={e => setDummyCard(e.target.value)}
                  placeholder="Enter dummy card number (e.g. 4242...)"
                  className="block mx-auto bg-white/10 border border-white/10 rounded px-3 py-2 text-white mb-2 w-64 text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={isDummyProcessing}
                  maxLength={19}
                />
                <div className="text-xs text-gray-400 mb-4">No real payment will be taken. This is for demo purposes only.</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Render appropriate button based on selected plan */}
      {selectedPlan === 'dummy' ? (
        <Button
          onClick={handleDummyPayment}
          size="lg"
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 flex items-center justify-center w-full sm:w-auto mx-auto mt-4"
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
      )}

      <div className="flex items-center justify-center mt-4 text-xs text-gray-400">
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

