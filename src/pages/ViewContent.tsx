
import { useEffect, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ViewContentContainer from '@/components/content/ViewContentContainer';
import ViewContentHeader from '@/components/content/ViewContentHeader';
import ContentLoader from '@/components/content/ContentLoader';
import ContentError from '@/components/content/ContentError';
import ContentActions from '@/components/content/ContentActions';
import { useViewContent } from '@/hooks/useViewContent';
import { useContentPermissions } from '@/hooks/useContentPermissions';
import { useContentSharing } from '@/hooks/useContentSharing';
import { useRelatedContent } from '@/hooks/useRelatedContent';
import { useToast } from '@/hooks/use-toast';
import PaymentFlow from '@/components/content/payment/PaymentFlow';
import DirectPurchaseButton from '@/components/content/DirectPurchaseButton';
import ContentViewWrapper from '@/components/content/ContentViewWrapper';
import RelatedContentList from '@/components/content/RelatedContentList';

// Main content component with error handling fixes
const ViewContent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { 
    content, 
    loading, 
    error, 
    secureFileUrl, 
    secureFileLoading,
    secureFileError,
    handleUnlock,
    isUnlocked,
    isAuthenticated,
    isProcessing
  } = useViewContent(id);
  
  const { isCreator, isPurchased, refreshPermissions } = useContentPermissions(content);
  const { shareUrl, handleShare, initializeShareUrl } = useContentSharing(id || '', content?.price || '0');
  const relatedContents = useRelatedContent(content, id || '');

  console.log(`[ViewContent] Content state:`, { 
    isLoading: loading,
    contentLoaded: !!content,
    isCreator,
    isPurchased,
    isUnlocked,
    hasError: !!error,
    isProcessingPayment: isProcessing,
    contentPrice: content?.price
  });

  // Function to directly handle purchase from the ViewContent component
  const handlePurchase = async () => {
    console.log("[ViewContent] Purchase button clicked");
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to purchase this content",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
    
    if (isProcessing) {
      toast({
        title: "Processing",
        description: "Your purchase is being processed",
      });
      return;
    }
    
    if (content && handleUnlock) {
      console.log("[ViewContent] Calling handleUnlock function");
      await handleUnlock();
    } else {
      console.error("[ViewContent] Cannot process purchase: content or handleUnlock missing");
      toast({
        title: "Error",
        description: "Unable to process your request. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Initialize share URL only once when content loads
  useEffect(() => {
    if (content) {
      initializeShareUrl();
    }
  }, [content, initializeShareUrl]);

  if (loading) {
    return <ContentLoader />;
  }

  // Fixed TypeScript error by ensuring error is always a string
  if (error || !content) {
    const errorMessage = error || "Content not found";
    return <ContentError error={errorMessage} />;
  }

  // Strict access control for paid content
  const isPaidContent = parseFloat(content.price) > 0;
  const canViewContent = isUnlocked || isCreator || isPurchased || !isPaidContent;

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

          <ContentActions
            onShare={handleShare}
            shareUrl={shareUrl}
            contentTitle={content.title}
            contentId={content.id}
            isCreator={isCreator}
          />

          {/* Always show payment flow for paid content if not unlocked */}
          {isPaidContent && !canViewContent && (
            <PaymentFlow
              content={content}
              onUnlock={handleUnlock}
              isCreator={isCreator}
              isPurchased={isPurchased}
              refreshPermissions={refreshPermissions}
            />
          )}

          {/* Display direct purchase button if needed */}
          {isPaidContent && !canViewContent && !isProcessing && (
            <DirectPurchaseButton 
              price={content.price}
              isProcessing={isProcessing}
              onPurchase={handlePurchase}
            />
          )}

          {/* Only show content if unlocked or free */}
          <ContentViewWrapper 
            content={content}
            isCreator={isCreator}
            isPurchased={isPurchased}
            canViewContent={canViewContent}
            secureFileUrl={secureFileUrl}
            secureFileLoading={secureFileLoading}
            secureFileError={secureFileError}
          />

          <RelatedContentList relatedContents={relatedContents} />
        </div>
      </div>
    </ViewContentContainer>
  );
};

export default memo(ViewContent);
