import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import UserCountBadge from './UserCountBadge';

const Hero = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/create');
  };
  
  return (
    <div className="relative flex flex-col items-start gap-6 py-10 md:py-12 lg:py-16 w-full max-w-screen-xl mx-auto px-4 md:px-6">
      <div className="flex flex-col gap-3 max-w-[720px]">
        <div className="flex items-center gap-2 mb-4">
          <img 
            src="/monitizelogo.jpg" 
            alt="Monitize.club Logo" 
            className="h-10 w-10 rounded-full"
          />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white">
            Create, Share, and <span className="text-gradient-emerald">Monetize</span> Your Content
          </h1>
        </div>
        
        <p className="text-lg md:text-xl text-gray-300 max-w-[600px]">
          All-in-one platform for creators to build, grow, and monetize their audience with powerful insights and analytics.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button 
            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-6 h-12 text-base font-medium"
            onClick={handleGetStarted}
          >
            Get Started Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <Button variant="outline" className="border-gray-700 hover:border-emerald-500 hover:bg-emerald-500/10 text-white rounded-full px-6 h-12 text-base font-medium">
            See How It Works
          </Button>
        </div>

        <div className="mt-6">
          <UserCountBadge count={5200} />
        </div>
      </div>
    </div>
  )
}

export default Hero;
