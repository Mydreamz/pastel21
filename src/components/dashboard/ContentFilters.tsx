
import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, FileText, Image, Video, Link as LinkIcon, DollarSign, Tag, Plus, Check } from 'lucide-react';

// Color options for custom tags
const tagColors = [
  'blue', 'purple', 'red', 'green', 'yellow', 
  'indigo', 'pink', 'emerald', 'amber', 'cyan'
];

interface ContentFiltersProps {
  onFilter: (filters: string[]) => void;
}

const ContentFilters: React.FC<ContentFiltersProps> = ({ onFilter }) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState<Array<{name: string, color: string, icon?: React.ComponentType}>>([]);
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState('blue');
  
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
  
  const defaultTags = [
    { name: 'Text', color: 'blue', icon: FileText },
    { name: 'Image', color: 'purple', icon: Image },
    { name: 'Video', color: 'red', icon: Video },
    { name: 'Link', color: 'yellow', icon: LinkIcon },
    { name: 'Free', color: 'green', icon: null },
    { name: 'Paid', color: 'emerald', icon: DollarSign },
  ];
  
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
  
  const addCustomTag = () => {
    if (newTagName.trim() === '') return;
    
    // Check if tag name already exists
    if (allTags.some(tag => tag.name.toLowerCase() === newTagName.toLowerCase())) {
      return; // Don't add duplicate tags
    }
    
    const newTag = {
      name: newTagName.trim(),
      color: selectedColor
    };
    
    setCustomTags([...customTags, newTag]);
    setNewTagName('');
  };
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center text-sm text-gray-400 mr-1">
        <Filter className="h-4 w-4 mr-1" />
        Filter:
      </div>
      
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => {
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
          <div className="space-y-4">
            <h4 className="font-medium">Create Custom Tag</h4>
            <div className="flex gap-2">
              <Input
                placeholder="Tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
              <Button 
                onClick={addCustomTag}
                disabled={newTagName.trim() === ''}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            
            <div>
              <h5 className="text-sm text-gray-400 mb-2">Choose Color</h5>
              <div className="flex flex-wrap gap-2">
                {tagColors.map((color) => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded-full bg-${color}-500 flex items-center justify-center`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <Check className="h-3.5 w-3.5 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {customTags.length > 0 && (
              <div>
                <h5 className="text-sm text-gray-400 mb-2">Your Custom Tags</h5>
                <div className="flex flex-wrap gap-2">
                  {customTags.map((tag) => (
                    <Badge
                      key={tag.name}
                      variant="outline"
                      className={`border-${tag.color}-500/30 bg-${tag.color}-500/20 text-${tag.color}-300`}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ContentFilters;
