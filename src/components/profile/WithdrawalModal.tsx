
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bank, Phone, IndianRupee, CreditCard } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  balance: number;
}

// Bank account withdrawal form schema
const bankWithdrawalSchema = z.object({
  accountHolderName: z.string().min(3, { message: "Account holder name is required" }),
  accountNumber: z.string().min(9, { message: "Enter a valid account number" }),
  confirmAccountNumber: z.string().min(9, { message: "Confirm account number" }),
  ifscCode: z.string().min(11, { message: "IFSC code must be 11 characters" }).max(11),
  bankName: z.string().min(3, { message: "Bank name is required" }),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, { message: "Enter a valid 10-character PAN number" }),
  panName: z.string().min(3, { message: "Name on PAN is required" }),
  phoneNumber: z.string().regex(/^\d{10}$/, { message: "Phone number must be 10 digits" }),
  amount: z.number().min(1, { message: "Amount must be greater than 0" })
}).refine((data) => data.accountNumber === data.confirmAccountNumber, {
  message: "Account numbers must match",
  path: ["confirmAccountNumber"],
});

// UPI withdrawal form schema
const upiWithdrawalSchema = z.object({
  upiId: z.string().regex(/^[\w.-]+@[\w.-]+$/, { message: "Enter a valid UPI ID (e.g., user@bank)" }),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, { message: "Enter a valid 10-character PAN number" }),
  panName: z.string().min(3, { message: "Name on PAN is required" }),
  phoneNumber: z.string().regex(/^\d{10}$/, { message: "Phone number must be 10 digits" }),
  amount: z.number().min(1, { message: "Amount must be greater than 0" })
});

type BankWithdrawalFormValues = z.infer<typeof bankWithdrawalSchema>;
type UpiWithdrawalFormValues = z.infer<typeof upiWithdrawalSchema>;

const WithdrawalModal = ({ isOpen, onClose, userId, balance }: WithdrawalModalProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("bank");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
      amount: balance > 0 ? balance : 0
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
      amount: balance > 0 ? balance : 0
    }
  });

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
      
      // Save withdrawal request to database
      const { error } = await supabase.from('withdrawal_requests').insert({
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
        status: 'pending'
      });
      
      if (error) throw error;
      
      toast({
        title: "Withdrawal request submitted",
        description: "Your withdrawal request has been submitted successfully.",
      });
      
      onClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit withdrawal request",
      });
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
      
      // Save withdrawal request to database
      const { error } = await supabase.from('withdrawal_requests').insert({
        user_id: userId,
        amount: values.amount,
        upi_id: values.upiId,
        pan_number: values.panNumber,
        pan_name: values.panName,
        phone_number: values.phoneNumber,
        payment_method: 'upi',
        status: 'pending'
      });
      
      if (error) throw error;
      
      toast({
        title: "Withdrawal request submitted",
        description: "Your UPI withdrawal request has been submitted successfully.",
      });
      
      onClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit withdrawal request",
      });
    } finally {
      setIsSubmitting(false);
    }
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
        
        <Tabs defaultValue="bank" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2 bg-white/50 border border-pastel-200/50 p-1">
            <TabsTrigger value="bank" className="data-[state=active]:bg-pastel-500 data-[state=active]:text-white text-gray-700">
              <Bank className="h-4 w-4 mr-2" />
              Bank Transfer
            </TabsTrigger>
            <TabsTrigger value="upi" className="data-[state=active]:bg-pastel-500 data-[state=active]:text-white text-gray-700">
              <CreditCard className="h-4 w-4 mr-2" />
              UPI
            </TabsTrigger>
          </TabsList>
          
          {/* Bank Transfer Form */}
          <TabsContent value="bank" className="mt-4">
            <Form {...bankForm}>
              <form onSubmit={bankForm.handleSubmit(handleBankSubmit)} className="space-y-4">
                <div className="bg-pastel-500/5 p-3 rounded-md border border-pastel-200/50 mb-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-gray-700">Withdrawal Amount</Label>
                    <div className="flex items-center text-lg font-bold text-gray-800">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      <FormField
                        control={bankForm.control}
                        name="amount"
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              className="w-32 border-pastel-200/50 bg-white/50"
                              max={balance}
                            />
                          </FormControl>
                        )}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Available balance: <span className="font-semibold">₹{balance.toFixed(2)}</span>
                  </p>
                </div>
                
                <h3 className="text-sm font-semibold text-gray-800">Bank Account Details</h3>
                
                <FormField
                  control={bankForm.control}
                  name="accountHolderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Account Holder Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="border-pastel-200/50 bg-white/50 text-black" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={bankForm.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Account Number</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="text" 
                          className="border-pastel-200/50 bg-white/50 text-black" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={bankForm.control}
                  name="confirmAccountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Confirm Account Number</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="text" 
                          className="border-pastel-200/50 bg-white/50 text-black" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={bankForm.control}
                    name="ifscCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">IFSC Code</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            className="border-pastel-200/50 bg-white/50 text-black uppercase" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={bankForm.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Bank Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-pastel-200/50 bg-white/50 text-black" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <h3 className="text-sm font-semibold text-gray-800">PAN Card Details</h3>
                
                <FormField
                  control={bankForm.control}
                  name="panNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">PAN Number</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          className="border-pastel-200/50 bg-white/50 text-black uppercase" 
                          maxLength={10}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={bankForm.control}
                  name="panName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Name on PAN</FormLabel>
                      <FormControl>
                        <Input {...field} className="border-pastel-200/50 bg-white/50 text-black" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={bankForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          className="border-pastel-200/50 bg-white/50 text-black" 
                          type="tel"
                          maxLength={10} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-pastel-500 hover:bg-pastel-600 text-white"
                >
                  {isSubmitting ? "Processing..." : "Submit Withdrawal Request"}
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          {/* UPI Form */}
          <TabsContent value="upi" className="mt-4">
            <Form {...upiForm}>
              <form onSubmit={upiForm.handleSubmit(handleUpiSubmit)} className="space-y-4">
                <div className="bg-pastel-500/5 p-3 rounded-md border border-pastel-200/50 mb-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-gray-700">Withdrawal Amount</Label>
                    <div className="flex items-center text-lg font-bold text-gray-800">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      <FormField
                        control={upiForm.control}
                        name="amount"
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              className="w-32 border-pastel-200/50 bg-white/50"
                              max={balance}
                            />
                          </FormControl>
                        )}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Available balance: <span className="font-semibold">₹{balance.toFixed(2)}</span>
                  </p>
                </div>
                
                <h3 className="text-sm font-semibold text-gray-800">UPI Details</h3>
                
                <FormField
                  control={upiForm.control}
                  name="upiId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">UPI ID</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="yourname@bank" 
                          className="border-pastel-200/50 bg-white/50 text-black" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <h3 className="text-sm font-semibold text-gray-800">PAN Card Details</h3>
                
                <FormField
                  control={upiForm.control}
                  name="panNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">PAN Number</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          className="border-pastel-200/50 bg-white/50 text-black uppercase" 
                          maxLength={10}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={upiForm.control}
                  name="panName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Name on PAN</FormLabel>
                      <FormControl>
                        <Input {...field} className="border-pastel-200/50 bg-white/50 text-black" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={upiForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          className="border-pastel-200/50 bg-white/50 text-black" 
                          type="tel"
                          maxLength={10} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-pastel-500 hover:bg-pastel-600 text-white"
                >
                  {isSubmitting ? "Processing..." : "Submit UPI Withdrawal Request"}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalModal;
