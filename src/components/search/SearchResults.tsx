
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, FileText, Image, Link, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchResultsProps {
  results: any[];
  loading: boolean;
  query: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, loading, query }) => {
  const navigate = useNavigate();

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <FileText className="h-4 w-4 text-blue-400" />;
      case 'image':
        return <Image className="h-4 w-4 text-purple-400" />;
      case 'video':
        return <Video className="h-4 w-4 text-red-400" />;
      case 'link':
        return <Link className="h-4 w-4 text-yellow-400" />;
      default:
        return <FileText className="h-4 w-4 text-blue-400" />;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-r-transparent"></div>
        <p className="mt-4 text-gray-400">Searching...</p>
      </div>
    );
  }

  if (query && results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-400">No results found for "{query}"</p>
        <p className="mt-2 text-sm text-gray-500">Try different keywords or browse the content below</p>
      </div>
    );
  }

  return (
    <div>
      {query && (
        <h2 className="text-xl font-semibold mb-4">
          {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
        </h2>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((content) => (
          <Card 
            key={content.id} 
            className="glass-card border-white/10 hover:border-emerald-500/30 transition-colors cursor-pointer"
            onClick={() => navigate(`/view/${content.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                {getContentTypeIcon(content.contentType)}
                <div className="flex items-center gap-1">
                  {parseFloat(content.price) > 0 ? (
                    <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {parseFloat(content.price).toFixed(2)}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      Free
                    </Badge>
                  )}
                </div>
              </div>
              
              <h4 className="font-medium text-lg mb-2 line-clamp-1">{content.title}</h4>
              <p className="text-sm text-gray-400 line-clamp-2 mb-2">{content.teaser}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="font-medium">{content.creatorName}</span>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
