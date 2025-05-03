import { Button } from "@/components/ui/button";
import { 
  Share, 
  Copy, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Mail,
  MessageCircle,
  Instagram,
  Trash2
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import DeleteContentDialog from './DeleteContentDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

interface ContentActionsProps {
  onShare: () => void;
  shareUrl: string;
  contentTitle: string;
  contentId: string;
  isCreator: boolean;
  children?: React.ReactNode;
}

const ContentActions = ({ 
  onShare, 
  shareUrl, 
  contentTitle,
  contentId,
  isCreator, 
  children 
}: ContentActionsProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [copying, setCopying] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('contents')
        .delete()
        .eq('id', contentId);

      if (error) throw error;

      toast({
        title: "Content deleted",
        description: "Your content has been permanently deleted",
      });

      navigate('/profile');
    } catch (error: any) {
      console.error('Error deleting content:', error);
      toast({
        title: "Error",
        description: "Failed to delete content. Please try again.",
        variant: "destructive"
      });
    }
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out "${contentTitle}" ${shareUrl}`)}`, '_blank');
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

  const shareToWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Check out "${contentTitle}" ${shareUrl}`)}`, '_blank');
  };

  const shareToInstagram = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied for Instagram",
      description: "Link copied! You can now paste it in your Instagram story or message",
    });
  };

  return (
    <>
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
            <DropdownMenuSeparator className="bg-gray-800" />
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
            <DropdownMenuItem onClick={shareToWhatsApp} className="cursor-pointer hover:bg-gray-800">
              <MessageCircle className="mr-2 h-4 w-4" />
              <span>WhatsApp</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={shareToInstagram} className="cursor-pointer hover:bg-gray-800">
              <Instagram className="mr-2 h-4 w-4" />
              <span>Instagram</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={shareByEmail} className="cursor-pointer hover:bg-gray-800">
              <Mail className="mr-2 h-4 w-4" />
              <span>Email</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {isCreator && (
          <Button
            variant="outline"
            className="border-red-500/30 hover:border-red-500 text-red-400 hover:text-red-300"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        )}
        {children}
      </div>

      <DeleteContentDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        contentTitle={contentTitle}
      />
    </>
  );
};

export default ContentActions;
