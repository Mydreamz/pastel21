
import React from 'react';

interface LinkContentProps {
  content?: string;
}

const LinkContent = ({ content }: LinkContentProps) => {
  if (!content) return null;
  
  return (
    <div className="bg-cream-200/50 p-4 rounded-xl shadow-neumorphic">
      <a 
        href={content} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-green-700 hover:underline break-all"
      >
        {content}
      </a>
    </div>
  );
};

export default LinkContent;
