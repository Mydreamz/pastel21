
import { Content } from '@/types/content';
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, Tag, AlertCircle, Lock, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ContentDisplayProps {
  content: Content;
  isCreator: boolean;
  isPurchased: boolean;
  secureFileUrl?: string | null;
  secureFileLoading?: boolean;
  secureFileError?: string | null;
}

const ContentDisplay = ({ 
  content, 
  isCreator, 
  isPurchased, 
  secureFileUrl,
  secureFileLoading,
  secureFileError
}: ContentDisplayProps) => {
  const [mediaError, setMediaError] = useState<string | null>(null);
  
  // Determine which file URL to use (secure URL takes precedence)
  const displayFileUrl = secureFileUrl || content.fileUrl;
  
  // Check if file URL is valid (not a blob URL)
  const isValidFileUrl = displayFileUrl && 
    (displayFileUrl.startsWith('http') || displayFileUrl.startsWith('/'));
  
  const isMediaContent = ['image', 'video', 'audio', 'document'].includes(content.contentType || '');
  const canAccessMedia = isCreator || isPurchased || parseFloat(content.price) === 0;

  const handleMediaError = () => {
    setMediaError("The media file could not be loaded. It may have been stored using a temporary URL or you don't have access to it.");
  };

  return (
    <div className="mt-8 border-t border-gray-200 pt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Full Content</h2>
        <div className="flex gap-2">
          {isCreator && (
            <Badge variant="outline" className="bg-pastel-500/20 text-pastel-700 border-pastel-500/30 rounded-full">
              Creator View
            </Badge>
          )}
          {isPurchased && !isCreator && (
            <Badge variant="outline" className="bg-pastel-400/20 text-pastel-700 border-pastel-400/30 rounded-full">
              Purchased
            </Badge>
          )}
          {parseFloat(content.price) === 0 && (
            <Badge variant="outline" className="bg-pastel-300/20 text-pastel-700 border-pastel-300/30 rounded-full">
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
              className="bg-pastel-500/20 text-pastel-700 border-pastel-500/30 cursor-pointer hover:bg-pastel-500/30 rounded-full"
            >
              <Tag className="h-3 w-3 mr-1" />
              {content.category}
            </Badge>
          )}
          
          {content.tags?.map((tag) => (
            <Badge 
              key={`tag-${tag}`}
              variant="outline" 
              className="bg-white/50 hover:bg-white/70 cursor-pointer border-gray-200 text-gray-700 rounded-full"
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
      )}
      
      {content.contentType === 'text' && content.content && (
        <div className="prose max-w-none text-gray-700">
          <p>{content.content}</p>
        </div>
      )}
      
      {content.contentType === 'link' && content.content && (
        <div className="bg-white/50 p-4 rounded-xl shadow-neumorphic">
          <a 
            href={content.content} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-pastel-700 hover:underline break-all"
          >
            {content.content}
          </a>
        </div>
      )}
      
      {/* Display any error messages */}
      {mediaError && (
        <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200 text-red-700">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{mediaError}</AlertDescription>
        </Alert>
      )}
      
      {secureFileError && (
        <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200 text-red-700">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load secure content: {secureFileError}
          </AlertDescription>
        </Alert>
      )}
      
      {isMediaContent && (
        <div className="mt-4">
          {secureFileLoading && (
            <div className="bg-white/50 border border-gray-200 rounded-xl p-6 flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin text-pastel-500/80" />
              <p className="ml-3 text-gray-600">Loading secure content...</p>
            </div>
          )}
          
          {!canAccessMedia && !secureFileLoading && (
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl p-6 text-center">
              <Lock className="h-8 w-8 mx-auto mb-3 text-pastel-500/80" />
              <p className="text-lg font-medium mb-1 text-gray-800">Protected Content</p>
              <p className="text-gray-600 text-sm">
                This content requires purchase to view
              </p>
            </div>
          )}
          
          {canAccessMedia && !secureFileLoading && content.contentType === 'image' && (
            <div className="overflow-hidden rounded-xl bg-white/50 p-2 flex justify-center shadow-neumorphic">
              {isValidFileUrl ? (
                <img 
                  src={displayFileUrl} 
                  alt={content.title} 
                  onError={handleMediaError}
                  className="max-w-full max-h-[600px] object-contain rounded-xl"
                  loading="lazy"
                />
              ) : (
                <div className="p-6 text-pastel-700">
                  {secureFileError ? 
                    "Error loading secure image content." : 
                    "This image was stored with a temporary URL and needs to be updated."}
                  {isCreator && " Please edit this content to upload the image again."}
                </div>
              )}
            </div>
          )}
          
          {canAccessMedia && !secureFileLoading && content.contentType === 'video' && (
            <div className="overflow-hidden rounded-xl bg-white/50 p-2 shadow-neumorphic">
              {isValidFileUrl ? (
                <video 
                  controls
                  preload="metadata"
                  poster={displayFileUrl + '?poster=true'}
                  onError={handleMediaError}
                  className="w-full rounded-xl"
                >
                  <source src={displayFileUrl} type={content.fileType} />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="p-6 text-pastel-700">
                  {secureFileError ? 
                    "Error loading secure video content." : 
                    "This video was stored with a temporary URL and needs to be updated."}
                  {isCreator && " Please edit this content to upload the video again."}
                </div>
              )}
            </div>
          )}
          
          {canAccessMedia && !secureFileLoading && content.contentType === 'audio' && (
            <div className="bg-white/50 p-4 rounded-xl shadow-neumorphic">
              {isValidFileUrl ? (
                <audio 
                  controls
                  preload="metadata"
                  onError={handleMediaError}
                  className="w-full"
                >
                  <source src={displayFileUrl} type={content.fileType} />
                  Your browser does not support the audio tag.
                </audio>
              ) : (
                <div className="p-6 text-pastel-700">
                  {secureFileError ? 
                    "Error loading secure audio content." : 
                    "This audio was stored with a temporary URL and needs to be updated."}
                  {isCreator && " Please edit this content to upload the audio again."}
                </div>
              )}
            </div>
          )}
          
          {canAccessMedia && !secureFileLoading && content.contentType === 'document' && (
            <div className="bg-white/50 p-4 rounded-xl shadow-neumorphic">
              {isValidFileUrl ? (
                <a 
                  href={displayFileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-pastel-700 hover:underline flex items-center"
                >
                  Download {content.fileName || 'Document'}
                </a>
              ) : (
                <div className="p-6 text-pastel-700">
                  {secureFileError ? 
                    "Error loading secure document." : 
                    "This document was stored with a temporary URL and needs to be updated."}
                  {isCreator && " Please edit this content to upload the document again."}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Content engagement stats */}
      <div className="mt-6 flex items-center gap-4 text-sm text-gray-600">
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
