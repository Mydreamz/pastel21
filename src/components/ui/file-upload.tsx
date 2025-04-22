import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { getAcceptString, validateFile } from "@/lib/fileUtils";
import FilePreview from "./file-preview";
import UploadArea from "./upload-area";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const acceptTypes = accept || getAcceptString(type);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    validateAndSetFile(file);
  };
  const validateAndSetFile = (file: File | null) => {
    const {
      isValid,
      error
    } = validateFile(file, acceptTypes, maxSize);
    if (!isValid) {
      setError(error);
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
  return <div className={cn("space-y-2", className)}>
      <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className="mx-0 my-[100px]">
        {!value ? <UploadArea type={type} isDragging={isDragging} onButtonClick={handleButtonClick} /> : <FilePreview file={value} type={type} onRemove={() => {
        onChange(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }} />}
        
        <input ref={fileInputRef} type="file" accept={acceptTypes} onChange={handleFileChange} className="hidden" />
      </div>
      
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>;
};
export { FileUpload };