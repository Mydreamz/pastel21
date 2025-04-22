
import React, { useEffect, useState } from 'react';

interface ReadingProgressProps {
  progress?: number;
  elementRef?: React.RefObject<HTMLElement>;
  color?: string;
  height?: number;
}

const ReadingProgress: React.FC<ReadingProgressProps> = ({ 
  progress, 
  elementRef,
  color = 'emerald',
  height = 2
}) => {
  const [scrollProgress, setScrollProgress] = useState(progress || 0);
  
  useEffect(() => {
    // If progress is provided as a prop, use that
    if (progress !== undefined) {
      setScrollProgress(progress);
      return;
    }
    
    // If elementRef is provided, calculate scroll progress
    if (elementRef?.current) {
      const handleScroll = () => {
        const element = elementRef.current;
        if (element) {
          const totalHeight = element.scrollHeight - element.clientHeight;
          const scrollPosition = element.scrollTop;
          
          if (totalHeight > 0) {
            setScrollProgress((scrollPosition / totalHeight) * 100);
          }
        }
      };

      const currentElement = elementRef.current;
      currentElement.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial calculation
      
      return () => {
        if (currentElement) {
          currentElement.removeEventListener('scroll', handleScroll);
        }
      };
    }
    
    // If neither progress nor elementRef is provided, calculate based on window scroll
    else {
      const handleWindowScroll = () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPosition = window.scrollY;
        
        if (totalHeight > 0) {
          setScrollProgress((scrollPosition / totalHeight) * 100);
        }
      };
      
      window.addEventListener('scroll', handleWindowScroll);
      handleWindowScroll(); // Initial calculation
      
      return () => {
        window.removeEventListener('scroll', handleWindowScroll);
      };
    }
  }, [progress, elementRef]);

  return (
    <div className="sticky top-0 z-20 w-full bg-transparent">
      <div 
        className={`bg-${color}-500 transition-all duration-300 ease-out`}
        style={{ 
          width: `${scrollProgress}%`,
          height: `${height}px`
        }}
      />
    </div>
  );
};

export default ReadingProgress;
