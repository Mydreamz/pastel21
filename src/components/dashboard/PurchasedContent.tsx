
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { DollarSign, Trash2 } from 'lucide-react';
import ContentCard from './ContentCard';
import DeleteContentDialog from '../content/DeleteContentDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const handleDeletePurchase = async () => {
    if (!selectedContent) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .update({ is_deleted: true })
        .eq('content_id', selectedContent.id)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) {
        toast({
          title: "Error removing purchase",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Purchase removed",
          description: "The content has been removed from your purchases"
        });
        // Force refresh by incrementing the trigger state
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "An error occurred",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setSelectedContent(null);
    }
  };
  
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContents.map((content) => (
          <ContentCard 
            key={`${content.id}-${refreshTrigger}`} 
            content={content} 
            showPurchaseDate 
            onDelete={() => {
              setSelectedContent(content);
              setIsDeleting(true);
            }}
          />
        ))}
      </div>
      
      <DeleteContentDialog 
        isOpen={isDeleting}
        onClose={() => {
          setIsDeleting(false);
          setSelectedContent(null);
        }}
        onConfirm={handleDeletePurchase}
        contentTitle={selectedContent?.title || "this content"}
      />
    </>
  );
};

export default PurchasedContent;
