
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/App';
import { useContentForm } from '@/hooks/useContentForm';
import StarsBackground from '@/components/StarsBackground';
import ContentHeader from '@/components/content/ContentHeader';
import EditContentForm from '@/components/content/EditContentForm';
import EditContentLoader from '@/components/content/EditContentLoader';

const EditContent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { user, session } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [originalFilePath, setOriginalFilePath] = useState<string | null>(null);
  
  const {
    form,
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
  
  if (isLoading) {
    return <EditContentLoader />;
  }

  return (
    <div className="min-h-screen flex flex-col antialiased text-gray-800 relative overflow-x-hidden bg-[#EAEFFC]">
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 md:px-6 py-6">
        <ContentHeader />
        
        <Card className="glass-card shadow-neumorphic border-pastel-200/50 text-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800">Edit Content</CardTitle>
            <CardDescription className="text-gray-600">
              Update your content details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EditContentForm
              form={form}
              selectedContentType={selectedContentType}
              setSelectedContentType={setSelectedContentType}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              showAdvanced={showAdvanced}
              setShowAdvanced={setShowAdvanced}
              contentId={id!}
              originalFilePath={originalFilePath}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditContent;
