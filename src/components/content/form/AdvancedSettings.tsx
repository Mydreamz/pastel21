
import React from 'react';
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from 'lucide-react';

const AdvancedSettings: React.FC = () => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const { control } = useFormContext();
  
  return (
    <div className="pt-1">
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => setShowAdvanced(!showAdvanced)} 
        className="text-gray-300 border-gray-700 text-xs h-8 hover:border-emerald-500 hover:bg-emerald-500/10 w-full sm:w-auto"
      >
        {showAdvanced ? "Hide" : "Show"} Advanced Settings
      </Button>
      
      {showAdvanced && (
        <div className="mt-3 space-y-3 p-3 bg-white/5 border border-white/10 rounded-md">
          <FormField 
            control={control} 
            name="expiry" 
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" /> Expiry Date (Optional)
                </FormLabel>
                <FormControl>
                  <Input 
                    type="datetime-local" 
                    className="bg-white/5 border-white/10 text-white h-10" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription className="text-gray-400 text-xs">
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
