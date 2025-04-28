
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronDown, Tag } from 'lucide-react';
import { format } from "date-fns";
import { UseFormReturn } from "react-hook-form";
import { ContentFormValues } from '@/types/content';
import CustomTagCreator from '../dashboard/filters/CustomTagCreator';

interface AdvancedSettingsProps {
  form: UseFormReturn<ContentFormValues>;
  showAdvanced: boolean;
  setShowAdvanced: (show: boolean) => void;
}

const AdvancedSettings = ({ form, showAdvanced, setShowAdvanced }: AdvancedSettingsProps) => {
  const [customTags, setCustomTags] = React.useState<Array<{name: string, color: string}>>([]);

  const handleAddTag = (name: string, color: string) => {
    // Add new tag to customTags state
    setCustomTags(prev => [...prev, { name, color }]);
    
    // Add tag to form values
    const currentTags = form.getValues('tags') || [];
    form.setValue('tags', [...currentTags, name]);
  };

  const removeTag = (tagToRemove: string) => {
    // Remove from form values
    const currentTags = form.getValues('tags') || [];
    form.setValue('tags', currentTags.filter(tag => tag !== tagToRemove));
    
    // Remove from customTags state
    setCustomTags(prev => prev.filter(tag => tag.name !== tagToRemove));
  };

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

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <FormLabel>Content Tags</FormLabel>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {customTags.map((tag) => (
                <Badge
                  key={tag.name}
                  variant="outline"
                  className={`cursor-pointer border-${tag.color}-500/30 bg-${tag.color}-500/20 text-${tag.color}-300`}
                  onClick={() => removeTag(tag.name)}
                >
                  {tag.name}
                  <span className="ml-1 text-xs">&times;</span>
                </Badge>
              ))}
            </div>
            
            <CustomTagCreator
              customTags={customTags}
              onAddTag={handleAddTag}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSettings;
