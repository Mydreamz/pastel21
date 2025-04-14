
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { FormField, FormItem, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from 'react-hook-form';
import { ContentFormValues } from '../form/ContentFormProvider';

interface LinkUploaderProps {
  control: Control<ContentFormValues>;
}

const LinkUploader: React.FC<LinkUploaderProps> = ({ control }) => {
  return (
    <TabsContent value="link" className="p-3 bg-white/5 border border-white/10 rounded-md">
      <FormField 
        control={control} 
        name="content" 
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input 
                placeholder="https://example.com/your-premium-link" 
                className="bg-white/5 border-white/10 text-white h-10" 
                {...field} 
              />
            </FormControl>
            <FormDescription className="text-gray-400 text-xs mt-1">
              Enter the URL you want to share with paying users
            </FormDescription>
            <FormMessage />
          </FormItem>
        )} 
      />
    </TabsContent>
  );
};

export default LinkUploader;
