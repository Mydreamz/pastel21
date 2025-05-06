
import React, { useRef } from 'react';
import ContentDisplay from './ContentDisplay';
import ContentReadingProgress from './ContentReadingProgress';

interface ContentViewWrapperProps {
  content: any;
  isCreator: boolean;
  isPurchased: boolean;
  canViewContent: boolean;
  secureFileUrl?: string;
  secureFileLoading?: boolean;
  secureFileError?: string;
}

const ContentViewWrapper = ({ 
  content, 
  isCreator, 
  isPurchased,
  canViewContent,
  secureFileUrl,
  secureFileLoading,
  secureFileError
}: ContentViewWrapperProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  // If content is paid and user has no access, don't render content
  if (!canViewContent) {
    return (
      <div className="mt-8 p-6 border-t border-gray-200 text-center">
        <h3 className="text-xl font-semibold mb-3">Content Locked</h3>
        <p className="text-gray-400 mb-4">
          This content requires purchase to view.
        </p>
      </div>
    );
  }
  
  return (
    <>
      <div ref={contentRef} className="overflow-auto max-h-[600px]">
        <ContentDisplay 
          content={content} 
          isCreator={isCreator} 
          isPurchased={isPurchased || isCreator || parseFloat(content.price) === 0}
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
