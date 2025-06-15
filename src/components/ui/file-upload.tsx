
import React from "react";
import { cn } from "@/lib/utils";
import FilePreview from "./file-preview";
import { useFileUpload } from "@/hooks/useFileUpload";
import FileUploadLoader from "./file-upload-loader";
import FileUploadDropzone from "./file-upload-dropzone";
import FileUploadError from "./file-upload-error";

type FileUploadProps = {
  accept?: string;
  maxSize?: number;
  value?: File | null;
  onChange: (file: File | null) => void;
  className?: string;
  type: 'image' | 'video' | 'audio' | 'document';
  isUploading?: boolean;
};

const FileUpload: React.FC<FileUploadProps> = ({
  value,
  onChange,
  className,
  type,
  accept,
  maxSize: maxSizeProp,
  isUploading = false,
}) => {
  const {
    isDragging,
    error,
    isProcessing,
    fileInputRef,
    cameraInputRef,
    maxSize,
    acceptTypes,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleBrowseClick,
    handleCameraClick,
    clearFile,
  } = useFileUpload({ accept, maxSize: maxSizeProp, value, onChange, type });

  const supportsCamera = type === 'image' && typeof window !== 'undefined' && 'mediaDevices' in navigator;
  const showLoader = isUploading || isProcessing;

  const handleContainerClick = () => {
    if (!value && !showLoader) {
      handleBrowseClick();
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "relative rounded-xl border-2 border-dashed transition-all duration-300",
          "min-h-[200px] flex flex-col items-center justify-center cursor-pointer",
          isDragging 
            ? "border-primary bg-primary/5" 
            : "border-border hover:border-primary/50",
          value && !showLoader ? "bg-card cursor-default" : "",
          !value && !showLoader ? "hover:bg-accent/50" : "",
          "mobile-upload-area"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleContainerClick}
      >
        {showLoader ? (
          <FileUploadLoader isUploading={isUploading} />
        ) : !value ? (
          <FileUploadDropzone
            type={type}
            isDragging={isDragging}
            acceptTypes={acceptTypes}
            maxSize={maxSize}
            onBrowseClick={handleBrowseClick}
            onCameraClick={handleCameraClick}
            supportsCamera={supportsCamera}
          />
        ) : (
          <FilePreview
            file={value}
            type={type}
            onRemove={clearFile}
          />
        )}
        
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
      
      <FileUploadError error={error} />
    </div>
  );
};

export { FileUpload };
