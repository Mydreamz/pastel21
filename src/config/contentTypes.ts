
import { FileText, LinkIcon, Image, FileVideo, FileAudio } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export type ContentType = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export const contentTypes: ContentType[] = [{
  id: 'text',
  label: 'Text',
  icon: FileText
}, {
  id: 'link',
  label: 'Link',
  icon: LinkIcon
}, {
  id: 'image',
  label: 'Image',
  icon: Image
}, {
  id: 'video',
  label: 'Video',
  icon: FileVideo
}, {
  id: 'audio',
  label: 'Audio',
  icon: FileAudio
}, {
  id: 'document',
  label: 'Document',
  icon: FileText
}];
