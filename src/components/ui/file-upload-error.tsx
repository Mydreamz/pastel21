
import React from 'react';

type FileUploadErrorProps = {
  error: string | null;
};

const FileUploadError: React.FC<FileUploadErrorProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
      <p className="text-sm text-destructive">{error}</p>
    </div>
  );
};

export default FileUploadError;
