
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IndianRupee } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ContentFormValues } from '@/types/content';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from "@/components/ui/separator";

type BasicInfoFieldsProps = {
  form: UseFormReturn<ContentFormValues>;
};

const BasicInfoFields = ({ form }: BasicInfoFieldsProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={`${isMobile ? 'p-3' : 'p-4'} rounded-lg border border-pastel-200 bg-white/80 shadow-sm`}>
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-lg font-medium text-gray-800">Basic Information</h3>
        <Separator className="flex-1 bg-pastel-200" />
      </div>

      <div className={`${isMobile ? 'space-y-3' : 'space-y-6'}`}>
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">Title</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter a title for your content" 
                className="bg-white border-pastel-200 text-gray-800 input-neumorphic focus:border-pastel-500" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        
        <FormField control={form.control} name="teaser" render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
              Public Teaser <span className="text-gray-500 text-sm font-normal">(visible to everyone)</span>
            </FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Write a teaser that will make people want to unlock your content" 
                className={`${isMobile ? 'h-16' : 'h-24'} bg-white border-pastel-200 text-gray-800 input-neumorphic focus:border-pastel-500`}
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        
        <FormField control={form.control} name="price" render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
              <IndianRupee className="h-4 w-4 text-pastel-500" /> Unlock Price
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  placeholder="5.00" 
                  className={`pl-8 bg-white border-pastel-200 text-gray-800 input-neumorphic focus:border-pastel-500 ${isMobile ? 'w-full' : 'max-w-xs'}`} 
                  {...field} 
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pastel-500 font-medium">₹</span>
              </div>
            </FormControl>
            {!isMobile && (
              <FormDescription className="text-gray-500">
                Set to 0 for free content
              </FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )} />
      </div>
    </div>
  );
};

export default BasicInfoFields;
