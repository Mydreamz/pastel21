
import { useParams, useNavigate } from 'react-router-dom';
import ViewContentContainer from '@/components/content/ViewContentContainer';
import ViewContentHeader from '@/components/content/ViewContentHeader';
import ContentPreview from '@/components/ContentPreview';
import ContentLoader from '@/components/content/ContentLoader';
import ContentError from '@/components/content/ContentError';
import LockedContent from '@/components/content/LockedContent';
import { useViewContent } from '@/hooks/useViewContent';
import { Share, DollarSign, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

const PreviewContent = () => {
  const { id } = useParams<{ id: string }>();
  const { content, loading, error, handleUnlock } = useViewContent(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [relatedContent, setRelatedContent] = useState<any[]>([]);

  // Add debug logging for this component
  console.log("PreviewContent: Content ID:", id);
  console.log("PreviewContent: Content loaded:", content);
  console.log("PreviewContent: Error state:", error);

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      try {
        const parsedAuth = JSON.parse(auth);
        if (parsedAuth && parsedAuth.user) {
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error("Auth parsing error", e);
      }
    }
    
    // Load related content if content is available
    if (content) {
      try {
        const contents = JSON.parse(localStorage.getItem('contents') || '[]');
        const related = contents
          .filter((item: any) => 
            item.id !== id && 
            (item.creatorId === content.creatorId || 
             item.contentType === content.contentType)
          )
          .slice(0, 3);
        setRelatedContent(related);
      } catch (e) {
        console.error("Error loading related content", e);
      }
    }
  }, [content, id]);

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

  const handlePurchase = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to purchase this content",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      if (handleUnlock) {
        handleUnlock();
        handleSuccessfulPayment();
      }
    }, 1500);
  };

  // Get preview content (first 30% of text content)
  const getContentPreview = () => {
    if (!content || !content.content || content.contentType !== 'text') return content?.teaser;
    
    const wordCount = content.content.split(' ').length;
    const previewWordCount = Math.floor(wordCount * 0.3);
    const previewWords = content.content.split(' ').slice(0, previewWordCount);
    return previewWords.join(' ') + '...';
  };

  if (loading) {
    return <ContentLoader />;
  }

  if (error || !content) {
    return <ContentError error={error || "Content not available. The link might be invalid or the content was removed."} />;
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
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                Preview
              </Badge>
              {parseFloat(content.price) > 0 ? (
                <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  Premium
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  Free
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{Math.floor(Math.random() * 100) + 5} views</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{content.contentType === 'text' ? `${Math.ceil((content.content?.length || 0) / 1000)} min read` : '3 min'}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <h3 className="text-lg font-semibold text-emerald-400 mb-2">Premium Content</h3>
            <p className="text-gray-300 mb-4">{getContentPreview()}</p>
            
            <LockedContent 
              price={content.price}
              onUnlock={handlePurchase}
              contentTitle={content.title}
              isProcessing={isProcessing}
            />
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleShare}
              variant="outline"
              className="border-gray-700 hover:border-emerald-500 text-gray-300"
            >
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
          
          <div className="mt-8">
            <ContentPreview
              title={content.title}
              teaser={content.teaser}
              price={parseFloat(content.price)}
              type={content.contentType}
              onPaymentSuccess={handleSuccessfulPayment}
              contentId={content.id}
              onPurchase={handlePurchase}
            />
          </div>
          
          {/* Related Content Section */}
          {relatedContent.length > 0 && (
            <div className="mt-10 border-t border-white/10 pt-6">
              <h3 className="text-xl font-bold mb-4">More from this creator</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedContent.map((item: any) => (
                  <div key={item.id} className="glass-card p-4 rounded-lg cursor-pointer hover:border-emerald-500/30 transition-colors border border-white/10" 
                       onClick={() => navigate(`/preview/${item.id}`)}>
                    <h4 className="font-medium text-emerald-300 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-400 line-clamp-2">{item.teaser}</p>
                    {parseFloat(item.price) > 0 && (
                      <div className="mt-2 text-xs text-emerald-400">${parseFloat(item.price).toFixed(2)}</div>
                    )}
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

export default PreviewContent;
