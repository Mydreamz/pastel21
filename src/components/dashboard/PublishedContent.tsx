
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';
import { useProfileData } from '@/hooks/useProfileData';
import ContentCard from './ContentCard';

interface PublishedContentProps {
  contents: any[];
  loading: boolean;
  filters: string[];
  searchQuery: string;
}

const PublishedContent: React.FC<PublishedContentProps> = ({ 
  contents, 
  loading, 
  filters,
  searchQuery 
}) => {
  const navigate = useNavigate();
  const { handleDeleteContent } = useProfileData();
  
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
        <FileText className="h-12 w-12 mx-auto mb-3 opacity-40" />
        <h3 className="text-xl font-medium mb-1">No published content</h3>
        <p className="text-gray-400 mb-4">Create your first content to get started</p>
        <Button 
          onClick={() => navigate('/create')} 
          className="bg-pastel-500 hover:bg-pastel-600 text-white"
        >
          Create Content
        </Button>
      </div>
    );
  }
  
  const filteredContents = contents.filter(content => {
    const isPaid = parseFloat(content.price) > 0;
    const matchesSearch = searchQuery ? 
      (content.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
       content.teaser?.toLowerCase().includes(searchQuery.toLowerCase())) 
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
        <ContentCard 
          key={content.id} 
          content={content}
          showActions
          onDelete={handleDeleteContent}
        />
      ))}
    </div>
  );
};

export default PublishedContent;
