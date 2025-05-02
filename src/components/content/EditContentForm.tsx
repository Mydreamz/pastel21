
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from "@/components/ui/form";
import { UseFormReturn } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { ContentFormValues } from '@/types/content';
import ContentTypeSelector from '@/components/content/ContentTypeSelector';
import BasicInfoFields from '@/components/content/BasicInfoFields';
import AdvancedSettings from '@/components/content/AdvancedSettings';
import { deleteFileFromStorage, uploadFileToStorage } from '@/lib/fileUtils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EditContentFormProps {
  form: UseFormReturn<ContentFormValues>;
  selectedContentType: string;
  setSelectedContentType: (type: string) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  showAdvanced: boolean;
  setShowAdvanced: (show: boolean) => void;
  contentId: string;
  originalFilePath: string | null;
}

const EditContentForm = ({
  form,
  selectedContentType,
  setSelectedContentType,
  selectedFile,
  setSelectedFile,
  showAdvanced,
  setShowAdvanced,
  contentId,
  originalFilePath
}: EditContentFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (values: ContentFormValues) => {
    try {
      setIsSaving(true);
      
      let fileUrl, fileName, fileType, fileSize, filePath;
      
      // Handle file upload if a new file is selected
      if (['image', 'video', 'audio', 'document'].includes(selectedContentType) && selectedFile) {
        // Upload new file to Supabase Storage
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) {
          toast({
            title: "Authentication required",
            description: "Please sign in to edit content",
            variant: "destructive"
          });
          navigate('/');
          return;
        }

        const uploadResult = await uploadFileToStorage(selectedFile, user.id);
        
        if (!uploadResult) {
          toast({
            title: "Upload failed",
            description: "Failed to upload the new file. Please try again.",
            variant: "destructive"
          });
          setIsSaving(false);
          return;
        }
        
        // Delete the old file if it exists
        if (originalFilePath) {
          await deleteFileFromStorage(originalFilePath);
        }
        
        fileUrl = uploadResult.url;
        filePath = uploadResult.path;
        fileName = selectedFile.name;
        fileType = selectedFile.type;
        fileSize = selectedFile.size;
      }

      // Prepare payload for update
      const payload: any = {
        title: values.title,
        teaser: values.teaser,
        price: values.price,
        content: (selectedContentType === 'text' || selectedContentType === 'link') ? values.content : '',
        expiry: values.expiry || null,
        tags: values.tags || [],
        category: values.category || null,
        updated_at: new Date().toISOString()
      };
      
      // Only update file info if a new file was uploaded
      if (fileUrl) {
        payload.file_url = fileUrl;
        payload.file_name = fileName;
        payload.file_type = fileType;
        payload.file_size = fileSize;
        payload.file_path = filePath;
      }

      const { data, error } = await supabase
        .from('contents')
        .update(payload)
        .eq('id', contentId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Content updated",
        description: "Your content has been successfully updated"
      });

      navigate(`/view/${contentId}`);
    } catch (error: any) {
      console.error("Error updating content:", error);
      toast({
        title: "Error",
        description: "Failed to update content: " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <BasicInfoFields form={form} />
        
        <ContentTypeSelector
          form={form}
          selectedContentType={selectedContentType}
          setSelectedContentType={setSelectedContentType}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />
        
        <AdvancedSettings 
          form={form}
          showAdvanced={showAdvanced}
          setShowAdvanced={setShowAdvanced}
        />
        
        <div className="flex justify-end gap-4 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(`/view/${contentId}`)}
            className="border-pastel-200 hover:bg-pastel-100 text-gray-700"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-pastel-500 hover:bg-pastel-600 text-white"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditContentForm;
