
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building, Phone, IndianRupee, CreditCard, Loader2 } from 'lucide-react';
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
  amount: z.number().min(1, { message: "Amount must be greater than 0" }),
  saveDetails: z.boolean().default(false)
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
  amount: z.number().min(1, { message: "Amount must be greater than 0" }),
  saveDetails: z.boolean().default(false)
});

type BankWithdrawalFormValues = z.infer<typeof bankWithdrawalSchema>;
type UpiWithdrawalFormValues = z.infer<typeof upiWithdrawalSchema>;

// Interface for saved user details
interface SavedUserDetails {
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

const WithdrawalModal = ({ isOpen, onClose, userId, balance }: WithdrawalModalProps) => {
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
      if (!isOpen || !userId) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await fetch('/api/withdrawal-requests', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabase.auth.getSession().then(res => res.data.session?.access_token)}`
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
      } catch (error) {
        console.error('Error fetching saved details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSavedDetails();
  }, [isOpen, userId, bankForm, upiForm]);

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
              {savedDetails?.is_verified && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
                  <p className="text-green-700 text-sm">
                    Your bank details are verified! You can proceed with withdrawal or update your details if needed.
                  </p>
                </div>
              )}
              
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
                  
                  <div className="flex items-center space-x-2">
                    <FormField
                      control={bankForm.control}
                      name="saveDetails"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-pastel-500"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-gray-700">
                              Save these details for future withdrawals
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-pastel-500 hover:bg-pastel-600 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : "Submit Withdrawal Request"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            {/* UPI Form */}
            <TabsContent value="upi" className="mt-4">
              {savedDetails?.is_verified && savedDetails?.upi_id && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
                  <p className="text-green-700 text-sm">
                    Your UPI details are verified! You can proceed with withdrawal or update your details if needed.
                  </p>
                </div>
              )}
            
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
                  
                  <div className="flex items-center space-x-2">
                    <FormField
                      control={upiForm.control}
                      name="saveDetails"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-pastel-500"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-gray-700">
                              Save these details for future withdrawals
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-pastel-500 hover:bg-pastel-600 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : "Submit UPI Withdrawal Request"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalModal;
