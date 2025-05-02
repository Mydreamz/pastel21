
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowUp } from 'lucide-react';

export const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('scroll', toggleVisibility);
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'auto' // Changed from 'smooth' to 'auto' to remove animation
    });
  };
  
  return (
    <div className={`fixed bottom-4 right-4 z-50 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <Button 
        onClick={scrollToTop} 
        size="icon" 
        className="p-2 rounded-full shadow-lg bg-pastel-600 hover:bg-pastel-500"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </div>
  );
};
