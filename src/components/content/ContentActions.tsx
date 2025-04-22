
import { Button } from "@/components/ui/button";
import { 
  Share, 
  Copy, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Mail 
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface ContentActionsProps {
  onShare: () => void;
  shareUrl: string;
  contentTitle: string;
  isCreator: boolean;
  children?: React.ReactNode;
}

const ContentActions = ({ onShare, shareUrl, contentTitle, isCreator, children }: ContentActionsProps) => {
  const { toast } = useToast();
  const [copying, setCopying] = useState(false);

  const handleCopyLink = async () => {
    try {
      setCopying(true);
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
    } finally {
      setCopying(false);
    }
  };

  const shareToTwitter = () => {
    const text = `Check out "${contentTitle}" ${shareUrl}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareByEmail = () => {
    const subject = encodeURIComponent(`Check out "${contentTitle}"`);
    const body = encodeURIComponent(`I thought you might be interested in this content: ${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="mt-4 flex justify-end gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="border-gray-700 hover:border-emerald-500 text-gray-300"
          >
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-gray-900 border border-gray-800 text-white">
          <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer hover:bg-gray-800">
            <Copy className="mr-2 h-4 w-4" />
            <span>Copy link</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareToTwitter} className="cursor-pointer hover:bg-gray-800">
            <Twitter className="mr-2 h-4 w-4" />
            <span>Twitter</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareToFacebook} className="cursor-pointer hover:bg-gray-800">
            <Facebook className="mr-2 h-4 w-4" />
            <span>Facebook</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareToLinkedIn} className="cursor-pointer hover:bg-gray-800">
            <Linkedin className="mr-2 h-4 w-4" />
            <span>LinkedIn</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareByEmail} className="cursor-pointer hover:bg-gray-800">
            <Mail className="mr-2 h-4 w-4" />
            <span>Email</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isCreator && children}
    </div>
  );
};

export default ContentActions;
