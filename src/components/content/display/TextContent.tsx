
import React from 'react';

interface TextContentProps {
  content?: string;
}

const TextContent = ({ content }: TextContentProps) => {
  if (!content) return null;
  
  return (
    <div className="prose max-w-none text-foreground">
      <p>{content}</p>
    </div>
  );
};

export default TextContent;
