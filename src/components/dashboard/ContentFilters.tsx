
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Filter } from 'lucide-react';

interface ContentFiltersProps {
  onFilter: (filters: string[]) => void;
}

const ContentFilters: React.FC<ContentFiltersProps> = ({ onFilter }) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const tags = [
    { name: 'Text', color: 'blue' },
    { name: 'Image', color: 'purple' },
    { name: 'Video', color: 'red' },
    { name: 'Link', color: 'yellow' },
    { name: 'Free', color: 'green' },
    { name: 'Paid', color: 'emerald' },
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
      
      {tags.map((tag) => (
        <Badge
          key={tag.name}
          variant="outline"
          className={`cursor-pointer border-${tag.color}-500/30 ${
            activeFilters.includes(tag.name)
              ? `bg-${tag.color}-500/20 text-${tag.color}-300`
              : 'bg-white/5 text-gray-300'
          }`}
          onClick={() => toggleFilter(tag.name)}
        >
          {tag.name}
        </Badge>
      ))}
    </div>
  );
};

export default ContentFilters;
