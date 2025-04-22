
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
    const checkAuth = async () => {
      // Check for existing session
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
        setUserData(data.session.user);
      } else {
        // Check local storage as fallback
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
      }
    };

    checkAuth();
  }, []);

  const onSubmit = async (values: ContentFormValues) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create content",
        variant: "destructive"
      });
      navigate('/'); // Redirect to main page where auth dialog can be opened
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

      // Check the current session with Supabase
      const { data: sessionData } = await supabase.auth.getSession();
      
      // If there's no active session, we'll redirect to login
      if (!sessionData.session) {
        console.error("No active Supabase session found");
        toast({
          title: "Session expired",
          description: "Please sign in again to create content",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      // Map properties for Supabase and convert dates to strings
      const payload: any = {
        title: values.title,
        teaser: values.teaser,
        price: values.price,
        content: (selectedContentType === 'text' || selectedContentType === 'link') ? values.content : '',
        content_type: selectedContentType,
        creator_id: userData.id,
        creator_name: userData.user_metadata?.name || userData.email.split('@')[0] || 'Anonymous',
        expiry: values.expiry || null,
        scheduled_for: values.scheduledFor ? (typeof values.scheduledFor === 'string' ? values.scheduledFor : values.scheduledFor.toISOString()) : null,
        scheduled_time: values.scheduledTime || null,
        status: values.scheduledFor ? 'scheduled' : 'published',
        file_url: fileUrl,
        file_name: fileName,
        file_type: fileType,
        file_size: fileSize,
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
