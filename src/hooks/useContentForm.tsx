
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { contentFormSchema, ContentFormValues } from '@/types/content';

export const useContentForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedContentType, setSelectedContentType] = useState<string>('text');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      title: "",
      teaser: "",
      price: "0",
      content: "",
      expiry: ""
    }
  });

  // Check authentication status
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
      // Create new content object
      const newContent = {
        id: uuidv4(),
        title: values.title,
        teaser: values.teaser,
        price: values.price,
        content: values.content,
        contentType: selectedContentType,
        creatorId: userData.id,
        creatorName: userData.name,
        expiry: values.expiry || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Get existing contents array or create empty one
      const existingContents = JSON.parse(localStorage.getItem('contents') || '[]');
      existingContents.push(newContent);
      
      // Save back to local storage
      localStorage.setItem('contents', JSON.stringify(existingContents));
      
      toast({
        title: "Content created successfully",
        description: "Your content has been published"
      });
      
      // Navigate to success page with content data
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
    showAdvanced,
    setShowAdvanced,
    isAuthenticated,
    userData
  };
};
