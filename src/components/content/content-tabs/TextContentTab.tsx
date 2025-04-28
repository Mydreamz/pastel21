
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
    <TabsContent value="text" className="p-4 bg-white/5 border border-white/10 rounded-md top-10">
      <TextContentForm form={form} />
    </TabsContent>
  );
};

export default TextContentTab;
