
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { 
  bankWithdrawalSchema, 
  BankWithdrawalFormValues 
} from "@/components/profile/withdrawal/BankWithdrawalForm";
import { 
  upiWithdrawalSchema, 
  UpiWithdrawalFormValues 
} from "@/components/profile/withdrawal/UpiWithdrawalForm";

// Interface for saved user details
export interface SavedUserDetails {
  account_holder_name?: string;
  account_number?: string;
  ifsc_code?: string;
  bank_name?: string;
  upi_id?: string;
  pan_number?: string;
  pan_name?: string;
  phone_number?: string;
  is_verified?: boolean;
}

export const useWithdrawal = (userId: string, balance: number) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("bank");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [savedDetails, setSavedDetails] = useState<SavedUserDetails | null>(null);
  
  // Bank form
  const bankForm = useForm<BankWithdrawalFormValues>({
    resolver: zodResolver(bankWithdrawalSchema),
    defaultValues: {
      accountHolderName: "",
      accountNumber: "",
      confirmAccountNumber: "",
      ifscCode: "",
      bankName: "",
      panNumber: "",
      panName: "",
      phoneNumber: "",
      amount: balance > 0 ? balance : 0,
      saveDetails: true
    }
  });

  // UPI form
  const upiForm = useForm<UpiWithdrawalFormValues>({
    resolver: zodResolver(upiWithdrawalSchema),
    defaultValues: {
      upiId: "",
      panNumber: "",
      panName: "",
      phoneNumber: "",
      amount: balance > 0 ? balance : 0,
      saveDetails: true
    }
  });

  // Fetch saved withdrawal details when modal opens
  useEffect(() => {
    const fetchSavedDetails = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await fetch('/api/withdrawal-requests', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          }
        }).then(res => res.json());
        
        if (error) throw new Error(error);
        
        if (data) {
          setSavedDetails(data);
          
          // Pre-fill bank form
          if (data.account_holder_name) {
            bankForm.setValue('accountHolderName', data.account_holder_name);
            bankForm.setValue('accountNumber', data.account_number || '');
            bankForm.setValue('confirmAccountNumber', data.account_number || '');
            bankForm.setValue('ifscCode', data.ifsc_code || '');
            bankForm.setValue('bankName', data.bank_name || '');
            bankForm.setValue('panNumber', data.pan_number || '');
            bankForm.setValue('panName', data.pan_name || '');
            bankForm.setValue('phoneNumber', data.phone_number || '');
          }
          
          // Pre-fill UPI form
          if (data.upi_id || data.pan_number) {
            upiForm.setValue('upiId', data.upi_id || '');
            upiForm.setValue('panNumber', data.pan_number || '');
            upiForm.setValue('panName', data.pan_name || '');
            upiForm.setValue('phoneNumber', data.phone_number || '');
          }
        }
      } catch (error: any) {
        console.error('Error fetching saved details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSavedDetails();
  }, [userId, bankForm, upiForm]);

  // Handle form submission for bank transfer
  const handleBankSubmit = async (values: BankWithdrawalFormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      // Validate withdrawal amount
      if (values.amount > balance) {
        toast({
          title: "Invalid amount",
          description: "Withdrawal amount cannot exceed your balance",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Save withdrawal request to database (using Edge Function)
      const response = await fetch('/api/withdrawal-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          user_id: userId,
          amount: values.amount,
          account_holder_name: values.accountHolderName,
          account_number: values.accountNumber,
          ifsc_code: values.ifscCode,
          bank_name: values.bankName,
          pan_number: values.panNumber,
          pan_name: values.panName,
          phone_number: values.phoneNumber,
          payment_method: 'bank_transfer',
          status: 'pending',
          saveDetails: values.saveDetails
        })
      });
      
      const { error } = await response.json();
      
      if (error) throw new Error(error);
      
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
  const handleUpiSubmit = async (values: UpiWithdrawalFormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      // Validate withdrawal amount
      if (values.amount > balance) {
        toast({
          title: "Invalid amount",
          description: "Withdrawal amount cannot exceed your balance",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Save withdrawal request to database (using Edge Function)
      const response = await fetch('/api/withdrawal-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          user_id: userId,
          amount: values.amount,
          upi_id: values.upiId,
          pan_number: values.panNumber,
          pan_name: values.panName,
          phone_number: values.phoneNumber,
          payment_method: 'upi',
          status: 'pending',
          saveDetails: values.saveDetails
        })
      });
      
      const { error } = await response.json();
      
      if (error) throw new Error(error);
      
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
