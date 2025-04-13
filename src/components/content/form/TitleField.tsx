
import React from 'react';
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const TitleField: React.FC = () => {
  const { control } = useFormContext();
  
  return (
    <FormField 
      control={control} 
      name="title" 
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input 
              placeholder="Enter a title for your content" 
              className="bg-white/5 border-white/10 text-white h-10" 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} 
    />
  );
};

export default TitleField;
