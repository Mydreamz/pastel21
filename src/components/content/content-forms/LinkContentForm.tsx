
import React from 'react';
import { FormField, FormItem, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from 'react-hook-form';
import { ContentFormValues } from '@/types/content';
import { useIsMobile } from '@/hooks/use-mobile';

type LinkContentFormProps = {
  form: UseFormReturn<ContentFormValues>;
};

const LinkContentForm = ({ form }: LinkContentFormProps) => {
  const isMobile = useIsMobile();
  
  return (
    <FormField
      control={form.control}
      name="content"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input 
              placeholder="https://example.com/your-premium-link" 
              className="bg-white border-pastel-200 text-gray-700 focus:border-pastel-500" 
              {...field} 
            />
          </FormControl>
          {!isMobile && (
            <FormDescription className="text-gray-500">
              Enter the URL you want to share with paying users
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LinkContentForm;
