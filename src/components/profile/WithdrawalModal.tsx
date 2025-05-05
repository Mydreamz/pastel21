
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, CreditCard, IndianRupee, Loader2 } from 'lucide-react';
import { useWithdrawal } from '@/hooks/useWithdrawal';
import BankWithdrawalForm from './withdrawal/BankWithdrawalForm';
import UpiWithdrawalForm from './withdrawal/UpiWithdrawalForm';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  balance: number;
}

const WithdrawalModal = ({ isOpen, onClose, userId, balance }: WithdrawalModalProps) => {
  const {
    activeTab,
    setActiveTab,
    isLoading,
    isSubmitting,
    savedDetails,
    bankForm,
    upiForm,
    handleBankSubmit,
    handleUpiSubmit
  } = useWithdrawal(userId, balance);

  // Only fetch data when the modal is open
  useEffect(() => {
    // This effect will only trigger when the modal opens
    // No explicit data loading here - it's handled by useWithdrawal hook
  }, [isOpen]);

  // Handle successful submission
  const handleFormSuccess = () => {
    onClose();
  };

  // Wrap the submit handlers to close the modal on success
  const handleBankFormSubmit = async (values: any) => {
    const success = await handleBankSubmit(values);
    if (success) handleFormSuccess();
  };

  const handleUpiFormSubmit = async (values: any) => {
    const success = await handleUpiSubmit(values);
    if (success) handleFormSuccess();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-800 flex items-center">
            <IndianRupee className="h-5 w-5 mr-2 text-pastel-700" />
            Withdraw Funds
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Please provide your banking details to withdraw your funds.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-pastel-500" />
            <p className="mt-2 text-gray-600">Loading your details...</p>
          </div>
        ) : (
          <Tabs defaultValue="bank" value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid grid-cols-2 bg-white/50 border border-pastel-200/50 p-1">
              <TabsTrigger value="bank" className="data-[state=active]:bg-pastel-500 data-[state=active]:text-white text-gray-700">
                <Building className="h-4 w-4 mr-2" />
                Bank Transfer
              </TabsTrigger>
              <TabsTrigger value="upi" className="data-[state=active]:bg-pastel-500 data-[state=active]:text-white text-gray-700">
                <CreditCard className="h-4 w-4 mr-2" />
                UPI
              </TabsTrigger>
            </TabsList>
            
            {/* Bank Transfer Form */}
            <TabsContent value="bank" className="mt-4">
              <BankWithdrawalForm
                form={bankForm}
                onSubmit={handleBankFormSubmit}
                isSubmitting={isSubmitting}
                balance={balance}
                isVerified={savedDetails?.is_verified}
              />
            </TabsContent>
            
            {/* UPI Form */}
            <TabsContent value="upi" className="mt-4">
              <UpiWithdrawalForm
                form={upiForm}
                onSubmit={handleUpiFormSubmit}
                isSubmitting={isSubmitting}
                balance={balance}
                isVerified={savedDetails?.is_verified && !!savedDetails?.upi_id}
              />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalModal;
