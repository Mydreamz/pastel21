
import { Button } from "@/components/ui/button";
import { Share } from 'lucide-react';

interface ContentActionsProps {
  onShare: () => void;
  isCreator: boolean;
  children?: React.ReactNode;
}

const ContentActions = ({ onShare, isCreator, children }: ContentActionsProps) => {
  return (
    <div className="mt-4 flex justify-end gap-2">
      <Button
        onClick={onShare}
        variant="outline"
        className="border-gray-700 hover:border-emerald-500 text-gray-300"
      >
        <Share className="mr-2 h-4 w-4" />
        Share
      </Button>
      {isCreator && children}
    </div>
  );
};

export default ContentActions;
