
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
        <Badge variant="outline" className="bg-blue-300/20 text-blue-700 border-blue-300/30">
          <FileText className="h-3 w-3 mr-1" /> Text
        </Badge>
      );
    case 'image':
      return (
        <Badge variant="outline" className="bg-purple-300/20 text-purple-700 border-purple-300/30">
          <Image className="h-3 w-3 mr-1" /> Image
        </Badge>
      );
    case 'video':
      return (
        <Badge variant="outline" className="bg-red-300/20 text-red-700 border-red-300/30">
          <Video className="h-3 w-3 mr-1" /> Video
        </Badge>
      );
    case 'link':
      return (
        <Badge variant="outline" className="bg-yellow-300/20 text-yellow-700 border-yellow-300/30">
          <LinkIcon className="h-3 w-3 mr-1" /> Link
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-gray-300/20 text-gray-700 border-gray-300/30">
          <FileText className="h-3 w-3 mr-1" /> Content
        </Badge>
      );
  }
};

export default ContentTypeBadge;
