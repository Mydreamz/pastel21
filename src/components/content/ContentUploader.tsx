
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { FormField, FormItem, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ContentType } from './ContentTypeSelector';
import { Image, FileVideo, FileAudio, FileText } from 'lucide-react';
import { Control } from 'react-hook-form';
import { ContentFormValues } from './ContentForm';

interface ContentUploaderProps {
  selectedContentType: ContentType;
  control: Control<ContentFormValues>;
}

const ContentUploader: React.FC<ContentUploaderProps> = ({ 
  selectedContentType,
  control
}) => {
  return (
    <div className="mt-3">
      <TabsContent value="text" className="p-3 bg-white/5 border border-white/10 rounded-md">
        <FormField 
          control={control} 
          name="content" 
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea 
                  placeholder="Write your premium content here" 
                  className="h-32 bg-white/5 border-white/10 text-white" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />
      </TabsContent>
      
      <TabsContent value="link" className="p-3 bg-white/5 border border-white/10 rounded-md">
        <FormField 
          control={control} 
          name="content" 
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                  placeholder="https://example.com/your-premium-link" 
                  className="bg-white/5 border-white/10 text-white h-10" 
                  {...field} 
                />
              </FormControl>
              <FormDescription className="text-gray-400 text-xs mt-1">
                Enter the URL you want to share with paying users
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} 
        />
      </TabsContent>
      
      <TabsContent value="image" className="p-3 bg-white/5 border border-white/10 rounded-md">
        <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/20 rounded-md">
          <Image className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-gray-400 text-xs text-center px-2">
            Drag & drop image or <span className="text-emerald-500">browse</span>
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="video" className="p-3 bg-white/5 border border-white/10 rounded-md">
        <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/20 rounded-md">
          <FileVideo className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-gray-400 text-xs text-center px-2">
            Drag & drop video or <span className="text-emerald-500">browse</span>
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="audio" className="p-3 bg-white/5 border border-white/10 rounded-md">
        <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/20 rounded-md">
          <FileAudio className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-gray-400 text-xs text-center px-2">
            Drag & drop audio or <span className="text-emerald-500">browse</span>
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="document" className="p-3 bg-white/5 border border-white/10 rounded-md">
        <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/20 rounded-md">
          <FileText className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-gray-400 text-xs text-center px-2">
            Drag & drop document or <span className="text-emerald-500">browse</span>
          </p>
        </div>
      </TabsContent>
    </div>
  );
};

export default ContentUploader;
