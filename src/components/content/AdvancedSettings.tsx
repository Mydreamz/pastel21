
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ContentFormValues } from '@/types/content';

type AdvancedSettingsProps = {
  form: UseFormReturn<ContentFormValues>;
  showAdvanced: boolean;
  setShowAdvanced: (show: boolean) => void;
};

const AdvancedSettings = ({ form, showAdvanced, setShowAdvanced }: AdvancedSettingsProps) => {
  return (
    <div className="pt-2">
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => setShowAdvanced(!showAdvanced)} 
        className="text-gray-300 border-gray-700 hover:border-emerald-500 hover:bg-emerald-500/10"
      >
        {showAdvanced ? "Hide" : "Show"} Advanced Settings
      </Button>
      
      {showAdvanced && (
        <div className="mt-4 space-y-4 p-4 bg-white/5 border border-white/10 rounded-md">
          <FormField control={form.control} name="expiry" render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Expiry Date (Optional)
              </FormLabel>
              <FormControl>
                <Input type="datetime-local" className="bg-white/5 border-white/10 text-white" {...field} />
              </FormControl>
              <FormDescription className="text-gray-400">
                Set a date when this content will no longer be available
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        </div>
      )}
    </div>
  );
};

export default AdvancedSettings;
