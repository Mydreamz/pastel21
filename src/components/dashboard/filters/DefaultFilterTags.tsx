
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { DollarSign } from 'lucide-react';

export const defaultTags = [
  { name: 'Free', color: 'green', icon: null },
  { name: 'Paid', color: 'emerald', icon: DollarSign },
];

interface DefaultFilterTagsProps {
  activeFilters: string[];
  onToggleFilter: (tag: string) => void;
}

const DefaultFilterTags: React.FC<DefaultFilterTagsProps> = ({ 
  activeFilters, 
  onToggleFilter 
}) => {
  return (
    <>
      {defaultTags.map((tag) => {
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
            onClick={() => onToggleFilter(tag.name)}
          >
            {IconComponent && <IconComponent className="h-3 w-3 mr-1" />}
            {tag.name}
          </Badge>
        );
      })}
    </>
  );
};

export default DefaultFilterTags;
