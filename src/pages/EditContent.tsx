
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import ContentForm, { ContentFormValues } from '@/components/ContentForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StarsBackground from '@/components/StarsBackground';

const EditContent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<ContentFormValues | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/auth');
      return;
    }

    // Fetch content to edit
    if (id) {
      const fetchContent = () => {
        setLoading(true);
        try {
          // Get the contents from localStorage
          const contents = JSON.parse(localStorage.getItem('contents') || '[]');
          
          // Find the content with the matching id
          const foundContent = contents.find((item: any) => item.id === id);
          
          if (foundContent) {
            // Ensure the content belongs to the current user
            const currentUser = JSON.parse(user);
            if (foundContent.creatorId !== currentUser.id) {
              setError("You don't have permission to edit this content");
              navigate('/');
              return;
            }
            
            setContent(foundContent);
          } else {
            setError("Content not found");
            navigate('/');
          }
        } catch (error) {
          console.error("Error fetching content:", error);
          setError("Error loading content");
        } finally {
          setLoading(false);
        }
      };
      
      fetchContent();
    }
  }, [id, navigate]);
  
  const handleSubmit = (values: ContentFormValues) => {
    try {
      // Get all contents from localStorage
      const contents = JSON.parse(localStorage.getItem('contents') || '[]');
      
      // Find and update the specific content
      const updatedContents = contents.map((item: any) => {
        if (item.id === id) {
          return {
            ...item,
            ...values,
            updatedAt: new Date().toISOString()
          };
        }
        return item;
      });
      
      // Save back to localStorage
      localStorage.setItem('contents', JSON.stringify(updatedContents));
      
      toast.success("Content updated successfully");
      navigate(`/content/${id}`);
    } catch (error) {
      console.error("Error updating content:", error);
      toast.error("Failed to update content");
    }
  };
  
  const handleCancel = () => {
    navigate(`/content/${id}`);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Loading...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col antialiased text-white relative">
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <div className="w-full max-w-screen-xl mx-auto px-4 pt-16 relative z-10 flex-1">
        <Card className="glass-card border-white/10 text-white overflow-hidden max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Edit Content</CardTitle>
            <CardDescription className="text-gray-400">
              Update your premium content details below
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {content && (
              <ContentForm 
                onSubmit={handleSubmit} 
                onCancel={handleCancel}
                initialValues={content} 
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditContent;
