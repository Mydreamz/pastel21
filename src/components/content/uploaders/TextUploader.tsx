
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from 'react-hook-form';
import { ContentFormValues } from '../form/ContentFormProvider';

interface TextUploaderProps {
  control: Control<ContentFormValues>;
}

const TextUploader: React.FC<TextUploaderProps> = ({ control }) => {
  return (
    <TabsContent value="text" className="p-3 bg-white/5 border border-white/10 rounded-md">
      <FormField 
        control={control} 
        name="content" 
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea 
                placeholder="Write your premium content here" 
                className="h-32 bg-white/5 border-white/10 text-white" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />
    </TabsContent>
  );
};

export default TextUploader;
