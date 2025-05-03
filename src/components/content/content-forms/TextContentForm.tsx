
import React from 'react';
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from 'react-hook-form';
import { ContentFormValues } from '@/types/content';
import { useIsMobile } from '@/hooks/use-mobile';

type TextContentFormProps = {
  form: UseFormReturn<ContentFormValues>;
};

const TextContentForm = ({ form }: TextContentFormProps) => {
  const isMobile = useIsMobile();
  
  return (
    <FormField
      control={form.control}
      name="content"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Textarea 
              placeholder="Write your premium content here" 
              className={`${isMobile ? 'h-24' : 'h-40'} bg-white border-pastel-200 text-gray-700 focus:border-pastel-500`} 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TextContentForm;
