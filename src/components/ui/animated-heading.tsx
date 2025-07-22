
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedHeadingProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'gradient' | 'stagger';
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const AnimatedHeading = ({ 
  children, 
  className, 
  variant = 'gradient',
  level = 1 
}: AnimatedHeadingProps) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  const baseClasses = cn(
    'font-display font-medium transition-all duration-300',
    {
      'text-60 md:text-60 lg:text-60 font-semibold': level === 1,
      'text-5xl md:text-5xl lg:text-60 font-semibold': level === 2,
      'text-4xl md:text-5xl font-semibold': level === 3,
      'text-3xl md:text-4xl font-medium': level === 4,
      'text-2xl md:text-3xl font-medium': level === 5,
      'text-xl md:text-2xl font-medium': level === 6,
    }
  );

  if (variant === 'stagger' && typeof children === 'string') {
    return (
      <Tag className={cn(baseClasses, 'heading-stagger', className)}>
        {children.split('').map((char, index) => (
          <span key={index}>{char === ' ' ? '\u00A0' : char}</span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag className={cn(baseClasses, 'heading-animate', className)}>
      {children}
    </Tag>
  );
};

export default AnimatedHeading;
