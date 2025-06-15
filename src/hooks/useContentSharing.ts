
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useContentSharing = (contentId: string, price: string) => {
  const [shareUrl, setShareUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    initializeShareUrl();
  }, [contentId, price]);

  const initializeShareUrl = () => {
    if (!contentId) return;
    
    // All content, paid or free, will now use the /view/:id link
    setShareUrl(`${window.location.origin}/view/${contentId}`);
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

  return {
    shareUrl,
    handleShare,
    initializeShareUrl
  };
};
