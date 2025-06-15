
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import DashboardSearch from './DashboardSearch';
import OptimizedDashboardTabs from './OptimizedDashboardTabs';

interface DashboardContentProps {
  activeTab: string;
  handleTabChange: (tab: string) => void;
  publishedContents: any[];
  purchasedContents: any[];
  marketplaceContents: any[];
  loading: boolean;
  activeFilters: string[];
  searchQuery: string;
  setActiveFilters: (filters: string[]) => void;
  setSearchQuery: (query: string) => void;
  invalidateCache?: () => void;
}

const DashboardContent = ({
  activeTab,
  handleTabChange,
  publishedContents,
  purchasedContents,
  marketplaceContents,
  loading,
  activeFilters,
  searchQuery,
  setActiveFilters,
  setSearchQuery,
  invalidateCache
}: DashboardContentProps) => {
  return (
    <Card className="glass-card border-white/10 text-gray-800 flex-1">
      <CardContent className="p-0">
        <DashboardSearch 
          onFilter={setActiveFilters}
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <OptimizedDashboardTabs 
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          publishedContents={publishedContents}
          purchasedContents={purchasedContents}
          marketplaceContents={marketplaceContents}
          loading={loading}
          filters={activeFilters}
          searchQuery={searchQuery}
          invalidateCache={invalidateCache}
        />
      </CardContent>
    </Card>
  );
};

export default DashboardContent;
