
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';

interface FileUploadAreaProps {
  icon: React.ReactNode;
  fileType: string;
  accept: string;
  onFileSelect: (file: File) => void;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  icon,
  fileType,
  accept,
  onFileSelect
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };
  
  return (
    <div 
      className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/20 rounded-md cursor-pointer hover:bg-white/5 transition-colors"
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
      />
      {icon}
      <p className="text-gray-400 text-xs text-center px-2">
        Drag & drop {fileType} or <span className="text-emerald-500">browse</span>
      </p>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="mt-2 h-8 text-xs border-white/10 bg-white/5 hover:bg-white/10"
        onClick={(e) => {
          e.stopPropagation();
          fileInputRef.current?.click();
        }}
      >
        <Upload className="h-3.5 w-3.5 mr-1" />
        Choose {fileType}
      </Button>
    </div>
  );
};

export default FileUploadArea;
