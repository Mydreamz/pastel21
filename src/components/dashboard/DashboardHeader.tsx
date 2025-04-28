
import React from 'react';
import { Button } from "@/components/ui/button";
import { Store } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const DashboardHeader = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex justify-end py-2">
      {isMobile && (
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10"
        >
          <Store className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default DashboardHeader;
