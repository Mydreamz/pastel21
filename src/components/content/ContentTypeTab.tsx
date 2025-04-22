
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
      className="flex flex-col items-center justify-center gap-1.5 px-3 py-2 relative min-h-[48px] text-gray-400 data-[state=active]:text-white data-[state=active]:bg-white/10"
    >
      <Icon className="h-4 w-4" />
      <span className="text-xs font-medium">
        {contentType.label}
      </span>
    </TabsTrigger>
  );
};

export default ContentTypeTab;
