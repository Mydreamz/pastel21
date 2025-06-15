
import React from 'react';
import { Loader2 } from 'lucide-react';

type FileUploadLoaderProps = {
  isUploading: boolean;
};

const FileUploadLoader: React.FC<FileUploadLoaderProps> = ({ isUploading }) => {
  return (
    <div className="flex flex-col items-center gap-4 text-center p-4">
      <Loader2 className="h-12 w-12 text-primary animate-spin" />
      <p className="text-lg font-medium text-muted-foreground">
        {isUploading ? 'Uploading...' : 'Processing file...'}
      </p>
      <p className="text-sm text-muted-foreground">
        Please wait, this may take a moment.
      </p>
    </div>
  );
};

export default FileUploadLoader;
