
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Filter, FileText, Image, Video, Link as LinkIcon, DollarSign } from 'lucide-react';

interface ContentFiltersProps {
  onFilter: (filters: string[]) => void;
}

const ContentFilters: React.FC<ContentFiltersProps> = ({ onFilter }) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const tags = [
    { name: 'Text', color: 'blue', icon: FileText },
    { name: 'Image', color: 'purple', icon: Image },
    { name: 'Video', color: 'red', icon: Video },
    { name: 'Link', color: 'yellow', icon: LinkIcon },
    { name: 'Free', color: 'green', icon: null },
    { name: 'Paid', color: 'emerald', icon: DollarSign },
  ];
  
  const toggleFilter = (tag: string) => {
    if (activeFilters.includes(tag)) {
      const updatedFilters = activeFilters.filter(f => f !== tag);
      setActiveFilters(updatedFilters);
      onFilter(updatedFilters);
    } else {
      const updatedFilters = [...activeFilters, tag];
      setActiveFilters(updatedFilters);
      onFilter(updatedFilters);
    }
  };
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center text-sm text-gray-400 mr-1">
        <Filter className="h-4 w-4 mr-1" />
        Filter:
      </div>
      
      {tags.map((tag) => {
        const isActive = activeFilters.includes(tag.name);
        const IconComponent = tag.icon;
        
        return (
          <Badge
            key={tag.name}
            variant="outline"
            className={`cursor-pointer border-${tag.color}-500/30 flex items-center ${
              isActive
                ? `bg-${tag.color}-500/20 text-${tag.color}-300`
                : 'bg-white/5 text-gray-300'
            }`}
            onClick={() => toggleFilter(tag.name)}
          >
            {IconComponent && <IconComponent className="h-3 w-3 mr-1" />}
            {tag.name}
          </Badge>
        );
      })}
    </div>
  );
};

export default ContentFilters;
