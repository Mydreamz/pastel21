
import { useEffect, useState, RefObject } from 'react';
import ReadingProgress from './ReadingProgress';

interface ContentReadingProgressProps {
  contentRef: RefObject<HTMLDivElement>;
}

const ContentReadingProgress = ({ contentRef }: ContentReadingProgressProps) => {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const element = contentRef.current;
        const totalHeight = element.scrollHeight - element.clientHeight;
        const scrollPosition = element.scrollTop;
        
        if (totalHeight > 0) {
          setReadingProgress((scrollPosition / totalHeight) * 100);
        }
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (contentElement) {
        contentElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [contentRef]);

  return <ReadingProgress progress={readingProgress} />;
};

export default ContentReadingProgress;
