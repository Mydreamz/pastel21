
import React, { useEffect, useState } from 'react';

interface Star {
  id: number;
  size: number;
  top: string;
  left: string;
  animationDuration: string;
  delay: string;
  opacity: string;
}

// Component that creates a background with animated stars
const StarsBackground: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);
  
  useEffect(() => {
    // Create 65 random stars (increased number for better effect)
    const newStars = Array.from({ length: 65 }, (_, i) => {
      const size = Math.random() * 2.5 + 1; // Random size between 1-3.5px
      const top = `${Math.random() * 100}%`;
      const left = `${Math.random() * 100}%`;
      const animationDuration = `${Math.random() * 8 + 5}s`; // Slower animation durations
      const delay = `${Math.random() * 7}s`; // Random delay between 0-7s
      const opacity = `${Math.random() * 0.5 + 0.3}`; // Random opacity between 0.3-0.8
      
      return {
        id: i,
        size,
        top,
        left,
        animationDuration,
        delay,
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
          className="star transition-opacity duration-1000"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            top: star.top,
            left: star.left,
            opacity: star.opacity,
            transition: `opacity ${star.animationDuration} ease-in-out`,
            animationDelay: star.delay,
            boxShadow: `0 0 ${Math.round(star.size * 2)}px rgba(255, 255, 255, 0.8)`,
          }}
        />
      ))}
      
      {/* Add pastel glow effects with smoother transitions */}
      <div className="absolute top-1/4 -left-40 w-80 h-80 bg-glow-pastel rounded-full opacity-40 transition-all duration-3000" style={{transition: 'opacity 5s ease-in-out'}} />
      <div className="absolute top-3/4 -right-40 w-96 h-96 bg-glow-pastel rounded-full opacity-30 transition-all duration-3000" style={{transition: 'opacity 7s ease-in-out, transform 7s ease-in-out', animationDelay: '2s'}} />
      <div className="absolute bottom-0 left-1/3 w-[40rem] h-[40rem] bg-glow-pastel rounded-full opacity-20 transition-all duration-3000" style={{transition: 'opacity 9s ease-in-out, transform 9s ease-in-out', animationDelay: '4s'}} />
    </div>
  );
};

export default StarsBackground;
