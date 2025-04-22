
import { useParams } from 'react-router-dom';
import ViewContentContainer from '@/components/content/ViewContentContainer';
import ViewContentHeader from '@/components/content/ViewContentHeader';
import ContentPreview from '@/components/ContentPreview';
import { useViewTracking } from '@/hooks/useViewTracking';
import CommentSection from '@/components/content/CommentSection';
import ContentLoader from '@/components/content/ContentLoader';
import ContentError from '@/components/content/ContentError';
import LockedContent from '@/components/content/LockedContent';
import { Button } from '@/components/ui/button';
import { CalendarClock } from 'lucide-react';
import ContentScheduler from '@/components/content/ContentScheduler';
import { useState } from 'react';
import { useViewContent } from '@/hooks/useViewContent';
import { useToast } from "@/hooks/use-toast";

const ViewContent = () => {
  const { id } = useParams<{ id: string }>();
  const { content, loading, error, isUnlocked, handleUnlock } = useViewContent(id);
  const [showScheduler, setShowScheduler] = useState(false);
  const { toast } = useToast();

  // Track view of this content
  useViewTracking();

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
      
      setShowScheduler(false);
    } catch (e) {
      console.error("Error scheduling content:", e);
      toast({
        title: "Error",
        description: "Failed to schedule content",
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
          
          {content.creatorId === JSON.parse(localStorage.getItem('auth') || '{}')?.user?.id && (
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => setShowScheduler(!showScheduler)}
                variant="outline"
                className="border-gray-700 hover:border-emerald-500 text-gray-300"
              >
                <CalendarClock className="mr-2 h-4 w-4" />
                {showScheduler ? 'Hide Scheduler' : 'Schedule Content'}
              </Button>
            </div>
          )}
          
          {showScheduler && (
            <div className="mt-4">
              <ContentScheduler
                contentId={content.id}
                contentTitle={content.title}
                onSchedule={handleSchedule}
              />
            </div>
          )}
          
          <div className="mb-6">
            <p className="text-gray-300">{content.teaser}</p>
          </div>
          
          {!isUnlocked ? (
            <LockedContent price={content.price} onUnlock={handleUnlock} />
          ) : (
            <div className="mt-8 border-t border-white/10 pt-8">
              <h2 className="text-xl font-bold mb-4">Full Content</h2>
              {content.contentType === 'text' && content.content && (
                <div className="prose prose-invert max-w-none">
                  <p>{content.content}</p>
                </div>
              )}
              
              {content.contentType === 'link' && content.content && (
                <div className="bg-white/5 p-4 rounded-md">
                  <a 
                    href={content.content} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline break-all"
                  >
                    {content.content}
                  </a>
                </div>
              )}
              
              {content.fileUrl && (
                <div className="mt-4">
                  {content.contentType === 'image' && (
                    <img 
                      src={content.fileUrl} 
                      alt={content.title} 
                      className="max-w-full rounded-md"
                    />
                  )}
                  
                  {content.contentType === 'video' && (
                    <video 
                      controls 
                      className="w-full rounded-md"
                    >
                      <source src={content.fileUrl} type={content.fileType} />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  
                  {content.contentType === 'audio' && (
                    <audio 
                      controls 
                      className="w-full"
                    >
                      <source src={content.fileUrl} type={content.fileType} />
                      Your browser does not support the audio tag.
                    </audio>
                  )}
                  
                  {content.contentType === 'document' && (
                    <div className="bg-white/5 p-4 rounded-md">
                      <a 
                        href={content.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:underline flex items-center"
                      >
                        Download {content.fileName || 'Document'}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {isUnlocked && content && (
        <CommentSection contentId={id || ''} creatorId={content.creatorId} />
      )}
    </ViewContentContainer>
  );
};

export default ViewContent;
