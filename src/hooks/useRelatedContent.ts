
import { useState, useEffect, useCallback } from 'react';

export const useRelatedContent = (content: any, contentId: string) => {
  const [relatedContents, setRelatedContents] = useState<any[]>([]);

  // Memoize the filter function to improve performance
  const filterRelatedContent = useCallback((allContents: any[], content: any, contentId: string) => {
    if (!content || !contentId) return [];
    
    return allContents
      .filter((item: any) => 
        item.id !== contentId && 
        (item.creatorId === content.creatorId || 
         item.contentType === content.contentType)
      )
      .slice(0, 3);
  }, []);

  useEffect(() => {
    if (content) {
      try {
        const contents = JSON.parse(localStorage.getItem('contents') || '[]');
        const related = filterRelatedContent(contents, content, contentId);
        setRelatedContents(related);
      } catch (e) {
        console.error("Error loading related content", e);
      }
    }
  }, [content, contentId, filterRelatedContent]);

  return relatedContents;
};
