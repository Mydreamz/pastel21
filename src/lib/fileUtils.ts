
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
  if (acceptTypes) {
    const fileType = file.type;
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    // Handle wildcards like 'image/*'
    if (acceptTypes.includes('/*')) {
      const acceptMainType = acceptTypes.split('/')[0];
      const fileMainType = fileType.split('/')[0];
      
      if (acceptMainType !== fileMainType) {
        return { 
          isValid: false, 
          error: `Invalid file type. Please upload a valid ${acceptMainType} file.`
        };
      }
    } 
    // Handle specific extensions like .pdf,.doc
    else if (acceptTypes.includes(',') && acceptTypes.includes('.')) {
      const allowedExtensions = acceptTypes.split(',');
      if (!allowedExtensions.some(ext => fileExtension === ext || file.name.toLowerCase().endsWith(ext))) {
        return { 
          isValid: false, 
          error: `Invalid file type. Allowed formats: ${acceptTypes.replace(/\./g, '').replace(/,/g, ', ')}`
        };
      }
    }
    // Handle specific MIME types
    else if (!fileType.match(acceptTypes.replace(/\*/g, '.*'))) {
      return { 
        isValid: false, 
        error: `Invalid file type. Please upload a valid file.`
      };
    }
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
