
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useBankWithdrawalForm, useUpiWithdrawalForm } from "./withdrawal/useWithdrawalForms";
import { WithdrawalService } from "@/services/WithdrawalService";
import { SavedUserDetails } from "@/types/transaction";

export const useWithdrawal = (userId: string, balance: number) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("bank");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [savedDetails, setSavedDetails] = useState<SavedUserDetails | null>(null);
  
  // Fetch saved withdrawal details when modal opens
  useEffect(() => {
    const fetchSavedDetails = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      try {
        const session = await supabase.auth.getSession();
        const accessToken = session.data.session?.access_token;
        
        if (!accessToken) throw new Error("No access token available");
        
        const data = await WithdrawalService.getSavedWithdrawalDetails(accessToken);
        if (data) {
          setSavedDetails(data);
        }
      } catch (error: any) {
        console.error('Error fetching saved details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSavedDetails();
  }, [userId]);
  
  // Initialize forms with the saved details
  const bankForm = useBankWithdrawalForm(balance, savedDetails);
  const upiForm = useUpiWithdrawalForm(balance, savedDetails);

  // Handle form submission for bank transfer
  const handleBankSubmit = async (values: any) => {
    if (isSubmitting) return false;
    setIsSubmitting(true);
    
    try {
      // Validate withdrawal amount
      if (values.amount > balance) {
        toast({
          title: "Invalid amount",
          description: "Withdrawal amount cannot exceed your balance",
          variant: "destructive",
        });
        return false;
      }
      
      const session = await supabase.auth.getSession();
      const accessToken = session.data.session?.access_token;
      
      if (!accessToken) throw new Error("No access token available");
      
      // Submit withdrawal request
      const result = await WithdrawalService.submitBankWithdrawal(
        values, 
        userId, 
        accessToken
      );
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      toast({
        title: "Withdrawal request submitted",
        description: "Your withdrawal request has been submitted successfully.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit withdrawal request",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form submission for UPI transfer
  const handleUpiSubmit = async (values: any) => {
    if (isSubmitting) return false;
    setIsSubmitting(true);
    
    try {
      // Validate withdrawal amount
      if (values.amount > balance) {
        toast({
          title: "Invalid amount",
          description: "Withdrawal amount cannot exceed your balance",
          variant: "destructive",
        });
        return false;
      }
      
      const session = await supabase.auth.getSession();
      const accessToken = session.data.session?.access_token;
      
      if (!accessToken) throw new Error("No access token available");
      
      // Submit withdrawal request
      const result = await WithdrawalService.submitUpiWithdrawal(
        values, 
        userId, 
        accessToken
      );
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      toast({
        title: "Withdrawal request submitted",
        description: "Your UPI withdrawal request has been submitted successfully.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit withdrawal request",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    isLoading,
    isSubmitting,
    savedDetails,
    bankForm,
    upiForm,
    handleBankSubmit,
    handleUpiSubmit
  };
};
