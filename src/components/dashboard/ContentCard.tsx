
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Clock, Calendar, User, Check } from 'lucide-react';
import ContentTypeBadge from './ContentTypeBadge';
import PriceBadge from './PriceBadge';

interface ContentCardProps {
  content: any;
  showActions?: boolean;
  showPurchaseDate?: boolean;
  onDelete?: (id: string) => void;
  isPurchased?: boolean;
}

const ContentCard: React.FC<ContentCardProps> = ({ 
  content, 
  showActions = false, 
  showPurchaseDate = false,
  onDelete,
  isPurchased
}) => {
  const navigate = useNavigate();
  
  const contentType = content.content_type || content.contentType;
  const contentId = content.id;
  const title = content.title;
  const price = content.price;
  const creatorName = content.creator_name || content.creatorName;
  const createdAt = new Date(content.created_at || content.createdAt).toLocaleDateString();
  const status = content.status || 'published';
  const views = content.views || 0;
  // Check if the file URL is a blob URL or a storage URL
  const fileUrl = content.file_url || content.fileUrl;
  const isValidUrl = fileUrl && (fileUrl.startsWith('http') || fileUrl.startsWith('/'));
  
  return (
    <Card key={contentId} className="bg-white/5 border-white/10 hover:border-emerald-500/30 transition-colors">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-2">
            <ContentTypeBadge contentType={contentType} />
            {(isPurchased || showPurchaseDate) && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Check className="h-3 w-3 mr-1" /> Purchased
              </span>
            )}
          </div>
          <PriceBadge price={price} />
        </div>
        
        <h3 className="font-medium text-lg mb-1 text-emerald-300 line-clamp-1">{title}</h3>
        
        <div className="flex flex-col text-xs text-gray-400 mb-3 gap-1">
          {creatorName && (
            <div className="flex items-center">
              <User className="h-3 w-3 mr-1" />
              {creatorName}
            </div>
          )}
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Created: {createdAt}
          </div>
          {showPurchaseDate && (
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              Purchased: {new Date().toLocaleDateString()}
            </div>
          )}
          {showActions && (
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              {views} views
            </div>
          )}
          {contentType !== 'text' && contentType !== 'link' && !isValidUrl && (
            <div className="text-amber-400">
              Media files pending migration
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={() => navigate(`/view/${contentId}`)} 
            variant="outline" 
            size="sm" 
            className="border-white/10 hover:bg-white/10"
          >
            <Eye className="h-4 w-4 mr-1" />
            {showPurchaseDate ? 'View Content' : 'View'}
          </Button>
          
          {showActions && (
            <>
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
                onClick={() => onDelete?.(contentId)}
                variant="outline" 
                size="sm" 
                className="border-white/10 hover:bg-white/10 hover:text-red-400 ml-auto"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ContentCard;
