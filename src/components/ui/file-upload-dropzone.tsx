
import React from 'react';
import { Upload, Camera } from 'lucide-react';
import { Button } from './button';

type FileUploadDropzoneProps = {
  type: 'image' | 'video' | 'audio' | 'document';
  isDragging: boolean;
  acceptTypes: string;
  maxSize: number;
  onBrowseClick: () => void;
  onCameraClick: () => void;
  supportsCamera: boolean;
};

const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  type,
  isDragging,
  acceptTypes,
  maxSize,
  onBrowseClick,
  onCameraClick,
  supportsCamera,
}) => {
  return (
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
            <br />
            Max size: {maxSize}MB
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
            onBrowseClick();
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
              onCameraClick();
            }}
          >
            <Camera className="mr-2 h-4 w-4" />
            Camera
          </Button>
        )}
      </div>
    </div>
  );
};

export default FileUploadDropzone;
