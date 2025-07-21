
import React from 'react';
import { Eye, Clock } from 'lucide-react';

interface ContentStatsProps {
  views?: number;
  readingTime?: string;
  contentType: string;
  contentLength?: number;
}

const ContentStats = ({ views, contentType, contentLength = 0 }: ContentStatsProps) => {
  const readingTime = contentType === 'text' 
    ? `${Math.ceil(contentLength / 1000)} min read` 
    : '3 min';
  
  return (
    <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-1">
        <Eye className="h-4 w-4" />
        <span>{views || Math.floor(Math.random() * 100) + 5} views</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock className="h-4 w-4" />
        <span>{readingTime}</span>
      </div>
    </div>
  );
};

export default ContentStats;
