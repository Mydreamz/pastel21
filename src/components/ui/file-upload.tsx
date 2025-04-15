
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileText, Image, FileVideo, FileAudio, Upload, X } from "lucide-react";

type FileUploadProps = {
  accept?: string;
  maxSize?: number; // in MB
  value?: File | null;
  onChange: (file: File | null) => void;
  className?: string;
  type: 'image' | 'video' | 'audio' | 'document';
};

const getFileIcon = (type: string) => {
  switch (type) {
    case 'image':
      return Image;
    case 'video':
      return FileVideo;
    case 'audio':
      return FileAudio;
    case 'document':
    default:
      return FileText;
  }
};

const getAcceptString = (type: string): string => {
  switch (type) {
    case 'image':
      return 'image/*';
    case 'video':
      return 'video/*';
    case 'audio':
      return 'audio/*';
    case 'document':
      return '.pdf,.doc,.docx,.txt,.rtf,.ppt,.pptx,.xls,.xlsx';
    default:
      return '';
  }
};

const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  maxSize = 50, // Default 50MB max size
  value,
  onChange,
  className,
  type
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const FileIcon = getFileIcon(type);
  const acceptTypes = accept || getAcceptString(type);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file: File | null) => {
    if (!file) {
      setError(null);
      onChange(null);
      return;
    }

    // Check file type if accept is specified
    if (acceptTypes && !file.type.match(acceptTypes.replace(/\*/g, '.*'))) {
      setError(`Invalid file type. Please upload a ${type} file.`);
      return;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit.`);
      return;
    }

    setError(null);
    onChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    validateAndSetFile(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-md transition-colors",
          isDragging ? "border-emerald-500 bg-emerald-500/10" : "border-white/20",
          value ? "bg-white/5" : "",
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!value ? (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <FileIcon className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-gray-400 mb-2">
              Drag & drop your {type} here or
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleButtonClick}
              className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/10"
            >
              <Upload className="mr-2 h-4 w-4" />
              Browse
            </Button>
          </div>
        ) : (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 h-8 w-8 rounded-full hover:bg-white/10"
              onClick={handleRemoveFile}
            >
              <X className="h-4 w-4" />
            </Button>
            
            {type === "image" && (
              <img 
                src={URL.createObjectURL(value)} 
                alt="Preview" 
                className="max-h-32 max-w-[90%] object-contain rounded"
              />
            )}
            
            {type === "video" && (
              <video 
                src={URL.createObjectURL(value)} 
                controls 
                className="max-h-32 max-w-[90%] object-contain rounded"
              />
            )}
            
            {type === "audio" && (
              <audio 
                src={URL.createObjectURL(value)} 
                controls 
                className="max-w-[90%]"
              />
            )}
            
            {type === "document" && (
              <div className="flex flex-col items-center">
                <FileText className="h-16 w-16 text-emerald-500" />
                <p className="mt-2 text-sm font-medium text-white truncate max-w-[90%]">
                  {value.name}
                </p>
                <p className="text-xs text-gray-400">
                  {(value.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
            
            <p className="text-xs text-gray-400 mt-2">
              {value.name}
            </p>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptTypes}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export { FileUpload };
