import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ViewContentContainer from '@/components/content/ViewContentContainer';
import ViewContentHeader from '@/components/content/ViewContentHeader';
import ContentPreview from '@/components/ContentPreview';
import ContentLoader from '@/components/content/ContentLoader';
import ContentError from '@/components/content/ContentError';
import ContentActions from '@/components/content/ContentActions';
import { useViewContent } from '@/hooks/useViewContent';
import { useContentSharing } from '@/hooks/useContentSharing';
import { Share, DollarSign, Clock, Eye, Calendar, User, FileText, Video, Image, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';

const PreviewContent = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    content, 
    loading, 
    error, 
    handleUnlock, 
    isProcessing: unlockProcessing 
  } = useViewContent(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [relatedContent, setRelatedContent] = useState<any[]>([]);
  const { shareUrl, handleShare, initializeShareUrl } = useContentSharing(id || '', content?.price || '0');

  // Check authentication status once
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
  }, []);

  // Initialize share URL when content is available
  useEffect(() => {
    if (content) {
      initializeShareUrl();
    }
  }, [content, initializeShareUrl]);

  // Load related content only once when content is available
  useEffect(() => {
    if (content?.id && !relatedContent.length) {
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
  }, [content?.id, content?.creatorId, content?.contentType, id, relatedContent.length]);

  // Memoize handlers to prevent recreating functions on every render
  const handleSuccessfulPayment = useCallback(() => {
    navigate(`/view/${id}`);
  }, [navigate, id]);

  const handlePurchase = useCallback(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to purchase this content",
        variant: "destructive"
      });
      return;
    }
    
    if (handleUnlock) {
      handleUnlock();
    }
  }, [isAuthenticated, toast, handleUnlock]);

  // Get preview content (first 30% of text content)
  const getContentPreview = useCallback(() => {
    if (!content || !content.content || content.contentType !== 'text') return content?.teaser;
    
    const wordCount = content.content.split(' ').length;
    const previewWordCount = Math.floor(wordCount * 0.3);
    const previewWords = content.content.split(' ').slice(0, previewWordCount);
    return previewWords.join(' ') + '...';
  }, [content]);

  const getContentTypeIcon = useCallback(() => {
    if (!content) return <FileText className="h-5 w-5" />;
    
    switch (content.contentType) {
      case 'text':
        return <FileText className="h-5 w-5 text-blue-400" />;
      case 'image':
        return <Image className="h-5 w-5 text-purple-400" />;
      case 'video':
        return <Video className="h-5 w-5 text-red-400" />;
      case 'link':
        return <LinkIcon className="h-5 w-5 text-yellow-400" />;
      default:
        return <FileText className="h-5 w-5 text-blue-400" />;
    }
  }, [content?.contentType]);

  // Memoize content info to prevent unnecessary re-renders
  const contentInfo = useMemo(() => ({
    id,
    title: content?.title,
    price: content?.price,
    teaser: content?.teaser,
    contentType: content?.contentType
  }), [id, content?.title, content?.price, content?.teaser, content?.contentType]);

  // Memoize related content components to prevent re-rendering
  const relatedContentItems = useMemo(() => {
    return relatedContent.map((item: any) => (
      <div key={item.id} className="glass-card p-4 rounded-lg cursor-pointer hover:border-emerald-500/30 transition-colors border border-white/10" 
           onClick={() => navigate(`/preview/${item.id}`)}>
        <div className="flex items-center justify-between mb-2">
          {(() => {
            switch (item.contentType) {
              case 'text':
                return <FileText className="h-4 w-4 text-blue-400" />;
              case 'image':
                return <Image className="h-4 w-4 text-purple-400" />;
              case 'video':
                return <Video className="h-4 w-4 text-red-400" />;
              case 'link':
                return <LinkIcon className="h-4 w-4 text-yellow-400" />;
              default:
                return <FileText className="h-4 w-4 text-blue-400" />;
            }
          })()}
          {parseFloat(item.price) > 0 && (
            <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 flex items-center">
              <DollarSign className="h-3 w-3 mr-1" />
              {parseFloat(item.price).toFixed(2)}
            </Badge>
          )}
        </div>
        <h4 className="font-medium text-emerald-300 mb-1">{item.title}</h4>
        <p className="text-sm text-gray-400 line-clamp-2">{item.teaser}</p>
      </div>
    ));
  }, [relatedContent, navigate]);

  if (loading) {
    return <ContentLoader />;
  }

  if (error || !content) {
    // Error is already a string from our hook, but add a fallback just in case
    const errorMessage = error || "Content not available. The link might be invalid or the content was removed.";
    return <ContentError error={errorMessage} />;
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
              <Badge variant="outline" className="bg-gray-500/20 text-gray-300 border-gray-500/30 flex items-center">
                {getContentTypeIcon()}
                <span className="ml-1">{content.contentType.charAt(0).toUpperCase() + content.contentType.slice(1)}</span>
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{content.creatorName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(content.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{content.views || Math.floor(Math.random() * 100) + 5} views</span>
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
            
            <ContentPreview
              title={content.title}
              teaser={content.teaser}
              price={parseFloat(content.price)}
              type={content.contentType as any}
              onPaymentSuccess={handleSuccessfulPayment}
              contentId={content.id}
              onPurchase={handlePurchase}
            />
          </div>
          
          <ContentActions
            onShare={handleShare}
            shareUrl={shareUrl}
            contentTitle={content.title}
            contentId={content.id} 
            isCreator={false}
          />
          
          {/* Related Content Section */}
          {relatedContent.length > 0 && (
            <div className="mt-10 border-t border-white/10 pt-6">
              <h3 className="text-xl font-bold mb-4">More from this creator</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedContentItems}
              </div>
            </div>
          )}
        </div>
      </div>
    </ViewContentContainer>
  );
};

export default React.memo(PreviewContent);
