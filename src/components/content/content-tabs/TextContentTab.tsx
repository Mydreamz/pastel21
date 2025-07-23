
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import TextContentForm from '../content-forms/TextContentForm';
import { UseFormReturn } from 'react-hook-form';
import { ContentFormValues } from '@/types/content';

type TextContentTabProps = {
  form: UseFormReturn<ContentFormValues>;
};

const TextContentTab = ({ form }: TextContentTabProps) => {
  return (
    <TabsContent value="text" className="p-4 bg-white/90 border border-gray-200 rounded-md">
      <TextContentForm form={form} />
    </TabsContent>
  );
};

export default TextContentTab;
