
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ViewContentContainer from '@/components/content/ViewContentContainer';
import ViewContentHeader from '@/components/content/ViewContentHeader';
import ContentLoader from '@/components/content/ContentLoader';
import ContentError from '@/components/content/ContentError';
import ContentActions from '@/components/content/ContentActions';
import { useViewContent } from '@/hooks/useViewContent';
import { useContentSharing } from '@/hooks/useContentSharing';
import { useRelatedContent } from '@/hooks/useRelatedContent';
import ContentViewWrapper from '@/components/content/ContentViewWrapper';
import RelatedContentList from '@/components/content/RelatedContentList';
import LockedContent from '@/components/content/LockedContent';
import AuthDialog from '@/components/auth/AuthDialog';

const ViewContent = () => {
  const { id } = useParams<{ id: string }>();

  const { 
    content, 
    loading, 
    error, 
    secureFileUrl, 
    secureFileLoading,
    secureFileError,
    handleUnlock,
    isUnlocked,
    isProcessing,
    isCreator,
    isAuthenticated,
  } = useViewContent(id);
  
  const { shareUrl, handleShare, initializeShareUrl } = useContentSharing(id || '', content?.price || '0');
  const relatedContents = useRelatedContent(content, id || '');

  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    if (content) {
      initializeShareUrl();
    }
  }, [content, initializeShareUrl]);

  const handleUnlockAttempt = () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
    } else {
      handleUnlock();
    }
  };

  if (loading) {
    return <ContentLoader />;
  }

  if (error || !content) {
    return <ContentError error={error || "Content not found"} />;
  }

  const isPaidContent = parseFloat(content.price) > 0;
  const canViewContent = isUnlocked || !isPaidContent;

  return (
    <>
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

            {!canViewContent && isPaidContent ? (
              <LockedContent 
                price={content.price}
                onUnlock={handleUnlockAttempt}
                contentTitle={content.title}
                isProcessing={isProcessing}
              />
            ) : (
              <ContentViewWrapper 
                content={content}
                isCreator={isCreator}
                isPurchased={isUnlocked} // Simplified
                canViewContent={canViewContent}
                secureFileUrl={secureFileUrl}
                secureFileLoading={secureFileLoading}
                secureFileError={secureFileError}
              />
            )}

            <RelatedContentList relatedContents={relatedContents} />
          </div>
        </div>
      </ViewContentContainer>
      <AuthDialog
        showAuthDialog={showAuthDialog}
        setShowAuthDialog={setShowAuthDialog}
        authTab={authTab}
        setAuthTab={setAuthTab}
      />
    </>
  );
};

export default ViewContent;
