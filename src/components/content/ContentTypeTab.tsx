
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
      className="text-gray-700 hover:text-primary data-[state=active]:text-primary data-[state=active]:bg-primary/10 flex-col p-2 h-auto min-h-[60px] md:flex-row md:h-10"
    >
      <Icon className="h-4 w-4 md:mr-1 flex-shrink-0 mb-1 md:mb-0" />
      <span className="truncate text-xs md:text-sm leading-tight">{contentType.label}</span>
    </TabsTrigger>
  );
};

export default ContentTypeTab;
