
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, DollarSign, Store } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import PublishedContent from './PublishedContent';
import PurchasedContent from './PurchasedContent';
import MarketplaceContent from './MarketplaceContent';

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  publishedContents: any[];
  purchasedContents: any[];
  marketplaceContents: any[];
  loading: boolean;
  filters: string[];
  searchQuery: string;
}

const DashboardTabs = ({
  activeTab,
  setActiveTab,
  publishedContents,
  purchasedContents,
  marketplaceContents,
  loading,
  filters,
  searchQuery
}: DashboardTabsProps) => {
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Handle tab changes and update URL params
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };
  
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="w-full grid grid-cols-2 md:grid-cols-3 bg-white/5 rounded-none border-b border-white/10">
        <TabsTrigger 
          value="my-content" 
          className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-pastel-500"
        >
          <FileText className="mr-2 h-4 w-4" />
          My Content
        </TabsTrigger>
        <TabsTrigger 
          value="purchased" 
          className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-pastel-500"
        >
          <DollarSign className="mr-2 h-4 w-4" />
          Purchased
        </TabsTrigger>
        {!isMobile && (
          <TabsTrigger 
            value="marketplace" 
            className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-pastel-500"
          >
            <Store className="mr-2 h-4 w-4" />
            Marketplace
          </TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="my-content" className="m-0 p-4">
        <PublishedContent 
          contents={publishedContents} 
          loading={loading} 
          filters={filters}
          searchQuery={searchQuery}
        />
      </TabsContent>
      
      <TabsContent value="purchased" className="m-0 p-4">
        <PurchasedContent 
          contents={purchasedContents} 
          loading={loading} 
          filters={filters}
          searchQuery={searchQuery}
        />
      </TabsContent>
      
      <TabsContent value="marketplace" className="m-0 p-4">
        <MarketplaceContent 
          contents={marketplaceContents} 
          loading={loading} 
          filters={filters}
          searchQuery={searchQuery}
        />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
