
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
              className="bg-white/5 border-white/10 text-white" 
              {...field} 
            />
          </FormControl>
          <FormDescription className="text-gray-400">
            Enter the URL you want to share with paying users
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LinkContentForm;
