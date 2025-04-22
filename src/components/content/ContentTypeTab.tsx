
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
      className="flex items-center justify-center gap-2 px-2 py-1.5 relative min-h-[40px]"
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span className="md:inline truncate text-sm absolute md:static top-[calc(100%+2px)] md:top-auto left-1/2 md:left-auto -translate-x-1/2 md:translate-x-0 whitespace-nowrap bg-background/80 md:bg-transparent px-2 md:px-0 rounded">
        {contentType.label}
      </span>
    </TabsTrigger>
  );
};

export default ContentTypeTab;
