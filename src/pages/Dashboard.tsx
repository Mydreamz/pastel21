import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/App';
import { useToast } from "@/hooks/use-toast";
import StarsBackground from '@/components/StarsBackground';
import MainNav from '@/components/navigation/MainNav';
import { Card, CardContent } from "@/components/ui/card";
import { BackToTop } from '@/components/ui/back-to-top';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import DashboardSearch from '@/components/dashboard/DashboardSearch';
import { supabase } from "@/integrations/supabase/client";

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

  useEffect(() => {
    if (!session) {
      navigate('/');
      toast({
        title: "Authentication required",
        description: "Please sign in to access your dashboard",
        variant: "destructive"
      });
    } else {
      fetchUserContents();
    }
  }, [session, navigate]);

  const fetchUserContents = async () => {
    setLoading(true);
    
    try {
      if (!user) return;
      
      const { data: publishedData, error: publishedError } = await supabase
        .from('contents')
        .select('*')
        .eq('creator_id', user.id);
        
      if (publishedError) throw publishedError;
      
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*, contents(*)')
        .eq('user_id', user.id);
        
      if (transactionsError) throw transactionsError;
      
      const purchased = transactionsData?.map(tx => tx.contents) || [];
      
      const { data: marketplaceData, error: marketplaceError } = await supabase
        .from('contents')
        .select('*')
        .neq('creator_id', user.id)
        .eq('status', 'published');
        
      if (marketplaceError) throw marketplaceError;
      
      setPublishedContents(publishedData || []);
      setPurchasedContents(purchased.filter(Boolean));
      setMarketplaceContents(marketplaceData || []);
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
  };

  const handleCreateContent = () => {
    navigate('/create');
  };

  return (
    <div className="min-h-screen flex flex-col antialiased text-white relative overflow-hidden">
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <MainNav openAuthDialog={() => {}} />
      
      <main className="relative z-10 flex-1 flex flex-col w-full">
        <div className="container px-2 sm:px-4">
          <DashboardHeader />
          
          <Card className="glass-card border-white/10 text-white flex-1">
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
            className="fixed right-4 bottom-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg h-14 w-14 p-0"
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
