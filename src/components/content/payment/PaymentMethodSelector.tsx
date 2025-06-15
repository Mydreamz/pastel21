
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Smartphone, Wallet, IndianRupee } from 'lucide-react';
import { formatCurrency } from '@/utils/paymentUtils';

interface PaymentMethodSelectorProps {
  amount: number;
  onPaymentMethodSelect: (method: 'internal' | 'paytm') => void;
  isProcessing: boolean;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  amount,
  onPaymentMethodSelect,
  isProcessing
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'internal' | 'paytm'>('paytm');

  const handleProceed = () => {
    onPaymentMethodSelect(selectedMethod);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IndianRupee className="h-5 w-5" />
          Choose Payment Method
        </CardTitle>
        <CardDescription>
          Select how you'd like to pay {formatCurrency(amount)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={selectedMethod}
          onValueChange={(value) => setSelectedMethod(value as 'internal' | 'paytm')}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="paytm" id="paytm" />
            <Label htmlFor="paytm" className="flex items-center gap-3 cursor-pointer flex-1">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded">
                <Smartphone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">Paytm Wallet</div>
                <div className="text-sm text-gray-500">UPI, Cards, Wallet & More</div>
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="internal" id="internal" />
            <Label htmlFor="internal" className="flex items-center gap-3 cursor-pointer flex-1">
              <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded">
                <Wallet className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium">Direct Payment</div>
                <div className="text-sm text-gray-500">Instant processing</div>
              </div>
            </Label>
          </div>
        </RadioGroup>

        <div className="bg-gray-50 p-3 rounded-lg text-sm">
          <div className="flex justify-between mb-1">
            <span>Amount:</span>
            <span className="font-medium">{formatCurrency(amount)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Payment method:</span>
            <span>{selectedMethod === 'paytm' ? 'Paytm Gateway' : 'Direct Payment'}</span>
          </div>
        </div>

        <Button
          onClick={handleProceed}
          disabled={isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              Processing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Proceed to Pay {formatCurrency(amount)}
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodSelector;
