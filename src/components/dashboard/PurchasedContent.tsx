import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { DollarSign } from 'lucide-react';
import ContentCard from './ContentCard';

interface PurchasedContentProps {
  contents: any[];
  loading: boolean;
  filters: string[];
  searchQuery: string;
}

const PurchasedContent: React.FC<PurchasedContentProps> = ({ 
  contents, 
  loading, 
  filters,
  searchQuery 
}) => {
  const navigate = useNavigate();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin h-8 w-8 border-t-2 border-emerald-500 border-r-2 rounded-full"></div>
      </div>
    );
  }
  
  if (!contents || contents.length === 0) {
    return (
      <div className="text-center py-12">
        <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-40" />
        <h3 className="text-xl font-medium mb-1">No purchased content</h3>
        <p className="text-gray-400 mb-4">Purchase content from other creators to see it here</p>
        <Button 
          onClick={() => navigate('/')} 
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          Explore Content
        </Button>
      </div>
    );
  }
  
  const filteredContents = contents.filter(content => {
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
        <ContentCard key={content.id} content={content} showPurchaseDate />
      ))}
    </div>
  );
};

export default PurchasedContent;
