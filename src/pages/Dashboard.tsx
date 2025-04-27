
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/App';
import { useToast } from "@/hooks/use-toast";
import StarsBackground from '@/components/StarsBackground';
import MainNav from '@/components/navigation/MainNav';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Plus, Tag, DollarSign, Store } from 'lucide-react';
import { BackToTop } from '@/components/ui/back-to-top';
import ContentFilters from '@/components/dashboard/ContentFilters';
import PublishedContent from '@/components/dashboard/PublishedContent';
import PurchasedContent from '@/components/dashboard/PurchasedContent';
import MarketplaceContent from '@/components/dashboard/MarketplaceContent';

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
  
  // Check authentication
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
      
      // Fetch user's published contents
      const { data: publishedData, error: publishedError } = await supabase
        .from('contents')
        .select('*')
        .eq('creator_id', user.id);
        
      if (publishedError) throw publishedError;
      
      // Fetch user's purchased contents (from transactions)
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*, contents(*)')
        .eq('user_id', user.id);
        
      if (transactionsError) throw transactionsError;
      
      const purchased = transactionsData?.map(tx => tx.contents) || [];
      
      // Fetch marketplace contents (all published content except user's own)
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
  
  const handleFilter = (filters: string[]) => {
    setActiveFilters(filters);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  return (
    <div className="min-h-screen flex flex-col antialiased text-white relative overflow-hidden">
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <MainNav openAuthDialog={() => {}} />
      
      <main className="relative z-10 flex-1 w-full max-w-screen-xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage and explore content</p>
          </div>
          
          <Button 
            onClick={handleCreateContent} 
            className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-2"
          >
            <Plus size={18} />
            Create Content
          </Button>
        </div>
        
        <Card className="glass-card border-white/10 text-white mb-8">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-3 bg-white/5 rounded-none border-b border-white/10">
                <TabsTrigger 
                  value="my-content" 
                  className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  My Content
                </TabsTrigger>
                <TabsTrigger 
                  value="purchased" 
                  className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500"
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Purchased Content
                </TabsTrigger>
                <TabsTrigger 
                  value="marketplace" 
                  className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500"
                >
                  <Store className="mr-2 h-4 w-4" />
                  Marketplace
                </TabsTrigger>
              </TabsList>
              
              <div className="p-4 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <ContentFilters onFilter={handleFilter} />
                
                <div className="relative w-full md:w-64">
                  <input 
                    type="text"
                    placeholder="Search content..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-8 pr-4 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </svg>
                </div>
              </div>
              
              <TabsContent value="my-content" className="m-0 p-4">
                <PublishedContent 
                  contents={publishedContents} 
                  loading={loading} 
                  filters={activeFilters}
                  searchQuery={searchQuery}
                />
              </TabsContent>
              
              <TabsContent value="purchased" className="m-0 p-4">
                <PurchasedContent 
                  contents={purchasedContents} 
                  loading={loading} 
                  filters={activeFilters}
                  searchQuery={searchQuery}
                />
              </TabsContent>
              
              <TabsContent value="marketplace" className="m-0 p-4">
                <MarketplaceContent 
                  contents={marketplaceContents} 
                  loading={loading} 
                  filters={activeFilters}
                  searchQuery={searchQuery}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      
      <BackToTop />
    </div>
  );
};

export default Dashboard;
