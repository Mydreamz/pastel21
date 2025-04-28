
import React from 'react';
import { Tabs } from "@/components/ui/tabs";
import { Lock } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ContentFormValues } from '@/types/content';
import ContentTypeTabs from './content-tabs/ContentTypeTabs';
import TextContentTab from './content-tabs/TextContentTab';
import LinkContentTab from './content-tabs/LinkContentTab';
import MediaContentTab from './content-tabs/MediaContentTab';

type ContentTypeSelectorProps = {
  form: UseFormReturn<ContentFormValues>;
  selectedContentType: string;
  setSelectedContentType: (type: string) => void;
  selectedFile?: File | null;
  setSelectedFile?: (file: File | null) => void;
};

const ContentTypeSelector = ({
  form,
  selectedContentType,
  setSelectedContentType,
  selectedFile,
  setSelectedFile
}: ContentTypeSelectorProps) => {
  return (
    <div className="space-y-6 sm:space-y-6 w-full">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Lock className="h-4 w-4" /> Locked Content
      </h3>
      
      <Tabs defaultValue="text" value={selectedContentType} onValueChange={setSelectedContentType} className="w-full">
        <ContentTypeTabs />
        
        <div className="mt-2 sm:mt-2 space-y-2 top-16">
          <TextContentTab form={form} />
          <LinkContentTab form={form} />
          
          {['image', 'video', 'audio', 'document'].map(type => (
            <MediaContentTab 
              key={type} 
              form={form} 
              type={type as 'image' | 'video' | 'audio' | 'document'} 
              selectedFile={selectedFile} 
              setSelectedFile={setSelectedFile} 
            />
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default ContentTypeSelector;
