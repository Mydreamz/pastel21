
import React from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Phone, IndianRupee, Loader2 } from 'lucide-react';
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

// UPI withdrawal form schema
export const upiWithdrawalSchema = z.object({
  upiId: z.string().regex(/^[\w.-]+@[\w.-]+$/, { message: "Enter a valid UPI ID (e.g., user@bank)" }),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, { message: "Enter a valid 10-character PAN number" }),
  panName: z.string().min(3, { message: "Name on PAN is required" }),
  phoneNumber: z.string().regex(/^\d{10}$/, { message: "Phone number must be 10 digits" }),
  amount: z.number().min(1, { message: "Amount must be greater than 0" }),
  saveDetails: z.boolean().default(false)
});

export type UpiWithdrawalFormValues = z.infer<typeof upiWithdrawalSchema>;

interface UpiWithdrawalFormProps {
  form: UseFormReturn<UpiWithdrawalFormValues>;
  onSubmit: (values: UpiWithdrawalFormValues) => Promise<void>;
  isSubmitting: boolean;
  balance: number;
  isVerified?: boolean;
}

const UpiWithdrawalForm = ({ form, onSubmit, isSubmitting, balance, isVerified }: UpiWithdrawalFormProps) => {
  return (
    <>
      {isVerified && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
          <p className="text-green-700 text-sm">
            Your UPI details are verified! You can proceed with withdrawal or update your details if needed.
          </p>
        </div>
      )}
    
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="bg-pastel-500/5 p-3 rounded-md border border-pastel-200/50 mb-4">
            <div className="flex justify-between items-center">
              <Label className="text-gray-700">Withdrawal Amount</Label>
              <div className="flex items-center text-lg font-bold text-gray-800">
                <IndianRupee className="h-4 w-4 mr-1" />
                <FormField
                  control={form.control}
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
            control={form.control}
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
            control={form.control}
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
            control={form.control}
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
            control={form.control}
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
              control={form.control}
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
    </>
  );
};

export default UpiWithdrawalForm;
