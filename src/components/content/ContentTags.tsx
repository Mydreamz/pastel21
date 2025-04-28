
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ContentTagsProps {
  tags?: string[];
  categories?: string[];
  className?: string;
}

const ContentTags: React.FC<ContentTagsProps> = ({ 
  tags = [], 
  categories = [], 
  className = ""
}) => {
  const navigate = useNavigate();

  const handleTagClick = (tag: string) => {
    navigate(`/search?q=${encodeURIComponent(tag)}`);
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {categories.map((category) => (
        <Badge 
          key={`category-${category}`}
          variant="outline" 
          className="bg-purple-500/20 text-purple-300 border-purple-500/30 cursor-pointer hover:bg-purple-500/30"
          onClick={() => handleTagClick(category)}
        >
          <Tag className="h-3 w-3 mr-1" />
          {category}
        </Badge>
      ))}
      
      {tags.map((tag) => (
        <Badge 
          key={`tag-${tag}`}
          variant="outline" 
          className="bg-white/5 hover:bg-white/10 cursor-pointer border-white/10"
          onClick={() => handleTagClick(tag)}
        >
          <Tag className="h-3 w-3 mr-1" />
          {tag}
        </Badge>
      ))}
    </div>
  );
};

export default ContentTags;
