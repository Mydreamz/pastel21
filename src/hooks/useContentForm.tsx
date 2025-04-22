
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { contentFormSchema, ContentFormValues } from '@/types/content';
import { useNotifications } from '@/contexts/NotificationContext';

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

  const onSubmit = (values: ContentFormValues) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create content",
        variant: "destructive"
      });
      return;
    }

    try {
      const newContent: any = {
        id: uuidv4(),
        title: values.title,
        teaser: values.teaser,
        price: values.price,
        content: "",
        contentType: selectedContentType,
        creatorId: userData.id,
        creatorName: userData.name,
        expiry: values.expiry || null,
        scheduledFor: values.scheduledFor || null,
        scheduledTime: values.scheduledTime || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: values.scheduledFor ? 'scheduled' : 'published'
      };

      if (selectedContentType === 'text' || selectedContentType === 'link') {
        newContent.content = values.content || '';
      } else if (selectedFile) {
        const fileUrl = URL.createObjectURL(selectedFile);
        newContent.fileUrl = fileUrl;
        newContent.fileName = selectedFile.name;
        newContent.fileType = selectedFile.type;
        newContent.fileSize = selectedFile.size;
        newContent.content = values.content || '';
      } else if (['image', 'video', 'audio', 'document'].includes(selectedContentType)) {
        toast({
          title: "File required",
          description: `Please select a ${selectedContentType} file to upload`,
          variant: "destructive"
        });
        return;
      }
      
      const existingContents = JSON.parse(localStorage.getItem('contents') || '[]');
      existingContents.push(newContent);
      localStorage.setItem('contents', JSON.stringify(existingContents));
      
      toast({
        title: values.scheduledFor ? "Content scheduled" : "Content created",
        description: values.scheduledFor 
          ? `Your content will be published on ${new Date(values.scheduledFor).toLocaleDateString()} at ${values.scheduledTime}`
          : "Your content has been published"
      });
      
      navigate('/success', { state: { content: newContent } });
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        title: "Error creating content",
        description: "There was a problem saving your content",
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
