
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
              className="h-40 bg-white/5 border-white/10 text-white" 
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
