
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import MediaContentForm from '../content-forms/MediaContentForm';
import { UseFormReturn } from 'react-hook-form';
import { ContentFormValues } from '@/types/content';

type MediaContentTabProps = {
  form: UseFormReturn<ContentFormValues>;
  type: 'image' | 'video' | 'audio' | 'document';
  selectedFile: File | null | undefined;
  setSelectedFile: ((file: File | null) => void) | undefined;
};

const MediaContentTab = ({ form, type, selectedFile, setSelectedFile }: MediaContentTabProps) => {
  return (
    <TabsContent value={type} className="p-4 bg-white/90 border border-gray-200 rounded-md">
      <MediaContentForm 
        form={form} 
        type={type} 
        selectedFile={selectedFile} 
        setSelectedFile={setSelectedFile} 
      />
    </TabsContent>
  );
};

export default MediaContentTab;
