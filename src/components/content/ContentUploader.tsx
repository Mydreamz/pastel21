
import React, { useRef, useState } from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { FormField, FormItem, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ContentType } from './ContentTypeSelector';
import { Image, FileVideo, FileAudio, FileText, Upload, CheckCircle } from 'lucide-react';
import { Control } from 'react-hook-form';
import { ContentFormValues } from './form/ContentFormProvider';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

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
  
  // State to track uploaded files
  const [uploadedFiles, setUploadedFiles] = useState<{
    image?: File;
    video?: File;
    audio?: File;
    document?: File;
  }>({});
  
  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, contentType: ContentType) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(`Selected ${contentType} file:`, file);

      // Update the form with file info (in a real app, you'd upload to storage and get a URL)
      setUploadedFiles(prev => ({ ...prev, [contentType]: file }));
      
      // In a real app with a backend, you would:
      // 1. Upload the file to storage (e.g., Supabase Storage, AWS S3)
      // 2. Get back a URL
      // 3. Set that URL in the form
      
      // For now, we'll just update the form with the file name as a placeholder
      const fileInfo = `[FILE] ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
      setFieldValue('content', fileInfo, control);
      
      toast.success(`${contentType} file selected: ${file.name}`);
    }
  };

  // Helper to set field value programmatically
  const setFieldValue = (
    name: keyof ContentFormValues, 
    value: string, 
    control: Control<ContentFormValues>
  ) => {
    control._formValues[name] = value;
    // This is a simple approach - in a real app with a backend, you'd use setValue from react-hook-form
  };
  
  // Render preview for uploaded files
  const renderFilePreview = (contentType: ContentType) => {
    const file = uploadedFiles[contentType as keyof typeof uploadedFiles];
    
    if (!file) return null;
    
    return (
      <div className="mt-2 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-md flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-emerald-500" />
        <span className="text-sm text-emerald-300 truncate">{file.name}</span>
        <span className="text-xs text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
      </div>
    );
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
        {renderFilePreview('image')}
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
        {renderFilePreview('video')}
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
        {renderFilePreview('audio')}
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
        {renderFilePreview('document')}
      </TabsContent>
    </div>
  );
};

export default ContentUploader;
