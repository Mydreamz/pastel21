
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

const TabErrorFallback = memo(({ error }: { error?: Error }) => (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <div className="text-red-500 mb-2">Failed to load content</div>
    <div className="text-sm text-gray-500">
      {error?.message || 'Something went wrong. Please refresh the page.'}
    </div>
  </div>
));

class TabErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ComponentType<{ error?: Error }> },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback;
      return <Fallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

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
  
  // On mobile, redirect marketplace tab to my-content
  const handleTabChange = (value: string) => {
    if (isMobile && value === 'marketplace') {
      setActiveTab('my-content');
    } else {
      setActiveTab(value);
    }
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
        <TabErrorBoundary fallback={TabErrorFallback}>
          <Suspense fallback={<TabLoadingSpinner />}>
            <LazyPublishedContent 
              contents={publishedContents} 
              loading={loading} 
              filters={filters}
              searchQuery={searchQuery}
            />
          </Suspense>
        </TabErrorBoundary>
      </TabsContent>
      
      <TabsContent value="purchased" className="m-0 p-4">
        <TabErrorBoundary fallback={TabErrorFallback}>
          <Suspense fallback={<TabLoadingSpinner />}>
            <LazyPurchasedContent 
              contents={purchasedContents} 
              loading={loading} 
              filters={filters}
              searchQuery={searchQuery}
            />
          </Suspense>
        </TabErrorBoundary>
      </TabsContent>
      
      {!isMobile && (
        <TabsContent value="marketplace" className="m-0 p-4">
          <TabErrorBoundary fallback={TabErrorFallback}>
            <Suspense fallback={<TabLoadingSpinner />}>
              <LazyMarketplaceContent 
                contents={marketplaceContents} 
                loading={loading} 
                filters={filters}
                searchQuery={searchQuery}
              />
            </Suspense>
          </TabErrorBoundary>
        </TabsContent>
      )}
    </Tabs>
  );
});

OptimizedDashboardTabs.displayName = 'OptimizedDashboardTabs';

export default OptimizedDashboardTabs;
