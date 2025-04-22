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
import { useState, useEffect } from 'react';
import { useViewContent } from '@/hooks/useViewContent';
import { useToast } from "@/hooks/use-toast";

const ViewContent = () => {
  const { id } = useParams<{ id: string }>();
  const { content, loading, error, isUnlocked, handleUnlock } = useViewContent(id);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isCreator, setIsCreator] = useState(false);

  // Track view of this content
  useViewTracking();
  
  useEffect(() => {
    // Check if user is the content creator
    if (content) {
      const auth = localStorage.getItem('auth');
      if (auth) {
        try {
          const parsedAuth = JSON.parse(auth);
          if (parsedAuth && parsedAuth.user) {
            setIsCreator(content.creatorId === parsedAuth.user.id);
          }
        } catch (e) {
          console.error("Auth parsing error", e);
        }
      }
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

  const handleShare = async () => {
    try {
      // Share the preview link for paid content, or direct link for free content
      const shareUrl = content && parseFloat(content.price) > 0 && !isCreator ? 
        `${window.location.origin}/preview/${id}` : 
        window.location.href;
        
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Content link has been copied to your clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the link to clipboard",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <ContentLoader />;
  }

  if (error || !content) {
    return <ContentError error={error} />;
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
          
          <ContentActions onShare={handleShare} isCreator={isCreator}>
            {isCreator && (
              <CreatorControls
                contentId={content.id}
                contentTitle={content.title}
                onSchedule={handleSchedule}
              />
            )}
          </ContentActions>
          
          <PaymentFlow 
            content={content} 
            onUnlock={handleUnlock} 
            isCreator={isCreator} 
          />

          {(isUnlocked || isCreator) && (
            <ContentDisplay content={content} />
          )}
        </div>
      </div>
      
      {(isUnlocked || isCreator) && content && (
        <CommentSection contentId={id || ''} creatorId={content.creatorId} />
      )}
    </ViewContentContainer>
  );
};

export default ViewContent;
