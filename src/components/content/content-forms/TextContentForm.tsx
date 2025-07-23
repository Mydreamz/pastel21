
import React from 'react';
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from 'react-hook-form';
import { ContentFormValues } from '@/types/content';

type TextContentFormProps = {
  form: UseFormReturn<ContentFormValues>;
};

const TextContentForm = ({ form }: TextContentFormProps) => {
  return (
    <FormField
      control={form.control}
      name="content"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Textarea 
              placeholder="Write your premium content here" 
              className="h-40 bg-white/90 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-primary focus:ring-primary/20" 
              {...field} 
            />
          </FormControl>
          <FormMessage className="text-red-600" />
        </FormItem>
      )}
    />
  );
};

export default TextContentForm;
