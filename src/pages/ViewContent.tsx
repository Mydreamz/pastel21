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
import ReadingProgress from '@/components/content/ReadingProgress';
import { useState, useEffect, useRef } from 'react';
import { useViewContent } from '@/hooks/useViewContent';
import { useToast } from "@/hooks/use-toast";
import { useContentAnalytics } from '@/hooks/useContentAnalytics';

const ViewContent = () => {
  const { id } = useParams<{ id: string }>();
  const { content, loading, error, isUnlocked, handleUnlock, isAuthenticated } = useViewContent(id);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isCreator, setIsCreator] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [readingProgress, setReadingProgress] = useState(0);
  const [relatedContents, setRelatedContents] = useState<any[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const { totalViews } = useContentAnalytics(id);
  
  useViewTracking();

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const element = contentRef.current;
        const totalHeight = element.scrollHeight - element.clientHeight;
        const scrollPosition = element.scrollTop;
        
        if (totalHeight > 0) {
          setReadingProgress((scrollPosition / totalHeight) * 100);
        }
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (contentElement) {
        contentElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
  
  useEffect(() => {
    if (content) {
      const auth = localStorage.getItem('auth');
      if (auth) {
        try {
          const parsedAuth = JSON.parse(auth);
          if (parsedAuth && parsedAuth.user) {
            setIsCreator(content.creatorId === parsedAuth.user.id);
            
            // Check if user has purchased this content
            const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
            const hasPurchased = transactions.some(
              (tx: any) => tx.contentId === id && tx.userId === parsedAuth.user.id
            );
            setIsPurchased(hasPurchased);
          }
        } catch (e) {
          console.error("Auth parsing error", e);
        }
      }
      
      // Set share URL based on content price
      if (parseFloat(content.price) > 0) {
        setShareUrl(`${window.location.origin}/preview/${id}`);
      } else {
        setShareUrl(`${window.location.origin}/view/${id}`);
      }

      // Load related content
      try {
        const contents = JSON.parse(localStorage.getItem('contents') || '[]');
        const related = contents
          .filter((item: any) => 
            item.id !== id && 
            (item.creatorId === content.creatorId || 
             item.contentType === content.contentType)
          )
          .slice(0, 3);
        setRelatedContents(related);
      } catch (e) {
        console.error("Error loading related content", e);
      }
    }
  }, [content, id]);

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

  if (!isUnlocked && !isCreator && parseFloat(content.price) > 0) {
    navigate(`/preview/${id}`);
    return null;
  }

  return (
    <ViewContentContainer>
      <div className="glass-card border border-white/10 rounded-xl overflow-hidden">
        <ReadingProgress progress={readingProgress} />
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
