
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getAcceptString, validateFile } from "@/lib/fileUtils";
import FilePreview from "./file-preview";
import { Upload, Camera } from "lucide-react";
import { Button } from "./button";

type FileUploadProps = {
  accept?: string;
  maxSize?: number;
  value?: File | null;
  onChange: (file: File | null) => void;
  className?: string;
  type: 'image' | 'video' | 'audio' | 'document';
};

const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  maxSize = 50,
  value,
  onChange,
  className,
  type
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const acceptTypes = accept || getAcceptString(type);

  // Reset file input when value is cleared
  useEffect(() => {
    if (!value && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (!value && cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    validateAndSetFile(file);
  };

  const validateAndSetFile = async (file: File | null) => {
    if (!file) {
      onChange(null);
      setError(null);
      return;
    }

    setIsUploading(true);
    setError(null);

    // Add a small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 300));

    const { isValid, error } = validateFile(file, acceptTypes, maxSize);
    
    if (!isValid) {
      setError(error);
      setIsUploading(false);
      return;
    }

    setError(null);
    setIsUploading(false);
    onChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    validateAndSetFile(file);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const clearFile = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  };

  // Check if device supports camera
  const supportsCamera = type === 'image' && 'mediaDevices' in navigator;

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "relative rounded-xl border-2 border-dashed transition-all duration-300",
          "min-h-[200px] flex flex-col items-center justify-center",
          isDragging 
            ? "border-primary bg-primary/5" 
            : "border-border hover:border-primary/50",
          value ? "bg-card" : "",
          "mobile-upload-area"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!value ? handleBrowseClick : undefined}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="loading-spinner"></div>
            <p className="text-sm text-muted-foreground">Processing file...</p>
          </div>
        ) : !value ? (
          <div className="flex flex-col items-center gap-4 p-6 text-center">
            <Upload className="h-12 w-12 text-muted-foreground" />
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {isDragging ? `Drop your ${type} here` : `Upload ${type}`}
              </p>
              <p className="text-sm text-muted-foreground">
                Drag & drop or click to browse
              </p>
              {acceptTypes && (
                <p className="text-xs text-muted-foreground">
                  Supported: {acceptTypes.replace(/\./g, '').replace(/,/g, ', ')}
                </p>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              <Button
                type="button"
                variant="default"
                className="flex-1 mobile-upload-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBrowseClick();
                }}
              >
                <Upload className="mr-2 h-4 w-4" />
                Browse Files
              </Button>
              
              {supportsCamera && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCameraClick();
                  }}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Camera
                </Button>
              )}
            </div>
          </div>
        ) : (
          <FilePreview
            file={value}
            type={type}
            onRemove={clearFile}
          />
        )}
        
        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptTypes}
          onChange={handleFileChange}
          className="hidden"
          multiple={false}
        />
        
        {supportsCamera && (
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
            multiple={false}
          />
        )}
      </div>
      
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
};

export { FileUpload };
