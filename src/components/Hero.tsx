
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import UserCountBadge from './UserCountBadge';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import TutorialDialog from './Tutorial/TutorialDialog';
import TutorialDrawer from './Tutorial/TutorialDrawer';
import { TextRevealCard, TextRevealCardTitle, TextRevealCardDescription } from "@/components/ui/text-reveal-card";

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
      <div className="flex flex-col gap-6 max-w-3xl">
        <div className="space-y-4">
          <TextRevealCard
            text="Create, Share, and Monetize Your Content"
            revealText="Build Your Creator Empire"
            className="border-0 bg-transparent p-0"
          >
            <TextRevealCardTitle className="text-foreground text-lg mb-2">
              The all-in-one platform for creators
            </TextRevealCardTitle>
            <TextRevealCardDescription className="text-muted-foreground">
              Build, grow, and monetize your audience with powerful insights and analytics.
            </TextRevealCardDescription>
          </TextRevealCard>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            Join thousands of creators who are earning more with our platform.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3"
            onClick={handleGetStarted}
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="border-border hover:border-primary hover:bg-primary/10 text-foreground px-8 py-3 transition-all duration-200"
            onClick={handleTutorialOpen}
          >
            See How It Works
          </Button>
        </div>

        <div className="pt-4">
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
