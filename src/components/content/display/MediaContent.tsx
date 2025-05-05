
import React, { useState } from 'react';
import { AlertCircle, Lock, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MediaContentProps {
  contentType: string;
  displayFileUrl: string | null;
  isValidFileUrl: boolean;
  canAccessMedia: boolean;
  secureFileLoading?: boolean;
  secureFileError?: string | null;
  title: string;
  fileType?: string;
  fileName?: string;
  isCreator: boolean;
}

const MediaContent = ({
  contentType,
  displayFileUrl,
  isValidFileUrl,
  canAccessMedia,
  secureFileLoading,
  secureFileError,
  title,
  fileType,
  fileName,
  isCreator
}: MediaContentProps) => {
  const [mediaError, setMediaError] = useState<string | null>(null);

  const handleMediaError = () => {
    setMediaError("The media file could not be loaded. It may have been stored using a temporary URL or you don't have access to it.");
  };

  // Show loading state
  if (secureFileLoading) {
    return (
      <div className="bg-white/50 border border-gray-200 rounded-xl p-6 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-pastel-500/80" />
        <p className="ml-3 text-gray-600">Loading secure content...</p>
      </div>
    );
  }

  // Show locked content state
  if (!canAccessMedia && !secureFileLoading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl p-6 text-center">
        <Lock className="h-8 w-8 mx-auto mb-3 text-pastel-500/80" />
        <p className="text-lg font-medium mb-1 text-gray-800">Protected Content</p>
        <p className="text-gray-600 text-sm">
          This content requires purchase to view
        </p>
      </div>
    );
  }

  // Show error state if there's a media error
  if (mediaError) {
    return (
      <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200 text-red-700">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{mediaError}</AlertDescription>
      </Alert>
    );
  }

  // Show secure file error state
  if (secureFileError) {
    return (
      <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200 text-red-700">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load secure content: {secureFileError}
        </AlertDescription>
      </Alert>
    );
  }

  // Render appropriate media content based on content type
  switch (contentType) {
    case 'image':
      return (
        <div className="overflow-hidden rounded-xl bg-white/50 p-2 flex justify-center shadow-neumorphic">
          {isValidFileUrl ? (
            <img 
              src={displayFileUrl || ''} 
              alt={title} 
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
      );

    case 'video':
      return (
        <div className="overflow-hidden rounded-xl bg-white/50 p-2 shadow-neumorphic">
          {isValidFileUrl ? (
            <video 
              controls
              preload="metadata"
              poster={displayFileUrl + '?poster=true'}
              onError={handleMediaError}
              className="w-full rounded-xl"
            >
              <source src={displayFileUrl || ''} type={fileType} />
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
      );

    case 'audio':
      return (
        <div className="bg-white/50 p-4 rounded-xl shadow-neumorphic">
          {isValidFileUrl ? (
            <audio 
              controls
              preload="metadata"
              onError={handleMediaError}
              className="w-full"
            >
              <source src={displayFileUrl || ''} type={fileType} />
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
      );

    case 'document':
      return (
        <div className="bg-white/50 p-4 rounded-xl shadow-neumorphic">
          {isValidFileUrl ? (
            <a 
              href={displayFileUrl || ''} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pastel-700 hover:underline flex items-center"
            >
              Download {fileName || 'Document'}
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
      );

    default:
      return null;
  }
};

export default MediaContent;
