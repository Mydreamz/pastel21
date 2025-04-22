
import { useParams } from 'react-router-dom';
import ViewContentContainer from '@/components/content/ViewContentContainer';
import ViewContentHeader from '@/components/content/ViewContentHeader';
import ContentPreview from '@/components/ContentPreview';
import { useViewTracking } from '@/hooks/useViewTracking';
import CommentSection from '@/components/content/CommentSection';
import ContentLoader from '@/components/content/ContentLoader';
import ContentError from '@/components/content/ContentError';
import LockedContent from '@/components/content/LockedContent';
import { useViewContent } from '@/hooks/useViewContent';

const ViewContent = () => {
  const { id } = useParams<{ id: string }>();
  const { content, loading, error, isUnlocked, handleUnlock } = useViewContent(id);

  // Track view of this content
  useViewTracking();

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
