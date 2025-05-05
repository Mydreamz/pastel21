
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import StarsBackground from '@/components/StarsBackground';
import MainNav from '@/components/navigation/MainNav';
import { Card, CardContent } from "@/components/ui/card";
import { BackToTop } from '@/components/ui/back-to-top';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import DashboardSearch from '@/components/dashboard/DashboardSearch';
import { supabase } from "@/integrations/supabase/client";
import { createCacheableRequest, useCacheUtils } from '@/utils/requestUtils';

// Cacheable function to fetch all user content in a single go with a stable function reference
const fetchAllUserContent = async (userId: string) => {
  if (!userId) {
    console.warn("Cannot fetch content: Missing user ID");
    return {
      publishedContents: [],
      purchasedContents: [],
      marketplaceContents: []
    };
  }
  
  // Use Promise.all to parallelize requests
  const [publishedResult, transactionsResult, marketplaceResult] = await Promise.all([
    supabase
      .from('contents')
      .select('*')
      .eq('creator_id', userId),
      
    supabase
      .from('transactions')
      .select('*, contents(*)')
      .eq('user_id', userId),
      
    supabase
      .from('contents')
      .select('*')
      .neq('creator_id', userId)
      .eq('status', 'published')
  ]);
    
  if (publishedResult.error) throw publishedResult.error;
  if (transactionsResult.error) throw transactionsResult.error;
  if (marketplaceResult.error) throw marketplaceResult.error;
  
  const purchased = transactionsResult.data?.map(tx => tx.contents).filter(Boolean) || [];
  
  return {
    publishedContents: publishedResult.data || [],
    purchasedContents: purchased,
    marketplaceContents: marketplaceResult.data || []
  };
};

// Create a cached version of this function (cache for 1 minute)
const getCachedUserContent = createCacheableRequest(fetchAllUserContent, 60 * 1000);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [publishedContents, setPublishedContents] = useState<any[]>([]);
  const [purchasedContents, setPurchasedContents] = useState<any[]>([]);
  const [marketplaceContents, setMarketplaceContents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>("my-content");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const isMobile = useIsMobile();
  const { invalidateCache } = useCacheUtils();
  
  // Use a stable reference for user ID
  const userId = useMemo(() => user?.id || null, [user?.id]);

  // Memoized function to fetch content data with better dependency tracking
  const fetchUserContents = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    
    try {
      // Use our cached fetch function with stable reference
      const results = await getCachedUserContent(userId);
      
      setPublishedContents(results.publishedContents);
      setPurchasedContents(results.purchasedContents);
      setMarketplaceContents(results.marketplaceContents);
    } catch (error) {
      console.error("Error fetching content:", error);
      toast({
        title: "Failed to load content",
        description: "There was an error loading your content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  // Fetch data only when session/user changes
  useEffect(() => {
    if (!session) {
      navigate('/');
      toast({
        title: "Authentication required",
        description: "Please sign in to access your dashboard",
        variant: "destructive"
      });
    } else if (userId) {
      fetchUserContents();
    }
  }, [session, userId, navigate, fetchUserContents, toast]);

  const handleCreateContent = () => {
    navigate('/create');
  };

  return (
    <div className="min-h-screen flex flex-col antialiased text-gray-800 relative overflow-hidden">
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <MainNav openAuthDialog={() => {}} />
      
      <main className="relative z-10 flex-1 flex flex-col w-full">
        <div className="container px-2 sm:px-4">
          <DashboardHeader />
          
          <Card className="glass-card border-white/10 text-gray-800 flex-1">
            <CardContent className="p-0">
              <DashboardSearch 
                onFilter={setActiveFilters}
                searchQuery={searchQuery}
                onSearchChange={(e) => setSearchQuery(e.target.value)}
              />
              
              <DashboardTabs 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                publishedContents={publishedContents}
                purchasedContents={purchasedContents}
                marketplaceContents={marketplaceContents}
                loading={loading}
                filters={activeFilters}
                searchQuery={searchQuery}
              />
            </CardContent>
          </Card>
        </div>

        {isMobile && (
          <Button
            onClick={handleCreateContent}
            className="fixed right-4 bottom-4 rounded-full bg-pastel-500 hover:bg-pastel-600 text-white shadow-lg h-14 w-14 p-0"
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        )}
      </main>
      
      <BackToTop />
    </div>
  );
};

export default Dashboard;
