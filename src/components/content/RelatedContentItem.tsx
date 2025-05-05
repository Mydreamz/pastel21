
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { DollarSign, FileText, Image, Video, Link as LinkIcon } from 'lucide-react';

interface RelatedContentItemProps {
  item: any;
}

const RelatedContentItem = ({ item }: RelatedContentItemProps) => {
  const navigate = useNavigate();

  return (
    <div 
      key={item.id} 
      className="glass-card p-4 rounded-lg cursor-pointer hover:border-emerald-500/30 transition-colors border border-white/10" 
      onClick={() => navigate(`/view/${item.id}`)}
    >
      <div className="flex items-center justify-between mb-2">
        {(() => {
          switch (item.contentType) {
            case 'text':
              return <FileText className="h-4 w-4 text-blue-400" />;
            case 'image':
              return <Image className="h-4 w-4 text-purple-400" />;
            case 'video':
              return <Video className="h-4 w-4 text-red-400" />;
            case 'link':
              return <LinkIcon className="h-4 w-4 text-yellow-400" />;
            default:
              return <FileText className="h-4 w-4 text-blue-400" />;
          }
        })()}
        {parseFloat(item.price) > 0 && (
          <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 flex items-center">
            <DollarSign className="h-3 w-3 mr-1" />
            {parseFloat(item.price).toFixed(2)}
          </Badge>
        )}
      </div>
      <h4 className="font-medium text-emerald-300 mb-1">{item.title}</h4>
      <p className="text-sm text-gray-400 line-clamp-2">{item.teaser}</p>
    </div>
  );
};

export default memo(RelatedContentItem);
