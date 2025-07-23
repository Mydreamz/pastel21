
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import LinkContentForm from '../content-forms/LinkContentForm';
import { UseFormReturn } from 'react-hook-form';
import { ContentFormValues } from '@/types/content';

type LinkContentTabProps = {
  form: UseFormReturn<ContentFormValues>;
};

const LinkContentTab = ({ form }: LinkContentTabProps) => {
  return (
    <TabsContent value="link" className="p-4 bg-white/90 border border-gray-200 rounded-md">
      <LinkContentForm form={form} />
    </TabsContent>
  );
};

export default LinkContentTab;
