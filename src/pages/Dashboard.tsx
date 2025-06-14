
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import StarsBackground from '@/components/StarsBackground';
import MainNav from '@/components/navigation/MainNav';
import MobileBottomNav from '@/components/navigation/MobileBottomNav';
import { BackToTop } from '@/components/ui/back-to-top';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { useOptimizedDashboardData } from '@/hooks/dashboard/useOptimizedDashboardData';
import { useDashboardNavigation } from '@/hooks/dashboard/useDashboardNavigation';
import { useOptimizedSearch } from '@/hooks/dashboard/useOptimizedSearch';

const Dashboard = () => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const isMobile = useIsMobile();

  // Performance timing
  console.time('[Dashboard] Render Time');

  // Use optimized hooks
  const {
    loading,
    publishedContents,
    purchasedContents,
    marketplaceContents
  } = useOptimizedDashboardData();

  const {
    activeTab,
    activeFilters,
    setActiveFilters,
    handleTabChange,
    handleCreateContent
  } = useDashboardNavigation();

  const {
    searchQuery,
    debouncedQuery,
    setSearchQuery
  } = useOptimizedSearch();

  const openAuthDialog = (tab: 'login' | 'signup') => {
    setAuthTab(tab);
    setShowAuthDialog(true);
  };

  // Log performance
  React.useEffect(() => {
    console.timeEnd('[Dashboard] Render Time');
  });

  return (
    <div className="min-h-screen flex flex-col antialiased text-gray-800 relative overflow-hidden">
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <MainNav openAuthDialog={openAuthDialog} />
      
      <main className="relative z-10 flex-1 flex flex-col w-full pb-20 md:pb-0">
        <div className="container px-2 sm:px-4">
          <DashboardHeader />
          
          <DashboardContent 
            activeTab={activeTab}
            handleTabChange={handleTabChange}
            publishedContents={publishedContents}
            purchasedContents={purchasedContents}
            marketplaceContents={marketplaceContents}
            loading={loading}
            activeFilters={activeFilters}
            searchQuery={debouncedQuery}
            setActiveFilters={setActiveFilters}
            setSearchQuery={setSearchQuery}
          />
        </div>

        {!isMobile && (
          <Button
            onClick={handleCreateContent}
            className="fixed right-4 bottom-4 rounded-full bg-pastel-500 hover:bg-pastel-600 text-white shadow-lg h-14 w-14 p-0"
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        )}
      </main>
      
      <MobileBottomNav 
        openAuthDialog={openAuthDialog}
        onDashboardTabChange={handleTabChange}
        activeDashboardTab={activeTab}
      />
      <BackToTop />
    </div>
  );
};

export default Dashboard;
