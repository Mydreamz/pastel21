
import React from 'react';
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { Lock } from 'lucide-react';
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
  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-medium text-gray-300">
        <Lock className="h-4 w-4" /> Locked Content
      </h3>
      
      <Tabs defaultValue="text" value={selectedContentType} onValueChange={setSelectedContentType} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-1 bg-black/40 rounded-lg p-1 border border-white/10">
          {contentTypes.map(type => (
            <ContentTypeTab key={type.id} contentType={type} />
          ))}
        </TabsList>
        
        <div className="mt-4">
          <TabsContent value="text" className="p-0 m-0">
            <TextContentForm form={form} />
          </TabsContent>
          
          <TabsContent value="link" className="p-0 m-0">
            <LinkContentForm form={form} />
          </TabsContent>
          
          {['image', 'video', 'audio', 'document'].map(type => (
            <TabsContent key={type} value={type} className="p-0 m-0">
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
