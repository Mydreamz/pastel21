
import React, { useEffect, useState } from 'react';

interface Star {
  id: number;
  size: number;
  top: string;
  left: string;
  animationDuration: string;
  delay: string;
}

// Component that creates a background with animated stars
const StarsBackground: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);
  
  useEffect(() => {
    // Create 50 random stars
    const newStars = Array.from({ length: 50 }, (_, i) => {
      const size = Math.random() * 2 + 1; // Random size between 1-3px
      const top = `${Math.random() * 100}%`;
      const left = `${Math.random() * 100}%`;
      const animationDuration = `${Math.random() * 5 + 3}s`; // Random duration between 3-8s
      const delay = `${Math.random() * 5}s`; // Random delay between 0-5s
      
      return {
        id: i,
        size,
        top,
        left,
        animationDuration,
        delay,
      };
    });
    
    setStars(newStars);
  }, []);
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star animate-pulse-gentle"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            top: star.top,
            left: star.left,
            animationDuration: star.animationDuration,
            animationDelay: star.delay,
          }}
        />
      ))}
      
      {/* Add emerald glow effects */}
      <div className="absolute top-1/4 -left-40 w-80 h-80 bg-glow-emerald rounded-full animate-glow opacity-40" />
      <div className="absolute top-3/4 -right-40 w-96 h-96 bg-glow-emerald rounded-full animate-glow opacity-30" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-0 left-1/3 w-[40rem] h-[40rem] bg-glow-emerald rounded-full animate-glow opacity-20" style={{ animationDelay: '4s' }} />
    </div>
  );
};

export default StarsBackground;
