
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { contentFormSchema, ContentFormValues } from '@/types/content';
import { useNotifications } from '@/contexts/NotificationContext';
import { supabase } from '@/integrations/supabase/client';

export const useContentForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { notifications, addNotification } = useNotifications();
  const [selectedContentType, setSelectedContentType] = useState<string>('text');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      title: "",
      teaser: "",
      price: "0",
      content: "",
      expiry: "",
      file: null
    }
  });

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      try {
        const parsedAuth = JSON.parse(auth);
        if (parsedAuth && parsedAuth.user) {
          setIsAuthenticated(true);
          setUserData(parsedAuth.user);
        }
      } catch (e) {
        console.error("Auth parsing error", e);
      }
    }
  }, []);

  const onSubmit = async (values: ContentFormValues) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create content",
        variant: "destructive"
      });
      return;
    }

    try {
      // FILE HANDLING
      let fileUrl, fileName, fileType, fileSize;
      if (['image', 'video', 'audio', 'document'].includes(selectedContentType)) {
        if (!selectedFile) {
          toast({
            title: "File required",
            description: `Please select a ${selectedContentType} file to upload`,
            variant: "destructive"
          });
          return;
        }
        // For now, store file locally (todo: upload to Supabase Storage later)
        fileUrl = URL.createObjectURL(selectedFile);
        fileName = selectedFile.name;
        fileType = selectedFile.type;
        fileSize = selectedFile.size;
      }

      // --- Fix: Map properties for Supabase and convert dates to strings ---
      const payload: any = {
        title: values.title,
        teaser: values.teaser,
        price: values.price,
        content: (selectedContentType === 'text' || selectedContentType === 'link') ? values.content : '',
        content_type: selectedContentType,
        creator_id: userData.id,
        creator_name: userData.name,
        expiry: values.expiry || null,
        scheduled_for: values.scheduledFor ? (typeof values.scheduledFor === 'string' ? values.scheduledFor : values.scheduledFor.toISOString()) : null,
        scheduled_time: values.scheduledTime || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: values.scheduledFor ? 'scheduled' : 'published',
        file_url: fileUrl,
        file_name: fileName,
        file_type: fileType,
        file_size: fileSize,
        tags: values.tags || [],
        category: values.category || null
      };

      const { data, error } = await supabase.from('contents').insert([payload]).select().single();

      if (error) {
        throw error;
      }

      toast({
        title: values.scheduledFor ? "Content scheduled" : "Content created",
        description: values.scheduledFor
          ? `Your content will be published on ${new Date(values.scheduledFor).toLocaleDateString()} at ${values.scheduledTime}`
          : "Your content has been published"
      });

      navigate('/success', { state: { content: data } });
    } catch (error: any) {
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
    isAuthenticated,
    userData
  };
};
