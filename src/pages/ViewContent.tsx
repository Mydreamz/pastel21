
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
          />
          
          <div className="mb-6">
            <p className="text-gray-300">{content.teaser}</p>
          </div>
          
          {!isUnlocked ? (
            <LockedContent price={content.price} onUnlock={handleUnlock} />
          ) : (
            <ContentPreview 
              title={content.title}
              teaser={content.teaser}
              price={parseFloat(content.price)}
              type={content.contentType}
              expiryDate={content.expiry}
              onPaymentSuccess={handleUnlock}
              contentId={content.id}
            />
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
