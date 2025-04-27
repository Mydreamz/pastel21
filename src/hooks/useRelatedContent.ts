
import { useState, useEffect } from 'react';

export const useRelatedContent = (content: any, contentId: string) => {
  const [relatedContents, setRelatedContents] = useState<any[]>([]);

  useEffect(() => {
    if (content) {
      try {
        const contents = JSON.parse(localStorage.getItem('contents') || '[]');
        const related = contents
          .filter((item: any) => 
            item.id !== contentId && 
            (item.creatorId === content.creatorId || 
             item.contentType === content.contentType)
          )
          .slice(0, 3);
        setRelatedContents(related);
      } catch (e) {
        console.error("Error loading related content", e);
      }
    }
  }, [content, contentId]);

  return relatedContents;
};
