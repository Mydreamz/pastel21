
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
    <div className="flex flex-col justify-center items-start gap-6 py-8 md:py-12 lg:py-16 w-full">
      <div className="flex flex-col gap-4 w-full">
        <h1 className="font-lora text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
          Create, Share, and <span className="text-primary">Monetize</span> Your Content
        </h1>
        
        <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          All-in-one platform for creators to build, grow, and monetize their audience with powerful insights and analytics.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full sm:w-auto">
          <Button 
            className="w-full sm:w-auto h-12 px-8 text-base font-medium"
            onClick={handleGetStarted}
          >
            Get Started Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full sm:w-auto h-12 px-8 text-base font-medium"
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
