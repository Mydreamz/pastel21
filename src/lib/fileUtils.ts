
import { LucideIcon, FileText, Image, FileVideo, FileAudio } from 'lucide-react';

export const getFileIcon = (type: string): LucideIcon => {
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

export const getAcceptString = (type: string): string => {
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

export const validateFile = (
  file: File | null,
  acceptTypes: string,
  maxSize: number
): { isValid: boolean; error: string | null } => {
  if (!file) {
    return { isValid: true, error: null };
  }

  // Check file type
  if (acceptTypes && !file.type.match(acceptTypes.replace(/\*/g, '.*'))) {
    return { 
      isValid: false, 
      error: `Invalid file type. Please upload a valid file.`
    };
  }

  // Check file size
  if (file.size > maxSize * 1024 * 1024) {
    return { 
      isValid: false, 
      error: `File size exceeds ${maxSize}MB limit.`
    };
  }

  return { isValid: true, error: null };
};
