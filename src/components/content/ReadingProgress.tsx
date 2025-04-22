
import React from 'react';

interface ReadingProgressProps {
  progress: number;
}

const ReadingProgress: React.FC<ReadingProgressProps> = ({ progress }) => {
  return (
    <div className="sticky top-0 z-20 w-full bg-transparent">
      <div 
        className="h-1 bg-emerald-500 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ReadingProgress;
