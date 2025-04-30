
import React, { useEffect, useState } from 'react';
import { 
  Trophy, TrendingUp, BookOpen, Smartphone, Calendar, 
  Lock, DollarSign, CheckCircle, Crown, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UseCaseSlide {
  id: number;
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  monetizationIcon: React.FC<{ className?: string }>;
  monetizationText: string;
}

const useAnimationDelay = (totalSlides: number, duration = 3000) => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, duration);
    
    return () => clearInterval(interval);
  }, [totalSlides, duration]);
  
  return activeSlide;
};

export default function UseCaseCarousel() {
  const USE_CASES: UseCaseSlide[] = [
    {
      id: 1,
      title: "Dream11 Teams",
      description: "Monetize your sports expertise with premium team selections",
      icon: (props) => <Trophy {...props} />,
      monetizationIcon: (props) => <DollarSign {...props} />,
      monetizationText: "Buy Now ₹99"
    },
    {
      id: 2,
      title: "Stock Market Analysis",
      description: "Sell valuable market insights to eager investors",
      icon: (props) => <TrendingUp {...props} />,
      monetizationIcon: (props) => <Crown {...props} />,
      monetizationText: "PREMIUM"
    },
    {
      id: 3,
      title: "Online Courses",
      description: "Secure your knowledge behind a paywall",
      icon: (props) => <BookOpen {...props} />,
      monetizationIcon: (props) => <Lock {...props} />,
      monetizationText: "Locked Content"
    },
    {
      id: 4,
      title: "Instagram Reels",
      description: "Turn your video content into a revenue stream",
      icon: (props) => <Smartphone {...props} />,
      monetizationIcon: (props) => <DollarSign {...props} />,
      monetizationText: "₹199"
    },
    {
      id: 5,
      title: "Paid Meeting Links",
      description: "Get paid before granting meeting access",
      icon: (props) => <Calendar {...props} />,
      monetizationIcon: (props) => <CheckCircle {...props} />,
      monetizationText: "Pre-paid Access"
    }
  ];
  
  const activeSlide = useAnimationDelay(USE_CASES.length);
  
  return (
    <div className="w-full p-6 overflow-hidden">
      <div className="relative h-64 w-full">
        {USE_CASES.map((useCase, index) => (
          <div
            key={useCase.id}
            className={cn(
              "absolute inset-0 glass-card p-6 rounded-2xl transition-all duration-700 flex flex-col",
              {
                "translate-x-0 opacity-100": index === activeSlide,
                "translate-x-full opacity-0": index > activeSlide,
                "-translate-x-full opacity-0": index < activeSlide
              }
            )}
            style={{
              transitionTimingFunction: "cubic-bezier(0.4, 0.0, 0.2, 1)"
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 bg-black/20 rounded-xl animate-float">
                <useCase.icon className="text-emerald-500 w-8 h-8" />
              </div>
              
              <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-2 rounded-lg animate-pulse-gentle">
                <useCase.monetizationIcon className="h-4 w-4" />
                <span className="text-sm font-medium">{useCase.monetizationText}</span>
              </div>
            </div>
            
            <div className="mt-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
              <h3 className="text-xl font-bold mb-1">{useCase.title}</h3>
              <p className="text-gray-400 text-sm">{useCase.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
