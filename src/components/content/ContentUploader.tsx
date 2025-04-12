
import React, { useRef } from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { FormField, FormItem, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ContentType } from './ContentTypeSelector';
import { Image, FileVideo, FileAudio, FileText, Upload } from 'lucide-react';
import { Control } from 'react-hook-form';
import { ContentFormValues } from './ContentForm';
import { Button } from "@/components/ui/button";

interface ContentUploaderProps {
  selectedContentType: ContentType;
  control: Control<ContentFormValues>;
}

const ContentUploader: React.FC<ContentUploaderProps> = ({ 
  selectedContentType,
  control
}) => {
  // Create refs for the file inputs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  
  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, contentType: ContentType) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(`Selected ${contentType} file:`, file);
      // Here you would typically handle the file, e.g., upload it to a server
      // and then update the form with the file URL or ID
    }
  };
  
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
        <div 
          className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/20 rounded-md cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => imageInputRef.current?.click()}
        >
          <input
            type="file"
            ref={imageInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'image')}
          />
          <Image className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-gray-400 text-xs text-center px-2">
            Drag & drop image or <span className="text-emerald-500">browse</span>
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="mt-2 h-8 text-xs border-white/10 bg-white/5 hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              imageInputRef.current?.click();
            }}
          >
            <Upload className="h-3.5 w-3.5 mr-1" />
            Choose Image
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="video" className="p-3 bg-white/5 border border-white/10 rounded-md">
        <div 
          className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/20 rounded-md cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => videoInputRef.current?.click()}
        >
          <input
            type="file"
            ref={videoInputRef}
            className="hidden"
            accept="video/*"
            onChange={(e) => handleFileChange(e, 'video')}
          />
          <FileVideo className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-gray-400 text-xs text-center px-2">
            Drag & drop video or <span className="text-emerald-500">browse</span>
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="mt-2 h-8 text-xs border-white/10 bg-white/5 hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              videoInputRef.current?.click();
            }}
          >
            <Upload className="h-3.5 w-3.5 mr-1" />
            Choose Video
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="audio" className="p-3 bg-white/5 border border-white/10 rounded-md">
        <div 
          className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/20 rounded-md cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => audioInputRef.current?.click()}
        >
          <input
            type="file"
            ref={audioInputRef}
            className="hidden"
            accept="audio/*"
            onChange={(e) => handleFileChange(e, 'audio')}
          />
          <FileAudio className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-gray-400 text-xs text-center px-2">
            Drag & drop audio or <span className="text-emerald-500">browse</span>
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="mt-2 h-8 text-xs border-white/10 bg-white/5 hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              audioInputRef.current?.click();
            }}
          >
            <Upload className="h-3.5 w-3.5 mr-1" />
            Choose Audio
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="document" className="p-3 bg-white/5 border border-white/10 rounded-md">
        <div 
          className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/20 rounded-md cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => documentInputRef.current?.click()}
        >
          <input
            type="file"
            ref={documentInputRef}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) => handleFileChange(e, 'document')}
          />
          <FileText className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-gray-400 text-xs text-center px-2">
            Drag & drop document or <span className="text-emerald-500">browse</span>
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="mt-2 h-8 text-xs border-white/10 bg-white/5 hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              documentInputRef.current?.click();
            }}
          >
            <Upload className="h-3.5 w-3.5 mr-1" />
            Choose Document
          </Button>
        </div>
      </TabsContent>
    </div>
  );
};

export default ContentUploader;
