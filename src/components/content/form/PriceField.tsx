
import React from 'react';
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DollarSign } from 'lucide-react';

const PriceField: React.FC = () => {
  const { control } = useFormContext();
  
  return (
    <FormField 
      control={control} 
      name="price" 
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4" /> Unlock Price
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input 
                type="number" 
                min="0" 
                step="0.01" 
                placeholder="5.00" 
                className="pl-8 bg-white/5 border-white/10 text-white h-10" 
                {...field} 
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            </div>
          </FormControl>
          <FormDescription className="text-gray-400 text-xs">
            Set to 0 for free content
          </FormDescription>
          <FormMessage />
        </FormItem>
      )} 
    />
  );
};

export default PriceField;
