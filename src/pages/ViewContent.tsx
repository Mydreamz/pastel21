
import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
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
import { useToast } from '@/hooks/use-toast';
import PaymentFlow from '@/components/content/PaymentFlow';

const ViewContent = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [justPurchased, setJustPurchased] = useState(false);
  
  // Get the query parameters
  const queryParams = new URLSearchParams(location.search);
  const fromPurchase = queryParams.get('purchased') === 'true';
  
  const { 
    content, 
    loading, 
    error, 
    secureFileUrl, 
    secureFileLoading,
    secureFileError,
    handleUnlock,
    isUnlocked,
    refetchContent
  } = useViewContent(id);
  
  const { 
    isCreator, 
    isPurchased, 
    isLoading: permissionsLoading,
    refetchPermissions 
  } = useContentPermissions(content);
  
  const { shareUrl, handleShare, initializeShareUrl } = useContentSharing(id || '', content?.price || '0');
  const relatedContents = useRelatedContent(content, id || '');
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle case where user just purchased the content and was redirected here
  useEffect(() => {
    if (fromPurchase && !justPurchased) {
      setJustPurchased(true);
      
      // Show a success toast
      toast({
        title: "Purchase successful",
        description: "Thank you for your purchase. Enjoy the content!",
      });
      
      // Clean up the URL to remove the query parameter
      navigate(`/view/${id}`, { replace: true });
      
      // Refresh permissions and content to ensure we have the latest data
      const refreshData = async () => {
        if (refetchPermissions) {
          await refetchPermissions();
        }
        refetchContent();
      };
      
      refreshData();
    }
  }, [fromPurchase, id, navigate, toast, justPurchased, refetchPermissions, refetchContent]);

  // Initialize share URL when content is loaded
  useEffect(() => {
    if (content) {
      initializeShareUrl();
    }
  }, [content, initializeShareUrl]);

  // Show payment flow if content is paid and user hasn't purchased it
  const showPaymentFlow = content && 
                          !loading && 
                          !permissionsLoading && 
                          !isCreator && 
                          !isPurchased && 
                          parseFloat(content.price) > 0;
  
  if (loading || permissionsLoading) {
    return <ContentLoader />;
  }

  if (error || !content) {
    return <ContentError error={error || "Content not found"} />;
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

          <ContentActions
            onShare={handleShare}
            shareUrl={shareUrl}
            contentTitle={content.title}
            contentId={content.id}
            isCreator={isCreator}
          />

          {showPaymentFlow && (
            <PaymentFlow 
              content={content} 
              onUnlock={handleUnlock} 
              isCreator={isCreator}
              refetchPermissions={refetchPermissions}
            />
          )}

          <div ref={contentRef} className="overflow-auto max-h-[600px]">
            <ContentDisplay 
              content={content} 
              isCreator={isCreator} 
              isPurchased={isPurchased || isUnlocked}
              secureFileUrl={secureFileUrl}
              secureFileLoading={secureFileLoading}
              secureFileError={secureFileError}
            />
          </div>

          {content.contentType === 'text' && (
            <ContentReadingProgress contentRef={contentRef} />
          )}

          {relatedContents.length > 0 && (
            <div className="mt-8 border-t border-white/10 pt-6">
              <h3 className="text-xl font-bold mb-4">More from this creator</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedContents.map((item) => (
                  <div key={item.id} className="glass-card p-4 rounded-lg cursor-pointer hover:border-emerald-500/30 transition-colors border border-white/10" 
                       onClick={() => navigate(`/view/${item.id}`)}>
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
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ViewContentContainer>
  );
};

export default ViewContent;
