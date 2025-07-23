
import React from 'react';
import { FormField, FormItem, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from 'react-hook-form';
import { ContentFormValues } from '@/types/content';

type LinkContentFormProps = {
  form: UseFormReturn<ContentFormValues>;
};

const LinkContentForm = ({ form }: LinkContentFormProps) => {
  return (
    <FormField
      control={form.control}
      name="content"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input 
              placeholder="https://example.com/your-premium-link" 
              className="bg-white/90 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-primary focus:ring-primary/20" 
              {...field} 
            />
          </FormControl>
          <FormDescription className="text-gray-600">
            Enter the URL you want to share with paying users
          </FormDescription>
          <FormMessage className="text-red-600" />
        </FormItem>
      )}
    />
  );
};

export default LinkContentForm;
