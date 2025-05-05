
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Tag } from 'lucide-react';

interface ContentTagsProps {
  tags?: string[];
  category?: string;
}

const ContentTags = ({ tags, category }: ContentTagsProps) => {
  if (!tags?.length && !category) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {category && (
        <Badge 
          variant="outline" 
          className="bg-pastel-500/20 text-pastel-700 border-pastel-500/30 cursor-pointer hover:bg-pastel-500/30 rounded-full"
        >
          <Tag className="h-3 w-3 mr-1" />
          {category}
        </Badge>
      )}
      
      {tags?.map((tag) => (
        <Badge 
          key={`tag-${tag}`}
          variant="outline" 
          className="bg-white/50 hover:bg-white/70 cursor-pointer border-gray-200 text-gray-700 rounded-full"
        >
          <Tag className="h-3 w-3 mr-1" />
          {tag}
        </Badge>
      ))}
    </div>
  );
};

export default ContentTags;
