
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { contentFormSchema, ContentFormValues } from '@/types/content';
import { useNotifications } from '@/contexts/NotificationContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/App';
import { uploadFileToStorage } from '@/lib/fileUtils';

export const useContentForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { notifications, addNotification } = useNotifications();
  const [selectedContentType, setSelectedContentType] = useState<string>('text');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { user, session, isLoading } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      title: "",
      teaser: "",
      price: "0",
      content: "",
      expiry: "",
      file: null,
      tags: []
    }
  });

  const onSubmit = async (values: ContentFormValues) => {
    // Verify authentication before proceeding
    try {
      setIsUploading(true);
      
      if (!session || !user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create content",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      // Handle file upload if needed
      let fileUrl, fileName, fileType, fileSize, filePath;
      if (['image', 'video', 'audio', 'document'].includes(selectedContentType)) {
        if (!selectedFile) {
          toast({
            title: "File required",
            description: `Please select a ${selectedContentType} file to upload`,
            variant: "destructive"
          });
          setIsUploading(false);
          return;
        }
        
        // Upload file to Supabase Storage
        const uploadResult = await uploadFileToStorage(selectedFile, user.id);
        
        if (!uploadResult) {
          toast({
            title: "Upload failed",
            description: "Failed to upload the file. Please try again.",
            variant: "destructive"
          });
          setIsUploading(false);
          return;
        }
        
        fileUrl = uploadResult.url;
        filePath = uploadResult.path;
        fileName = selectedFile.name;
        fileType = selectedFile.type;
        fileSize = selectedFile.size;
      }

      // Ensure we're using the most current user data
      const userId = user.id;
      const userName = user.user_metadata?.name || 
                       user.email?.split('@')[0] || 
                       'Anonymous';

      // Map properties for Supabase and convert dates to strings
      const payload: any = {
        title: values.title,
        teaser: values.teaser,
        price: values.price,
        content: (selectedContentType === 'text' || selectedContentType === 'link') ? values.content : '',
        content_type: selectedContentType,
        creator_id: userId,
        creator_name: userName,
        expiry: values.expiry || null,
        scheduled_for: values.scheduledFor ? (typeof values.scheduledFor === 'string' ? values.scheduledFor : values.scheduledFor.toISOString()) : null,
        scheduled_time: values.scheduledTime || null,
        status: values.scheduledFor ? 'scheduled' : 'published',
        file_url: fileUrl,
        file_name: fileName,
        file_type: fileType,
        file_size: fileSize,
        file_path: filePath, // Store the file path for future reference
        tags: values.tags || [],
        category: values.category || null
      };

      console.log("Sending payload to Supabase:", payload);

      const { data, error } = await supabase.from('contents').insert([payload]).select().single();

      if (error) {
        console.error("Supabase error details:", error);
        throw error;
      }

      toast({
        title: values.scheduledFor ? "Content scheduled" : "Content created",
        description: values.scheduledFor
          ? `Your content will be published on ${new Date(values.scheduledFor).toLocaleDateString()} at ${values.scheduledTime}`
          : "Your content has been published"
      });

      setIsUploading(false);
      navigate('/success', { state: { content: data } });
    } catch (error: any) {
      setIsUploading(false);
      console.error("Error saving content:", error);
      toast({
        title: "Error creating content",
        description: error.message || "There was a problem saving your content",
        variant: "destructive"
      });
    }
  };

  return {
    form,
    onSubmit,
    selectedContentType,
    setSelectedContentType,
    selectedFile,
    setSelectedFile,
    showAdvanced,
    setShowAdvanced,
    isAuthenticated: !!user,
    isAuthChecking: isLoading,
    userData: user,
    isUploading
  };
};
