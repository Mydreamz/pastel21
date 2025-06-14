
import React from 'react';

interface LinkContentProps {
  content?: string;
}

const LinkContent = ({ content }: LinkContentProps) => {
  if (!content) return null;
  
  return (
    <div className="bg-white/50 p-4 rounded-xl shadow-neumorphic mobile-card">
      <a 
        href={content} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-emerald-700 hover:underline break-all touch-target"
      >
        {content}
      </a>
    </div>
  );
};

export default LinkContent;
