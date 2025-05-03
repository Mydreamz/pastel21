
import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface TutorialStep {
  title: string;
  description: string;
  image?: string;
  action?: string;
}

const TutorialContent = ({ onClose }: { onClose: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const tutorialSteps: TutorialStep[] = [
    {
      title: "Welcome to Monitize.club!",
      description: "Let's quickly show you how our platform works. We'll guide you through the core features so you can start monetizing your content in minutes.",
      action: "Start Tutorial"
    },
    {
      title: "Create Your First Content",
      description: "Creating content is simple! Choose from text, images, videos, or links. Set your price and publish instantly.",
      action: "Try Creating Content"
    },
    {
      title: "Track Your Analytics",
      description: "See who views and purchases your content with real-time analytics and insights.",
      action: "Explore Analytics"
    },
    {
      title: "Monetize Your Audience",
      description: "Set your prices, get paid directly to your account, and withdraw your earnings easily.",
      action: "Set Up Payments"
    },
    {
      title: "You're Ready!",
      description: "You now know the basics of Monitize.club. Ready to start creating?",
      action: "Get Started"
    }
  ];

  const handleStepComplete = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
    setCurrentStep(step + 1);
  };

  const handleAction = () => {
    if (currentStep < tutorialSteps.length - 1) {
      handleStepComplete(currentStep);
    } else {
      onClose();
    }
  };

  const step = tutorialSteps[currentStep];

  return (
    <div className="p-6 max-w-md mx-auto">
      {/* Progress indicator */}
      <div className="flex justify-center mb-6">
        {tutorialSteps.map((_, index) => (
          <div 
            key={index}
            className={`h-1 rounded-full mx-1 transition-all duration-300 ${
              index === currentStep 
                ? "w-8 bg-pastel-500" 
                : completedSteps.includes(index)
                  ? "w-4 bg-pastel-400" 
                  : "w-4 bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Step content */}
      <div className="glass-card shadow-neumorphic backdrop-blur-xl bg-white/60 p-6 rounded-2xl">
        <h3 className="text-xl font-bold mb-3 text-gray-800">{step.title}</h3>
        <p className="text-gray-600 mb-6">{step.description}</p>

        {/* Interactive elements based on step */}
        {currentStep === 1 && (
          <div className="mb-4 glass-card p-4 rounded-xl bg-pastel-50/50 flex items-center">
            <CheckCircle className="h-5 w-5 text-pastel-500 mr-2" />
            <span className="text-sm text-gray-700">Title your content and add description</span>
          </div>
        )}

        {currentStep === 2 && (
          <div className="mb-4 grid grid-cols-3 gap-2">
            <div className="h-16 glass-card p-2 rounded-xl flex items-center justify-center text-sm text-gray-600 bg-pastel-50/50">
              <span>Views: 120</span>
            </div>
            <div className="h-16 glass-card p-2 rounded-xl flex items-center justify-center text-sm text-gray-600 bg-pastel-50/50">
              <span>Sales: 24</span>
            </div>
            <div className="h-16 glass-card p-2 rounded-xl flex items-center justify-center text-sm text-gray-600 bg-pastel-50/50">
              <span>Revenue: ₹4,800</span>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="mb-4 glass-card p-4 rounded-xl bg-pastel-50/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Set your price</span>
              <span className="text-sm text-gray-700">₹499</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div className="bg-pastel-500 h-2 w-3/5 rounded-full"></div>
            </div>
          </div>
        )}

        <Button 
          onClick={handleAction}
          className="w-full bg-pastel-500 hover:bg-pastel-600 text-white rounded-full"
        >
          {step.action}
        </Button>
      </div>
    </div>
  );
};

export default TutorialContent;
