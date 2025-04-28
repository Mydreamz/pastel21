
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Check } from 'lucide-react';

interface CustomTagCreatorProps {
  customTags: Array<{name: string, color: string}>;
  onAddTag: (name: string, color: string) => void;
}

const tagColors = [
  'blue', 'purple', 'red', 'green', 'yellow', 
  'indigo', 'pink', 'emerald', 'amber', 'cyan'
];

const CustomTagCreator: React.FC<CustomTagCreatorProps> = ({ customTags, onAddTag }) => {
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState('blue');
  
  const handleAddTag = () => {
    if (newTagName.trim() === '') return;
    onAddTag(newTagName.trim(), selectedColor);
    setNewTagName('');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter tag name"
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
        <h5 className="text-sm text-gray-400 mb-2">Select Color</h5>
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
    </div>
  );
};

export default CustomTagCreator;
