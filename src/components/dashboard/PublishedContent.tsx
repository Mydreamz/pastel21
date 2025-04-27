import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, FileText, Image, Video, Link as LinkIcon, DollarSign, Clock } from 'lucide-react';
import { useProfileData } from '@/hooks/useProfileData';

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
        <div className="animate-spin h-8 w-8 border-t-2 border-emerald-500 border-r-2 rounded-full"></div>
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
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          Create Content
        </Button>
      </div>
    );
  }
  
  const filteredContents = contents.filter(content => {
    const contentType = content.content_type || content.contentType;
    const isPaid = parseFloat(content.price) > 0;
    const matchesSearch = searchQuery ? 
      (content.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
       content.teaser?.toLowerCase().includes(searchQuery.toLowerCase())) 
      : true;
    
    if (filters.length === 0) return matchesSearch;
    
    const matchesTypeFilter = 
      filters.includes(contentType === 'text' ? 'Text' : '') ||
      filters.includes(contentType === 'image' ? 'Image' : '') ||
      filters.includes(contentType === 'video' ? 'Video' : '') ||
      filters.includes(contentType === 'link' ? 'Link' : '');
      
    const matchesPriceFilter = 
      (filters.includes('Free') && !isPaid) ||
      (filters.includes('Paid') && isPaid);
      
    return (matchesTypeFilter || matchesPriceFilter) && matchesSearch;
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
      {filteredContents.map((content) => {
        const contentType = content.content_type || content.contentType;
        const contentId = content.id;
        const title = content.title;
        const price = content.price;
        const createdAt = new Date(content.created_at || content.createdAt).toLocaleDateString();
        const status = content.status || 'published';
        const views = content.views || 0;
        
        return (
          <Card key={contentId} className="bg-white/5 border-white/10 hover:border-emerald-500/30 transition-colors">
            <div className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex gap-2">
                  {(() => {
                    switch (contentType) {
                      case 'text':
                        return <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                          <FileText className="h-3 w-3 mr-1" /> Text
                        </Badge>;
                      case 'image':
                        return <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                          <Image className="h-3 w-3 mr-1" /> Image
                        </Badge>;
                      case 'video':
                        return <Badge variant="outline" className="bg-red-500/20 text-red-300 border-red-500/30">
                          <Video className="h-3 w-3 mr-1" /> Video
                        </Badge>;
                      case 'link':
                        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                          <LinkIcon className="h-3 w-3 mr-1" /> Link
                        </Badge>;
                      default:
                        return <Badge variant="outline" className="bg-gray-500/20 text-gray-300 border-gray-500/30">
                          <FileText className="h-3 w-3 mr-1" /> Content
                        </Badge>;
                    }
                  })()}
                  
                  {status === 'draft' && (
                    <Badge variant="outline" className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                      Draft
                    </Badge>
                  )}
                  
                  {status === 'scheduled' && (
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      Scheduled
                    </Badge>
                  )}
                  
                  {status === 'published' && (
                    <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30">
                      Published
                    </Badge>
                  )}
                </div>
                
                {parseFloat(price) > 0 && (
                  <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                    <DollarSign className="h-3 w-3 mr-1" />
                    {parseFloat(price).toFixed(2)}
                  </Badge>
                )}
              </div>
              
              <h3 className="font-medium text-lg mb-1 text-emerald-300 line-clamp-1">{title}</h3>
              
              <div className="flex items-center text-xs text-gray-400 mb-3 gap-3">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {createdAt}
                </div>
                <div className="flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  {views} views
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={() => navigate(`/view/${contentId}`)} 
                  variant="outline" 
                  size="sm" 
                  className="border-white/10 hover:bg-white/10"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button 
                  onClick={() => navigate(`/edit/${contentId}`)} 
                  variant="outline" 
                  size="sm" 
                  className="border-white/10 hover:bg-white/10"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  onClick={() => handleDeleteContent(contentId)}
                  variant="outline" 
                  size="sm" 
                  className="border-white/10 hover:bg-white/10 hover:text-red-400 ml-auto"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default PublishedContent;
