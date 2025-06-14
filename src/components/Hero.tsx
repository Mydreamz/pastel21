
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
    <div className="relative flex flex-col items-start gap-6 py-10 md:py-12 lg:py-16 w-full">
      <div className="flex flex-col gap-6 animate-fade-in">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          Create, Share, and <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Monetize</span> Your Content
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-[600px]">
          All-in-one platform for creators to build, grow, and monetize their audience with powerful insights and analytics.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button 
            size="lg"
            className="smooth-bounce"
            onClick={handleGetStarted}
          >
            Get Started Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={handleTutorialOpen}
          >
            See How It Works
          </Button>
        </div>

        <div className="mt-6">
          <UserCountBadge count={5200} />
        </div>
      </div>
      
      {isMobile ? (
        <TutorialDrawer isOpen={showTutorial} onClose={handleTutorialClose} />
      ) : (
        <TutorialDialog isOpen={showTutorial} onClose={handleTutorialClose} />
      )}
    </div>
  );
};

export default Hero;
