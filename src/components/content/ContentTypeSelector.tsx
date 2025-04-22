
import React from 'react';
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { Lock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { UseFormReturn } from 'react-hook-form';
import { ContentFormValues } from '@/types/content';
import { contentTypes } from '@/config/contentTypes';
import ContentTypeTab from './ContentTypeTab';
import TextContentForm from './content-forms/TextContentForm';
import LinkContentForm from './content-forms/LinkContentForm';
import MediaContentForm from './content-forms/MediaContentForm';

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
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Lock className="h-4 w-4" /> Locked Content
      </h3>
      
      <Tabs defaultValue="text" value={selectedContentType} onValueChange={setSelectedContentType} className="w-full">
        <TabsList className={`
          grid 
          ${isMobile ? 'grid-cols-3 gap-1.5' : 'grid-cols-3 md:grid-cols-6 gap-2'} 
          bg-black/20 
          border 
          border-white/10 
          p-1.5 
          rounded-lg
          backdrop-blur-sm
          mb-2
        `}>
          {contentTypes.map(type => (
            <ContentTypeTab key={type.id} contentType={type} />
          ))}
        </TabsList>
        
        <div className="mt-4 space-y-4">
          <TabsContent value="text" className="p-6 bg-black/20 border border-white/10 rounded-lg backdrop-blur-sm">
            <TextContentForm form={form} />
          </TabsContent>
          
          <TabsContent value="link" className="p-6 bg-black/20 border border-white/10 rounded-lg backdrop-blur-sm">
            <LinkContentForm form={form} />
          </TabsContent>
          
          {['image', 'video', 'audio', 'document'].map((type) => (
            <TabsContent
              key={type}
              value={type}
              className="p-6 bg-black/20 border border-white/10 rounded-lg backdrop-blur-sm"
            >
              <MediaContentForm
                form={form}
                type={type as 'image' | 'video' | 'audio' | 'document'}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
              />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default ContentTypeSelector;
