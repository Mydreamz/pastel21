
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Filter } from 'lucide-react';
import DefaultFilterTags, { defaultTags } from './filters/DefaultFilterTags';

interface ContentFiltersProps {
  onFilter: (filters: string[]) => void;
}

const ContentFilters: React.FC<ContentFiltersProps> = ({ onFilter }) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
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
      
      <div className="flex flex-wrap gap-2">
        <DefaultFilterTags 
          activeFilters={activeFilters} 
          onToggleFilter={toggleFilter} 
        />
      </div>
    </div>
  );
};

export default ContentFilters;
