
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Plus, Store } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const DashboardHeader = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const handleCreateContent = () => {
    navigate('/create');
  };
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
        <p className="text-gray-400 mt-1">Manage and explore content</p>
      </div>
      
      <div className="flex items-center gap-2">
        {isMobile && (
          <Button
            onClick={() => navigate('/marketplace')}
            variant="outline"
            size="sm"
            className="border-white/10 hover:bg-white/5"
          >
            <Store className="h-4 w-4 mr-2" />
            Marketplace
          </Button>
        )}
        <Button 
          onClick={handleCreateContent} 
          className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-2"
        >
          <Plus size={18} />
          Create Content
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
