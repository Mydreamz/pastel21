
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, LinkIcon, Image, FileVideo, FileAudio } from 'lucide-react';

export type ContentType = 'text' | 'link' | 'image' | 'video' | 'audio' | 'document';

export const contentTypes = [
  { id: 'text', label: 'Text', icon: FileText },
  { id: 'link', label: 'Link', icon: LinkIcon },
  { id: 'image', label: 'Image', icon: Image },
  { id: 'video', label: 'Video', icon: FileVideo },
  { id: 'audio', label: 'Audio', icon: FileAudio },
  { id: 'document', label: 'Document', icon: FileText }
];

interface ContentTypeSelectorProps {
  selectedContentType: ContentType;
  onValueChange: (value: ContentType) => void;
}

const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({ 
  selectedContentType, 
  onValueChange 
}) => {
  return (
    <>
      <TabsList className="grid grid-cols-3 w-full bg-white/5 border border-white/10 p-1 overflow-x-auto flex-nowrap">
        {contentTypes.slice(0, 3).map(type => (
          <TabsTrigger 
            key={type.id} 
            value={type.id} 
            className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white flex items-center justify-center h-9 px-1 text-xs"
          >
            <type.icon className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
            <span className="truncate">{type.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      
      <div className="mt-3 mb-2">
        <TabsList className="grid grid-cols-3 w-full bg-white/5 border border-white/10 p-1 overflow-x-auto flex-nowrap">
          {contentTypes.slice(3).map(type => (
            <TabsTrigger 
              key={type.id} 
              value={type.id} 
              className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white flex items-center justify-center h-9 px-1 text-xs"
            >
              <type.icon className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              <span className="truncate">{type.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </>
  );
};

export default ContentTypeSelector;
