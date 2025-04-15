
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface FilePreviewProps {
  file: File | undefined;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
  if (!file) return null;
  
  return (
    <div className="mt-2 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-md flex items-center gap-2">
      <CheckCircle className="h-4 w-4 text-emerald-500" />
      <span className="text-sm text-emerald-300 truncate">{file.name}</span>
      <span className="text-xs text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
    </div>
  );
};

export default FilePreview;
