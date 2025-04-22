
import React from 'react';
import { Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { getFileIcon } from '@/lib/fileUtils';

type UploadAreaProps = {
  type: 'image' | 'video' | 'audio' | 'document';
  isDragging: boolean;
  onButtonClick: () => void;
  accept?: string;
};

const UploadArea = ({ type, isDragging, onButtonClick, accept }: UploadAreaProps) => {
  const FileIcon = getFileIcon(type);
  
  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <FileIcon className="h-10 w-10 text-gray-400 mb-2" />
      <p className="text-gray-400 mb-2">
        Drag & drop your {type} here or
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onButtonClick}
        className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/10"
      >
        <Upload className="mr-2 h-4 w-4" />
        Browse
      </Button>
      {accept && (
        <p className="text-xs text-gray-400 mt-2">
          Accepted formats: {accept.replace(/\./g, '').replace(/,/g, ', ')}
        </p>
      )}
    </div>
  );
};

export default UploadArea;
