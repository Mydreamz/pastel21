
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

      // Check the current session with Supabase
      const { data: sessionData } = await supabase.auth.getSession();
      
      // If there's no active session, we need to handle this
      if (!sessionData.session) {
        console.error("No active Supabase session found");
        
        // We'll try to sign in the user with their stored credentials
        // This is a workaround - in a production app, you'd implement proper auth flow
        if (userData && userData.email && userData.password) {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: userData.email,
            password: userData.password
          });
          
          if (signInError) {
            throw new Error("Authentication failed with Supabase: " + signInError.message);
          }
        } else {
          // Create an anonymous session as a fallback
          const { error: anonError } = await supabase.auth.signUp({
            email: `guest_${Date.now()}@example.com`,
            password: `password_${Date.now()}`
          });
          
          if (anonError) {
            throw new Error("Failed to create anonymous session: " + anonError.message);
          }
        }
      }

      // Map properties for Supabase and convert dates to strings
      const payload: any = {
        title: values.title,
        teaser: values.teaser,
        price: values.price,
        content: (selectedContentType === 'text' || selectedContentType === 'link') ? values.content : '',
        content_type: selectedContentType,
        creator_id: userData.id,
        creator_name: userData.name || 'Anonymous',
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
