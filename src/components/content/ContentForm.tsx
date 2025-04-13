
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DollarSign, Lock, Calendar } from 'lucide-react';
import { ContentType } from './ContentTypeSelector';
import ContentTypeSelector from './ContentTypeSelector';
import ContentUploader from './ContentUploader';

export const contentFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  teaser: z.string().min(1, "Teaser text is required"),
  price: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Price must be a positive number"
  }),
  content: z.string().min(1, "Content is required"),
  contentType: z.enum(['text', 'link', 'image', 'video', 'audio', 'document'] as const).default('text'),
  expiry: z.string().optional()
});

export type ContentFormValues = z.infer<typeof contentFormSchema>;

interface ContentFormProps {
  onSubmit: (values: ContentFormValues) => void;
  onCancel: () => void;
}

const ContentForm: React.FC<ContentFormProps> = ({ onSubmit, onCancel }) => {
  const [selectedContentType, setSelectedContentType] = React.useState<ContentType>('text');
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      title: "",
      teaser: "",
      price: "0",
      content: "",
      contentType: 'text',
      expiry: ""
    }
  });
  
  // Update contentType field when selector changes
  React.useEffect(() => {
    form.setValue('contentType', selectedContentType);
  }, [selectedContentType, form]);
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
        <FormField 
          control={form.control} 
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
        
        <FormField 
          control={form.control} 
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
        
        <FormField 
          control={form.control} 
          name="price" 
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4" /> Unlock Price
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    placeholder="5.00" 
                    className="pl-8 bg-white/5 border-white/10 text-white h-10" 
                    {...field} 
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                </div>
              </FormControl>
              <FormDescription className="text-gray-400 text-xs">
                Set to 0 for free content
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} 
        />
        
        <div className="space-y-3">
          <h3 className="text-base font-medium flex items-center gap-2">
            <Lock className="h-4 w-4" /> Locked Content
          </h3>
          
          <Tabs 
            defaultValue="text" 
            value={selectedContentType} 
            onValueChange={(value) => setSelectedContentType(value as ContentType)} 
            className="w-full"
          >
            <ContentTypeSelector 
              selectedContentType={selectedContentType}
              onValueChange={(value) => setSelectedContentType(value)}
            />
            
            <ContentUploader 
              selectedContentType={selectedContentType}
              control={form.control}
            />
          </Tabs>
        </div>
        
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
                control={form.control} 
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
        
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel} 
            className="border-gray-700 hover:border-gray-600 text-gray-300 h-9 order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-emerald-500 hover:bg-emerald-600 text-white h-9 order-1 sm:order-2"
          >
            Create Content
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContentForm;
