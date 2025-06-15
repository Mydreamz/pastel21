
import React from 'react';
import DOMPurify from 'dompurify';

interface TextContentProps {
  content?: string;
}

const TextContent = ({ content }: TextContentProps) => {
  if (!content) return null;
  
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div 
      className="prose max-w-none text-gray-700"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default TextContent;
