
import React, { useRef } from 'react';
import ContentDisplay from './ContentDisplay';
import ContentReadingProgress from './ContentReadingProgress';

interface ContentViewWrapperProps {
  content: any;
  isCreator: boolean;
  canViewContent: boolean;
  secureFileUrl?: string;
  secureFileLoading?: boolean;
  secureFileError?: string;
}

const ContentViewWrapper = ({ 
  content, 
  isCreator, 
  canViewContent,
  secureFileUrl,
  secureFileLoading,
  secureFileError
}: ContentViewWrapperProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  if (!canViewContent) return null;
  
  return (
    <>
      <div ref={contentRef} className="overflow-auto max-h-[600px]">
        <ContentDisplay 
          content={content} 
          isCreator={isCreator} 
          isPurchased={canViewContent}
          secureFileUrl={secureFileUrl}
          secureFileLoading={secureFileLoading}
          secureFileError={secureFileError}
        />
      </div>

      {content.contentType === 'text' && (
        <ContentReadingProgress contentRef={contentRef} />
      )}
    </>
  );
};

export default ContentViewWrapper;
