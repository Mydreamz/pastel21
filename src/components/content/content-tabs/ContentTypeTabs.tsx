
import React from 'react';
import { TabsList } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';
import { contentTypes } from '@/config/contentTypes';
import ContentTypeTab from '../ContentTypeTab';

const ContentTypeTabs = () => {
  const isMobile = useIsMobile();
  
  return (
    <TabsList className={`
      grid 
      ${isMobile ? 'grid-cols-3 gap-1' : 'grid-cols-3 md:grid-cols-6 gap-1'} 
      bg-white/5 
      border 
      border-white/10 
      p-1 
      rounded-md
    `}>
      {contentTypes.map(type => <ContentTypeTab key={type.id} contentType={type} />)}
    </TabsList>
  );
};

export default ContentTypeTabs;
