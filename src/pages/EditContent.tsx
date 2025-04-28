
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/App';
import { useContentForm } from '@/hooks/useContentForm';
import ContentTypeSelector from '@/components/content/ContentTypeSelector';
import BasicInfoFields from '@/components/content/BasicInfoFields';
import AdvancedSettings from '@/components/content/AdvancedSettings';
import ContentHeader from '@/components/content/ContentHeader';
import ContentFormActions from '@/components/content/ContentFormActions';
import StarsBackground from '@/components/StarsBackground';
import { uploadFileToStorage, deleteFileFromStorage } from '@/lib/fileUtils';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const EditContent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { user, session } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [originalFilePath, setOriginalFilePath] = useState<string | null>(null);
  
  const {
    form,
    onSubmit,
    selectedContentType,
    setSelectedContentType,
    selectedFile,
    setSelectedFile,
    showAdvanced,
    setShowAdvanced
  } = useContentForm();

  useEffect(() => {
    const loadContent = async () => {
      if (!session || !user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to edit content",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      try {
        setIsLoading(true);
        
        const { data: content, error } = await supabase
          .from('contents')
          .select('*')
          .eq('id', id)
          .eq('creator_id', user.id)
          .maybeSingle();

        if (error) throw error;
        
        if (content) {
          form.reset({
            title: content.title,
            teaser: content.teaser,
            price: content.price.toString(),
            content: content.content || '',
            expiry: content.expiry || "",
            tags: content.tags || []
          });
          
          setSelectedContentType(content.content_type);
          // Check for file_path in the content object
          if (content.file_path) {
            setOriginalFilePath(content.file_path);
          }
          
          if (content.expiry || (content.tags && content.tags.length > 0)) {
            setShowAdvanced(true);
          }
        } else {
          toast({
            title: "Content not found",
            description: "The content you're trying to edit couldn't be found or you don't have permission to edit it.",
            variant: "destructive"
          });
          navigate('/');
        }
      } catch (error: any) {
        console.error("Error loading content:", error);
        toast({
          title: "Error",
          description: "Failed to load content data: " + error.message,
          variant: "destructive"
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [id, form, navigate, toast, user, session]);
  
  const handleSubmit = async (values: any) => {
    if (!user || !id) return;
    
    try {
      setIsSaving(true);
      
      let fileUrl, fileName, fileType, fileSize, filePath;
      
      // Handle file upload if a new file is selected
      if (['image', 'video', 'audio', 'document'].includes(selectedContentType) && selectedFile) {
        // Upload new file to Supabase Storage
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
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Content updated",
        description: "Your content has been successfully updated"
      });

      navigate(`/view/${id}`);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="animate-spin h-8 w-8 border-t-2 border-emerald-500 border-r-2 rounded-full mr-3"></div>
        Loading content...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col antialiased text-white relative overflow-x-hidden">
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 md:px-6 py-6">
        <ContentHeader />
        
        <Card className="glass-card border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold">Edit Content</CardTitle>
            <CardDescription className="text-gray-300">
              Update your content details
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                    onClick={() => navigate(`/view/${id}`)}
                    className="border-gray-700 hover:border-gray-600 text-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditContent;
