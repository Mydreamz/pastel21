
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Copy, QrCode, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StarsBackground from '@/components/StarsBackground';
import ContentPreview from '@/components/ContentPreview';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

const ContentSuccess = () => {
  const { contentId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState<ContentData | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  
  // Generate the content link for sharing
  const contentLink = `${window.location.origin}/content/${contentId}`;

  useEffect(() => {
    // In a real app, fetch content data from API
    // For demo, we'll use localStorage
    if (contentId) {
      const storedContents = JSON.parse(localStorage.getItem('lockedContents') || '[]');
      const foundContent = storedContents.find((c: ContentData) => c.id === contentId);
      
      if (foundContent) {
        setContent(foundContent);
      } else {
        // Content not found, redirect to create page
        toast.error('Content not found');
        navigate('/create');
      }
    }
  }, [contentId, navigate]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contentLink)
      .then(() => {
        toast.success('Link copied to clipboard');
      })
      .catch(() => {
        toast.error('Failed to copy link');
      });
  };

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="animate-pulse">Loading content...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col antialiased text-white relative overflow-x-hidden">
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <div className="relative z-10 w-full mx-auto px-3 py-4 sm:px-4 md:px-6 max-w-xl">
        <button 
          onClick={() => navigate('/')} 
          className="mb-4 flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </button>
        
        <Card className="glass-card border-white/10 text-white overflow-hidden mb-4">
          <CardHeader className="px-4 py-5 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl font-bold text-emerald-400">Content Created Successfully!</CardTitle>
            <CardDescription className="text-gray-300 text-sm">
              Share this content with your audience to monetize it
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-4 sm:px-6 pb-2">
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
              <p className="text-sm text-emerald-300">Your unique content link:</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="bg-black/30 text-gray-200 py-2 px-3 rounded text-xs sm:text-sm overflow-hidden text-ellipsis flex-1">
                  {contentLink}
                </div>
                <Button 
                  onClick={copyToClipboard} 
                  variant="outline"
                  size="sm"
                  className="shrink-0 bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="mt-6 mb-2">
              <p className="text-sm font-medium mb-4">Content Preview (how others will see it):</p>
              <ContentPreview
                title={content.title}
                teaser={content.teaser}
                price={content.price}
                type={content.type}
                expiryDate={content.expiry}
              />
            </div>
          </CardContent>
          
          <CardFooter className="px-4 sm:px-6 py-4 flex flex-wrap sm:flex-nowrap gap-3">
            <Button 
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={() => setShareModalOpen(true)}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Content
            </Button>
            <Button 
              className="w-full sm:w-auto"
              variant="outline"
              onClick={() => navigate('/create')}
            >
              Create Another
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Share Modal */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="glass-card border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Content</DialogTitle>
            <DialogDescription className="text-gray-300">
              Share this content link with your audience
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Content Link</p>
              <div className="flex items-center gap-2">
                <div className="bg-black/30 text-gray-200 py-2 px-3 rounded text-xs sm:text-sm overflow-hidden text-ellipsis flex-1">
                  {contentLink}
                </div>
                <Button 
                  onClick={copyToClipboard} 
                  variant="outline"
                  size="sm"
                  className="shrink-0 bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm font-medium mb-2">QR Code</p>
              <div className="h-32 w-32 flex items-center justify-center bg-white rounded-md">
                <QrCode className="h-16 w-16 text-black" />
              </div>
              <p className="text-xs text-gray-400 text-center mt-2">
                Scan this code to access the content
              </p>
            </div>
            
            <div className="col-span-full">
              <p className="text-sm font-medium mb-2">Share on Social Media</p>
              <div className="grid grid-cols-3 gap-3">
                <Button variant="outline" className="w-full">Twitter</Button>
                <Button variant="outline" className="w-full">Facebook</Button>
                <Button variant="outline" className="w-full">Email</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentSuccess;
