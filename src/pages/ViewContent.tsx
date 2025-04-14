
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Lock, FileText, Image as ImageIcon, FileVideo, FileAudio, File, Eye, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import StarsBackground from '@/components/StarsBackground';
import ContentPreview from '@/components/ContentPreview';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

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
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  
  useEffect(() => {
    // In a real app, fetch content data from API
    // For demo, we're using localStorage
    if (contentId) {
      setLoading(true);
      const storedContents = JSON.parse(localStorage.getItem('lockedContents') || '[]');
      const foundContent = storedContents.find((c: ContentData) => c.id === contentId);
      
      if (foundContent) {
        setContent(foundContent);
        
        // Check if content is already unlocked
        const unlockedContents = JSON.parse(localStorage.getItem('unlockedContents') || '[]');
        if (unlockedContents.includes(contentId)) {
          setIsUnlocked(true);
        }
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
  
  const handlePayment = async (contentId: string) => {
    setPaymentProcessing(true);
    
    // In a real app, this would be handled by a payment processor
    // For demo purposes, we'll simulate a payment process
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save contentId to localStorage as 'unlocked'
      const unlockedContents = JSON.parse(localStorage.getItem('unlockedContents') || '[]');
      localStorage.setItem('unlockedContents', JSON.stringify([...unlockedContents, contentId]));
      
      setIsUnlocked(true);
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setPaymentProcessing(false);
    }
  };
  
  const renderContent = () => {
    if (!content || !isUnlocked) return null;
    
    switch (content.type) {
      case 'text':
        return (
          <div className="p-4 bg-white/5 rounded-md border border-white/10">
            <p className="text-white whitespace-pre-wrap">{content.content}</p>
          </div>
        );
      case 'link':
        return (
          <div className="p-4 bg-white/5 rounded-md border border-white/10 flex flex-col items-center">
            <p className="text-white mb-4">Your premium content is ready:</p>
            <Button 
              onClick={() => window.open(content.content, '_blank')}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Content
            </Button>
          </div>
        );
      case 'image':
        // In a real app, this would be an actual image URL
        return (
          <div className="p-4 bg-white/5 rounded-md border border-white/10 flex flex-col items-center">
            {content.content.startsWith('[FILE]') ? (
              <>
                <div className="w-full max-w-md rounded overflow-hidden my-4">
                  <img 
                    src={`/placeholder.svg`} 
                    alt={content.title} 
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-white text-center">
                  Image file: {content.content.replace('[FILE] ', '')}
                </p>
              </>
            ) : (
              <>
                <ImageIcon className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                <p className="text-white text-center">Your premium image is available</p>
              </>
            )}
          </div>
        );
      case 'video':
        return (
          <div className="p-4 bg-white/5 rounded-md border border-white/10 flex flex-col items-center">
            <FileVideo className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
            <p className="text-white text-center">
              {content.content.startsWith('[FILE]') 
                ? `Video file: ${content.content.replace('[FILE] ', '')}`
                : 'Your premium video is available'}
            </p>
            <div className="w-full max-w-md bg-black/30 rounded-md mt-4 p-8 flex items-center justify-center">
              <p className="text-gray-400 text-center">Video player would appear here</p>
            </div>
          </div>
        );
      case 'audio':
        return (
          <div className="p-4 bg-white/5 rounded-md border border-white/10 flex flex-col items-center">
            <FileAudio className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
            <p className="text-white text-center">
              {content.content.startsWith('[FILE]') 
                ? `Audio file: ${content.content.replace('[FILE] ', '')}`
                : 'Your premium audio is available'}
            </p>
            <div className="w-full max-w-md bg-black/30 rounded-md mt-4 p-4 flex items-center justify-center">
              <p className="text-gray-400 text-center">Audio player would appear here</p>
            </div>
          </div>
        );
      case 'document':
        return (
          <div className="p-4 bg-white/5 rounded-md border border-white/10 flex flex-col items-center">
            <FileText className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
            <p className="text-white text-center">
              {content.content.startsWith('[FILE]') 
                ? `Document file: ${content.content.replace('[FILE] ', '')}`
                : 'Your premium document is available'}
            </p>
            <Button 
              className="mt-4 bg-emerald-500 hover:bg-emerald-600"
              onClick={() => {
                toast.info('Document would open or download here');
              }}
            >
              Download Document
            </Button>
          </div>
        );
      default:
        return <p className="text-white">Content type not supported</p>;
    }
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
        
        {!isUnlocked ? (
          <ContentPreview 
            title={content.title}
            teaser={content.teaser}
            price={content.price}
            type={content.type}
            expiryDate={content.expiry}
            contentId={content.id}
            onUnlock={() => handlePayment(content.id)}
          />
        ) : (
          <Card className="glass-card border-white/10 text-white overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{content.title}</CardTitle>
                <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  Unlocked
                </div>
              </div>
              <CardDescription className="text-gray-300">
                {content.teaser}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {renderContent()}
            </CardContent>
            
            <CardFooter className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                onClick={() => navigate('/')} 
                variant="outline" 
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              
              <Button 
                onClick={() => navigate('/browse')} 
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600"
              >
                Browse More Content
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ViewContent;
