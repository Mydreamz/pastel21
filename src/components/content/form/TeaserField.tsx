
import React from 'react';
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const TeaserField: React.FC = () => {
  const { control } = useFormContext();
  
  return (
    <FormField 
      control={control} 
      name="teaser" 
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="flex items-center gap-2 text-sm">
            Public Teaser <span className="text-gray-400 text-xs">(visible to everyone)</span>
          </FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Write a teaser that will make people want to unlock your content" 
              className="h-20 bg-white/5 border-white/10 text-white" 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} 
    />
  );
};

export default TeaserField;
