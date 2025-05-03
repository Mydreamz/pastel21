
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
    <LinkContentForm form={form} />
  );
};

export default LinkContentTab;
