
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
  const [isAuthChecking, setIsAuthChecking] = useState(true);
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
      setIsAuthChecking(true);
      try {
        // First, get the current session from Supabase
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setIsAuthChecking(false);
          return;
        }
        
        if (sessionData.session) {
          console.log("Active session found:", sessionData.session.user.id);
          setIsAuthenticated(true);
          setUserData(sessionData.session.user);
          setIsAuthChecking(false);
          return;
        } else {
          console.log("No active session found");
          setIsAuthenticated(false);
          setUserData(null);
        }
      } catch (e) {
        console.error("Authentication check failed:", e);
      } finally {
        setIsAuthChecking(false);
      }
    };

    // Set up auth state listener for real-time auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      setIsAuthenticated(!!session);
      setUserData(session?.user || null);
      setIsAuthChecking(false);
    });

    checkAuth();

    return () => subscription.unsubscribe();
  }, []);

  const onSubmit = async (values: ContentFormValues) => {
    // Double-check authentication before proceeding
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        throw new Error(`Session error: ${sessionError.message}`);
      }
      
      if (!sessionData.session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create content",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      // Handle file upload if needed
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

      // Ensure we're using the most current user data
      const userId = sessionData.session.user.id;
      const userName = sessionData.session.user.user_metadata?.name || 
                       sessionData.session.user.email?.split('@')[0] || 
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
    isAuthChecking,
    userData
  };
};
