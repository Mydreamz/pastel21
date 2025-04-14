
import React, { useState } from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Image } from 'lucide-react';
import { Control } from 'react-hook-form';
import { ContentFormValues } from '../form/ContentFormProvider';
import FileUploadArea from './FileUploadArea';
import FilePreview from './FilePreview';
import { toast } from 'sonner';

interface ImageUploaderProps {
  control: Control<ContentFormValues>;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ control }) => {
  const [uploadedFile, setUploadedFile] = useState<File | undefined>(undefined);
  
  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    
    // Update the form with file info (in a real app, you'd upload to storage and get a URL)
    const fileInfo = `[FILE] ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    control._formValues['content'] = fileInfo;
    
    toast.success(`Image file selected: ${file.name}`);
  };
  
  return (
    <TabsContent value="image" className="p-3 bg-white/5 border border-white/10 rounded-md">
      <FileUploadArea
        icon={<Image className="h-8 w-8 text-gray-400 mb-2" />}
        fileType="image"
        accept="image/*"
        onFileSelect={handleFileSelect}
      />
      <FilePreview file={uploadedFile} />
    </TabsContent>
  );
};

export default ImageUploader;
