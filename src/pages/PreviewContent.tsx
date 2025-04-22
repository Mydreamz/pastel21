
import { useParams, useNavigate } from 'react-router-dom';
import ViewContentContainer from '@/components/content/ViewContentContainer';
import ViewContentHeader from '@/components/content/ViewContentHeader';
import ContentPreview from '@/components/ContentPreview';
import ContentLoader from '@/components/content/ContentLoader';
import ContentError from '@/components/content/ContentError';
import LockedContent from '@/components/content/LockedContent';
import { useViewContent } from '@/hooks/useViewContent';
import { Share, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from 'react';

const PreviewContent = () => {
  const { id } = useParams<{ id: string }>();
  const { content, loading, error, handleUnlock } = useViewContent(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Add debug logging for this component
  console.log("PreviewContent: Content ID:", id);
  console.log("PreviewContent: Content loaded:", content);
  console.log("PreviewContent: Error state:", error);

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      try {
        const parsedAuth = JSON.parse(auth);
        if (parsedAuth && parsedAuth.user) {
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error("Auth parsing error", e);
      }
    }
  }, []);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Content preview link has been copied to your clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the link to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleSuccessfulPayment = () => {
    // Redirect to full content view after successful payment
    navigate(`/view/${id}`);
  };

  const handlePurchase = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to purchase this content",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      if (handleUnlock) {
        handleUnlock();
        handleSuccessfulPayment();
      }
    }, 1500);
  };

  if (loading) {
    return <ContentLoader />;
  }

  if (error || !content) {
    return <ContentError error={error || "Content not available. The link might be invalid or the content was removed."} />;
  }

  return (
    <ViewContentContainer>
      <div className="glass-card border border-white/10 rounded-xl overflow-hidden">
        <div className="p-6 md:p-8">
          <ViewContentHeader
            title={content.title}
            creatorName={content.creatorName}
            createdAt={content.createdAt}
            price={content.price}
            creatorId={content.creatorId}
            contentId={content.id}
          />
          
          <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <h3 className="text-lg font-semibold text-emerald-400 mb-2">Premium Content</h3>
            <p className="text-gray-300 mb-4">{content.teaser}</p>
            
            <LockedContent 
              price={content.price}
              onUnlock={handlePurchase}
              contentTitle={content.title}
              isProcessing={isProcessing}
            />
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleShare}
              variant="outline"
              className="border-gray-700 hover:border-emerald-500 text-gray-300"
            >
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
          
          <div className="mt-8">
            <ContentPreview
              title={content.title}
              teaser={content.teaser}
              price={parseFloat(content.price)}
              type={content.contentType}
              onPaymentSuccess={handleSuccessfulPayment}
              contentId={content.id}
              onPurchase={handlePurchase}
            />
          </div>
        </div>
      </div>
    </ViewContentContainer>
  );
};

export default PreviewContent;
