
import React from 'react';
import { Card } from "@/components/ui/card";
import { FileText, FileImage, FileVideo, FileAudio } from 'lucide-react';

type FilePreviewProps = {
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  contentType: string;
};

const FilePreview: React.FC<FilePreviewProps> = ({
  fileUrl,
  fileName,
  fileType,
  contentType
}) => {
  if (!fileUrl) return null;

  const renderPreview = () => {
    if (contentType === 'image' || fileType?.startsWith('image/')) {
      return (
        <div className="flex justify-center py-4">
          <img 
            src={fileUrl} 
            alt={fileName || "Image preview"} 
            className="max-h-60 max-w-full rounded-md object-contain"
          />
        </div>
      );
    }
    
    if (contentType === 'video' || fileType?.startsWith('video/')) {
      return (
        <div className="flex justify-center py-4">
          <video 
            src={fileUrl} 
            controls 
            className="max-h-60 max-w-full rounded-md"
          />
        </div>
      );
    }
    
    if (contentType === 'audio' || fileType?.startsWith('audio/')) {
      return (
        <div className="flex justify-center py-4">
          <audio 
            src={fileUrl} 
            controls 
            className="w-full"
          />
        </div>
      );
    }
    
    // For documents and other files
    return (
      <div className="flex flex-col items-center py-8">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
          {contentType === 'document' ? (
            <FileText className="h-8 w-8 text-emerald-500" />
          ) : fileType?.includes('image') ? (
            <FileImage className="h-8 w-8 text-emerald-500" />
          ) : fileType?.includes('video') ? (
            <FileVideo className="h-8 w-8 text-emerald-500" /> 
          ) : fileType?.includes('audio') ? (
            <FileAudio className="h-8 w-8 text-emerald-500" />
          ) : (
            <FileText className="h-8 w-8 text-emerald-500" />
          )}
        </div>
        <p className="text-white font-medium mb-1 text-center">
          {fileName || "File"}
        </p>
        <p className="text-gray-400 text-sm">
          {fileType || "Unknown file type"}
        </p>
      </div>
    );
  };

  return (
    <Card className="glass-card border-white/10 overflow-hidden">
      {renderPreview()}
    </Card>
  );
};

export default FilePreview;
