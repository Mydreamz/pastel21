
import { useParams, useNavigate } from 'react-router-dom';
import ViewContentContainer from '@/components/content/ViewContentContainer';
import ViewContentHeader from '@/components/content/ViewContentHeader';
import ContentPreview from '@/components/ContentPreview';
import ContentLoader from '@/components/content/ContentLoader';
import ContentError from '@/components/content/ContentError';
import { useViewContent } from '@/hooks/useViewContent';
import { Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";

const PreviewContent = () => {
  const { id } = useParams<{ id: string }>();
  const { content, loading, error, handleUnlock } = useViewContent(id);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Content preview link has been copied to your clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the link to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleSuccessfulPayment = () => {
    // Redirect to full content view after successful payment
    navigate(`/view/${id}`);
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
          
          <div className="mt-4 flex justify-end gap-2">
            <Button
              onClick={handleShare}
              variant="outline"
              className="border-gray-700 hover:border-emerald-500 text-gray-300"
            >
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-300">{content.teaser}</p>
          </div>
          
          <div className="mt-4">
            <ContentPreview
              title={content.title}
              teaser={content.teaser}
              price={parseFloat(content.price)}
              type={content.contentType}
              onPaymentSuccess={handleSuccessfulPayment}
              contentId={content.id}
            />
          </div>
        </div>
      </div>
    </ViewContentContainer>
  );
};

export default PreviewContent;
