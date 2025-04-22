
import React from 'react';
import { TabsTrigger } from "@/components/ui/tabs";
import { ContentType } from '@/config/contentTypes';

type ContentTypeTabProps = {
  contentType: ContentType;
};

const ContentTypeTab = ({ contentType }: ContentTypeTabProps) => {
  const Icon = contentType.icon;
  
  return (
    <TabsTrigger value={contentType.id} className="m-1\\n bottom-12">
      <Icon className="h-4 w-4 mr-1 flex-shrink-0" />
      <span className="truncate">{contentType.label}</span>
    </TabsTrigger>
  );
};

export default ContentTypeTab;
