
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
        <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
          <FileText className="h-3 w-3 mr-1" /> Text
        </Badge>
      );
    case 'image':
      return (
        <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
          <Image className="h-3 w-3 mr-1" /> Image
        </Badge>
      );
    case 'video':
      return (
        <Badge variant="outline" className="bg-red-500/20 text-red-300 border-red-500/30">
          <Video className="h-3 w-3 mr-1" /> Video
        </Badge>
      );
    case 'link':
      return (
        <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
          <LinkIcon className="h-3 w-3 mr-1" /> Link
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-gray-500/20 text-gray-300 border-gray-500/30">
          <FileText className="h-3 w-3 mr-1" /> Content
        </Badge>
      );
  }
};

export default ContentTypeBadge;
