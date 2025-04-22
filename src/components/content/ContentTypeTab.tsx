
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
      className="flex flex-col items-center justify-center gap-1 px-2 py-2 relative min-h-[60px] md:min-h-[40px] md:flex-row"
    >
      <Icon className="h-5 w-5 md:h-4 md:w-4 flex-shrink-0" />
      <span className="text-[11px] md:text-sm font-medium">
        {contentType.label}
      </span>
    </TabsTrigger>
  );
};

export default ContentTypeTab;

