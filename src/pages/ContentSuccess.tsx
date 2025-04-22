import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CheckCircle, ArrowLeft, Facebook, Twitter, Linkedin } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import StarsBackground from '@/components/StarsBackground';

const ContentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [contentData, setContentData] = useState<any>(null);
  
  useEffect(() => {
    // Try to get content data from location state
    if (location.state && location.state.content) {
      setContentData(location.state.content);
    } else {
      // If no state (e.g., user navigated directly to this URL), redirect to home
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [location, navigate]);

  const copyToClipboard = async () => {
    if (!contentData) return;
    
    try {
      const shareUrl = `${window.location.origin}/view/${contentData.id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "The content link has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy the URL manually.",
        variant: "destructive",
      });
    }
  };

  const shareToSocial = (platform: string) => {
    if (!contentData) return;
    
    const shareUrl = `${window.location.origin}/view/${contentData.id}`;
    const text = `Check out my content: ${contentData.title}`;
    
    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
    }
    
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className="min-h-screen flex flex-col antialiased text-white relative overflow-x-hidden">
      {/* Background elements */}
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 md:px-6 py-6">
        <button onClick={() => navigate('/')} className="mb-6 flex items-center text-gray-300 hover:text-white transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </button>
        
        <div className="max-w-lg mx-auto">
          <Card className="glass-card border-white/10 text-white overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1 bg-emerald-500"></div>
            
            <div className="flex justify-center py-8">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-emerald-500" />
              </div>
            </div>
            
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Content Created Successfully!</CardTitle>
              <CardDescription className="text-gray-300">
                Your content is now ready to be shared
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {contentData ? (
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-lg font-medium mb-2">{contentData.title}</p>
                  <p className="text-sm text-gray-400 mb-3">Price: ${parseFloat(contentData.price).toFixed(2)}</p>
                  <div className="flex items-center text-xs text-gray-400">
                    <span>Created: {new Date(contentData.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400">Redirecting to home page...</p>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col sm:flex-row gap-3">
              <Button 
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={() => navigate(contentData ? `/view/${contentData.id}` : '/')}
              >
                View Content
              </Button>
              
              <Button 
                variant="outline"
                className="w-full sm:w-auto border-white/10 hover:bg-white/10 text-white"
                onClick={() => navigate('/profile')}
              >
                Go to Dashboard
              </Button>
            </CardFooter>
          </Card>
          
          {contentData && (
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm mb-4">Share your content</p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/10 hover:bg-white/10 text-white"
                  onClick={copyToClipboard}
                >
                  Copy Link
                </Button>
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-white/10 hover:bg-white/10 text-white"
                    onClick={() => shareToSocial('facebook')}
                  >
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-white/10 hover:bg-white/10 text-white"
                    onClick={() => shareToSocial('twitter')}
                  >
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-white/10 hover:bg-white/10 text-white"
                    onClick={() => shareToSocial('linkedin')}
                  >
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentSuccess;
