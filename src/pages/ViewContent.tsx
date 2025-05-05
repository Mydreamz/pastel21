
import { useEffect, useRef, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ViewContentContainer from '@/components/content/ViewContentContainer';
import ViewContentHeader from '@/components/content/ViewContentHeader';
import ContentLoader from '@/components/content/ContentLoader';
import ContentError from '@/components/content/ContentError';
import ContentDisplay from '@/components/content/ContentDisplay';
import ContentActions from '@/components/content/ContentActions';
import { useViewContent } from '@/hooks/useViewContent';
import { useContentPermissions } from '@/hooks/useContentPermissions';
import { useContentSharing } from '@/hooks/useContentSharing';
import { useRelatedContent } from '@/hooks/useRelatedContent';
import ContentReadingProgress from '@/components/content/ContentReadingProgress';
import { Share, DollarSign, Clock, Eye, Calendar, User, FileText, Video, Image, Link as LinkIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { memo as reactMemo } from 'react';
import { Button } from '@/components/ui/button';
import PaymentFlow from '@/components/content/PaymentFlow';
import { useToast } from '@/hooks/use-toast';

// Memoized related content item component to prevent re-renders
const RelatedContentItem = reactMemo(({ item, navigate }: { item: any, navigate: any }) => (
  <div 
    key={item.id} 
    className="glass-card p-4 rounded-lg cursor-pointer hover:border-emerald-500/30 transition-colors border border-white/10" 
    onClick={() => navigate(`/view/${item.id}`)}
  >
    <div className="flex items-center justify-between mb-2">
      {(() => {
        switch (item.contentType) {
          case 'text':
            return <FileText className="h-4 w-4 text-blue-400" />;
          case 'image':
            return <Image className="h-4 w-4 text-purple-400" />;
          case 'video':
            return <Video className="h-4 w-4 text-red-400" />;
          case 'link':
            return <LinkIcon className="h-4 w-4 text-yellow-400" />;
          default:
            return <FileText className="h-4 w-4 text-blue-400" />;
        }
      })()}
      {parseFloat(item.price) > 0 && (
        <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 flex items-center">
          <DollarSign className="h-3 w-3 mr-1" />
          {parseFloat(item.price).toFixed(2)}
        </Badge>
      )}
    </div>
    <h4 className="font-medium text-emerald-300 mb-1">{item.title}</h4>
    <p className="text-sm text-gray-400 line-clamp-2">{item.teaser}</p>
  </div>
));

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
  const contentRef = useRef<HTMLDivElement>(null);

  console.log(`[ViewContent] Content state:`, { 
    isLoading: loading,
    contentLoaded: !!content,
    isCreator,
    isPurchased,
    isUnlocked,
    hasError: !!error,
    isProcessingPayment: isProcessing
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

  const canViewContent = isUnlocked || isCreator || isPurchased || parseFloat(content.price) === 0;

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

          {/* Payment flow component for paid content */}
          {parseFloat(content.price) > 0 && !canViewContent && (
            <PaymentFlow
              content={content}
              onUnlock={handleUnlock}
              isCreator={isCreator}
              isPurchased={isPurchased}
              refreshPermissions={refreshPermissions}
            />
          )}

          {/* Display direct purchase button if needed */}
          {parseFloat(content.price) > 0 && !canViewContent && !isProcessing && (
            <div className="my-4 text-center">
              <Button 
                onClick={handlePurchase}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
                size="lg"
              >
                Purchase Now (₹{parseFloat(content.price).toFixed(2)})
              </Button>
            </div>
          )}

          {/* Only show content if unlocked or free */}
          {canViewContent && (
            <>
              <div ref={contentRef} className="overflow-auto max-h-[600px]">
                <ContentDisplay 
                  content={content} 
                  isCreator={isCreator} 
                  isPurchased={canViewContent}
                  secureFileUrl={secureFileUrl}
                  secureFileLoading={secureFileLoading}
                  secureFileError={secureFileError}
                />
              </div>

              {content.contentType === 'text' && (
                <ContentReadingProgress contentRef={contentRef} />
              )}
            </>
          )}

          {relatedContents.length > 0 && (
            <div className="mt-8 border-t border-white/10 pt-6">
              <h3 className="text-xl font-bold mb-4">More from this creator</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedContents.map((item) => (
                  <RelatedContentItem key={item.id} item={item} navigate={navigate} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ViewContentContainer>
  );
};

export default memo(ViewContent);
