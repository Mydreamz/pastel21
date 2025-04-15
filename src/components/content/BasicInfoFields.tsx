
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ContentFormValues } from '@/types/content';

type BasicInfoFieldsProps = {
  form: UseFormReturn<ContentFormValues>;
};

const BasicInfoFields = ({ form }: BasicInfoFieldsProps) => {
  return (
    <>
      <FormField control={form.control} name="title" render={({ field }) => (
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input placeholder="Enter a title for your content" className="bg-white/5 border-white/10 text-white" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
      
      <FormField control={form.control} name="teaser" render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            Public Teaser <span className="text-gray-400 text-sm">(visible to everyone)</span>
          </FormLabel>
          <FormControl>
            <Textarea placeholder="Write a teaser that will make people want to unlock your content" className="h-24 bg-white/5 border-white/10 text-white" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
      
      <FormField control={form.control} name="price" render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" /> Unlock Price
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input type="number" min="0" step="0.01" placeholder="5.00" className="pl-8 bg-white/5 border-white/10 text-white" {...field} />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            </div>
          </FormControl>
          <FormDescription className="text-gray-400">
            Set to 0 for free content
          </FormDescription>
          <FormMessage />
        </FormItem>
      )} />
    </>
  );
};

export default BasicInfoFields;
