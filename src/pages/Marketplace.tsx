
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';
import MainNav from '@/components/navigation/MainNav';
import StarsBackground from '@/components/StarsBackground';
import { BackToTop } from '@/components/ui/back-to-top';
import MarketplaceContent from '@/components/dashboard/MarketplaceContent';
import DashboardSearch from '@/components/dashboard/DashboardSearch';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/App';

const Marketplace = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [loading, setLoading] = React.useState(true);
  const [contents, setContents] = React.useState<any[]>([]);
  const { user } = useAuth();
  
  React.useEffect(() => {
    const fetchMarketplaceContents = async () => {
      try {
        const { data, error } = await supabase
          .from('contents')
          .select('*')
          .eq('status', 'published');
          
        if (error) throw error;
        setContents(data || []);
      } catch (error) {
        console.error('Error fetching marketplace contents:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMarketplaceContents();
  }, []);

  return (
    <div className="min-h-screen flex flex-col antialiased text-gray-800 relative overflow-hidden">
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <MainNav openAuthDialog={() => {}} />
      
      <main className="relative z-10 flex-1 w-full max-w-screen-xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="text-gray-700 hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Marketplace</h1>
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
            </div>
          </CardContent>
        </Card>
      </main>
      
      <BackToTop />
    </div>
  );
};

export default Marketplace;
