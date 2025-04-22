
import React from 'react';
import { FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { UseFormReturn } from 'react-hook-form';
import { ContentFormValues } from '@/types/content';

type MediaContentFormProps = {
  form: UseFormReturn<ContentFormValues>;
  type: 'image' | 'video' | 'audio' | 'document';
  selectedFile: File | null | undefined;
  setSelectedFile: ((file: File | null) => void) | undefined;
};

const MediaContentForm = ({ form, type, selectedFile, setSelectedFile }: MediaContentFormProps) => {
  const descriptionLabels = {
    image: 'Image caption/description',
    video: 'Video title/description',
    audio: 'Audio title/description',
    document: 'Document description'
  };

  return (
    <div className="space-y-4">
      {setSelectedFile && (
        <FileUpload
          type={type}
          value={selectedFile}
          onChange={(file) => {
            setSelectedFile(file);
            // If a description field should be updated based on file name, add that logic here
          }}
        />
      )}
      
      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-400 text-sm">
              {descriptionLabels[type]} (optional)
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder={`Add a description for your ${type}...`}
                className="bg-white/5 border-white/10 text-white h-16"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default MediaContentForm;
