
import React from 'react';
import { useFormContext } from "react-hook-form";
import { Tabs } from "@/components/ui/tabs";
import { Lock } from 'lucide-react';
import { ContentType } from '../ContentTypeSelector';
import ContentTypeSelector from '../ContentTypeSelector';
import ContentUploader from '../ContentUploader';

const ContentSection: React.FC = () => {
  const [selectedContentType, setSelectedContentType] = React.useState<ContentType>('text');
  const { control, setValue } = useFormContext();
  
  // Update contentType field when selector changes
  React.useEffect(() => {
    setValue('contentType', selectedContentType);
  }, [selectedContentType, setValue]);
  
  return (
    <div className="space-y-3">
      <h3 className="text-base font-medium flex items-center gap-2">
        <Lock className="h-4 w-4" /> Locked Content
      </h3>
      
      <Tabs 
        defaultValue="text" 
        value={selectedContentType} 
        onValueChange={(value) => setSelectedContentType(value as ContentType)} 
        className="w-full"
      >
        <ContentTypeSelector 
          selectedContentType={selectedContentType}
          onValueChange={(value) => setSelectedContentType(value)}
        />
        
        <ContentUploader 
          selectedContentType={selectedContentType}
          control={control}
        />
      </Tabs>
    </div>
  );
};

export default ContentSection;
