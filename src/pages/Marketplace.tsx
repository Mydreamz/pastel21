
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';
import MainNav from '@/components/navigation/MainNav';
import MobileBottomNav from '@/components/navigation/MobileBottomNav';
import StarsBackground from '@/components/StarsBackground';
import { BackToTop } from '@/components/ui/back-to-top';
import MarketplaceContent from '@/components/dashboard/MarketplaceContent';
import DashboardSearch from '@/components/dashboard/DashboardSearch';
import AuthDialog from '@/components/auth/AuthDialog';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { useContentCache } from '@/contexts/ContentCacheContext';

// Number of contents to load per page
const PAGE_SIZE = 12;

const Marketplace = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [loading, setLoading] = React.useState(true);
  const [contents, setContents] = React.useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const { user, session } = useAuth();
  const { purchasedContentIds } = useContentCache();
  const isAuthenticated = !!session;
  
  // Memoized function to fetch marketplace contents efficiently
  const fetchMarketplaceContents = useCallback(async (pageNumber: number) => {
    try {
      setLoading(true);
      
      // Query for marketplace contents with pagination
      const { data, error } = await supabase
        .from('contents')
        .select('id, title, teaser, price, content_type, creator_id, creator_name, status, file_url')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .range(pageNumber * PAGE_SIZE, (pageNumber + 1) * PAGE_SIZE - 1);
        
      if (error) throw error;
      
      if (pageNumber === 0) {
        // First page, replace contents
        setContents(data || []);
      } else {
        // Subsequent pages, append contents
        setContents(prev => [...prev, ...(data || [])]);
      }
      
      // If we got fewer items than requested, we've reached the end
      setHasMore(data && data.length === PAGE_SIZE);
    } catch (error) {
      console.error('Error fetching marketplace contents:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch initial data
  useEffect(() => {
    fetchMarketplaceContents(0);
  }, [fetchMarketplaceContents]);
  
  // Load more contents when user clicks the load more button
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMarketplaceContents(nextPage);
  };

  // Handle auth dialog opening
  const openAuthDialog = (tab: 'login' | 'signup') => {
    setAuthTab(tab);
    setShowAuthDialog(true);
  };

  const handleBackNavigation = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col antialiased text-gray-800 relative overflow-hidden">
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <MainNav openAuthDialog={openAuthDialog} />
      
      <main className="relative z-10 flex-1 w-full max-w-screen-xl mx-auto px-4 md:px-6 py-8 pb-20 md:pb-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackNavigation}
            className="text-gray-700 hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Marketplace</h1>
          {!isAuthenticated && (
            <div className="ml-auto">
              <Button 
                onClick={() => openAuthDialog('signup')}
                className="bg-pastel-500 hover:bg-pastel-600"
              >
                Sign Up to Purchase
              </Button>
            </div>
          )}
        </div>
        
        <Card className="glass-card border-white/10 text-gray-800 mb-8">
          <CardContent className="p-0">
            <DashboardSearch 
              onFilter={setFilters}
              searchQuery={searchQuery}
              onSearchChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="p-4">
              <MarketplaceContent 
                contents={contents}
                loading={loading}
                filters={filters}
                searchQuery={searchQuery}
              />
              
              {hasMore && !loading && (
                <div className="flex justify-center mt-6">
                  <Button 
                    onClick={loadMore} 
                    variant="outline"
                    className="border-pastel-300 text-pastel-700 hover:bg-pastel-50"
                  >
                    Load More
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      
      <MobileBottomNav openAuthDialog={openAuthDialog} />
      
      <AuthDialog 
        showAuthDialog={showAuthDialog}
        setShowAuthDialog={setShowAuthDialog}
        authTab={authTab}
        setAuthTab={setAuthTab}
      />
      
      <BackToTop />
    </div>
  );
};

export default Marketplace;
