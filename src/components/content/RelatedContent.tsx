
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, FileText, Image, Link, Video } from 'lucide-react';

interface RelatedContentProps {
  relatedContents: any[];
}

const RelatedContent: React.FC<RelatedContentProps> = ({ relatedContents }) => {
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

  return (
    <div className="mt-8 glass-card border border-white/10 rounded-xl p-6">
      <h3 className="text-xl font-bold mb-4">Related Content</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {relatedContents.map((content) => (
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

export default RelatedContent;
