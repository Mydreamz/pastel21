
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
    <TextContentForm form={form} />
  );
};

export default TextContentTab;
