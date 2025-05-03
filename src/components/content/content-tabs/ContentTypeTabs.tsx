
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
      ${isMobile ? 'grid-cols-2 gap-1 mt-2' : 'grid-cols-3 md:grid-cols-6 gap-1 mt-3'} 
      bg-pastel-100/50
      border 
      border-pastel-200
      p-1 
      rounded-md
    `}>
      {contentTypes.map(type => <ContentTypeTab key={type.id} contentType={type} />)}
    </TabsList>
  );
};

export default ContentTypeTabs;
