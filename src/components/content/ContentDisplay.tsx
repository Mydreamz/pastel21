
import { Content } from '@/types/content';
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, Tag, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ContentDisplayProps {
  content: Content;
  isCreator: boolean;
  isPurchased: boolean;
}

const ContentDisplay = ({ content, isCreator, isPurchased }: ContentDisplayProps) => {
  const [mediaError, setMediaError] = useState<string | null>(null);
  
  // Check if file URL is valid (not a blob URL)
  const isValidFileUrl = content.fileUrl && 
    (content.fileUrl.startsWith('http') || content.fileUrl.startsWith('/'));

  const handleMediaError = () => {
    setMediaError("The media file could not be loaded. It may have been stored using a temporary URL.");
  };

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
        <div className="flex flex-wrap gap-2 mb-4">
          {content.category && (
            <Badge 
              variant="outline" 
              className="bg-purple-500/20 text-purple-300 border-purple-500/30 cursor-pointer hover:bg-purple-500/30"
            >
              <Tag className="h-3 w-3 mr-1" />
              {content.category}
            </Badge>
          )}
          
          {content.tags?.map((tag) => (
            <Badge 
              key={`tag-${tag}`}
              variant="outline" 
              className="bg-white/5 hover:bg-white/10 cursor-pointer border-white/10"
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
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
      
      {mediaError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{mediaError}</AlertDescription>
        </Alert>
      )}
      
      {content.fileUrl && (
        <div className="mt-4">
          {content.contentType === 'image' && (
            <div className="overflow-hidden rounded-md bg-white/5 p-2 flex justify-center">
              {isValidFileUrl ? (
                <img 
                  src={content.fileUrl} 
                  alt={content.title} 
                  onError={handleMediaError}
                  className="max-w-full max-h-[600px] object-contain rounded-md"
                  loading="lazy"
                />
              ) : (
                <div className="p-6 text-amber-400">
                  This image was stored with a temporary URL and needs to be updated.
                  {isCreator && " Please edit this content to upload the image again."}
                </div>
              )}
            </div>
          )}
          
          {content.contentType === 'video' && (
            <div className="overflow-hidden rounded-md bg-white/5 p-2">
              {isValidFileUrl ? (
                <video 
                  controls
                  preload="metadata"
                  poster={content.fileUrl + '?poster=true'}
                  onError={handleMediaError}
                  className="w-full rounded-md"
                >
                  <source src={content.fileUrl} type={content.fileType} />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="p-6 text-amber-400">
                  This video was stored with a temporary URL and needs to be updated.
                  {isCreator && " Please edit this content to upload the video again."}
                </div>
              )}
            </div>
          )}
          
          {content.contentType === 'audio' && (
            <div className="bg-white/5 p-4 rounded-md">
              {isValidFileUrl ? (
                <audio 
                  controls
                  preload="metadata"
                  onError={handleMediaError}
                  className="w-full"
                >
                  <source src={content.fileUrl} type={content.fileType} />
                  Your browser does not support the audio tag.
                </audio>
              ) : (
                <div className="p-6 text-amber-400">
                  This audio was stored with a temporary URL and needs to be updated.
                  {isCreator && " Please edit this content to upload the audio again."}
                </div>
              )}
            </div>
          )}
          
          {content.contentType === 'document' && (
            <div className="bg-white/5 p-4 rounded-md">
              {isValidFileUrl ? (
                <a 
                  href={content.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline flex items-center"
                >
                  Download {content.fileName || 'Document'}
                </a>
              ) : (
                <div className="p-6 text-amber-400">
                  This document was stored with a temporary URL and needs to be updated.
                  {isCreator && " Please edit this content to upload the document again."}
                </div>
              )}
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
          <span>{content.contentType === 'text' ? `${Math.ceil((content.content?.length || 0) / 1000)} min read` : '3 min'}</span>
        </div>
      </div>
    </div>
  );
};

export default ContentDisplay;
