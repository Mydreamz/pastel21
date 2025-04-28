
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { format } from "date-fns";
import { UseFormReturn } from "react-hook-form";
import { ContentFormValues } from '@/types/content';

interface AdvancedSettingsProps {
  form: UseFormReturn<ContentFormValues>;
  showAdvanced: boolean;
  setShowAdvanced: (show: boolean) => void;
}

const AdvancedSettings = ({ form, showAdvanced, setShowAdvanced }: AdvancedSettingsProps) => {
  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="outline"
        className="w-full justify-between border-white/10 bg-white/5 hover:bg-white/10"
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        Advanced Settings
        <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
      </Button>

      {showAdvanced && (
        <div className="space-y-4 rounded-md border border-white/10 bg-white/5 p-4">
          <FormField
            control={form.control}
            name="expiry"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Content Expiry Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={`w-full pl-3 text-left font-normal border-white/10 bg-white/5 hover:bg-white/10 ${!field.value && "text-gray-400"}`}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-gray-900 border-white/10" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date?.toISOString())}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default AdvancedSettings;
