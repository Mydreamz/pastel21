
import React from 'react';
import { Button } from "@/components/ui/button";
import { Store } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const DashboardHeader = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const handleMarketplaceClick = () => {
    navigate('/marketplace');
  };
  
  return <div className="flex justify-end items-center py-2 gap-2">
      <ThemeToggle />
      {isMobile ? (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleMarketplaceClick} 
          className="text-white bg-pastel-700 hover:bg-pastel-600 dark:bg-neon-blue/20 dark:border-neon-blue/30 dark:hover:bg-neon-blue/30"
        >
          <Store className="h-4 w-4" />
        </Button>
      ) : (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleMarketplaceClick} 
          className="text-white bg-pastel-700 hover:bg-pastel-600 dark:bg-neon-blue/20 dark:border-neon-blue/30 dark:hover:bg-neon-blue/30"
        >
          <Store className="h-4 w-4 mr-2" /> Marketplace
        </Button>
      )}
    </div>;
};

export default DashboardHeader;
