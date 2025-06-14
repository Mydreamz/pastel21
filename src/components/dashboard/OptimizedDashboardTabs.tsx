
import React, { memo, Suspense, lazy } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, DollarSign, Store } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Lazy load tab content components
const LazyPublishedContent = lazy(() => import('./PublishedContent'));
const LazyPurchasedContent = lazy(() => import('./PurchasedContent'));
const LazyMarketplaceContent = lazy(() => import('./MarketplaceContent'));

interface OptimizedDashboardTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  publishedContents: any[];
  purchasedContents: any[];
  marketplaceContents: any[];
  loading: boolean;
  filters: string[];
  searchQuery: string;
}

const TabLoadingSpinner = memo(() => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin h-8 w-8 border-t-2 border-pastel-500 border-r-2 rounded-full"></div>
  </div>
));

const OptimizedDashboardTabs = memo(({
  activeTab,
  setActiveTab,
  publishedContents,
  purchasedContents,
  marketplaceContents,
  loading,
  filters,
  searchQuery
}: OptimizedDashboardTabsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
        <Suspense fallback={<TabLoadingSpinner />}>
          <LazyPublishedContent 
            contents={publishedContents} 
            loading={loading} 
            filters={filters}
            searchQuery={searchQuery}
          />
        </Suspense>
      </TabsContent>
      
      <TabsContent value="purchased" className="m-0 p-4">
        <Suspense fallback={<TabLoadingSpinner />}>
          <LazyPurchasedContent 
            contents={purchasedContents} 
            loading={loading} 
            filters={filters}
            searchQuery={searchQuery}
          />
        </Suspense>
      </TabsContent>
      
      <TabsContent value="marketplace" className="m-0 p-4">
        <Suspense fallback={<TabLoadingSpinner />}>
          <LazyMarketplaceContent 
            contents={marketplaceContents} 
            loading={loading} 
            filters={filters}
            searchQuery={searchQuery}
          />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
});

OptimizedDashboardTabs.displayName = 'OptimizedDashboardTabs';

export default OptimizedDashboardTabs;
