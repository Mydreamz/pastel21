
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

const EditContent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { user, session } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
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
            expiry: content.expiry || ""
          });
          
          setSelectedContentType(content.content_type);
          if (content.expiry) {
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                
                <ContentFormActions />
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditContent;
