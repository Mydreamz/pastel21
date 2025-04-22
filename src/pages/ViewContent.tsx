
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import StarsBackground from '@/components/StarsBackground';
import ContentPreview from '@/components/ContentPreview';
import { useViewTracking } from '@/hooks/useViewTracking';
import CommentSection from '@/components/content/CommentSection';
import ContentLoader from '@/components/content/ContentLoader';
import ContentError from '@/components/content/ContentError';
import LockedContent from '@/components/content/LockedContent';
import { useViewContent } from '@/hooks/useViewContent';

const ViewContent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
    <div className="min-h-screen flex flex-col antialiased text-white relative">
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 md:px-6 py-6">
        <button onClick={() => navigate('/')} className="mb-6 flex items-center text-gray-300 hover:text-white transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </button>
        
        <div className="glass-card border border-white/10 rounded-xl overflow-hidden">
          <div className="p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{content.title}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-400 mb-6">
              <span>By {content.creatorName}</span>
              <span className="hidden sm:block">•</span>
              <span>Created {new Date(content.createdAt).toLocaleDateString()}</span>
              {parseFloat(content.price) > 0 && (
                <>
                  <span className="hidden sm:block">•</span>
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
                    ${parseFloat(content.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>
            
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
      </div>
    </div>
  );
};

export default ViewContent;
