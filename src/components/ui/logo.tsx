
import React from 'react';
import { DollarSign } from 'lucide-react';

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

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-7 w-7',
  };
  
  return (
    <div className="flex items-center">
      <div className={`flex items-center justify-center ${sizeClasses[size]} rounded-full bg-emerald-500`}>
        <DollarSign className={`${iconSizes[size]} text-black`} />
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
