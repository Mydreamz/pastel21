
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { FileText, Image, Video, Link as LinkIcon } from 'lucide-react';

interface ContentTypeBadgeProps {
  contentType: string;
}

const ContentTypeBadge: React.FC<ContentTypeBadgeProps> = ({ contentType }) => {
  switch (contentType) {
    case 'text':
      return (
        <Badge variant="outline" className="bg-pastel-300/20 text-pastel-700 border-pastel-300/30 rounded-full">
          <FileText className="h-3 w-3 mr-1" /> Text
        </Badge>
      );
    case 'image':
      return (
        <Badge variant="outline" className="bg-pastel-400/20 text-pastel-700 border-pastel-400/30 rounded-full">
          <Image className="h-3 w-3 mr-1" /> Image
        </Badge>
      );
    case 'video':
      return (
        <Badge variant="outline" className="bg-pastel-500/20 text-pastel-700 border-pastel-500/30 rounded-full">
          <Video className="h-3 w-3 mr-1" /> Video
        </Badge>
      );
    case 'link':
      return (
        <Badge variant="outline" className="bg-pastel-200/20 text-pastel-700 border-pastel-200/30 rounded-full">
          <LinkIcon className="h-3 w-3 mr-1" /> Link
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-pastel-100/20 text-pastel-700 border-pastel-100/30 rounded-full">
          <FileText className="h-3 w-3 mr-1" /> Content
        </Badge>
      );
  }
};

export default ContentTypeBadge;
