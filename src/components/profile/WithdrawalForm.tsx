import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Banknote, CreditCard } from 'lucide-react';

interface WithdrawalFormProps {
  availableBalance: number;
  onWithdrawalSubmitted: () => void;
}

const WithdrawalForm: React.FC<WithdrawalFormProps> = ({ availableBalance, onWithdrawalSubmitted }) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [panName, setPanName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const withdrawalAmount = parseFloat(amount);
    if (withdrawalAmount <= 0 || withdrawalAmount > availableBalance) {
      toast({
        title: "Invalid Amount",
        description: `Please enter an amount between ₹1 and ₹${availableBalance}`,
        variant: "destructive"
      });
      return;
    }

    if (withdrawalAmount < 100) {
      toast({
        title: "Minimum Withdrawal",
        description: "Minimum withdrawal amount is ₹100",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const withdrawalData = {
        user_id: user.id,
        amount: withdrawalAmount,
        payment_method: paymentMethod,
        account_holder_name: accountHolderName,
        pan_number: panNumber,
        pan_name: panName,
        phone_number: phoneNumber,
        ...(paymentMethod === 'bank' ? {
          account_number: accountNumber,
          ifsc_code: ifscCode,
          bank_name: bankName
        } : {
          upi_id: upiId
        })
      };

      const { error } = await supabase
        .from('withdrawal_requests')
        .insert([withdrawalData]);

      if (error) throw error;

      toast({
        title: "Withdrawal Request Submitted",
        description: "Your withdrawal request has been submitted for processing. You will be notified once it's approved.",
      });

      // Reset form
      setAmount('');
      setPaymentMethod('');
      setAccountHolderName('');
      setAccountNumber('');
      setIfscCode('');
      setBankName('');
      setUpiId('');
      setPanNumber('');
      setPanName('');
      setPhoneNumber('');
      
      onWithdrawalSubmitted();
    } catch (error) {
      console.error('Error submitting withdrawal request:', error);
      toast({
        title: "Error",
        description: "Failed to submit withdrawal request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Banknote className="h-5 w-5" />
          Request Withdrawal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-foreground">
                Amount (Available: ₹{availableBalance.toFixed(2)})
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="100"
                max={availableBalance}
                step="0.01"
                required
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod" className="text-foreground">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountHolderName" className="text-foreground">Account Holder Name</Label>
              <Input
                id="accountHolderName"
                type="text"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                placeholder="Enter account holder name"
                required
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-foreground">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
                required
                className="bg-background border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="panNumber" className="text-foreground">PAN Number</Label>
              <Input
                id="panNumber"
                type="text"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                placeholder="Enter PAN number"
                pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                required
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="panName" className="text-foreground">Name as per PAN</Label>
              <Input
                id="panName"
                type="text"
                value={panName}
                onChange={(e) => setPanName(e.target.value)}
                placeholder="Enter name as per PAN"
                required
                className="bg-background border-border"
              />
            </div>
          </div>

          {paymentMethod === 'bank' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountNumber" className="text-foreground">Account Number</Label>
                <Input
                  id="accountNumber"
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter account number"
                  required
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ifscCode" className="text-foreground">IFSC Code</Label>
                <Input
                  id="ifscCode"
                  type="text"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  placeholder="Enter IFSC code"
                  required
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bankName" className="text-foreground">Bank Name</Label>
                <Input
                  id="bankName"
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Enter bank name"
                  required
                  className="bg-background border-border"
                />
              </div>
            </div>
          )}

          {paymentMethod === 'upi' && (
            <div className="space-y-2">
              <Label htmlFor="upiId" className="text-foreground">UPI ID</Label>
              <Input
                id="upiId"
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="Enter UPI ID (e.g., user@paytm)"
                required
                className="bg-background border-border"
              />
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !paymentMethod || availableBalance < 100}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Withdrawal Request'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default WithdrawalForm;