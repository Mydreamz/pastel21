
import { Content } from '@/types/content';
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, Share2, DollarSign } from 'lucide-react';
import ContentTags from './ContentTags';

interface ContentDisplayProps {
  content: Content;
  isCreator: boolean;
  isPurchased: boolean;
}

const ContentDisplay = ({ content, isCreator, isPurchased }: ContentDisplayProps) => {
  return (
    <div className="mt-8 border-t border-white/10 pt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Full Content</h2>
        <div className="flex gap-2">
          {isCreator && (
            <Badge variant="outline" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
              Creator View
            </Badge>
          )}
          {isPurchased && !isCreator && (
            <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
              Purchased
            </Badge>
          )}
          {parseFloat(content.price) === 0 && (
            <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              Free
            </Badge>
          )}
        </div>
      </div>
      
      {/* Display tags if available */}
      {(content.tags?.length || content.category) && (
        <ContentTags 
          tags={content.tags} 
          categories={content.category ? [content.category] : []} 
          className="mb-4"
        />
      )}
      
      {content.contentType === 'text' && content.content && (
        <div className="prose prose-invert max-w-none">
          <p>{content.content}</p>
        </div>
      )}
      
      {content.contentType === 'link' && content.content && (
        <div className="bg-white/5 p-4 rounded-md">
          <a 
            href={content.content} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-emerald-400 hover:underline break-all"
          >
            {content.content}
          </a>
        </div>
      )}
      
      {content.fileUrl && (
        <div className="mt-4">
          {content.contentType === 'image' && (
            <div className="overflow-hidden rounded-md bg-white/5 p-2 flex justify-center">
              <img 
                src={content.fileUrl} 
                alt={content.title} 
                className="max-w-full max-h-[600px] object-contain rounded-md"
                loading="lazy"
              />
            </div>
          )}
          
          {content.contentType === 'video' && (
            <div className="overflow-hidden rounded-md bg-white/5 p-2">
              <video 
                controls
                preload="metadata"
                poster={content.fileUrl + '?poster=true'}
                className="w-full rounded-md"
              >
                <source src={content.fileUrl} type={content.fileType} />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          
          {content.contentType === 'audio' && (
            <div className="bg-white/5 p-4 rounded-md">
              <audio 
                controls
                preload="metadata"
                className="w-full"
              >
                <source src={content.fileUrl} type={content.fileType} />
                Your browser does not support the audio tag.
              </audio>
            </div>
          )}
          
          {content.contentType === 'document' && (
            <div className="bg-white/5 p-4 rounded-md">
              <a 
                href={content.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline flex items-center"
              >
                Download {content.fileName || 'Document'}
              </a>
            </div>
          )}
        </div>
      )}
      
      {/* Content engagement stats */}
      <div className="mt-6 flex items-center gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          <span>{content.views || Math.floor(Math.random() * 100) + 5} views</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{content.contentType === 'text' ? `${Math.ceil(content.content?.length / 1000)} min read` : '3 min'}</span>
        </div>
      </div>
    </div>
  );
};

export default ContentDisplay;
