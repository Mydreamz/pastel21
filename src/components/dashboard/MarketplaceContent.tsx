
import React, { useState, useEffect } from 'react';
import { Store, Check } from 'lucide-react';
import ContentCard from './ContentCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { useContentCache } from '@/contexts/ContentCacheContext';

interface MarketplaceContentProps {
  contents: any[];
  loading: boolean;
  filters: string[];
  searchQuery: string;
}

const MarketplaceContent: React.FC<MarketplaceContentProps> = ({ 
  contents, 
  loading, 
  filters,
  searchQuery
}) => {
  const { user } = useAuth();
  const { purchasedContentIds } = useContentCache();
  
  // Filter logic now uses memoization to avoid unnecessary re-filters
  const filteredContents = React.useMemo(() => {
    return contents.filter(content => {
      const isPaid = parseFloat(content.price) > 0;
      const matchesSearch = searchQuery ? 
        (content.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
         content.teaser?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         content.creator_name?.toLowerCase().includes(searchQuery.toLowerCase())) 
        : true;
      
      if (filters.length === 0) return matchesSearch;
      
      const matchesPriceFilter = 
        (filters.includes('Free') && !isPaid) ||
        (filters.includes('Paid') && isPaid);
        
      return matchesPriceFilter && matchesSearch;
    });
  }, [contents, filters, searchQuery]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin h-8 w-8 border-t-2 border-pastel-500 border-r-2 rounded-full"></div>
      </div>
    );
  }
  
  if (!contents || contents.length === 0) {
    return (
      <div className="text-center py-12">
        <Store className="h-12 w-12 mx-auto mb-3 opacity-40" />
        <h3 className="text-xl font-medium mb-1">No marketplace content available</h3>
        <p className="text-gray-400">Check back soon for new content from other creators</p>
      </div>
    );
  }
  
  if (filteredContents.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No content matches your current filters or search query</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredContents.map((content) => (
        <div key={content.id} className="relative">
          {purchasedContentIds.has(content.id) && (
            <Badge 
              className="absolute top-2 right-2 z-10 bg-pastel-500 text-white flex items-center gap-1 px-2 py-1"
            >
              <Check className="h-3 w-3" /> Purchased
            </Badge>
          )}
          <ContentCard key={content.id} content={content} />
        </div>
      ))}
    </div>
  );
};

export default MarketplaceContent;
