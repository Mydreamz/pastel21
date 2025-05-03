import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { format } from "date-fns";
import { UseFormReturn } from "react-hook-form";
import { ContentFormValues } from '@/types/content';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from "@/components/ui/separator";

interface AdvancedSettingsProps {
  form: UseFormReturn<ContentFormValues>;
  showAdvanced: boolean;
  setShowAdvanced: (show: boolean) => void;
}

const AdvancedSettings = ({ form, showAdvanced, setShowAdvanced }: AdvancedSettingsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="outline"
        className="w-full justify-between bg-white border-pastel-200 hover:bg-pastel-100 text-gray-700 font-medium"
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        Advanced Settings
        <ChevronDown className={`h-4 w-4 text-pastel-500 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
      </Button>

      {showAdvanced && (
        <div className="space-y-4 rounded-lg border border-pastel-200 bg-white/80 p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium text-gray-800">Expiration Settings</h3>
            <Separator className="flex-1 bg-pastel-200" />
          </div>
          
          <FormField
            control={form.control}
            name="expiry"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-gray-700 font-medium">Content Expiry Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={`${isMobile ? 'w-full' : 'w-[240px]'} pl-3 text-left font-normal border-pastel-200 bg-white hover:bg-pastel-100/50 text-gray-700 ${!field.value && "text-gray-500"}`}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 text-pastel-500" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white border-pastel-200 shadow-md" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date?.toISOString())}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="border-pastel-200"
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription className="text-gray-500">
                  Set a date when this content will no longer be available
                </FormDescription>
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
