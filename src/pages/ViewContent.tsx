
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card } from "@/components/ui/card";
import StarsBackground from '@/components/StarsBackground';
import ContentPreview from '@/components/ContentPreview';
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
}

const ViewContent = () => {
  const { contentId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, fetch content data from API
    // For demo, we're using localStorage
    if (contentId) {
      setLoading(true);
      const storedContents = JSON.parse(localStorage.getItem('lockedContents') || '[]');
      const foundContent = storedContents.find((c: ContentData) => c.id === contentId);
      
      if (foundContent) {
        setContent(foundContent);
      } else {
        toast.error('Content not found');
        navigate('/');
      }
      setLoading(false);
    }
  }, [contentId, navigate]);
  
  // Check if the content has expired
  const isExpired = React.useMemo(() => {
    if (content?.expiry) {
      const expiryDate = new Date(content.expiry);
      return expiryDate < new Date();
    }
    return false;
  }, [content]);
  
  const onUnlock = (contentId: string) => {
    // In a real app, this would be handled by a payment processor
    // For demo purposes, we'll pretend the payment was successful
    
    toast.success('Content unlocked successfully!');
    
    // Later we would show the real content here
    console.log('Unlocked content:', contentId);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="animate-pulse">Loading content...</div>
      </div>
    );
  }
  
  if (!content || isExpired) {
    return (
      <div className="min-h-screen flex flex-col antialiased text-white relative overflow-x-hidden">
        <StarsBackground />
        <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
        
        <div className="relative z-10 w-full mx-auto px-3 py-4 sm:px-4 md:px-6 max-w-lg flex flex-col items-center justify-center min-h-[calc(100vh-2rem)]">
          <Card className="glass-card border-white/10 text-white overflow-hidden p-6 text-center">
            <h2 className="text-xl font-bold mb-2">
              {isExpired ? 'Content has expired' : 'Content not found'}
            </h2>
            <p className="text-gray-300 mb-4">
              {isExpired 
                ? 'The content you are trying to access is no longer available.'
                : 'The content you are looking for does not exist or has been removed.'}
            </p>
            <button 
              onClick={() => navigate('/')} 
              className="inline-flex items-center text-emerald-400 hover:text-emerald-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go back to home
            </button>
          </Card>
        </div>
      </div>
    );
  }
  
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
        
        <ContentPreview 
          title={content.title}
          teaser={content.teaser}
          price={content.price}
          type={content.type}
          expiryDate={content.expiry}
          onUnlock={() => onUnlock(content.id)}
        />
      </div>
    </div>
  );
};

export default ViewContent;
