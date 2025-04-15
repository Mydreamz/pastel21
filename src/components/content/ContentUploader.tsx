
import React from 'react';
import { ContentType } from './ContentTypeSelector';
import { Control } from 'react-hook-form';
import { ContentFormValues } from './form/ContentFormProvider';
import TextUploader from './uploaders/TextUploader';
import LinkUploader from './uploaders/LinkUploader';
import ImageUploader from './uploaders/ImageUploader';
import VideoUploader from './uploaders/VideoUploader';
import AudioUploader from './uploaders/AudioUploader';
import DocumentUploader from './uploaders/DocumentUploader';

interface ContentUploaderProps {
  selectedContentType: ContentType;
  control: Control<ContentFormValues>;
}

const ContentUploader: React.FC<ContentUploaderProps> = ({ 
  selectedContentType,
  control
}) => {
  return (
    <div className="mt-3">
      <TextUploader control={control} />
      <LinkUploader control={control} />
      <ImageUploader control={control} />
      <VideoUploader control={control} />
      <AudioUploader control={control} />
      <DocumentUploader control={control} />
    </div>
  );
};

export default ContentUploader;
