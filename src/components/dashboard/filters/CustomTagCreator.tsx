
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Check, Tag } from 'lucide-react';

interface CustomTagCreatorProps {
  customTags: Array<{name: string, color: string, icon?: React.ComponentType}>;
  onAddTag: (name: string, color: string) => void;
}

// Color options for custom tags
const tagColors = [
  'blue', 'purple', 'red', 'green', 'yellow', 
  'indigo', 'pink', 'emerald', 'amber', 'cyan'
];

const CustomTagCreator: React.FC<CustomTagCreatorProps> = ({ customTags, onAddTag }) => {
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState('blue');
  
  const handleAddTag = () => {
    if (newTagName.trim() === '') return;
    onAddTag(newTagName, selectedColor);
    setNewTagName('');
  };

  return (
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
          onClick={handleAddTag}
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
  );
};

export default CustomTagCreator;
