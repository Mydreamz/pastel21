
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, X } from 'lucide-react';

type FilePreviewProps = {
  file: File;
  type: 'image' | 'video' | 'audio' | 'document';
  onRemove: () => void;
};

const FilePreview = ({ file, type, onRemove }: FilePreviewProps) => {
  const fileUrl = URL.createObjectURL(file);
  
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 h-8 w-8 rounded-full hover:bg-white/10"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
      
      {type === "image" && (
        <img 
          src={fileUrl} 
          alt={file.name}
          className="max-h-32 max-w-[90%] object-contain rounded"
          loading="lazy"
        />
      )}
      
      {type === "video" && (
        <video 
          src={fileUrl} 
          controls 
          preload="metadata"
          className="max-h-32 max-w-[90%] object-contain rounded"
        >
          <source src={fileUrl} type={file.type} />
        </video>
      )}
      
      {type === "audio" && (
        <audio 
          src={fileUrl} 
          controls 
          preload="metadata"
          className="max-w-[90%]"
        >
          <source src={fileUrl} type={file.type} />
        </audio>
      )}
      
      {type === "document" && (
        <div className="flex flex-col items-center">
          <FileText className="h-16 w-16 text-emerald-500" />
          <p className="mt-2 text-sm font-medium text-white truncate max-w-[90%]">
            {file.name}
          </p>
          <p className="text-xs text-gray-400">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      )}
      
      <p className="text-xs text-gray-400 mt-2 truncate max-w-[90%]">
        {file.name}
      </p>
    </div>
  );
};

export default FilePreview;
