
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StarsBackground from '@/components/StarsBackground';
import ContentForm from '@/components/content/ContentForm';
import { ContentFormValues } from '@/components/content/form/ContentFormProvider';
import { toast } from 'sonner';

interface ContentData {
  id: string;
  title: string;
  teaser: string;
  price: number;
  content: string;
  type: 'text' | 'link' | 'image' | 'video' | 'audio' | 'document';
  expiry?: string;
  createdAt: string;
  ownerId?: string;
}

const EditContent = () => {
  const navigate = useNavigate();
  const { contentId } = useParams();
  const [contentData, setContentData] = useState<ContentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('userData');
    if (!userData) {
      toast.error('You must be logged in to edit content');
      navigate('/auth');
      return;
    }
    
    const user = JSON.parse(userData);
    
    // Get content data from localStorage
    if (contentId) {
      const storedContents = JSON.parse(localStorage.getItem('lockedContents') || '[]');
      const content = storedContents.find((c: ContentData) => c.id === contentId);
      
      if (!content) {
        toast.error('Content not found');
        navigate('/');
        return;
      }
      
      // Check if user is the owner
      if (content.ownerId && content.ownerId !== user.id) {
        toast.error('You do not have permission to edit this content');
        navigate('/');
        return;
      }
      
      setContentData(content);
    }
    
    setIsLoading(false);
  }, [contentId, navigate]);
  
  const onSubmit = (values: ContentFormValues) => {
    if (!contentData) return;
    
    // Get current user
    const userData = localStorage.getItem('userData');
    if (!userData) {
      toast.error('You must be logged in to edit content');
      navigate('/auth');
      return;
    }
    
    const user = JSON.parse(userData);
    
    // Update content data
    const updatedContent = {
      ...contentData,
      title: values.title,
      teaser: values.teaser,
      price: parseFloat(values.price),
      content: values.content,
      type: values.contentType || contentData.type,
      expiry: values.expiry || null,
      ownerId: user.id
    };
    
    // Update in localStorage
    const storedContents = JSON.parse(localStorage.getItem('lockedContents') || '[]');
    const updatedContents = storedContents.map((c: ContentData) => 
      c.id === contentId ? updatedContent : c
    );
    
    localStorage.setItem('lockedContents', JSON.stringify(updatedContents));
    
    toast.success('Content updated successfully!');
    navigate(`/content/${contentId}`);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="animate-pulse">Loading content...</div>
      </div>
    );
  }
  
  if (!contentData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div>Content not found</div>
      </div>
    );
  }
  
  // Convert content data to form values
  const initialValues: ContentFormValues = {
    title: contentData.title,
    teaser: contentData.teaser,
    price: contentData.price.toString(),
    content: contentData.content,
    contentType: contentData.type,
    expiry: contentData.expiry || '',
  };
  
  return (
    <div className="min-h-screen flex flex-col antialiased text-white relative overflow-x-hidden">
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <div className="relative z-10 w-full mx-auto px-3 py-4 sm:px-4 md:px-6 max-w-lg">
        <button 
          onClick={() => navigate('/')} 
          className="mb-4 flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </button>
        
        <Card className="glass-card border-white/10 text-white overflow-hidden">
          <CardHeader className="px-4 py-5 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl font-bold">Edit Content</CardTitle>
            <CardDescription className="text-gray-300 text-sm">
              Update your locked content information
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-4 sm:px-6 pb-2">
            <ContentForm 
              onSubmit={onSubmit}
              onCancel={() => navigate('/profile')}
              initialValues={initialValues}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditContent;
