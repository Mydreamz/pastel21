
import React from 'react';
import { TabsTrigger } from "@/components/ui/tabs";
import { ContentType } from '@/config/contentTypes';

type ContentTypeTabProps = {
  contentType: ContentType;
};

const ContentTypeTab = ({ contentType }: ContentTypeTabProps) => {
  const Icon = contentType.icon;
  
  return (
    <TabsTrigger 
      value={contentType.id} 
      className="flex items-center justify-center gap-1 px-2 py-1.5"
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span className="hidden md:inline truncate">{contentType.label}</span>
    </TabsTrigger>
  );
};

export default ContentTypeTab;
