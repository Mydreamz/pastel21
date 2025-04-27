
import React, { useState, useEffect } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";  // Add this import
import { Filter, Plus, Tag } from 'lucide-react';
import DefaultFilterTags, { defaultTags } from './filters/DefaultFilterTags';
import CustomTagCreator from './filters/CustomTagCreator';

interface ContentFiltersProps {
  onFilter: (filters: string[]) => void;
}

const ContentFilters: React.FC<ContentFiltersProps> = ({ onFilter }) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState<Array<{name: string, color: string, icon?: React.ComponentType}>>([]);
  
  // Load saved custom tags from localStorage on mount
  useEffect(() => {
    const savedTags = localStorage.getItem('customTags');
    if (savedTags) {
      setCustomTags(JSON.parse(savedTags));
    }
  }, []);
  
  // Save custom tags to localStorage when they change
  useEffect(() => {
    localStorage.setItem('customTags', JSON.stringify(customTags));
  }, [customTags]);
  
  // Combined tags (default + custom)
  const allTags = [...defaultTags, ...customTags];
  
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
  
  const handleAddCustomTag = (name: string, color: string) => {
    // Check if tag name already exists
    if (allTags.some(tag => tag.name.toLowerCase() === name.toLowerCase())) {
      return; // Don't add duplicate tags
    }
    
    setCustomTags(prev => [...prev, { name, color }]);
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
        
        {customTags.map((tag) => (
          <Badge
            key={tag.name}
            variant="outline"
            className={`cursor-pointer border-${tag.color}-500/30 flex items-center ${
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
      
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="border-dashed border-gray-500 bg-transparent text-gray-400"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            <Tag className="h-3.5 w-3.5 mr-1" />
            Custom Tag
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-gray-900 border-white/10 text-white">
          <CustomTagCreator 
            customTags={customTags}
            onAddTag={handleAddCustomTag}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ContentFilters;
