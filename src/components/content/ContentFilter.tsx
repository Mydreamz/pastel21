
import React from 'react';
import { Button } from "@/components/ui/button";
import { contentTypes, ContentType } from './ContentTypeSelector';
import { FileText, Image, LinkIcon, FileVideo, FileAudio } from 'lucide-react';

interface ContentFilterProps {
  selectedType: ContentType | 'all';
  onSelectType: (type: ContentType | 'all') => void;
}

const ContentFilter: React.FC<ContentFilterProps> = ({ selectedType, onSelectType }) => {
  const allTypes = [
    { id: 'all', label: 'All', icon: FileText },
    ...contentTypes
  ];
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {allTypes.map(type => {
        const Icon = type.icon;
        return (
          <Button
            key={type.id}
            variant={selectedType === type.id ? "default" : "outline"}
            className={`flex items-center gap-2 h-8 text-xs px-2.5 ${
              selectedType === type.id
                ? "bg-emerald-500 hover:bg-emerald-600" 
                : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
            onClick={() => onSelectType(type.id as ContentType | 'all')}
          >
            <Icon className="h-3.5 w-3.5" />
            {type.label}
          </Button>
        );
      })}
    </div>
  );
};

export default ContentFilter;
