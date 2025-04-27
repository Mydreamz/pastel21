
import { useParams, useNavigate } from 'react-router-dom';
import ViewContentContainer from '@/components/content/ViewContentContainer';
import ViewContentHeader from '@/components/content/ViewContentHeader';
import { useViewTracking } from '@/hooks/useViewTracking';
import CommentSection from '@/components/content/CommentSection';
import ContentLoader from '@/components/content/ContentLoader';
import ContentError from '@/components/content/ContentError';
import PaymentFlow from '@/components/content/PaymentFlow';
import ContentDisplay from '@/components/content/ContentDisplay';
import ContentActions from '@/components/content/ContentActions';
import CreatorControls from '@/components/content/CreatorControls';
import RelatedContent from '@/components/content/RelatedContent';
import ContentReadingProgress from '@/components/content/ContentReadingProgress';
import { useRef } from 'react';
import { useViewContent } from '@/hooks/useViewContent';
import { useToast } from "@/hooks/use-toast";
import { useContentAnalytics } from '@/hooks/useContentAnalytics';
import { useContentSharing } from '@/hooks/useContentSharing';
import { useContentPermissions } from '@/hooks/useContentPermissions';
import { useRelatedContent } from '@/hooks/useRelatedContent';

const ViewContent = () => {
  const { id } = useParams<{ id: string }>();
  const { content, loading, error, isUnlocked, handleUnlock } = useViewContent(id);
  const { toast } = useToast();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const { totalViews } = useContentAnalytics(id);
  
  // Custom hooks
  useViewTracking();
  const { isCreator, isPurchased } = useContentPermissions(content);
  const { shareUrl, handleShare, initializeShareUrl } = useContentSharing(id || '', content?.price || '0');
  const relatedContents = useRelatedContent(content, id || '');

  // Initialize share URL when content is loaded
  useEffect(() => {
    if (content) {
      initializeShareUrl();
    }
  }, [content]);

  const handleSchedule = (scheduleInfo: { date: Date; time: string }) => {
    try {
      const contents = JSON.parse(localStorage.getItem('contents') || '[]');
      const updatedContents = contents.map((item: any) => {
        if (item.id === id) {
          return {
            ...item,
            scheduledFor: scheduleInfo.date.toISOString(),
            scheduledTime: scheduleInfo.time,
            status: 'scheduled'
          };
        }
        return item;
      });
      
      localStorage.setItem('contents', JSON.stringify(updatedContents));
      
      toast({
        title: "Content scheduled",
        description: `Content will be published on ${scheduleInfo.date.toLocaleDateString()} at ${scheduleInfo.time}`,
      });
    } catch (e) {
      console.error("Error scheduling content:", e);
      toast({
        title: "Error",
        description: "Failed to schedule content",
        variant: "destructive"
      });
    }
  };

  if (loading) return <ContentLoader />;
  if (error || !content) return <ContentError error={error} />;
  if (!isUnlocked && !isCreator && parseFloat(content.price) > 0) {
    navigate(`/preview/${id}`);
    return null;
  }

  return (
    <ViewContentContainer>
      <div className="glass-card border border-white/10 rounded-xl overflow-hidden">
        <ContentReadingProgress contentRef={contentRef} />
        <div className="p-6 md:p-8" ref={contentRef}>
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
          >
            {isCreator && (
              <CreatorControls
                contentId={content.id}
                contentTitle={content.title}
                onSchedule={handleSchedule}
              />
            )}
          </ContentActions>
          
          {!isUnlocked && !isCreator && (
            <PaymentFlow 
              content={content} 
              onUnlock={handleUnlock} 
              isCreator={isCreator} 
            />
          )}

          {(isUnlocked || isCreator) && (
            <ContentDisplay 
              content={content} 
              isCreator={isCreator}
              isPurchased={isPurchased}
            />
          )}
        </div>
      </div>

      {relatedContents.length > 0 && (
        <RelatedContent relatedContents={relatedContents} />
      )}
      
      {(isUnlocked || isCreator) && content && (
        <CommentSection contentId={id || ''} creatorId={content.creatorId} />
      )}
    </ViewContentContainer>
  );
};

export default ViewContent;
