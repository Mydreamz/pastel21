
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowUp } from 'lucide-react';

export const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    let scrollTimeout: number;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };
    
    window.addEventListener('scroll', toggleVisibility);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
      <Button 
        onClick={scrollToTop} 
        size="icon" 
        className={`p-2 rounded-full shadow-lg bg-pastel-600 hover:bg-pastel-500 transition-all duration-300 hover:shadow-xl ${isScrolling ? 'opacity-80' : 'opacity-100'}`}
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </div>
  );
};
