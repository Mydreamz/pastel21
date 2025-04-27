
import React from 'react';
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
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

  const supportedFormats = {
    image: 'JPG, PNG, GIF, WebP, SVG',
    video: 'MP4, WebM, OGG',
    audio: 'MP3, WAV, OGG',
    document: 'PDF, DOC, DOCX, TXT, XLS, XLSX'
  };

  return (
    <div className="space-y-4">
      {setSelectedFile && (
        <>
          <FormField
            control={form.control}
            name="file"
            render={() => (
              <FormItem>
                <FormLabel className="text-gray-400 text-sm">
                  Upload {type} ({supportedFormats[type]})
                </FormLabel>
                <FormControl>
                  <FileUpload
                    type={type}
                    value={selectedFile}
                    onChange={(file) => {
                      setSelectedFile(file);
                      if (file) {
                        form.setValue("file", file);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
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
