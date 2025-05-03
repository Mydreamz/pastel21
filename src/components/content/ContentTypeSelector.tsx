
import React from 'react';
import { Tabs } from "@/components/ui/tabs";
import { Lock } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ContentFormValues } from '@/types/content';
import ContentTypeTabs from './content-tabs/ContentTypeTabs';
import TextContentTab from './content-tabs/TextContentTab';
import LinkContentTab from './content-tabs/LinkContentTab';
import MediaContentTab from './content-tabs/MediaContentTab';
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  return (
    <div className={`${isMobile ? 'p-2.5' : 'p-4'} rounded-lg border border-pastel-200 bg-pastel-50/80 shadow-sm`}>
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <Lock className="h-4 w-4 text-pastel-500" /> Locked Content
        </h3>
        <Separator className="flex-1 bg-pastel-300" />
      </div>
      
      <Tabs defaultValue="text" value={selectedContentType} onValueChange={setSelectedContentType} className="w-full">
        <ContentTypeTabs />
        
        <div className={`mt-2 ${isMobile ? 'p-2.5' : 'p-4'} border border-pastel-200 rounded-md bg-white/90`}>
          {selectedContentType === 'text' && <TextContentTab form={form} />}
          {selectedContentType === 'link' && <LinkContentTab form={form} />}
          
          {['image', 'video', 'audio', 'document'].includes(selectedContentType) && (
            <MediaContentTab 
              key={selectedContentType} 
              form={form} 
              type={selectedContentType as 'image' | 'video' | 'audio' | 'document'} 
              selectedFile={selectedFile} 
              setSelectedFile={setSelectedFile} 
            />
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default ContentTypeSelector;
