
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
    <div className="relative flex flex-col items-start gap-8 py-12 md:py-16 lg:py-20 w-full max-w-4xl">
      <div className="flex flex-col gap-8 animate-fade-in">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
          Create, Share, and <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Monetize</span> Your Content
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-[640px] leading-relaxed">
          All-in-one platform for creators to build, grow, and monetize their audience with powerful insights and analytics.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button 
            size="lg"
            className="smooth-bounce font-semibold"
            onClick={handleGetStarted}
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="font-semibold"
            onClick={handleTutorialOpen}
          >
            See How It Works
          </Button>
        </div>

        <div className="mt-8">
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
