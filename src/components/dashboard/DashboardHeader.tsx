
import React from 'react';
import { Button } from "@/components/ui/button";
import { Store, Shield } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const DashboardHeader = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleMarketplaceClick = () => {
    navigate('/marketplace');
  };

  const handleAdminClick = () => {
    navigate('/admin/dashboard');
  };

  return (
    <div className="flex justify-end items-center py-2 gap-2">
      {isAdmin && (
        isMobile ? (
          <Button variant="ghost" size="sm" onClick={handleAdminClick} className="text-white bg-purple-700 hover:bg-purple-600">
            <Shield className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="ghost" size="sm" onClick={handleAdminClick} className="text-white bg-purple-700 hover:bg-purple-600">
            <Shield className="h-4 w-4 mr-2" /> Admin
          </Button>
        )
      )}
      {isMobile ? (
        <Button variant="ghost" size="sm" onClick={handleMarketplaceClick} className="text-white bg-pastel-700 hover:bg-pastel-600">
          <Store className="h-4 w-4" />
        </Button>
      ) : (
        <Button variant="ghost" size="sm" onClick={handleMarketplaceClick} className="text-white bg-pastel-700 hover:bg-pastel-600">
          <Store className="h-4 w-4 mr-2" /> Marketplace
        </Button>
      )}
    </div>
  );
};
export default DashboardHeader;
