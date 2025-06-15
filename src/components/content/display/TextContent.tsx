
import React from 'react';
import DOMPurify from 'dompurify';

interface TextContentProps {
  content?: string;
}

const TextContent = ({ content }: TextContentProps) => {
  if (!content) return null;
  
  // A simple regex to check for HTML tags.
  const containsHtml = /<[a-z][\s\S]*>/i.test(content);

  if (containsHtml) {
    const sanitizedContent = DOMPurify.sanitize(content);
    return (
      <div 
        className="prose max-w-none text-gray-700 dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    );
  }

  // For plain text, we can just render it. React will escape it.
  // Using whitespace-pre-wrap to respect newlines and spacing.
  return (
    <div className="prose max-w-none text-gray-700 dark:prose-invert">
      <p className="whitespace-pre-wrap">{content}</p>
    </div>
  );
};

export default TextContent;
