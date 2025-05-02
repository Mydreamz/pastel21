
import React, { useEffect, useState } from 'react';

interface Star {
  id: number;
  size: number;
  top: string;
  left: string;
  opacity: string;
}

const StarsBackground: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);
  
  useEffect(() => {
    // Create static stars without animations
    const newStars = Array.from({ length: 65 }, (_, i) => {
      const size = Math.random() * 2.5 + 1;
      const top = `${Math.random() * 100}%`;
      const left = `${Math.random() * 100}%`;
      const opacity = `${Math.random() * 0.5 + 0.3}`;
      
      return {
        id: i,
        size,
        top,
        left,
        opacity,
      };
    });
    
    setStars(newStars);
  }, []);
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            top: star.top,
            left: star.left,
            opacity: star.opacity,
            boxShadow: `0 0 ${Math.round(star.size * 2)}px rgba(255, 255, 255, 0.8)`,
          }}
        />
      ))}
      
      {/* Static background elements without animations */}
      <div className="absolute top-1/4 -left-40 w-80 h-80 bg-glow-pastel rounded-full opacity-40" />
      <div className="absolute top-3/4 -right-40 w-96 h-96 bg-glow-pastel rounded-full opacity-30" />
      <div className="absolute bottom-0 left-1/3 w-[40rem] h-[40rem] bg-glow-pastel rounded-full opacity-20" />
    </div>
  );
};

export default StarsBackground;
