import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Lock, DollarSign, Info, FileText, Image, Video, Music, File, Loader2, CreditCard, ExternalLink, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface ContentPreviewProps {
  title: string;
  teaser: string;
  price: number;
  type: 'text' | 'link' | 'image' | 'video' | 'audio' | 'document';
  expiryDate?: string;
  onUnlock?: () => void;
  contentId?: string;
  content?: string;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({
  title,
  teaser,
  price,
  type,
  expiryDate,
  onUnlock,
  contentId,
  content
}) => {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'details' | 'processing' | 'complete'>('details');
  const [contentUnlocked, setContentUnlocked] = useState(false);
  const navigate = useNavigate();
  
  const formatExpiryDate = (dateString?: string) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleUnlock = async () => {
    setPaymentStep('processing');
    
    setTimeout(() => {
      if (onUnlock) {
        onUnlock();
      }
      
      setShowPaymentDialog(false);
      setContentUnlocked(true);
      
      if (contentId) {
        toast.success('Payment successful! Enjoying your content!');
      }
    }, 1500);
  };
  
  const getContentTypeIcon = () => {
    switch (type) {
      case 'text':
        return <FileText className="h-12 w-12 text-emerald-500 mx-auto mb-4 opacity-80" />;
      case 'image':
        return <Image className="h-12 w-12 text-emerald-500 mx-auto mb-4 opacity-80" />;
      case 'video':
        return <Video className="h-12 w-12 text-emerald-500 mx-auto mb-4 opacity-80" />;
      case 'audio':
        return <Music className="h-12 w-12 text-emerald-500 mx-auto mb-4 opacity-80" />;
      case 'document':
        return <File className="h-12 w-12 text-emerald-500 mx-auto mb-4 opacity-80" />;
      default:
        return <Lock className="h-12 w-12 text-emerald-500 mx-auto mb-4 opacity-80" />;
    }
  };
  
  const renderPaymentStepContent = () => {
    switch (paymentStep) {
      case 'processing':
        return (
          <div className="py-8 flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 text-emerald-500 animate-spin mb-4" />
            <p className="text-center font-medium text-lg">Processing Payment...</p>
            <p className="text-gray-300 text-sm mt-2">Please wait while we confirm your payment</p>
          </div>
        );
      
      case 'complete':
        return (
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="h-12 w-12 bg-emerald-500 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-center font-medium text-lg">Payment Successful!</p>
            <p className="text-gray-300 text-sm mt-2">Redirecting you to the content...</p>
          </div>
        );
      
      default:
        return (
          <>
            <div className="py-4">
              <div className="mb-4 p-4 bg-white/5 rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <span>Content Price</span>
                  <span className="font-semibold">${price.toFixed(2)}</span>
                </div>
                
                <div className="space-y-3">
                  <div className="relative">
                    <input 
                      type="text" 
                      className="w-full rounded bg-white/10 p-2 pl-9 text-white border border-white/20"
                      placeholder="Card Number" 
                      defaultValue="4242 4242 4242 4242" 
                    />
                    <CreditCard className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      className="rounded bg-white/10 p-2 text-white border border-white/20"
                      placeholder="MM/YY" 
                      defaultValue="12/25" 
                    />
                    <input 
                      type="text" 
                      className="rounded bg-white/10 p-2 text-white border border-white/20"
                      placeholder="CVC" 
                      defaultValue="123" 
                    />
                  </div>
                </div>
                
                <div className="text-sm text-gray-400 mt-4">
                  Test Card: 4242 4242 4242 4242 (Any future date, any CVC)
                </div>
              </div>
              
              <p className="text-xs text-gray-400">
                By proceeding with payment, you agree to our terms of service and privacy policy.
              </p>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowPaymentDialog(false)}
                className="border-gray-700 hover:border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
              <Button 
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={handleUnlock}
              >
                Pay ${price.toFixed(2)}
              </Button>
            </DialogFooter>
          </>
        );
    }
  };
  
  const renderUnlockedContent = () => {
    if (!content) return null;
    
    switch (type) {
      case 'text':
        return (
          <div className="p-4 bg-white/5 rounded-md border border-white/10">
            <p className="text-white whitespace-pre-wrap">{content}</p>
          </div>
        );
      case 'link':
        return (
          <div className="p-4 bg-white/5 rounded-md border border-white/10 flex flex-col items-center">
            <p className="text-white mb-4">Your premium content is ready:</p>
            <Button 
              onClick={() => window.open(content, '_blank')}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Content
            </Button>
          </div>
        );
      case 'image':
        return (
          <div className="p-4 bg-white/5 rounded-md border border-white/10 flex flex-col items-center">
            {content.startsWith('[FILE]') ? (
              <>
                <div className="w-full max-w-md rounded overflow-hidden my-4">
                  <img 
                    src={`/placeholder.svg`} 
                    alt={title} 
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-white text-center">
                  Image file: {content.replace('[FILE] ', '')}
                </p>
              </>
            ) : (
              <>
                <Image className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                <p className="text-white text-center">Your premium image is available</p>
              </>
            )}
          </div>
        );
      case 'video':
        return (
          <div className="p-4 bg-white/5 rounded-md border border-white/10 flex flex-col items-center">
            <Video className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
            <p className="text-white text-center">
              {content.startsWith('[FILE]') 
                ? `Video file: ${content.replace('[FILE] ', '')}`
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
            <Music className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
            <p className="text-white text-center">
              {content.startsWith('[FILE]') 
                ? `Audio file: ${content.replace('[FILE] ', '')}`
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
              {content.startsWith('[FILE]') 
                ? `Document file: ${content.replace('[FILE] ', '')}`
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
  
  return (
    <Card className="glass-card border-white/10 text-white overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          {contentUnlocked ? (
            <>
              <Eye className="h-5 w-5 text-emerald-500" /> {title}
            </>
          ) : (
            <>
              <Lock className="h-5 w-5 text-emerald-500" /> {title}
            </>
          )}
        </CardTitle>
        <CardDescription className="text-gray-300">
          {teaser}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative">
        {contentUnlocked ? (
          <div className="rounded-md overflow-hidden">
            {renderUnlockedContent()}
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center bg-white/5 rounded-md backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative z-10 text-center p-6">
              {getContentTypeIcon()}
              <p className="text-white font-semibold">This content is locked</p>
              <p className="text-gray-300 text-sm mt-2">Unlock to view the full content</p>
            </div>
          </div>
        )}
        
        {!contentUnlocked && (
          <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            {price.toFixed(2)}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {!contentUnlocked ? (
          <>
            <Button 
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white" 
              onClick={() => setShowPaymentDialog(true)}
            >
              Unlock Now
            </Button>
            
            {expiryDate && (
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <Info className="h-3 w-3" />
                Expires: {formatExpiryDate(expiryDate)}
              </div>
            )}
          </>
        ) : (
          <div className="w-full text-center text-xs text-emerald-400 flex items-center justify-center gap-1">
            <Eye className="h-3 w-3" />
            Content successfully unlocked
          </div>
        )}
      </CardFooter>
      
      <Dialog open={showPaymentDialog} onOpenChange={(open) => {
        if (!open) {
          if (paymentStep !== 'processing') {
            setShowPaymentDialog(false);
            setPaymentStep('details');
          }
        } else {
          setShowPaymentDialog(open);
        }
      }}>
        <DialogContent className="glass-card border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {paymentStep === 'details' && 'Unlock Premium Content'}
              {paymentStep === 'processing' && 'Processing Payment'}
              {paymentStep === 'complete' && 'Payment Successful!'}
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              {paymentStep === 'details' && `Complete your payment to access "${title}"`}
              {paymentStep === 'processing' && 'Please wait while we process your payment'}
              {paymentStep === 'complete' && 'Your content is now being unlocked'}
            </DialogDescription>
          </DialogHeader>
          
          {renderPaymentStepContent()}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ContentPreview;
