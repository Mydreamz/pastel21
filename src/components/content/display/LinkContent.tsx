
import React from 'react';

interface LinkContentProps {
  content?: string;
}

const LinkContent = ({ content }: LinkContentProps) => {
  if (!content) return null;
  
  return (
    <div className="bg-cream-50/70 p-4 rounded-xl shadow-neumorphic hover:shadow-neumorphic-lg transition-all duration-300">
      <a 
        href={content} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-primary hover:text-primary/80 hover:underline break-all transition-colors duration-200"
      >
        {content}
      </a>
    </div>
  );
};

export default LinkContent;
