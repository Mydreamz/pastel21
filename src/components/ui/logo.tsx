
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
}

const Logo = ({ size = 'md', withText = false }: LogoProps) => {
  const sizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-12 w-12',
  };
  
  return (
    <div className="flex items-center">
      <div className={`flex items-center justify-center ${sizeClasses[size]} rounded-full bg-emerald-500 overflow-hidden`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-full h-full">
          <path d="M170 160H220V352H290V160H340V352H290V160" stroke="#111111" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M170 256H340" stroke="#111111" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      {withText && (
        <span className="ml-2 text-2xl font-bold text-white">
          Monitize<span className="text-emerald-500">.club</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
