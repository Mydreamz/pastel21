
import React from 'react';
import { Content } from '@/types/content';
import MediaContent from './display/MediaContent';
import TextContent from './display/TextContent';
import LinkContent from './display/LinkContent';
import ContentTags from './display/ContentTags';
import ContentStats from './display/ContentStats';
import ContentHeader from './display/ContentHeader';

interface ContentDisplayProps {
  content: Content;
  isCreator: boolean;
  isPurchased: boolean;
  secureFileUrl?: string | null;
  secureFileLoading?: boolean;
  secureFileError?: string | null;
}

const ContentDisplay = ({ 
  content, 
  isCreator, 
  isPurchased, 
  secureFileUrl,
  secureFileLoading,
  secureFileError
}: ContentDisplayProps) => {
  // Early return if content is not available
  if (!content) return null;

  // For paid content, only show if user is creator or has purchased
  const isPaidContent = parseFloat(content.price) > 0;
  const canAccessContent = isCreator || isPurchased || !isPaidContent;
  
  if (isPaidContent && !canAccessContent) {
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-semibold mb-4">Premium Content</h3>
        <p className="text-gray-400 mb-6">Please purchase this content to view it.</p>
      </div>
    );
  }

  // Determine which file URL to use (secure URL takes precedence)
  const displayFileUrl = secureFileUrl || content.fileUrl;
  
  // Check if file URL is valid (not a blob URL)
  const isValidFileUrl = displayFileUrl && 
    (displayFileUrl.startsWith('http') || displayFileUrl.startsWith('/'));
  
  const isMediaContent = ['image', 'video', 'audio', 'document'].includes(content.contentType || '');

  return (
    <div className="mt-8 border-t border-gray-200 pt-8">
      <ContentHeader 
        isCreator={isCreator}
        isPurchased={isPurchased}
        price={content.price}
      />
      
      <ContentTags 
        tags={content.tags}
        category={content.category}
      />
      
      {content.contentType === 'text' && (
        <TextContent content={content.content} />
      )}
      
      {content.contentType === 'link' && (
        <LinkContent content={content.content} />
      )}
      
      {isMediaContent && (
        <div className="mt-4">
          <MediaContent
            contentType={content.contentType}
            displayFileUrl={displayFileUrl}
            isValidFileUrl={isValidFileUrl}
            canAccessMedia={canAccessContent}
            secureFileLoading={secureFileLoading}
            secureFileError={secureFileError}
            title={content.title}
            fileType={content.fileType}
            fileName={content.fileName}
            isCreator={isCreator}
          />
        </div>
      )}
      
      <ContentStats 
        views={content.views}
        contentType={content.contentType}
        contentLength={content.content?.length}
      />
    </div>
  );
};

export default ContentDisplay;
