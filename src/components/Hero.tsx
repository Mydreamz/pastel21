
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import UserCountBadge from './UserCountBadge';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import TutorialDialog from './Tutorial/TutorialDialog';
import TutorialDrawer from './Tutorial/TutorialDrawer';

interface HeroProps {
  openAuthDialog?: (tab: 'login' | 'signup') => void;
}

const Hero = ({ openAuthDialog }: HeroProps) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [showTutorial, setShowTutorial] = useState(false);
  
  const handleGetStarted = () => {
    if (user) {
      window.location.href = '/dashboard';
    } else if (openAuthDialog) {
      openAuthDialog('signup');
    }
  };

  const handleTutorialOpen = () => {
    setShowTutorial(true);
  };

  const handleTutorialClose = () => {
    setShowTutorial(false);
  };
  
  return (
    <div className="relative flex flex-col items-start gap-6 py-10 md:py-12 lg:py-16 w-full max-w-screen-xl mx-auto px-4 md:px-6">
      <div className="flex flex-col gap-3 max-w-[720px]">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-800">
          Create, Share, and <span className="text-gradient-pastel">Monetize</span> Your Content
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 max-w-[600px]">
          All-in-one platform for creators to build, grow, and monetize their audience with powerful insights and analytics.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button 
            className="bg-pastel-500 hover:bg-pastel-600 text-white rounded-full px-6 h-12 text-base font-medium"
            onClick={handleGetStarted}
          >
            Get Started Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            className="border-gray-400 hover:border-pastel-500 hover:bg-pastel-500/10 text-gray-700 rounded-full px-6 h-12 text-base font-medium"
            onClick={handleTutorialOpen}
          >
            See How It Works
          </Button>
        </div>

        <div className="mt-6">
          <UserCountBadge count={5200} />
        </div>
      </div>
      
      {/* Show tutorial in dialog on desktop, drawer on mobile */}
      {isMobile ? (
        <TutorialDrawer isOpen={showTutorial} onClose={handleTutorialClose} />
      ) : (
        <TutorialDialog isOpen={showTutorial} onClose={handleTutorialClose} />
      )}
    </div>
  );
};

export default Hero;
