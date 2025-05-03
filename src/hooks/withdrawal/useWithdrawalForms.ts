
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  bankWithdrawalSchema, 
  BankWithdrawalFormValues 
} from "@/components/profile/withdrawal/BankWithdrawalForm";
import { 
  upiWithdrawalSchema, 
  UpiWithdrawalFormValues 
} from "@/components/profile/withdrawal/UpiWithdrawalForm";
import { SavedUserDetails } from "@/types/transaction";

/**
 * Initialize and manage bank withdrawal form
 */
export const useBankWithdrawalForm = (balance: number, savedDetails?: SavedUserDetails | null) => {
  const form = useForm<BankWithdrawalFormValues>({
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

  // Pre-fill form with saved details if available
  if (savedDetails) {
    if (savedDetails.account_holder_name) {
      form.setValue('accountHolderName', savedDetails.account_holder_name);
    }
    if (savedDetails.account_number) {
      form.setValue('accountNumber', savedDetails.account_number);
      form.setValue('confirmAccountNumber', savedDetails.account_number);
    }
    if (savedDetails.ifsc_code) {
      form.setValue('ifscCode', savedDetails.ifsc_code);
    }
    if (savedDetails.bank_name) {
      form.setValue('bankName', savedDetails.bank_name);
    }
    if (savedDetails.pan_number) {
      form.setValue('panNumber', savedDetails.pan_number);
    }
    if (savedDetails.pan_name) {
      form.setValue('panName', savedDetails.pan_name);
    }
    if (savedDetails.phone_number) {
      form.setValue('phoneNumber', savedDetails.phone_number);
    }
  }

  return form;
};

/**
 * Initialize and manage UPI withdrawal form
 */
export const useUpiWithdrawalForm = (balance: number, savedDetails?: SavedUserDetails | null) => {
  const form = useForm<UpiWithdrawalFormValues>({
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

  // Pre-fill form with saved details if available
  if (savedDetails) {
    if (savedDetails.upi_id) {
      form.setValue('upiId', savedDetails.upi_id);
    }
    if (savedDetails.pan_number) {
      form.setValue('panNumber', savedDetails.pan_number);
    }
    if (savedDetails.pan_name) {
      form.setValue('panName', savedDetails.pan_name);
    }
    if (savedDetails.phone_number) {
      form.setValue('phoneNumber', savedDetails.phone_number);
    }
  }

  return form;
};
